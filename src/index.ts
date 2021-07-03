import {
  ChangeListener, Value, RecursiveKeys, Cache,
} from './types';
import recompose from './utils';

function influer<T extends object>(
  initialState: T,
) {
  const cache: Cache<T> = {};

  const unwatch = (property: RecursiveKeys<T>) => delete cache[property];

  const handler = (baseObj?: string | number | symbol): ProxyHandler<T> => ({
    get(target, property, receiver) {
      // @ts-ignore
      if (typeof target[property] === 'object' && Object.keys(target[property]).length > 0) {
      // @ts-ignore
        return new Proxy(target[property], handler(baseObj ? `${baseObj.toString()}.${property.toString()}` : property));
      }

      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      let propertyKey = property.toString() as RecursiveKeys<T>;

      if (baseObj) {
        propertyKey = `${baseObj.toString()}.${property.toString()}` as RecursiveKeys<T>;
      }

      const cacheValue = cache[propertyKey];
      let newValue = value;

      if (cacheValue) {
        const { onChange, once } = cacheValue!;

        if (once) {
          unwatch(propertyKey);
        }

        const changeResult = onChange(newValue, recompose(initialState, propertyKey));

        newValue = changeResult || newValue;
      }

      return Reflect.set(target, property, newValue, receiver);
    },
  });

  const state = new Proxy(initialState, handler());

  const watch = (once: boolean) => <P extends RecursiveKeys<T>>(
    property: P,
    onChange: ChangeListener<Value<T, P>>,
  ) => {
    // @ts-ignore
    cache[property] = {
      onChange,
      once,
    };

    // @ts-ignore
    return () => unwatch(property);
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
