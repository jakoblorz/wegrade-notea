import sequelize from "./database/connection";
import session from "express-session";
import { Session } from './models/Session';
const SequelizeSessionStore = require("connect-session-sequelize")(
  session.Store
);

export default session({
  secret: process.env.SECRET_KEY || "acakscakshiasd", // TODO: set to an random string
  store: new SequelizeSessionStore({
    db: sequelize,
    table: "Session",
    extendDefaultFields: function (defaults, session) {
      return {
        data: defaults.data,
        expires: defaults.expires,
        accountId: (function () {
          if (session.passport && session.passport.user) {
            return session.passport.user;
          }
          return null;
        })(),
      };
    },
  }),
  proxy: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: "/",
    httpOnly: false,
  },
});
