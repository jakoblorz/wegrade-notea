import "../setupTests";
import { testTypeDefinedClassMembers } from "./testUtil";
import Project from "./Project";

describe("type-validation Project.hasMany(Questionnaire) 1:n association", () =>
  testTypeDefinedClassMembers(new Project(), [
    "getQuestionnaires",
    "addQuestionnaire",
    "hasQuestionnaire",
    "countQuestionnaires",
    "createQuestionnaire",
  ]));
