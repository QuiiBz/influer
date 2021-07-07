export type RecursiveKeys<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveKeys<TObj[TKey]>}`
    : `${TKey}`
}[keyof TObj & (string | number)]
export type Value<T, K> = K extends `${infer FK}.${infer L}`
  ? FK extends keyof T
    ? Value<T[FK], L>
    : never
  : K extends keyof T
  ? T[K]
  : never

export type Cache<T extends object> = {
  // @ts-ignore
  [P in RecursiveKeys<T>]?: CacheValue<T, P>
}

export type CacheValue<T extends object, P extends RecursiveKeys<T>> = {
  onChange: WatcherCallback<Value<T, P>>
  once: boolean
}

export type WatcherCallback<V> = (newValue: V, oldValue: V) => void | V
