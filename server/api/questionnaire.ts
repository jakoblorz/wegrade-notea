import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import Questionnaire from "../models/Questionnaire";
import {
  Op,
  WhereOptions,
  FindAndCountOptions,
  col as Column,
} from "sequelize";

import validationHandler, {
  Validateable,
} from "../middlewares/validationHandler";
import presentApiResponse from "../presenters/ApiResponse";
import presentQuestionnaire from "../presenters/Questionnaire";
import { requireAuth } from "../middlewares/requireAuth";
import errorHandler from "../middlewares/errorHandler";
import { NotFoundError } from "../errors";
import QuestionnaireAttributes, {
  QuestionnaireCreateRequest,
  QuestionnaireUpdateRequest,
} from "../../shared/QuestionnaireAttributes";
import { sanitize } from "../utils/sanitize";
import { prepareQuery, queryCollection } from "../middlewares/query";
import Project from "../models/Project";

const router = express.Router();

export const queryQuestionnaireCollection: (arg: {
  from?: "body" | "query";
  status?: number;
  merge?: (q: FindAndCountOptions, req: Request) => FindAndCountOptions;
}) => RequestHandler[] = ({
  from = "query",
  status = 200,
  merge = (q) => q,
}) => [
  prepareQuery<QuestionnaireAttributes & { updatedAt: string }>({
    filter: ["name", "closed"],
    from: from,
    restrict: new Map([
      [Op.iLike, ["closed"]],
      [Op.notILike, ["name", "closed"]],
    ]),
  }),
  queryCollection<Questionnaire>(Questionnaire, {
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
              req.query.projectId
                ? {
                    model: Project,
                    where: {
                      id: req.query.projectId,
                    },
                    required: true,
                  }
                : null,
            ].filter((i) => i != null)
          ),
        },
        req
      ),
    then: ({ rows, count }, req, res, next) =>
      res.status(status).json({
        ...presentApiResponse(rows.map((o) => presentQuestionnaire(o))),
        pagination: {
          limit: req.sql.limit,
          offset: req.sql.offset,
          count,
        },
      }),
  }),
];

router.get(
  "/questionnaires",
  /* requireAuth, */ ...queryQuestionnaireCollection({})
);
router.post(
  "/questionnaires/query",
  /* requireAuth, */
  ...queryQuestionnaireCollection({ from: "body" })
);

router.post(
  "/questionnaire",
  requireAuth,
  validationHandler,
  async (req: Request & Validateable, res: Response, next: NextFunction) => {
    req.assertPresent(
      (req.body as Partial<QuestionnaireCreateRequest>).name,
      "expecting a name property"
    );
    req.assertPresent(
      (req.body as Partial<QuestionnaireCreateRequest>).description,
      "expecting a description property"
    );
    req.assertPresent(
      (req.body as Partial<QuestionnaireCreateRequest>).forkId,
      "expecting a forkId property"
    );
    req.assertPresent(
      (req.body as Partial<QuestionnaireCreateRequest>).projectId,
      "expecting a projectId property"
    );

    const questionnaire = await Questionnaire.create(
      sanitize<QuestionnaireCreateRequest>(
        ["name", "description", "forkId", "projectId"],
        req.body
      )
    );

    res
      .status(201)
      .json(presentApiResponse(presentQuestionnaire(questionnaire)));
  }
);

declare global {
  namespace Express {
    interface Request {
      questionnaire: Questionnaire;
    }
  }
}

router.use("/questionnaire/:id", requireAuth, async (req, res, next) => {
  req.questionnaire = await Questionnaire.findOne({
    where: {
      id: req.params.id,
    } as QuestionnaireAttributes & WhereOptions,
  });
  if (req.questionnaire == null) {
    errorHandler(NotFoundError(), req, res, next);
    return;
  }

  next();
});

router.get("/questionnaire/:id", async (req, res, next) => {
  res
    .status(200)
    .json(presentApiResponse(presentQuestionnaire(req.questionnaire)));
});

router.put("/questionnaire/:id", async (req, res, next) => {
  req.assertPresent(
    (req.body as Partial<QuestionnaireUpdateRequest>).name,
    "expecting a name property"
  );
  req.assertPresent(
    (req.body as Partial<QuestionnaireUpdateRequest>).description,
    "expecting a description property"
  );

  await req.questionnaire.update(
    sanitize<QuestionnaireUpdateRequest>(["name", "description"], req.body),
    {
      where: {
        id: req.questionnaire.id,
      } as QuestionnaireAttributes & WhereOptions,
    }
  );

  req.questionnaire = await Questionnaire.findOne({
    where: {
      id: req.questionnaire.id,
    } as QuestionnaireAttributes & WhereOptions,
  });

  res
    .status(200)
    .json(presentApiResponse(presentQuestionnaire(req.questionnaire)));
});

router.delete("/questionnaire/:id", async (req, res, next) => {
  await req.questionnaire.destroy();
  res.status(200).json(presentApiResponse({}));
});
export default router;
