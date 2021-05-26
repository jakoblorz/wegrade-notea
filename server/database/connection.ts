import { Sequelize } from "sequelize";

import pg from "pg";
if (
  process.env.ENV === "DEVELOPMENT" ||
  ["development", "test"].indexOf(process.env.NODE_ENV) !== -1
) {
  pg.defaults.ssl = false;
}

const config = require("../config.json")["production"];

export const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL)
  : new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true,
      },
    });

export default sequelize;
