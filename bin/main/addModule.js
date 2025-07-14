import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import installModuleDependencies from "../utils/installModuleDependencies.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_TEMPLATE_DIR = path.resolve(__dirname, "../../templates/modules");
const PROJECT_MODULES_DIR = path.resolve("src/modules");

export default async function addModule() {
  const moduleNames = getAvailableModules(MODULES_TEMPLATE_DIR);
  const existingModules = getExistingModules(PROJECT_MODULES_DIR);

  const choices = moduleNames.map((name) => ({
    name: `${existingModules.includes(name) ? "✅" : "⬜"} ${name}`,
    value: name,
    checked: existingModules.includes(name),
  }));

  const { selectedModules } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedModules",
      message: "📦 Select modules to add:",
      choices,
      pageSize: 15,
    },
  ]);

  for (const moduleName of selectedModules) {
    const sourcePath = path.join(MODULES_TEMPLATE_DIR, moduleName);
    const targetPath = path.join(PROJECT_MODULES_DIR, moduleName);

    if (fs.existsSync(targetPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `⚠️  Module '${moduleName}' already exists. Overwrite?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(`⏩ Skipped: ${moduleName}`);
        continue;
      }
    }

    copyFolderRecursive(sourcePath, targetPath);
    console.log(`✅ ${moduleName} module added.`);

    // 👇 تثبيت الـ dependencies بعد الإضافة
    installModuleDependencies(sourcePath);
  }

  console.log("\n🎉 All selected modules have been processed.\n");
}

function getAvailableModules(dir) {
  return fs.readdirSync(dir).filter((item) => {
    const itemPath = path.join(dir, item);
    return fs.statSync(itemPath).isDirectory();
  });
}

function getExistingModules(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((item) => {
    const itemPath = path.join(dir, item);
    return fs.statSync(itemPath).isDirectory();
  });
}

function copyFolderRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
