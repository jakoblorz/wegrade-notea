import sequelize from "../database/connection";
import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";
import GroupAttributes from "../../shared/GroupAttributes";
import Question from "./Question";
import Questionnaire from "./Questionnaire";

export interface GroupCreationAttributes extends Omit<GroupAttributes, "id"> {}

export class Group
  extends Model<GroupAttributes, GroupCreationAttributes>
  implements GroupAttributes {
  public static migrate() {
    Group.hasMany(Question, { foreignKey: "groupId" });
    Group.belongsTo(Questionnaire, { foreignKey: "questionnaireId" });
    Group.hasMany(Group, {
      foreignKey: "groupId",
      as: "groups",
      constraints: false,
    });
  }
  id!: string;
  name!: string;
  position!: number;
  description!: string;
  questionnaireId!: string;
  groupId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getQuestions!: HasManyGetAssociationsMixin<Question>;
  public addQuestion!: HasManyAddAssociationMixin<Question, string>;
  public hasQuestion!: HasManyHasAssociationMixin<Question, string>;
  public countQuestions!: HasManyCountAssociationsMixin;
  public createQuestion!: HasManyCreateAssociationMixin<Question>;

  public readonly questions?: Question[];

  public getQuestionnaire!: BelongsToGetAssociationMixin<Questionnaire>;
  public addQuestionnaire!: BelongsToCreateAssociationMixin<Questionnaire>;

  public readonly questionnaire?: Questionnaire;

  public getGroups!: HasManyGetAssociationsMixin<Group>;
  public addGroup!: HasManyAddAssociationMixin<Group, string>;
  public hasGroup!: HasManyHasAssociationMixin<Group, string>;
  public countGroups!: HasManyCountAssociationsMixin;
  public createGroup!: HasManyCreateAssociationMixin<Group>;

  public readonly groups?: Group[];
}

Group.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.INTEGER,
    },
  } as {
    [key in keyof GroupAttributes]: any;
  },
  { tableName: "groups", freezeTableName: true, sequelize }
);

export default Group;
