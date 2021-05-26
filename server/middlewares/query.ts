import { Request, Response, NextFunction } from "express";
import {
  InvalidRequestError,
  InvalidRequestErrorData,
  NotFoundError,
} from "../errors";
import {
  Op,
  WhereOptions,
  FindOptions,
  Model,
  FindAndCountOptions,
} from "sequelize";
import errorHandler from "./errorHandler";

declare global {
  namespace Express {
    interface Request {
      sql: Pick<FindOptions, "where" | "order" | "offset" | "limit">;
    }
  }
}

/**
 * Representing an invalid symbol
 */
export const NaS = Symbol("Not a Symbol");

/**
 * comparison codes for request body queries
 */
export const codes = [
  "==",
  "!=",
  "!",
  "||",
  "?",
  ">",
  ">=",
  "<",
  "<=",
  "%",
  "!%",
] as const;

/**
 * mapping of comparison code to sql operators
 */
export const codeMapping = new Map<typeof codes[number], symbol>([
  ["==", Op.eq],
  ["!=", Op.ne],
  ["!", Op.not],
  ["?", Op.is],
  ["||", Op.or],
  [">", Op.gt],
  [">=", Op.gte],
  ["<", Op.lt],
  ["<=", Op.lte],
  ["%", Op.iLike],
  ["!%", Op.notILike],
]);

interface CauseCorrelation {
  0: (v: unknown) => v is any;
  1: string;
}

/**
 * list of node.js simple value types
 */
export const simpleValueTypes = ["string", "number", "boolean"];

/**
 * checks to restrict operatability of the comparsion codes
 */
export const codeVerification = new Map<typeof codes[number], CauseCorrelation>(
  [
    [
      "==",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && simpleValueTypes.indexOf(typeof v) !== -1,
        `must be one of ${simpleValueTypes.join(", ")}`,
      ],
    ],
    [
      "!=",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && simpleValueTypes.indexOf(typeof v) !== -1,
        `must be one of ${simpleValueTypes.join(", ")}`,
      ],
    ],
    [
      "!",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && simpleValueTypes.indexOf(typeof v) !== -1,
        `must be one of ${simpleValueTypes.join(", ")}`,
      ],
    ],
    [
      "||",
      [
        (v: unknown): v is any =>
          v instanceof Array &&
          v.filter((v) => simpleValueTypes.indexOf(typeof v) === -1).length ===
            0,
        `must be array with elements one of ${simpleValueTypes.join(", ")}`,
      ],
    ],
    [
      "?",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && typeof v === "string" && v === "",
        `must be empty string`,
      ],
    ],
    [
      ">",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && typeof v === "number",
        "must be number",
      ],
    ],
    [
      ">=",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && typeof v === "number",
        "must be number",
      ],
    ],
    [
      "<",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && typeof v === "number",
        "must be number",
      ],
    ],
    [
      "<=",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && typeof v === "number",
        "must be number",
      ],
    ],
    [
      "%",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && typeof v === "string",
        "must be string",
      ],
    ],
    [
      "!%",
      [
        (v: unknown): v is any =>
          !(v instanceof Array) && typeof v === "string",
        "must be string",
      ],
    ],
  ]
);
export const codeValueOverrides = new Map<typeof codes[number], any>([
  ["?", null],
]);

/**
 * builds the `req.sql` object which describes the sql operation to be executed
 * @param param0 operator descriptor
 */
export const prepareQuery = <T extends { updatedAt: any }>({
  from,
  filter,
  restrict,
  defaultSort = "updatedAt",
  defaultLimit = 15,
  defaultOffset = 0,
  maxLimit = 100,
}: {
  from: "body" | "query";
  filter: Array<keyof T>;
  restrict: Map<symbol, Array<keyof T>>;
  defaultSort?: keyof T;
  defaultLimit?: number;
  defaultOffset?: number;
  maxLimit?: number;
}) => (req: Request, res: Response, next: NextFunction) => {
  req.sql = {};

  const { sort = defaultSort || "updatedAt", direction = "ASC" } = req[
    from
  ] as {
    sort: keyof T;
    direction: "ASC" | "DESC";
  };
  req.sql.order = [[sort as string, direction]];

  const errors = new Map<keyof T | "limit" | "offset", Array<string>>();
  const setError = (target: keyof T | "limit" | "offset", error: string) => {
    if (errors.has(target)) {
      errors.set(target, [...(errors.get(target) || []), error]);
    } else {
      errors.set(target, [error]);
    }
  };

  req.sql.where = filter.reduce<WhereOptions>((acc, field) => {
    const query = req[from];
    if (query == null || query[field] == null) {
      return acc;
    }

    if (simpleValueTypes.indexOf(typeof query[field]) !== -1) {
      return { ...acc, [field]: query[field] };
    }

    if (typeof query[field] === "object") {
      for (const code in query[field]) {
        if (!codeVerification.has(code as any)) {
          setError(
            field,
            `Operation ${code} not found: expecting one of ${codes.join(", ")}`
          );
          continue;
        }

        if (
          (
            restrict.get(
              codeMapping.get(code as typeof codes[number]) || NaS
            ) || []
          ).indexOf(field) !== -1
        ) {
          setError(
            field,
            `Operation ${code} not permitted: blocked by configuration`
          );
          continue;
        }

        const [validate, cause] = codeVerification.get(code as any) as any;
        if (!validate(query[field][code])) {
          setError(field, `Verification of ${code} failed: value ${cause}`);
          continue;
        }

        acc = {
          ...acc,
          [field]: {
            ...((acc as any)[code] || {}),
            ...(codeMapping.get(code as typeof codes[number])
              ? {
                  [codeMapping.get(
                    code as typeof codes[number]
                  ) as any]: codeValueOverrides.has(code as any)
                    ? codeValueOverrides.get(code as any)
                    : query[field][code],
                }
              : {}),
          },
        };
        console.debug(acc);
      }
    }

    return acc;
  }, {});
  console.debug(req.sql.where);
  if (Object.keys(req.sql.where).length === 0) {
    req.sql.where = undefined;
  }

  let hasNaNError = false;
  let limit = req.query.limit || req.body.limit;
  let offset = req.query.offset || req.body.offset;

  if (limit && isNaN(limit)) {
    setError("limit" as any, "Pagination limit must be a valid number");
    hasNaNError = true;
  }
  if (offset && isNaN(offset)) {
    setError("offset" as any, "Pagination offset must be a valid number");
    hasNaNError = true;
  }

  if (!hasNaNError) {
    if (limit > maxLimit) {
      setError("limit", `Pagination limit is too large (max ${maxLimit})`);
    }
    if (limit <= 0) {
      setError("limit", "Pagination limit must be greater than 0");
    }
    if (offset < 0) {
      setError("limit", "Pagination offset must be greater than or equal to 0");
    }

    req.sql.offset = offset || defaultOffset;
    req.sql.limit = limit || defaultLimit;
  }

  if (errors.size > 0) {
    let errorData: InvalidRequestErrorData<T> = {};
    for (const row of errors as any) {
      errorData = {
        ...errorData,
        [row[0]]: row[1],
      };
    }
    errorHandler(InvalidRequestError(undefined, errorData), req, res, next);
    return;
  }

  next();
};

/**
 * execute the merged `req.sql` against a model and expect a collection
 * to be returned
 * @param model sequelize model to run the query against
 * @param param1 descriptor on how to build the prepared query
 */
export const queryCollection = <M extends Model>(
  model: { new (): M } & typeof Model,
  {
    merge,
    then,
  }: {
    merge: (q: FindAndCountOptions, req: Request) => FindAndCountOptions;
    then: (
      data: { rows: M[]; count: number },
      req: Request,
      res: Response,
      next: NextFunction
    ) => void;
  }
) => async (req: Request, res: Response, next: NextFunction) => {
  let data: any;
  try {
    data = await model.findAndCountAll(merge(req.sql, req));
  } catch (err) {
    errorHandler(err, req, res, next);
    return;
  }
  then(data, req, res, next);
};

/**
 * execute the merged `req.sql` against a model and expect a single
 * and possibly null object in return
 * @param model sequelize model to run the query against
 * @param param1 descriptor on how to build the prepared query
 */
export const querySingle = <M extends Model>(
  model: { new (): M } & typeof Model,
  {
    merge,
    then,
    proceedWithNull = false,
  }: {
    merge: (q: FindOptions, req: Request) => FindOptions;
    then: (
      data: M | null,
      req: Request,
      res: Response,
      next: NextFunction
    ) => void;
    proceedWithNull?: boolean;
  }
) => async (req: Request, res: Response, next: NextFunction) => {
  let data: any;
  try {
    data = await model.findOne(merge(req.sql, req));
  } catch (err) {
    errorHandler(err, req, res, next);
    return;
  }

  if (proceedWithNull && data == null) {
    errorHandler(NotFoundError(), req, res, next);
    return;
  }

  then(data, req, res, next);
};
