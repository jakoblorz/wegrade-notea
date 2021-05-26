import sequelize from "../database/connection";
import {
  Model,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
} from "sequelize";
import Question from "./Question";
import QuestionnaireAttributes from "../../shared/QuestionnaireAttributes";
import Group from "./Group";
import Project from "./Project";

export interface QuestionnaireCreationAttributes
  extends Omit<QuestionnaireAttributes, "id"> {}

export class Questionnaire
  extends Model<QuestionnaireAttributes, QuestionnaireCreationAttributes>
  implements QuestionnaireAttributes {
  public static migrate() {
    Questionnaire.hasMany(Question, {
      foreignKey: "questionnaireId",
      as: "questions",
    });
    Questionnaire.hasMany(Group, {
      foreignKey: "questionnaireId",
      as: "groups",
    });
    Questionnaire.belongsTo(Project, {
      foreignKey: "projectId",
      as: "project",
    });
  }

  id!: string;
  name!: string;
  forkId!: string;
  description!: string;
  projectId!: string;
  closed!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getQuestions!: HasManyGetAssociationsMixin<Question>;
  public addQuestion!: HasManyAddAssociationMixin<Question, string>;
  public hasQuestion!: HasManyHasAssociationMixin<Question, string>;
  public countQuestions!: HasManyCountAssociationsMixin;
  public createQuestion!: HasManyCreateAssociationMixin<Question>;

  public readonly questions?: Question[];

  public getGroups!: HasManyGetAssociationsMixin<Group>;
  public addGroup!: HasManyAddAssociationMixin<Group, string>;
  public hasGroup!: HasManyHasAssociationMixin<Group, string>;
  public countGroups!: HasManyCountAssociationsMixin;
  public createGroup!: HasManyCreateAssociationMixin<Group>;

  public readonly groups?: Group[];

  public getProject: BelongsToGetAssociationMixin<Project>;
  public createProject: BelongsToCreateAssociationMixin<Project>;

  public readonly project?: Project;
}

Questionnaire.init(
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
    closed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  } as {
    [key in keyof QuestionnaireAttributes]: any;
  },
  { tableName: "questionnaires", freezeTableName: true, sequelize }
);

export default Questionnaire;
