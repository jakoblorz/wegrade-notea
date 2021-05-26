import express from "express";
import { IncomingMessage } from "http";

import { NotFoundError } from "../errors";
import errorHandler from "../middlewares/errorHandler";
import validationHandler from "../middlewares/validationHandler";

import accountRoutes from "./account";
import userRoutes from "./user";
import sessionRoutes from "./session";
import projectRoutes from "./project";
import questionnaireRoutes from "./questionnaire";
import groupRoutes from "./group";
import questionRoutes from "./question";

import User from "../models/User";

export const v1 = express.Router();
v1.use(errorHandler);
v1.use(validationHandler);

v1.use("/", accountRoutes);
v1.use("/", userRoutes);
v1.use("/", sessionRoutes);
v1.use("/", projectRoutes);
v1.use("/", questionnaireRoutes);
v1.use("/", groupRoutes);
v1.use("/", questionRoutes);

v1.post("*", () => {
  throw NotFoundError("Endpoint not found");
});

v1.use(errorHandler);

export default v1;

export const serializeUser = (
  user: User,
  done: (err?: Error, data?: string) => void
) => {
  done(null, user.get("id"));
};

export const deserializeUser = async (
  req: IncomingMessage,
  id: string,
  done: (err?: Error, user?: any) => void
) => {
  try {
    const user = User.findByPk(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
