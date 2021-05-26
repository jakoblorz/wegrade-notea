import "../setupTests";
import { testTypeDefinedClassMembers } from "./testUtil";
import Question from "./Question";

describe("type-validation Question.belongsTo(Questionnaire) n:1 association", () =>
  testTypeDefinedClassMembers(new Question(), [
    "getQuestionnaire",
    "addQuestionnaire",
  ]));

describe("type-validation Question.belongsTo(Group) n:1 association", () =>
  testTypeDefinedClassMembers(new Question(), ["getGroup", "addGroup"]));
