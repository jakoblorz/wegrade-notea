import sequelize from "./connection";

import User from "../models/User";
import Session from "../models/Session";
import Question from "../models/Question";
import Group from "../models/Group";
import Questionnaire from "../models/Questionnaire";
import Project from "../models/Project";

const models: Array<{ migrate() }> = [
  User,
  Session,
  Question,
  Group,
  Questionnaire,
  Project,
];

export default async () => {
  models.forEach((m) => m.migrate());
  await sequelize.sync();
};
