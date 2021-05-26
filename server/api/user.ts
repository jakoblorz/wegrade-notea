import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import User from "../models/User";
import { Op, FindAndCountOptions } from "sequelize";

import { Validateable } from "../middlewares/validationHandler";
import presentApiResponse from "../presenters/ApiResponse";
import presentUser from "../presenters/User";
import { WhereOptions } from "sequelize/types";
import { requireAuth } from "../middlewares/requireAuth";
import errorHandler from "../middlewares/errorHandler";
import { AuthorizationError, NotFoundError } from "../errors";
import UserAttributes from "../../shared/UserAttributes";
import { prepareQuery, queryCollection } from "../middlewares/query";

const router = express.Router();

export const queryUserCollection: (arg: {
  from?: "body" | "query";
  status?: number;
  merge?: (q: FindAndCountOptions, req: Request) => FindAndCountOptions;
}) => RequestHandler[] = ({
  from = "query",
  status = 200,
  merge = (q) => q,
}) => [
  prepareQuery<UserAttributes & { updatedAt: string }>({
    filter: ["email", "firstName", "lastName", "username"],
    from: from,
    restrict: new Map([
      [Op.notILike, ["email", "firstName", "lastName", "username"]],
    ]),
  }),
  queryCollection<User>(User, {
    merge: (query, req) => merge(query, req),
    then: ({ rows, count }, req, res, next) =>
      res.status(status).json({
        ...presentApiResponse(rows.map((o) => presentUser(o))),
        pagination: {
          limit: req.sql.limit,
          offset: req.sql.offset,
          count,
        },
      }),
  }),
];

router.get("/users", requireAuth, ...queryUserCollection({}));
router.post(
  "/users/query",
  requireAuth,
  ...queryUserCollection({ from: "body" })
);

router.post(
  "/user",
  requireAuth,
  (req: Request & Validateable, res: Response, next: NextFunction) => {
    errorHandler(
      AuthorizationError("manual user creation is forbidden"),
      req,
      res,
      next
    );
  }
);

router.get(
  "/user/:id",
  requireAuth,
  async (req: Request & Validateable, res, next) => {
    const user: User = await User.findOne({
      where: {
        id: req.params.id,
      } as UserAttributes & WhereOptions,
    });

    if (user != null) {
      res.status(200).json(presentApiResponse(presentUser(user)));
      return;
    }

    errorHandler(NotFoundError(), req, res, next);
  }
);

router.put(
  "/user/:id",
  requireAuth,
  (req: Request & Validateable, res: Response, next: NextFunction) => {
    errorHandler(
      AuthorizationError("updates to another user are forbidden"),
      req,
      res,
      next
    );
  }
);

router.delete(
  "/user/:id",
  requireAuth,
  (req: Request & Validateable, res: Response, next: NextFunction) => {
    errorHandler(
      AuthorizationError("deleting another user is forbidden"),
      req,
      res,
      next
    );
  }
);
export default router;
