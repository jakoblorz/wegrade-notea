export type ApiPresentable<T> = T & {
  status: number;
  ok: boolean;
};

export const presentApiResponse = <T>(
  r: T,
  status: number = 200
): ApiPresentable<T> =>
  r instanceof Array
    ? ({
        values: r,
        status: status,
        ok: status < 400,
      } as any)
    : ({
        status: status,
        ok: status < 400,
        ...r,
      } as any);

export default presentApiResponse;
