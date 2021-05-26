import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import Project from "../models/Project";
import { Op, FindAndCountOptions } from "sequelize";

import validationHandler, {
  Validateable,
} from "../middlewares/validationHandler";
import presentApiResponse from "../presenters/ApiResponse";
import presentProject from "../presenters/Project";
import { WhereOptions } from "sequelize";
import { requireAuth } from "../middlewares/requireAuth";
import errorHandler from "../middlewares/errorHandler";
import { NotFoundError } from "../errors";
import ProjectAttributes, {
  ProjectCreateRequest,
  ProjectUpdateRequest,
} from "../../shared/ProjectAttributes";
import { sanitize } from "../utils/sanitize";
import { prepareQuery, queryCollection } from "../middlewares/query";

const router = express.Router();

export const queryProjectCollection: (arg: {
  from?: "body" | "query";
  status?: number;
  merge?: (q: FindAndCountOptions, req: Request) => FindAndCountOptions;
}) => RequestHandler[] = ({
  from = "query",
  status = 200,
  merge = (p) => p,
}) => [
  prepareQuery<ProjectAttributes & { updatedAt: string }>({
    filter: ["name", "closed"],
    from: from,
    restrict: new Map([
      [Op.notILike, ["name", "closed"]],
      [Op.iLike, ["closed"]],
    ]),
  }),
  queryCollection<Project>(Project, {
    merge: ({ ...rest }, req) =>
      merge(
        {
          ...rest,
        },
        req
      ),
    then: ({ rows, count }, req, res, next) =>
      res.status(status).json({
        ...presentApiResponse(rows.map((o) => presentProject(o))),
        pagination: {
          limit: req.sql.limit,
          offset: req.sql.offset,
          count,
        },
      }),
  }),
];

router.get("/projects", /* requireAuth, */ ...queryProjectCollection({}));
router.post(
  "/projects/query",
  /* requireAuth, */
  ...queryProjectCollection({ from: "body" })
);

router.post(
  "/project",
  requireAuth,
  validationHandler,
  async (req: Request & Validateable, res: Response, next: NextFunction) => {
    req.assertPresent(
      (req.body as Partial<ProjectCreateRequest>).name,
      "expecting a name property"
    );
    req.assertPresent(
      (req.body as Partial<ProjectCreateRequest>).description,
      "expecting a description property"
    );

    const project = await Project.create(
      sanitize<ProjectCreateRequest>(["name", "description"], req.body)
    );

    res.status(201).json(presentApiResponse(presentProject(project)));
  }
);

declare global {
  namespace Express {
    interface Request {
      project: Project;
    }
  }
}

router.use("/project/:id", requireAuth, async (req, res, next) => {
  req.project = await Project.findOne({
    where: {
      id: req.params.id,
    } as ProjectAttributes & WhereOptions,
  });
  if (req.project == null) {
    errorHandler(NotFoundError(), req, res, next);
    return;
  }

  next();
});

router.get("/project/:id", async (req, res, next) => {
  res.status(200).json(presentApiResponse(presentProject(req.project)));
});

router.put("/project/:id", async (req, res, next) => {
  req.assertPresent(
    (req.body as Partial<ProjectUpdateRequest>).name,
    "expecting a name property"
  );
  req.assertPresent(
    (req.body as Partial<ProjectUpdateRequest>).description,
    "expecting a description property"
  );
  req.assertPresent(
    (req.body as Partial<ProjectUpdateRequest>).closed,
    "expecting a closed property"
  );

  await req.project.update(
    sanitize<ProjectUpdateRequest>(["name", "description", "closed"], req.body),
    {
      where: {
        id: req.project.id,
      } as ProjectAttributes & WhereOptions,
    }
  );

  req.project = await Project.findOne({
    where: {
      id: req.project.id,
    } as ProjectAttributes & WhereOptions,
  });

  res.status(200).json(presentApiResponse(presentProject(req.project)));
});

router.delete("/project/:id", async (req, res, next) => {
  await req.project.destroy();
  res.status(200).json(presentApiResponse({}));
});
export default router;
