export const simpleValueTypes = ["string", "number", "boolean"];
export const isSimpleValue = <T extends {}>(o: unknown): o is T =>
  simpleValueTypes.indexOf(typeof o) !== -1;
