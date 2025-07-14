import fs from "fs";
import inquirer from "inquirer";
import { spawn } from "child_process";
import { join } from "path";
import { tmpdir } from "os";
import { toCamelCase } from "../utils/stringUtils.js";
import parsePayloadFormat from "../utils/handlePayloadFormat.js";
import { generateSchemaFromPayload } from "../utils/schemaGenerator.js";

async function openInEditor(result, schemaName) {
  try {
    const tempFile = join(tmpdir(), `schema_${schemaName}_${Date.now()}.txt`);
    const content = result;

    fs.writeFileSync(tempFile, content);

    const platform = process.platform;
    let command, args;

    if (platform === "win32") {
      command = "notepad";
      args = [tempFile];
    } else if (platform === "darwin") {
      command = "open";
      args = ["-t", tempFile];
    } else {
      command = "xdg-open";
      args = [tempFile];
    }

    const child = spawn(command, args, { detached: true, stdio: "ignore" });

    child.unref();

    console.log(`✅ Schema generated and opened in text editor!`);
    console.log(`📄 File: ${tempFile}`);

    setTimeout(() => {
      try {
        fs.unlinkSync(tempFile);
      } catch (err) {}
    }, 300000); // 5 minutes
  } catch (error) {
    console.error("❌ Error opening text editor:", error.message);
    console.log("\n📋 Generated Schema:");
    console.log("=".repeat(50));
    console.log(result);
    console.log("=".repeat(50));
  }
}

export default async function generateSchema() {
  const { schemaName } = await inquirer.prompt({
    name: "schemaName",
    message: "Enter the schema name (e.g., user, product):",
  });

  const crudCamel = toCamelCase(schemaName);

  const { payloadText } = await inquirer.prompt({
    type: "editor",
    name: "payloadText",
    message:
      "Paste your payload (key:value) below. Press Enter twice when done:",
    default: "",
  });

  const convertedPayload = parsePayloadFormat(payloadText);

  const generatedSchema = generateSchemaFromPayload(
    convertedPayload,
    crudCamel
  );

  const { outputChoice } = await inquirer.prompt({
    type: "list",
    name: "outputChoice",
    message: "How would you like to receive the generated schema?",
    choices: [
      { name: "📝 Show in text editor", value: "editor" },
      { name: "💾 Save to project path", value: "save" },
    ],
  });

  if (outputChoice === "editor") {
    await openInEditor(generatedSchema, schemaName);
    process.exit(0);
  } else if (outputChoice === "save") {
    const { savePath: rawSavePath } = await inquirer.prompt({
      type: "input",
      name: "savePath",
      message:
        "Enter the folder path OR full file path where you want to save the schema:",
    });

    let savePath = rawSavePath.trim();

    try {
      const isFolder =
        fs.existsSync(savePath) && fs.lstatSync(savePath).isDirectory();

      if (isFolder) savePath = join(savePath, `${crudCamel}.js`);
      else if (!extname(savePath)) savePath += ".js";

      const folderPath = savePath.substring(
        0,
        savePath.lastIndexOf("\\") || savePath.lastIndexOf("/")
      );

      if (!fs.existsSync(folderPath))
        mkdirSync(folderPath, { recursive: true });

      fs.writeFileSync(savePath, generatedSchema);
      console.log(`✅ Schema saved to: ${savePath}`);
    } catch (err) {
      console.error("❌ Failed to save schema:", err.message);
    }

    process.exit(0);
  }
}
