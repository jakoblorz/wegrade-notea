import "../setupTests";
import { testTypeDefinedClassMembers } from "./testUtil";
import Session from "./Session";

describe("type-validation Session.belongsTo(User) n:1 association", () =>
  testTypeDefinedClassMembers(new Session(), ["getUser", "addUser"]));
