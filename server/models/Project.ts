import sequelize from "../database/connection";
import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from "sequelize";
import ProjectAttributes from "../../shared/ProjectAttributes";
import Questionnaire from "./Questionnaire";

export interface ProjectCreationAttributes
  extends Omit<ProjectAttributes, "id"> {}

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes {
  public static migrate() {
    Project.hasMany(Questionnaire, {
      foreignKey: "projectId",
      as: "questionnaires",
    });
  }

  id!: string;
  name!: string;
  description!: string;
  closed!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getQuestionnaires!: HasManyGetAssociationsMixin<Questionnaire>;
  public addQuestionnaire!: HasManyAddAssociationMixin<Questionnaire, string>;
  public hasQuestionnaire!: HasManyHasAssociationMixin<Questionnaire, string>;
  public countQuestionnaires!: HasManyCountAssociationsMixin;
  public createQuestionnaire!: HasManyCreateAssociationMixin<Questionnaire>;

  public readonly questionnaires?: Questionnaire[];
}

Project.init(
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
  },
  { tableName: "projects", freezeTableName: true, sequelize }
);

export default Project;
