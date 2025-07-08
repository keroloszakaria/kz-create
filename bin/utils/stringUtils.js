export const toKebabCase = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

export const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const toSnakeCase = (str) =>
  str
    .replace(/-/g, "_")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
