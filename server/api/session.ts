import express, { Request } from "express";
import type { Session } from "express-session";
import presentApiResponse from "../presenters/ApiResponse";

const router = express.Router();

type SessionCache = {
  session: Session & {
    cache: {};
  };
};

router.get("/session", async (req: Request & SessionCache, res, next) => {
  res.status(200).json(presentApiResponse(req.session.cache || {}));
});

router.put("/session/:key", async (req: Request & SessionCache, res, next) => {
  req.session.cache = {};
  req.session.cache[req.params.key] = req.body;
  req.session.save();
  res.status(201).json(presentApiResponse(req.session.cache));
});

router.delete("/session", async (req: Request & SessionCache, res, next) => {
  req.session.destroy(() => {});
  req.logOut();
  res.redirect("/");
});

export default router;
