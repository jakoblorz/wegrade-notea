export type SetLiteral<T> = { [x: string]: T[] };

export type LimitAndOffsetQuery = {
  sort?: string;
  direction?: string;
  limit: number;
  offset: number;
};
export type LikeOnFieldQuery<AllowedLikeFields extends string> = {
  like: string;
  field: AllowedLikeFields;
};

export type CollectionQuery<
  AllowedLikeFields extends string
> = LimitAndOffsetQuery & LikeOnFieldQuery<AllowedLikeFields>;
