#!/usr/bin/env node

import createCrud from "./main/createCrud.js";
import addModule from "./main/addModule.js";
import addComponent from "./main/addComponent.js";
import showHelp from "./main/showHelp.js";
import inquirer from "inquirer";

const command = process.argv[2];

// 👋 Global SIGINT Handler
process.on("SIGINT", () => {
  console.log("\n❌ العملية تم إلغاؤها بواسطة المستخدم. 👋");
  process.exit(0);
});

switch (command) {
  case "help":
  case "-h":
  case "--help":
    showHelp();
    break;
  case "create":
    createCrud();
    break;
  case "add":
    addCommon();
    break;
  default:
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
    if (error.isTtyError)
      console.log(
        "❌ This prompt couldn't be rendered in the current environment."
      );
    else if (error.message.includes("SIGINT"))
      console.log("\n❌ Action aborted. Goodbye! 👋");
    else console.error("❌ An error occurred:", error.message);

    process.exit(0);
  }
}
