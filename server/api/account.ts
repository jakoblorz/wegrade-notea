import express, { Request, Response, NextFunction } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import presentApiResponse from "../presenters/ApiResponse";
import { AuthorizationError } from "../errors";
import errorHandler from "../middlewares/errorHandler";
import { presentAccount } from "../presenters/Account";
import validationHandler from "../middlewares/validationHandler";
import UserAttributes, { UserUpdateRequest } from "../../shared/UserAttributes";
import { sanitize } from "../utils/sanitize";
import { WhereOptions } from "sequelize/types";
import User from "../models/User";

const router = express.Router();

router.get("/account", requireAuth, (req: Request, res: Response) => {
  res.status(200).json(presentApiResponse(presentAccount(req.user)));
});

router.post(
  "/account",
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    errorHandler(
      AuthorizationError("manual user creation is forbidden"),
      req,
      res,
      next
    );
  }
);

router.put(
  "/account",
  requireAuth,
  validationHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    req.assertPresent(
      (req.body as Partial<UserUpdateRequest>).firstName,
      "expecting a firstName property"
    );
    req.assertPresent(
      (req.body as Partial<UserUpdateRequest>).lastName,
      "expecting a lastName property"
    );

    await req.user.update(
      sanitize<UserUpdateRequest>(["firstName", "lastName"], req.body),
      {
        where: {
          id: req.user.id,
        } as UserAttributes & WhereOptions,
      }
    );

    // reload user to catch updates
    req.user = await User.findOne({
      where: {
        id: req.user.id,
      } as UserAttributes & WhereOptions,
    });

    res.status(200).json(presentApiResponse(presentAccount(req.user)));
  }
);

router.delete(
  "/account",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    await req.user.destroy();
    res.status(200).json(presentApiResponse({}));
  }
);

export default router;
