export function getEnumValues<TEnum, TKeys extends string>(e: {
  [key in TKeys]: TEnum;
}): TEnum[] {
  let keys = Object.keys(e) as Array<TKeys>;
  keys = keys.filter((key) => e[key] !== undefined);
  return keys.map((key) => e[key]);
}
