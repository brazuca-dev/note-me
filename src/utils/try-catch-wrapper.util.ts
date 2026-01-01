type AnyFunction = (...args: any[]) => any
  
export function tryCatchWrapper<Args extends any[], R>(
  handler: (...args: Args) => Promise<R>
): (...args: Args) => Promise<[R | null, Error | null]>;

export function tryCatchWrapper<Args extends any[], R>(
  handler: (...args: Args) => R
): (...args: Args) => [R | null, Error | null];

export function tryCatchWrapper(handler: AnyFunction) {
  return (...args: any[]) => {
    try {
      const data = handler(...args)
      
      if (data instanceof Promise) {
        return data
          .then((resolvedData) => [resolvedData, null])
          .catch((e) => [ null, e instanceof Error ? e : new Error(String(e)) ]);
      }
      
      return [data, null]
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e))
      console.error(error.cause)
      return [null, error]
    }
  }
}
