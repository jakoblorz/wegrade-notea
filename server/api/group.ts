import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import Group from "../models/Group";

import validationHandler, {
  Validateable,
} from "../middlewares/validationHandler";
import presentApiResponse from "../presenters/ApiResponse";
import presentGroup from "../presenters/Group";
import {
  Op,
  WhereOptions,
  FindAndCountOptions,
  col as Column,
} from "sequelize";
import { requireAuth } from "../middlewares/requireAuth";
import errorHandler from "../middlewares/errorHandler";
import { NotFoundError } from "../errors";
import GroupAttributes, {
  GroupCreateRequest,
  GroupUpdateRequest,
} from "../../shared/GroupAttributes";
import { sanitize } from "../utils/sanitize";
import { prepareQuery, queryCollection } from "../middlewares/query";
import Questionnaire from "../models/Questionnaire";
import Project from "../models/Project";

const router = express.Router();

export const queryGroupCollection: (arg: {
  from?: "body" | "query";
  status?: number;
  merge?: (q: FindAndCountOptions, req: Request) => FindAndCountOptions;
}) => RequestHandler[] = ({
  from = "query",
  status = 200,
  merge = (q) => q,
}) => [
  prepareQuery<GroupAttributes & { updatedAt: string }>({
    filter: ["position"],
    from: from,
    restrict: new Map([
      [Op.iLike, ["position"]],
      [Op.notILike, ["position"]],
    ]),
  }),
  queryCollection<Group>(Group, {
    merge: ({ include = [], ...rest }, req) =>
      merge(
        {
          ...rest,
          ...((include: FindAndCountOptions["include"]) =>
            include.length > 0
              ? {
                  include,
                }
              : {})(
            [
              ...include,
              req.query.questionnaireId || req.query.projectId
                ? {
                    model: Questionnaire,
                    where: {
                      id:
                        req.query.questionnaireId ||
                        Column("groups.questionnaireId"),
                    },
                    required: true,
                    ...(req.query.projectId
                      ? {
                          include: [
                            {
                              model: Project,
                              where: {
                                id: req.query.projectId,
                              },
                              required: true,
                            },
                          ],
                        }
                      : {}),
                  }
                : null,
            ].filter((i) => i != null)
          ),
        },
        req
      ),
    then: ({ rows, count }, req, res, next) =>
      res.status(status).json({
        ...presentApiResponse(rows.map((o) => presentGroup(o))),
        pagination: {
          limit: req.sql.limit,
          offset: req.sql.offset,
          count,
        },
      }),
  }),
];

router.get("/groups", /* requireAuth, */ ...queryGroupCollection({}));
router.post(
  "/groups/query",
  /* requireAuth, */
  ...queryGroupCollection({ from: "body" })
);

router.post(
  "/group",
  requireAuth,
  validationHandler,
  async (req: Request & Validateable, res: Response, next: NextFunction) => {
    req.assertPresent(
      (req.body as Partial<GroupCreateRequest>).name,
      "expecting a name property"
    );
    req.assertPresent(
      (req.body as Partial<GroupCreateRequest>).description,
      "expecting a description property"
    );
    req.assertPresent(
      (req.body as Partial<GroupCreateRequest>).position,
      "expecting a position property"
    );
    req.assertPresent(
      (req.body as Partial<GroupCreateRequest>).groupId,
      "expecting a groupId property"
    );
    req.assertPresent(
      (req.body as Partial<GroupCreateRequest>).parentType,
      "expecting a parentType property"
    );

    const group = await Group.create(
      sanitize<GroupCreateRequest>(
        ["name", "description", "position", "groupId", "parentType"],
        req.body
      )
    );

    res.status(201).json(presentApiResponse(presentGroup(group)));
  }
);

declare global {
  namespace Express {
    interface Request {
      group: Group;
    }
  }
}

router.use("/group/:id", requireAuth, async (req, res, next) => {
  req.group = await Group.findOne({
    where: {
      id: req.params.id,
    } as GroupAttributes & WhereOptions,
  });
  if (req.group == null) {
    errorHandler(NotFoundError(), req, res, next);
    return;
  }

  next();
});

router.get("/group/:id", async (req, res, next) => {
  res.status(200).json(presentApiResponse(presentGroup(req.group)));
});

router.put("/group/:id", async (req, res, next) => {
  req.assertPresent(
    (req.body as Partial<GroupUpdateRequest>).name,
    "expecting a name property"
  );
  req.assertPresent(
    (req.body as Partial<GroupUpdateRequest>).description,
    "expecting a description property"
  );
  req.assertPresent(
    (req.body as Partial<GroupUpdateRequest>).position,
    "expecting a position property"
  );

  await req.group.update(
    sanitize<GroupUpdateRequest>(["name", "description", "position"], req.body),
    {
      where: {
        id: req.group.id,
      } as GroupAttributes & WhereOptions,
    }
  );

  req.group = await Group.findOne({
    where: {
      id: req.group.id,
    } as GroupAttributes & WhereOptions,
  });

  res.status(200).json(presentApiResponse(presentGroup(req.group)));
});

router.delete("/group/:id", async (req, res, next) => {
  await req.group.destroy();
  res.status(200).json(presentApiResponse({}));
});
export default router;
