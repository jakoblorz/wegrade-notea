import "../setupTests";
import User, { UserCreationAttributes } from "./User";
import { testTypeDefinedClassMembers } from "./testUtil";

let testUser: User;
beforeAll(async () => {
  testUser = await User.create({
    email: "test@mail.com",
    username: "testuser",
    firstName: "test",
    lastName: "user",
    strategy: "local",
    strategyId: null,
    secret: "xyzadadasdadadadasdasdasdasdasdasssdasdasdasdasdasdasdas",
    lastActiveAt: new Date(),
    lastActiveIp: null,
    lastSignedInAt: new Date(),
    lastSignedInIp: null,
    lastSigninEmailSentAt: new Date(),
    suspendedAt: null,
    suspendedById: null,
  } as UserCreationAttributes);
});

afterAll(async () => {
  await testUser.destroy();
});

describe("sequelize tests", () => {
  it("findAll() should return [testUser] with length > 0", async () => {
    const accounts = await User.findAll();
    expect(accounts.length).toBeGreaterThan(0);
  });
});

describe("type-validation tests", () =>
  testTypeDefinedClassMembers(new User(), [
    "getSessions",
    "addSession",
    "hasSession",
    "countSessions",
    "createSession",
  ]));
