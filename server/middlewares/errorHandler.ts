import { HttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";
import { snakeCase } from "lodash";
import { ValidationError } from "sequelize";
import * as querystring from "querystring";

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
  redirectTo?: string
) => {
  let status = err.status || 500;
  let message = err.message || err.name;
  let error;

  if (err instanceof ValidationError) {
    status = 400;
    if (err.errors && err.errors[0]) {
      message = `${err.errors[0].message} (${err.errors[0].path})`;
    }
  }

  if (message.match(/Not found/i)) {
    status = 404;
    error = "not_found";
  }

  if (message.match(/Authorization error/i)) {
    status = 403;
    error = "authorization_error";
  }

  if (status === 500) {
    message = "Internal Server Error";
    error = "internal_server_error";
  }

  const errorData = {
    ok: false,
    error: snakeCase(err.id || error),
    status: status,
    message,
    data: err.errorData,
  };

  if (redirectTo) {
    res.redirect(redirectTo + "?" + querystring.stringify(errorData));
    return;
  }

  res.status(status).json(errorData);
};

export default errorHandler;
