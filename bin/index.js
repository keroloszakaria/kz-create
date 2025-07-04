#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_FOLDER = path.join(__dirname, "..", "templates");
const TARGET_FOLDER = path.join(process.cwd(), "src", "modules");

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseInputToObjects(input) {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => ({ name: s }));
}

function applyPlaceholders(content, crudName, helpModels, helpEnums) {
  const moduleCapital = capitalize(crudName);

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
    .replace(/__CRUD__/g, crudName)
    .replace(/__CRUD_CAPITAL__/g, moduleCapital)
    .replace(/__HELP_MODELS__/g, modelsString.trim())
    .replace(/__HELP_ENUMS__/g, enumsString.trim())
    .replace(/__HELP_PROMISES__/g, promiseString.trim());
}

function copyFolderRecursiveSync(
  source,
  target,
  crudName,
  helpModels = [],
  helpEnums = []
) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const curSource = path.join(source, file);
    const replacedFileName = file.replace(/__CRUD__/g, crudName);
    const curTarget = path.join(target, replacedFileName);

    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(
        curSource,
        curTarget,
        crudName,
        helpModels,
        helpEnums
      );
    } else {
      let content = fs.readFileSync(curSource, "utf8");
      content = applyPlaceholders(content, crudName, helpModels, helpEnums);
      fs.writeFileSync(curTarget, content, "utf8");
    }
  });
}

function updateRouter(modulePath, crudName) {
  const routerPath = path.join(modulePath, "router");
  const routerFile = path.join(routerPath, "index.js");

  const routeEntry = `{
    path: '${crudName === "index" ? "" : crudName}',
    name: '${crudName === "index" ? path.basename(modulePath) : crudName}',
    component: () => import('@/modules/${path.basename(
      modulePath
    )}/views/${crudName}.vue'),
    meta: {
      is_searchable: true,
      name: ${crudName}
    },
  }`;

  if (!fs.existsSync(routerPath)) fs.mkdirSync(routerPath, { recursive: true });

  let routerContent = "";

  if (fs.existsSync(routerFile)) {
    routerContent = fs.readFileSync(routerFile, "utf8").trim();

    if (!routerContent.includes("export default")) {
      routerContent = `export default [\n  ${routeEntry}\n];\n`;
    } else if (
      !routerContent.includes(`name: '${crudName}'`) &&
      !routerContent.includes(`name: '${path.basename(modulePath)}'`)
    ) {
      routerContent = routerContent.replace(
        /export default\s*\[/,
        `export default [\n  ${routeEntry},`
      );
    }
  } else {
    routerContent = `export default [\n  ${routeEntry}\n];\n`;
  }

  fs.writeFileSync(routerFile, routerContent, "utf8");
}

async function createCrud() {
  const { moduleName } = await inquirer.prompt({
    name: "moduleName",
    message: "Enter the module name (e.g., user, product):",
  });

  const modulePath = path.join(TARGET_FOLDER, moduleName);
  let targetFolder = modulePath;
  let crudName = moduleName;

  const moduleExists = fs.existsSync(modulePath);

  let multipleCruds = false;

  if (moduleExists) {
    const { hasMultiple } = await inquirer.prompt({
      type: "confirm",
      name: "hasMultiple",
      message: `Module "${moduleName}" already exists. Do you want to add a new CRUD to it?`,
      default: true,
    });

    multipleCruds = hasMultiple;

    if (multipleCruds) {
      const { newCrudName } = await inquirer.prompt({
        name: "newCrudName",
        message: "Enter the new CRUD name (e.g., createInvoice):",
      });

      crudName = newCrudName;
      targetFolder = modulePath;
    } else {
      crudName = "index";
      targetFolder = modulePath;
    }
  } else {
    const { hasMultiple } = await inquirer.prompt({
      type: "confirm",
      name: "hasMultiple",
      message: "Does this module have multiple CRUDs?",
      default: false,
    });

    multipleCruds = hasMultiple;

    crudName = multipleCruds
      ? await inquirer
          .prompt({
            name: "newCrudName",
            message: "Enter the CRUD name:",
          })
          .then((a) => a.newCrudName)
      : "index";

    targetFolder = modulePath;
  }

  const { layoutType } = await inquirer.prompt({
    type: "list",
    name: "layoutType",
    message: "Choose layout type:",
    choices: ["modal", "pages"],
  });

  const { helpModels } = await inquirer.prompt({
    name: "helpModels",
    message: "Enter help models (comma separated), or leave blank:",
  });

  const { helpEnums } = await inquirer.prompt({
    name: "helpEnums",
    message: "Enter help enums (comma separated), or leave blank:",
  });

  const helpModelsArray = parseInputToObjects(helpModels);
  const helpEnumsArray = parseInputToObjects(helpEnums);

  const selectedTemplate = path.join(TEMPLATE_FOLDER, layoutType);

  copyFolderRecursiveSync(
    selectedTemplate,
    targetFolder,
    crudName,
    helpModelsArray,
    helpEnumsArray
  );

  updateRouter(modulePath, crudName);

  console.log(
    `✅ CRUD "${crudName}" created successfully in module "${moduleName}" (${layoutType})`
  );
}

createCrud();
