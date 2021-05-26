import type { codes } from "../server/middlewares/query";
export type ComplexQuery<T extends any> = {
  [K in keyof T]:
    | T[K]
    | Partial<
        {
          [OP in typeof codes[number]]: T[K];
        }
      >;
};
