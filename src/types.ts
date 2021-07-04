export type RecursiveKeys<TObj extends object> = { [TKey in keyof TObj & (string | number)]: TObj[TKey] extends object ? `${TKey}` | `${TKey}.${RecursiveKeys<TObj[TKey]>}` : `${TKey}`; }[keyof TObj & (string | number)];
/**
 * An utility type to get all the keys of an object in a dot-notation.
 *
 * @example
 * const obj = {
 *   a: {
 *    b: 'c',
 *   },
 *   d: 'e',
 * };
 *
 * type Keys = RecursiveKeys<typeof obj>; // 'a.b' | 'd'
 */

/**
 * An utility type to get the type of the given key (in dot-notation)
 * from the given object.
 *
 * @example
 * const obj = {
 *   a: {
 *    b: 'c',
 *   },
 *   d: 'e',
 * };
 *
 * type CValue = Value<typeof obj, 'a.b'>; // 'string'
 */
export type Value<T, K> = K extends `${infer FK}.${infer L}` ? FK extends keyof T ? Value<T[FK], L> : never : K extends keyof T ? T[K] : never;

/**
 * The cache is a key-value object that contains all the watched
 * properties. The key is a dot-notation string to the property's
 * key, and the value is a CacheValue.
 */
export type Cache<T extends object> = {
  // @ts-ignore
  [P in RecursiveKeys<T>]?: CacheValue<T, P>;
};

/**
 * A cache value contains a watcher callback and a `once` flag, which
 * determines if the property should be called once and then unwatched.
 */
export type CacheValue<T extends object, P extends RecursiveKeys<T>> = {
  onChange: WatcherCallback<Value<T, P>>;
  once: boolean;
};

/**
 * A watcher callback is a callback that takes the new and the old
 * value. If the callback return not `void`, this value will be
 * applied as the new value for the property linked to this callback.
 */
export type WatcherCallback<V> = (newValue: V, oldValue: V) => void | V;
