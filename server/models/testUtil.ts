export const testTypeDefinedClassMembers = <T>(
  instance: T,
  validateKeys: Array<keyof T>,
  expectFn: (v: Function | undefined) => void = (v) =>
    expect(v).not.toBeUndefined()
) => {
  for (let i = 0; i < validateKeys.length; i++) {
    it(`should expose class member ${validateKeys[i]} on instance`, () =>
      expectFn(instance[validateKeys[i]] || (null as any)));
  }
};
