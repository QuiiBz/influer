import { Value, RecursiveKeys } from './types';

export default function recompose<T extends object, P extends RecursiveKeys<T>>(
  object: T,
  key: P,
): Value<T, P> {
  const parts = key.split('.');
  // @ts-ignore
  const newObj = object[parts[0]];

  if (parts[1]) {
    parts.splice(0, 1);
    return recompose(newObj, parts.join('.'));
  }

  return newObj;
}
