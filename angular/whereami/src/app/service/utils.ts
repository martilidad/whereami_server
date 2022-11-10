import { filter, MonoTypeOperatorFunction } from 'rxjs';

export function computeIfAbsent<K, V>(map: Map<K, V>, key: K, mappingFunction: (key: K) => V): V {
  let val = map.get(key);
  if (typeof val === "undefined") {
      val = mappingFunction(key);
      map.set(key, val);
  }
  return val;
}

export function distinctTimes<T, K>(keySelector?: (value: T) => K, times:number=1): MonoTypeOperatorFunction<T> {
  const distinctKeys = new Map();
  return filter(val => {
      const key = keySelector ? keySelector(val) : val;
      const newTimes = distinctKeys.has(key) ? distinctKeys.get(key) + 1 : 1;
      distinctKeys.set(key, newTimes);
      return newTimes <= times;
    });
}
