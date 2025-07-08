import { toKebabCase, toCamelCase, capitalize } from "./stringUtils.js";
export const parseInputToObjects = (input) =>
  input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => ({ name: s }));

export const extractNames = (objectsArray) =>
  objectsArray.map((obj) => obj.name);
import fs from "fs";
import path from "path";

export function applyPlaceholders(content, crudName, helpModels, helpEnums) {
  const crudKebab = toKebabCase(crudName);
  const crudCamel = toCamelCase(crudName);
  const crudUnderscore = crudKebab.replace(/-/g, "_");
  const moduleCapital = capitalize(crudCamel);

  const modelsString = helpModels.length
    ? `const tables = ${JSON.stringify(helpModels, null, 2)};\n`
    : "";

  const enumsString = helpEnums.length
    ? `const enums = ${JSON.stringify(helpEnums, null, 2)};\n`
    : "";

  const promiseCalls = [];
  if (helpEnums.length) promiseCalls.push("enumsStore.getHelpEnums(enums)");
  if (helpModels.length) promiseCalls.push("enumsStore.getHelpModels(tables)");

  const promiseString = promiseCalls.length
    ? `await Promise.all([\n  ${promiseCalls.join(",\n  ")}\n]);\n`
    : "";

  return content
    .replace(/__CRUD__/g, crudCamel)
    .replace(/__CRUD_KEBAB__/g, crudKebab)
    .replace(/__CRUD_UNDERSCORE__/g, crudUnderscore)
    .replace(/__CRUD_CAPITAL__/g, moduleCapital)
    .replace(/__HELP_MODELS__/g, modelsString.trim())
    .replace(/__HELP_ENUMS__/g, enumsString.trim())
    .replace(/__HELP_PROMISES__/g, promiseString.trim());
}

export function copyFolderRecursiveSync(
  src,
  dest,
  crudName,
  helpModels = [],
  helpEnums = []
) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    let destFileName = entry.name.replace(/__CRUD__/g, crudName);
    const destPath = path.join(dest, destFileName);

    if (entry.isDirectory()) {
      copyFolderRecursiveSync(
        srcPath,
        destPath,
        crudName,
        helpModels,
        helpEnums
      );
    } else {
      let content = fs.readFileSync(srcPath, "utf-8");

      content = applyPlaceholders(content, crudName, helpModels, helpEnums);

      fs.writeFileSync(destPath, content, "utf-8");
    }
  }
}

export function generateModuleContent(moduleName, moduleType) {
  return `// ${moduleType} module: ${moduleName}

export default function ${moduleName}() {
  console.log("${moduleName} module loaded");
}
`;
}

export function generateModuleReadme(moduleName, moduleType) {
  return `# ${moduleName} (${moduleType} module)

This is the **${moduleType}** module: **${moduleName}**.

## How to use

\`\`\`js
import ${moduleName} from '@/modules/common/${moduleName}'

${moduleName}()
\`\`\`
`;
}

export function generateComponentContent(componentName) {
  return `<template>
  <div class="${componentName}">
    <h1>${componentName} Component</h1>
  </div>
</template>

<script setup>
defineProps({})
</script>

<style scoped>
.${componentName} {
  padding: 1rem;
}
</style>
`;
}

export function generateComponentReadme(componentName) {
  return `# ${componentName} Component

This is the **${componentName}** component.

## Usage

\`\`\`vue
<${componentName} />
\`\`\`
`;
}
export function generateComponentIndex(componentName) {
  return `import ${componentName} from './${componentName}.vue';

export default ${componentName};
`;
}
