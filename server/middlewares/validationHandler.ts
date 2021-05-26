import { Request, Response, NextFunction } from "express";
import validator from "validator";
import { ParamRequiredError, ValidationError } from "../errors";

export interface Validateable {

  /**
   * ensure that a value exist
   * @param value value to test
   * @param message error message to throw in the ParamRequiredError error
   */
  assertPresent<T>(value: T | string, message: string);

  /**
   * applies Array.includes on the options value
   * @param value value to test
   * @param options values to accept
   * @param message error message to throw in the ValidationError error
   */
  assertIn(value: number, options: [number, number], message: string);

  /**
   * similar to assertPresent but just for strings:
   * ensures that there is not an empty value 
   * @param value value to test
   * @param message message to throw in the ValidationError error
   * @deprecated use assertPresent to ensure emptiniess check returns correctly for other types
   */
  assertNotEmpty<T>(value: T | string, message: string);

  /**
   * ensure that the given value is representing an email
   * @link uses validator to test email pattern
   * @param value value to test
   * @param message message to throw in the ValidationError error
   */
  assertEmail(value: string, message: string);

  /**
   * ensure that the given value is representing an uuid
   * @link uses validator to test uuid pattern
   * @param value value to test
   * @param message message to throw in the ValidationError error
   */
  assertUuid(value: string, message: string);

  /**
   * ensure that the given value is representing a positive integer
   * @link uses validator to test (stringified) integer being greater than 0
   * @param value value to test
   * @param message message to throw in the ValidationError error
   */
  assertPositiveInteger(value: string, message: string);
}

declare global {
  namespace Express {
    interface Request extends Validateable {}
  }
}

export const validationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.assertPresent = (value, message) => {
    if (value === undefined || value === null || value === "") {
      throw ParamRequiredError(message);
    }
  };

  req.assertIn = (value, options, message) => {
    if (!options.includes(value)) {
      throw ValidationError(message);
    }
  };

  req.assertNotEmpty = (value, message) => {
    if (value === "") {
      throw ValidationError(message);
    }
  };

  req.assertEmail = (value = "", message) => {
    if (!validator.isEmail(value)) {
      throw ValidationError(message);
    }
  };

  req.assertUuid = (value = "", message) => {
    if (!validator.isUUID(value)) {
      throw ValidationError(message);
    }
  };

  req.assertPositiveInteger = (value, message) => {
    if (!validator.isInt(value, { min: 0 })) {
      throw ValidationError(message);
    }
  };

  return next();
};
export default validationHandler;
