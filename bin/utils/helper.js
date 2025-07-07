export const toKebabCase = (str) => str;

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

export const parseInputToObjects = (input) =>
  input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => ({ name: s }));

export const extractNames = (objectsArray) =>
  objectsArray.map((obj) => obj.name);
