import crypto from "crypto";
import uuid from "uuid";
import { addMinutes, subMinutes } from "date-fns";
import JWT from "jsonwebtoken";
import sequelize from "../database/connection";
import {
  Model,
  DataTypes,
  WhereOptions,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from "sequelize";
import encryptedField from "../database/encryptedField";
import { publicS3Endpoint, uploadToS3FromUrl } from "../utils/s3";
import { Session } from "./Session";
import UserAttributes from "../../shared/UserAttributes";

const DEFAULT_AVATAR_HOST = "https://tiley.herokuapp.com";

export interface UserCreationAttributes extends Omit<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public static migrate() {
    User.hasMany(Session, {
      foreignKey: "userId",
      as: "sessions",
    });
  }

  public id!: string;
  public email!: string;
  public username!: string;
  public firstName!: string;
  public lastName!: string;
  public avatarUrl!: string; // overwritten to not be null using getterMethods
  public strategy: string; // used in a where
  public strategyId?: string; // used in a where
  public secret!: string;
  public lastActiveAt!: Date;
  public lastActiveIp?: string;
  public lastSignedInAt!: Date;
  public lastSignedInIp?: string;
  public lastSigninEmailSentAt!: Date;
  public suspendedAt!: Date;
  public suspendedById!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSessions!: HasManyGetAssociationsMixin<Session>;
  public addSession!: HasManyAddAssociationMixin<Session, string>;
  public hasSession!: HasManyHasAssociationMixin<Session, string>;
  public countSessions!: HasManyCountAssociationsMixin;
  public createSession!: HasManyCreateAssociationMixin<Session>;

  public readonly session?: Session[];

  public isSuspended!: boolean; // injected using getterMethods

  public updateActiveAt(ip: string, force: boolean = true) {
    const fiveMinutesAgo = subMinutes(new Date(), 5);

    // ensure this is updated only every few minutes otherwise
    // we'll be constantly writing to the DB as API requests happen
    if (this.lastActiveAt < fiveMinutesAgo || force) {
      this.lastActiveAt = new Date();
      this.lastActiveIp = ip;
      return this.save({ hooks: false } as any);
    }
  }

  public updateSignedIn(ip: string) {
    this.lastSignedInAt = new Date();
    this.lastSignedInIp = ip;
    return this.save({ hooks: false } as any);
  }

  public getJwtToken(expiresAt?: Date) {
    return JWT.sign(
      {
        id: this.id,
        expiresAt: expiresAt ? expiresAt.toISOString() : undefined,
        type: "session",
      },
      this.secret
    );
  }

  public getTransferToken() {
    return JWT.sign(
      {
        id: this.id,
        createdAt: new Date().toISOString(),
        expiresAt: addMinutes(new Date(), 1).toISOString(),
        type: "transfer",
      },
      this.secret
    );
  }

  public getEmailSigninToken() {
    if (this.strategy && this.strategy !== "local") {
      throw new Error("Cannot generate email signin token for OAuth user");
    }

    return JWT.sign(
      {
        id: this.id,
        createdAt: new Date().toISOString(),
        type: "email-signin",
      },
      this.secret
    );
  }

  public static async importUser(
    strategy: string,
    strategyId: string,
    attributes: Partial<UserCreationAttributes>
  ): Promise<User> {
    let user: User = await User.findOne({
      where: {
        strategy: strategy,
        strategyId: strategyId,
      } as UserAttributes & WhereOptions,
    });
    if (user != null) {
      user = await User.update(attributes, {
        where: {
          strategy: strategy,
          strategyId: strategyId,
        } as UserAttributes & WhereOptions,
      });
      user = await User.findOne({
        where: {
          strategy: strategy,
          strategyId: strategyId,
        } as UserAttributes & WhereOptions,
      });
      return user;
    }

    user = User.create({
      ...attributes,
      strategy,
      strategyId,
    });

    return await User.findOne({
      where: {
        strategy: strategy,
        strategyId: strategyId,
      } as UserAttributes & WhereOptions,
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    strategy: {
      type: DataTypes.STRING,
    },
    strategyId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    secret: encryptedField().vault("secret"),
    lastActiveAt: {
      type: DataTypes.DATE,
    },
    lastActiveIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastSignedInAt: {
      type: DataTypes.DATE,
    },
    lastSignedInIp: {
      type: DataTypes.STRING,
    },
    lastSigninEmailSentAt: {
      type: DataTypes.DATE,
    },
    suspendedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    suspendedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  } as {
    [key in keyof UserAttributes]: any;
  },
  {
    tableName: "users",
    freezeTableName: true,
    sequelize,
    getterMethods: {
      isSuspended() {
        return !!this.suspendedAt;
      },
      avatarUrl() {
        const original = this.getDataValue("avatarUrl");
        if (original) {
          return original;
        }

        const hash = crypto
          .createHash("md5")
          .update(this.email || "")
          .digest("hex");
        return `${DEFAULT_AVATAR_HOST}/avatar/${hash}/${this.username[0]}.png`;
      },
    },
  }
);

export const uploadAvatar = async (model) => {
  const endpoint = publicS3Endpoint();
  const { avatarUrl } = model;

  if (
    avatarUrl &&
    !avatarUrl.startsWith("/api") &&
    !avatarUrl.startsWith(endpoint) &&
    !avatarUrl.startsWith(DEFAULT_AVATAR_HOST)
  ) {
    try {
      const newUrl = await uploadToS3FromUrl(
        avatarUrl,
        `avatars/${model.id}/${uuid.v4()}`,
        "public-read"
      );
      if (newUrl) model.avatarUrl = newUrl;
    } catch (err) {
      // we can try again next time
      console.error(err);
    }
  }
};

User.beforeSave(uploadAvatar);

export default User;
