/**
 * selects the allowedKeys from the value and returns them in a new object
 * @param allowedKeys list of keys that are to be selected
 * @param value object from which the given keys are selected
 */
export function sanitize<T>(
  allowedKeys: Array<keyof T>,
  value: T & any
): Pick<T, typeof allowedKeys[number]> {
  return (allowedKeys.reduce(
    (v: Partial<T>, k: keyof T) => ({ ...v, [k]: value[k] }),
    {} as Partial<T>
  ) as any) as T;
}
