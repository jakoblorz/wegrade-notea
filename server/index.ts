import "./babel-environment";
import * as path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import logger from "morgan";
import passport from "passport";

// Database
import "./database/connection";

import migrate from "./database/bootstrap";
import type { User as UserModel } from "./models/User";
import apiRoutes, { serializeUser, deserializeUser } from "./api";
import session from "./session";
import github from "./auth/github";

migrate();

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

// App
const app = express();

app.use(logger(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(helmet());
app.use(express.static(path.join(__dirname, "../build")));

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost", "http://localhost:3000"],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

passport.use(github.strategy);
app.use("/oauth2/", github.router);

// routes
app.use("/api/v1", apiRoutes);

// test
app.get("/api/v1/test", (req, res) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
