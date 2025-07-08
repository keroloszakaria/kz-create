#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

import parsePayloadFormat from "../utils/handlePayloadFormat.js";
import { copyFolderRecursiveSync } from "../utils/helper.js";
import updateRouter from "../utils/handleRouter.js";
import { updateSidebarLinks } from "../utils/updateSidebarLinks.js";
import {
  generateSchemaFromPayload,
  generateBasicSchema,
} from "../utils/schemaGenerator.js";

import { parseInputToObjects, extractNames } from "../utils/helper.js";
import { toCamelCase, toKebabCase, toSnakeCase } from "../utils/stringUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_FOLDER = path.join(__dirname, "../../templates");
const TARGET_FOLDER = path.join(process.cwd(), "src", "modules");

export default async function createCrud() {
  console.log("🚀 Creating CRUD module...\n");

  const { moduleName } = await inquirer.prompt({
    name: "moduleName",
    message: "Enter the module name (e.g., user, product):",
  });

  const modulePath = path.join(TARGET_FOLDER, moduleName);
  let targetFolder = modulePath;
  let crudName = moduleName;
  let multipleCruds = false;

  const moduleExists = fs.existsSync(modulePath);

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
        message: "Enter the CRUD name (e.g., createInvoice, feature-groups):",
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
          .prompt({ name: "newCrudName", message: "Enter the CRUD name:" })
          .then((a) => a.newCrudName)
      : "index";

    targetFolder = modulePath;
  }

  const { layoutType } = await inquirer.prompt({
    type: "list",
    name: "layoutType",
    message: "Choose layout type:",
    choices: ["Modal", "Pages"],
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

  const { wantsSchema } = await inquirer.prompt({
    type: "confirm",
    name: "wantsSchema",
    message: "Do you want to auto-generate a form schema from payload?",
    default: false,
  });

  const schemaDir = path.join(targetFolder, "schema");
  if (!fs.existsSync(schemaDir)) fs.mkdirSync(schemaDir, { recursive: true });

  const crudCamel = toCamelCase(crudName);
  const schemaPath = path.join(schemaDir, `${crudCamel}.js`);

  if (wantsSchema) {
    console.log(
      "\n📝 Paste your payload (key:value) below. Press Enter twice or type 'END':\n"
    );

    const { payloadText } = await inquirer.prompt({
      type: "editor",
      name: "payloadText",
      message: "Paste your payload:",
      default: "",
    });

    const convertedPayload = parsePayloadFormat(payloadText);
    const helpModelsNames = extractNames(helpModelsArray);
    const helpEnumsNames = extractNames(helpEnumsArray);

    const generatedSchemaCode = generateSchemaFromPayload(
      convertedPayload,
      crudCamel,
      helpModelsNames,
      helpEnumsNames
    );

    fs.writeFileSync(schemaPath, generatedSchemaCode, "utf8");
  } else {
    const basicSchemaCode = generateBasicSchema(crudCamel);
    fs.writeFileSync(schemaPath, basicSchemaCode, "utf8");
  }

  const selectedTemplate = path.join(TEMPLATE_FOLDER, layoutType);

  copyFolderRecursiveSync(
    selectedTemplate,
    targetFolder,
    crudName,
    helpModelsArray,
    helpEnumsArray
  );

  updateRouter(modulePath, crudName);

  console.log(`✅ Route "${crudName}" added successfully.`);

  const { addSidebar } = await inquirer.prompt({
    type: "confirm",
    name: "addSidebar",
    message: "Do you want to add this CRUD to sidebarLinks.js?",
    default: true,
  });

  if (addSidebar) {
    const { iconName } = await inquirer.prompt({
      name: "iconName",
      message:
        "Enter icon name (without 'icons.'), e.g., 'dashboard' or 'users':",
    });

    const routePath = multipleCruds
      ? `/${toKebabCase(moduleName)}`
      : `/${toKebabCase(moduleName)}`;

    const crudPath = multipleCruds ? `/${toKebabCase(crudName)}` : null;

    updateSidebarLinks({
      moduleName: toKebabCase(moduleName),
      moduleKey: `sidebar.${toSnakeCase(moduleName)}`,
      iconName,
      isMultiple: multipleCruds,
      crudName: toKebabCase(crudName),
      crudKey: `sidebar.${toSnakeCase(crudName)}`,
      moduleRoute: routePath,
      crudRoute: crudPath,
    });
  }

  console.log(
    `✅ CRUD "${crudName}" created successfully in module "${moduleName}" (${layoutType})`
  );
}
