export function computeIfAbsent<K, V>(map: Map<K, V>, key: K, mappingFunction: (key: K) => V): V {
  let val = map.get(key);
  if (typeof val === "undefined") {
      val = mappingFunction(key);
      map.set(key, val);
  }
  return val;
}