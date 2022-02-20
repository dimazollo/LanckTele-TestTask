export function getTypedObjectKeys<T>(obj: T) {
  const result: Array<keyof T> = [];
  let key: keyof T;
  for (key in obj) {
    result.push(key);
  }
  return result;
}
