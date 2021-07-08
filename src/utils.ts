import { Value, RecursiveKeys } from './types';

/**
 * Recompose a value from the given keys in the given object.
 *
 * @example
 * const obj = { a: { b: { c: { d: 'e' } } } };
 * const key = 'a.b.c.d';
 *
 * recompose(obj, key) // 'e'
 *
 * @param {Object} obj - The object to recompose from.
 * @param {string} key - The key to recompose.
 *
 * @returns
 */
export default function recompose<T extends object, P extends RecursiveKeys<T>>(object: T, key: P): Value<T, P> {
  const parts = key.split('.');
  // @ts-ignore
  const newObj = object[parts[0]];

  if (parts[1]) {
    parts.splice(0, 1);
    return recompose(newObj, parts.join('.'));
  }

  return newObj;
}
