import {
  WatcherCallback, Value, RecursiveKeys, Cache,
} from './types';
import recompose from './utils';

/**
 * Generate a `state`, `watch` and `watchOnce` functions for a
 * given `initialState`.
 *
 * @param {Object} initialState - The state to generate the functions for.
 * @returns The `state`, `watch` and `watchOnce` functions.
 */
export default function influer<T extends object>(
  initialState: T,
) {
  type Keys = RecursiveKeys<T>;
  const cache: Cache<T> = {};

  // Unwatch a property by its key
  const unwatch = (key: Keys) => delete cache[key];

  // Construct the next property key in a dot-notation
  const constructPropertyKey = (property: string | symbol, key?: Keys): Keys => (key ? `${key.toString()}.${property.toString()}` : property.toString()) as Keys;

  /**
   * Get an handler for a key.
   *
   * @param {Keys} key - The key to get the handler for.
   * @returns The handler for the key.
   */
  const handler = <K extends object>(key?: Keys): ProxyHandler<K> => ({
    get(target, property, receiver) {
      // Trick to get types working
      const value = target[property as keyof K] as unknown as object;

      /**
       * If the value is an object, we need to wrap it in a proxy
       * to intercept all the future changes. This allow nesting
       * of objects in the state.
       */
      if (typeof value === 'object' && Object.keys(value).length > 0) {
        // @ts-ignore
        return new Proxy(value, handler(constructPropertyKey(property, key)));
      }

      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      const propertyKey = constructPropertyKey(property, key);
      const cacheValue = cache[propertyKey];
      let newValue = value;

      /**
       * If we currently have a value in the cache (= we have a watcher),
       * we should call the watcher callback with the current and old
       * values. We should also check if `once` is set to unwatch the
       * property.
       */
      if (cacheValue) {
        const { onChange, once } = cacheValue!;

        if (once) {
          unwatch(propertyKey);
        }

        newValue = onChange(newValue, recompose(initialState, propertyKey)) || newValue;
      }

      return Reflect.set(target, property, newValue, receiver);
    },
  });

  const state = new Proxy(initialState, handler());

  /**
   * Watch a property by its key. We use a curry function
   * to avoid duplicating the logic for the `once` flag.
   *
   * @param {boolean} once - If the property should be unwatched after the first call.
   * @returns A function that allow watching a property by its key, using a watcher callback.
   */
  const watch = (once: boolean) => <P extends Keys>(
    key: P,
    onChange: WatcherCallback<Value<T, P>>,
  ) => {
    cache[key as Keys] = {
      onChange,
      once,
    };

    // An `unwatch` function used to unwatch the property
    return () => unwatch(key as Keys);
  };

  return {
    state,
    watch: watch(false),
    watchOnce: watch(true),
  };
}

// Add influer to the window object if we are in the browser
if (typeof window !== 'undefined') {
  window.influer = influer;
}
