#!/usr/bin/env node

import createCrud from "./main/createCrud.js";
import addModule from "./main/addModule.js";
import addComponent from "./main/addComponent.js";
import showHelp from "./main/showHelp.js";
import generateSchema from "./main/generateSchema.js";
import inquirer from "inquirer";

const commands = {
  help: showHelp,
  "-h": showHelp,
  "--help": showHelp,
  generate: generateCommon,
  g: generateCommon,
  create: createCrud,
  c: createCrud,
  add: addCommon,
  a: addCommon,
  "add:module": addModule,
  "add:component": addComponent,
};

// Global SIGINT Handler
process.on("SIGINT", () => {
  console.log("\n❌ العملية تم إلغاؤها بواسطة المستخدم. 👋");
  process.exit(0);
});

const command = process.argv[2];

const action = commands[command];

if (action) action();
else {
  console.log(`❌ Unknown command: ${command}`);
  console.log('Run "wb help" for usage information.');
  process.exit(1);
}

async function addCommon() {
  try {
    const { addType } = await inquirer.prompt({
      type: "list",
      name: "addType",
      message: "What would you like to add?",
      choices: [
        { name: "📦 Module - Common reusable module", value: "module" },
        { name: "🧩 Component - Common Vue component", value: "component" },
      ],
    });

    if (addType === "module") await addModule();
    else await addComponent();
  } catch (error) {
    handleError(error);
  }
}

async function generateCommon() {
  try {
    const { generateType } = await inquirer.prompt({
      type: "list",
      name: "generateType",
      message: "What would you like to generate?",
      choices: [
        { name: "📦 Schema - generate from postman payload", value: "schema" },
      ],
    });

    if (generateType === "schema") await generateSchema();
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  if (error.isTtyError)
    console.log(
      "❌ This prompt couldn't be rendered in the current environment."
    );
  else if (error.message.includes("SIGINT"))
    console.log("\n❌ Action aborted. Goodbye! 👋");
  else console.error("❌ An error occurred:", error.message);

  process.exit(0);
}
