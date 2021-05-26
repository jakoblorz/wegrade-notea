import sequelize from "../database/connection";
import {
  DataTypes,
  Model,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";
import User from "./User";

export interface SessionAttributes {
  sid: string;
  expires: Date;
  data: any;
}

export interface SessionCreationAttributes
  extends Omit<SessionAttributes, "sid"> {}

export class Session extends Model<
  SessionAttributes,
  SessionCreationAttributes
> {
  public static migrate() {
    Session.belongsTo(User, { foreignKey: "userId" });
  }

  public sid!: string;
  public expires!: Date;
  public date!: any;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public addUser!: BelongsToCreateAssociationMixin<User>;

  public readonly user?: User;
}

Session.init(
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: DataTypes.DATE,
    data: DataTypes.JSON,
  },
  {
    tableName: "sessions",
    freezeTableName: true,
    sequelize,
  }
);

export default Session;
