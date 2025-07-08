import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_TEMPLATE_DIR = path.resolve(
  __dirname,
  "../../templates/components"
);
const PROJECT_COMPONENTS_DIR = path.resolve("src/components/common");

export default async function addComponent() {
  const componentTree = buildComponentTree(COMPONENTS_TEMPLATE_DIR);
  const flatChoices = flattenComponentTree(componentTree);

  const { selectedItems } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedItems",
      message: "🧩 Select components or folders:",
      choices: flatChoices,
      pageSize: 20,
    },
  ]);

  const filesToCopy = [];

  for (const item of selectedItems) {
    if (item.type === "folder") {
      const folderChoices = buildFolderChoices(item.children);

      const { selectedChildren } = await inquirer.prompt([
        {
          type: "checkbox",
          name: "selectedChildren",
          message: `📁 Select items inside ${item.name}:`,
          choices: folderChoices,
          pageSize: 20,
        },
      ]);

      if (selectedChildren.includes("BACK")) continue;

      const chosenChildren = selectedChildren.includes("SELECT_ALL")
        ? item.children
        : selectedChildren;

      filesToCopy.push(...chosenChildren);
    } else {
      filesToCopy.push(item);
    }
  }

  for (const file of filesToCopy) {
    const templatePath = file.relativePath;
    const targetPath = path.join(PROJECT_COMPONENTS_DIR, templatePath);
    await copyComponentWithConfirm(templatePath, targetPath);
  }

  console.log("\n🎉 All selected items have been processed.\n");
}

function buildComponentTree(dir, base = "") {
  const items = fs.readdirSync(dir);
  const tree = [];

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      tree.push({
        name: item,
        type: "folder",
        relativePath: path.join(base, item),
        children: buildComponentTree(itemPath, path.join(base, item)),
      });
    } else if (item.endsWith(".vue")) {
      tree.push({
        name: item.replace(".vue", ""),
        type: "file",
        relativePath: path.join(base, item),
      });
    }
  });

  return tree;
}

function flattenComponentTree(tree) {
  return tree.map((item) => ({
    name: item.type === "folder" ? `📁 ${item.name}` : `🧩 ${item.name}`,
    value: item,
    short: item.name,
    checked:
      item.type === "folder"
        ? checkFolderFullyExists(item)
        : checkIfExists(item.relativePath),
  }));
}

function buildFolderChoices(children) {
  return [
    { name: "✅ Select All", value: "SELECT_ALL" },
    { name: "↩ Back", value: "BACK" },
    ...children.map((child) => ({
      name: `🧩 ${child.name}`,
      value: child,
      checked: checkIfExists(child.relativePath),
    })),
  ];
}

function checkFolderFullyExists(folder) {
  if (!folder.children || folder.children.length === 0) return false;
  return folder.children.every((child) => checkIfExists(child.relativePath));
}

function checkIfExists(relativePath) {
  const targetPath = path.join(PROJECT_COMPONENTS_DIR, relativePath);
  return fs.existsSync(targetPath);
}

async function copyComponentWithConfirm(templateRelativePath, targetPath) {
  const sourcePath = path.join(COMPONENTS_TEMPLATE_DIR, templateRelativePath);
  const targetDir = path.dirname(targetPath);

  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  if (fs.existsSync(targetPath)) {
    const overwrite = await askYesNo(
      `⚠️  ${templateRelativePath} already exists. Overwrite? (y/N): `
    );
    if (!overwrite) {
      console.log(`⏩ Skipped: ${templateRelativePath}`);
      return;
    }
  }

  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✅ ${templateRelativePath} → ${targetPath}`);
}

function askYesNo(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}
