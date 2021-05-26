import "./babel-environment";
import sequelize from "./database/connection";
import migrate from "./database/bootstrap";

beforeAll(async () => {
  await migrate();
});

afterAll(async () => {
  const rt = sequelize.close();
  if (rt instanceof Promise) {
    await rt;
  }
});
