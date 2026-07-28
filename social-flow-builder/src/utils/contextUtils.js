export function getDeep(obj, path) {
  if (!path) return obj;
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .reduce((acc, key) => acc?.[key], obj);
}

export function deepClone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function asDisplayValue(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}
