import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../errors";
import errorHandler from "./errorHandler";
import { User as UserModel } from "../models/User";

declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    interface AuthInfo {}

    interface User extends UserModel {}

    interface Request {
      authInfo?: AuthInfo;
      user?: User;

      // These declarations are merged into express's Request type
      login(user: User, done: (err: any) => void): void;
      login(user: User, options: any, done: (err: any) => void): void;
      logIn(user: User, done: (err: any) => void): void;
      logIn(user: User, options: any, done: (err: any) => void): void;

      logout(): void;
      logOut(): void;

      isAuthenticated(): boolean;
      isUnauthenticated(): boolean;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    errorHandler(AuthenticationError(), req, res, next);
    return;
  }

  // user possibly a (disguised) promise? - passport does that sometimes
  if (req.user instanceof Promise || req.user["then"] != null) {
    req.user = await req.user;
  }

  req.user.updateActiveAt(req.ip);

  next();
};
