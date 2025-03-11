function camelToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);
}

export function convertKeysToSnakeCase(obj: any): any {
  // If the object is a Date, return its ISO string representation
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  // Process arrays recursively
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase);
  }
  // Process objects recursively
  if (obj !== null && typeof obj === "object") {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = camelToSnakeCase(key);
        newObj[snakeKey] = convertKeysToSnakeCase(obj[key]);
      }
    }
    return newObj;
  }
  // Return primitive values as-is
  return obj;
}
