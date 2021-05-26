import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import Question from "../models/Question";

import validationHandler, {
  Validateable,
} from "../middlewares/validationHandler";
import presentApiResponse from "../presenters/ApiResponse";
import presentQuestion from "../presenters/Question";
import {
  Op,
  WhereOptions,
  FindAndCountOptions,
  col as Column,
} from "sequelize";
import { requireAuth } from "../middlewares/requireAuth";
import errorHandler from "../middlewares/errorHandler";
import { NotFoundError } from "../errors";
import QuestionAttributes, {
  QuestionCreateRequest,
  QuestionUpdateRequest,
} from "../../shared/QuestionAttributes";
import { sanitize } from "../utils/sanitize";
import { prepareQuery, queryCollection } from "../middlewares/query";
import Questionnaire from "../models/Questionnaire";
import Project from "../models/Project";
import Group from "../models/Group";

const router = express.Router();

export const queryQuestionCollection: (arg: {
  from?: "body" | "query";
  status?: number;
  merge?: (q: FindAndCountOptions, req: Request) => FindAndCountOptions;
}) => RequestHandler[] = ({
  from = "query",
  status = 200,
  merge = (q) => q,
}) => [
  prepareQuery<QuestionAttributes & { updatedAt: string }>({
    filter: ["position", "type", "name"],
    from: from,
    restrict: new Map([
      [Op.iLike, ["position", "type"]],
      [Op.notILike, ["position", "type", "name"]],
    ]),
  }),
  queryCollection<Question>(Question, {
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
                        Column("questions.questionnaireId"),
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
              req.query.groupId
                ? {
                    model: Group,
                    where: {
                      id: req.query.groupId,
                    },
                  }
                : null,
            ].filter((i) => i != null)
          ),
        },
        req
      ),
    then: ({ rows, count }, req, res, next) =>
      res.status(status).json({
        ...presentApiResponse(rows.map((o) => presentQuestion(o))),
        pagination: {
          limit: req.sql.limit,
          offset: req.sql.offset,
          count,
        },
      }),
  }),
];

router.get("/questions", /* requireAuth, */ ...queryQuestionCollection({}));
router.post(
  "/questions/query",
  /* requireAuth, */
  ...queryQuestionCollection({ from: "body" })
);

router.post(
  "/question",
  requireAuth,
  validationHandler,
  async (req: Request & Validateable, res: Response, next: NextFunction) => {
    req.assertPresent(
      (req.body as Partial<QuestionCreateRequest>).name,
      "expecting a name property"
    );
    req.assertPresent(
      (req.body as Partial<QuestionCreateRequest>).description,
      "expecting a description property"
    );
    req.assertPresent(
      (req.body as Partial<QuestionCreateRequest>).position,
      "expecting a position property"
    );
    req.assertPresent(
      (req.body as Partial<QuestionCreateRequest>).type,
      "expecting a type property"
    );
    req.assertPresent(
      (req.body as Partial<QuestionCreateRequest>).meta,
      "expecting a meta property"
    );
    req.assertPresent(
      (req.body as Partial<QuestionCreateRequest>).parentId,
      "expecting a parentId property"
    );
    req.assertPresent(
      (req.body as Partial<QuestionCreateRequest>).parentType,
      "expecting a parentType property"
    );

    const question = await Question.create(
      sanitize<QuestionCreateRequest>(
        [
          "name",
          "description",
          "position",
          "type",
          "meta",
          "parentId",
          "parentType",
        ],
        req.body
      )
    );

    res.status(201).json(presentApiResponse(presentQuestion(question)));
  }
);

declare global {
  namespace Express {
    interface Request {
      question: Question;
    }
  }
}

router.use("/question/:id", requireAuth, async (req, res, next) => {
  req.question = await Question.findOne({
    where: {
      id: req.params.id,
    } as QuestionAttributes & WhereOptions,
  });
  if (req.question == null) {
    errorHandler(NotFoundError(), req, res, next);
    return;
  }

  next();
});

router.get("/question/:id", async (req, res, next) => {
  res.status(200).json(presentApiResponse(presentQuestion(req.question)));
});

router.put("/question/:id", async (req, res, next) => {
  req.assertPresent(
    (req.body as Partial<QuestionUpdateRequest>).name,
    "expecting a name property"
  );
  req.assertPresent(
    (req.body as Partial<QuestionUpdateRequest>).description,
    "expecting a description property"
  );
  req.assertPresent(
    (req.body as Partial<QuestionUpdateRequest>).position,
    "expecting a position property"
  );
  req.assertPresent(
    (req.body as Partial<QuestionUpdateRequest>).type,
    "expecting a type property"
  );
  req.assertPresent(
    (req.body as Partial<QuestionUpdateRequest>).meta,
    "expecting a meta property"
  );

  await req.question.update(
    sanitize<QuestionUpdateRequest>(
      ["name", "description", "position", "type", "meta"],
      req.body
    ),
    {
      where: {
        id: req.question.id,
      } as QuestionAttributes & WhereOptions,
    }
  );

  req.question = await Question.findOne({
    where: {
      id: req.question.id,
    } as QuestionAttributes & WhereOptions,
  });

  res.status(200).json(presentApiResponse(presentQuestion(req.question)));
});

router.delete("/question/:id", async (req, res, next) => {
  await req.question.destroy();
  res.status(200).json(presentApiResponse({}));
});
export default router;
