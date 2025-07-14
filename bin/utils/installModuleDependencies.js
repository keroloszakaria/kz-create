import fs from "fs";
import path from "path";
import { execSync } from "child_process";

function installModuleDependencies(modulePath) {
  const depFile = path.join(modulePath, "dependencies.json");

  if (fs.existsSync(depFile)) {
    const deps = JSON.parse(fs.readFileSync(depFile, "utf-8"));

    const depsList = Object.entries(deps.dependencies || {}).map(
      ([name, version]) => `${name}@${version}`
    );

    const devDepsList = Object.entries(deps.devDependencies || {}).map(
      ([name, version]) => `${name}@${version}`
    );

    if (depsList.length > 0) {
      console.log(`📦 Installing dependencies for module...`);
      execSync(`npm install ${depsList.join(" ")}`, { stdio: "inherit" });
    }

    if (devDepsList.length > 0) {
      console.log(`🛠️ Installing devDependencies for module...`);
      execSync(`npm install -D ${devDepsList.join(" ")}`, { stdio: "inherit" });
    }
  }
}

export default installModuleDependencies;
