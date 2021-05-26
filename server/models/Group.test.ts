import "../setupTests";
import { testTypeDefinedClassMembers } from "./testUtil";
import Group from "./Group";

describe("type-validation Group.hasMany(Question) 1:n association", () =>
  testTypeDefinedClassMembers(new Group(), [
    "getQuestions",
    "addQuestion",
    "hasQuestion",
    "countQuestions",
    "createQuestion",
  ]));

describe("type-validation Group.belongsTo(Questionnaire) n:1 association", () =>
  testTypeDefinedClassMembers(new Group(), [
    "getQuestionnaire",
    "addQuestionnaire",
  ]));

describe("type-validation Group.hasMany(Group) recursive 1:n association", () =>
  testTypeDefinedClassMembers(new Group(), [
    "getGroups",
    "addGroup",
    "hasGroup",
    "countGroups",
    "createGroup",
  ]));
