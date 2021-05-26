import sequelize from "../database/connection";
import {
  Model,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";
import QuestionAttributes, {
  QuestionType,
} from "../../shared/QuestionAttributes";
import Questionnaire from "./Questionnaire";
import Group from "./Group";

export interface QuestionCreationAttributes
  extends Omit<QuestionAttributes, "id"> {}

export class Question
  extends Model<QuestionAttributes, QuestionCreationAttributes>
  implements QuestionAttributes {
  public static migrate() {
    Question.belongsTo(Questionnaire, {
      foreignKey: "questionnaireId",
      as: "questionnaire",
    });
    Question.belongsTo(Group, {
      foreignKey: "groupId",
      as: "group",
    });
  }

  id!: string;
  name!: string;
  position!: number;
  description!: string;
  type!: QuestionType;
  meta!: string;
  questionnaireId?: string;
  groupId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getQuestionnaire!: BelongsToGetAssociationMixin<Questionnaire>;
  public addQuestionnaire!: BelongsToCreateAssociationMixin<Questionnaire>;

  public readonly questionnaire?: Questionnaire;

  public getGroup!: BelongsToGetAssociationMixin<Group>;
  public addGroup!: BelongsToCreateAssociationMixin<Group>;

  public readonly group?: Group;
}

Question.init(
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
    type: {
      type: DataTypes.STRING,
    },
    meta: {
      type: DataTypes.JSON,
    },
  } as {
    [key in keyof QuestionAttributes]: any;
  },
  { tableName: "questions", freezeTableName: true, sequelize }
);

export default Question;
