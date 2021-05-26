import { Router } from "express";
import passport from "passport";
import * as github from "passport-github";

import User from "../models/User";

const router = Router();

router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

export default {
  strategy: new github.Strategy(
    {
      clientID: process.env.GH_CLIENT_ID || "7d1dd022a2856f2f8f93",
      clientSecret:
        process.env.GH_CLIENT_SECRET ||
        "ff769538f84ef6dcc07a3ae7036bd559618a2e1d",
      callbackURL:
        process.env.GH_CLIENT_URL ||
        "http://127.0.0.1:8080/oauth2/github/callback",
    },
    async (accessToken, refreshToken, profile: any, done) => {
      console.log(JSON.stringify(profile));

      let user: User;
      try {
        user = await User.importUser("github", profile.id, {
          email: profile.email,
          username: profile.username,
          firstName: profile.displayName.split(" ")[0],
          lastName: ((arr: string[]) =>
            arr.length > 1 ? arr[arr.length - 1] : "")(
            profile.displayName.split(" ")
          ),
          avatarUrl: profile.avatar_url,
        });
      } catch (err) {
        done(err);
        return;
      }

      user.updateSignedIn("unknown");

      done(null, user);
    }
  ),
  router: router,
};
