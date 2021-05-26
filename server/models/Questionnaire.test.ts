import "../setupTests";
import { testTypeDefinedClassMembers } from "./testUtil";
import Project from "./Questionnaire";

describe("type-validation Questionnaire.hasMany(Question) 1:n association", () =>
  testTypeDefinedClassMembers(new Project(), [
    "getQuestions",
    "addQuestion",
    "hasQuestion",
    "countQuestions",
    "createQuestion",
  ]));

describe("type-validation Questionnaire.hasMany(Group) 1:n association", () =>
  testTypeDefinedClassMembers(new Project(), [
    "getGroups",
    "addGroup",
    "hasGroup",
    "countGroups",
    "createGroup",
  ]));
