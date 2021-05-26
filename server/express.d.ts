import { Request as OGRequest } from "../node_modules/@types/express";
import type { Validateable } from "./middlewares/validationHandler";
declare namespace Express {
  export type Request = OGRequest & Validateable;
}