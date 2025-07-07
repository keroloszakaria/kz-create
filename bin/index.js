#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import parsePayloadFormat from "./utils/handlePayloadFormat.js";
import updateRouter from "./utils/handleRouter.js";
import {
  generateSchemaFromPayload,
  generateBasicSchema,
} from "./utils/schemaGenerator.js";

import {
  toKebabCase,
  toCamelCase,
  capitalize,
  parseInputToObjects,
  extractNames,
} from "./utils/helper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_FOLDER = path.join(__dirname, "..", "templates");
const TARGET_FOLDER = path.join(process.cwd(), "src", "modules");

function applyPlaceholders(content, crudName, helpModels, helpEnums) {
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
    const crudCamel = toCamelCase(crudName);
    const replacedFileName = file.replace(/__CRUD__/g, crudCamel);
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
      default: `
          title[ar]:منتج جديد
          title[en]:New Product
          description[ar]:textarea
          description[en]:textarea
          price:100
          status:true
          icon:image
          manual:file
          category_id:1
          tag_ids:[1,2,3]
          rating:4.5
          launch_date:2023-05-20
          launch_time:14:30
          publish_at:datetime
          phone:phone
          custom_field:text
          password:password
          role:select
          accept_terms:false
          otp_code:otp
          captcha_field:captcha
          editor_content:editor
        `,
    });

    const convertedPayload = parsePayloadFormat(payloadText);
    console.log("\n🔄 Converted payload:");
    console.log(convertedPayload);

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

  console.log(
    `✅ CRUD "${crudName}" created successfully in module "${moduleName}" (${layoutType})`
  );
}

createCrud();
