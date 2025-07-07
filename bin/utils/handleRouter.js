import fs from "fs";
import path from "path";
import { toCamelCase, toKebabCase } from "./helper.js";

export default function updateRouter(modulePath, crudName) {
  const routerPath = path.join(modulePath, "router");
  const routerFile = path.join(routerPath, "index.js");

  const crudKebab = toKebabCase(crudName);
  const crudCamel = toCamelCase(crudName);
  const crudUnderscore = crudKebab.replace(/-/g, "_");

  const routePath =
    crudName === "index" ? `/${path.basename(modulePath)}` : `/${crudKebab}`;
  const routeName =
    crudName === "index" ? path.basename(modulePath) : crudKebab;

  const newRoute = `  {
    path: "${routePath}",
    name: "${routeName}",
    component: () => import("@/modules/${path.basename(modulePath)}/views/${crudCamel}.vue"),
    meta: {
      is_searchable: true,
      name: "${crudUnderscore}",
    },
  }`;

  if (!fs.existsSync(routerPath)) fs.mkdirSync(routerPath, { recursive: true });

  let routerContent = "";
  if (fs.existsSync(routerFile)) {
    routerContent = fs.readFileSync(routerFile, "utf8");
  }

  // Step 1: Ensure export default exists
  if (!routerContent.includes("export default [")) {
    routerContent = `export default [\n];\n`;
  }

  // Step 2: Check if route already exists (safe string check)
  if (
    routerContent.includes(`path: "${routePath}"`) ||
    routerContent.includes(`name: "${routeName}"`)
  ) {
    console.log(`⚠️ Route "${routeName}" already exists. Skipping...`);
    return;
  }

  // Step 3: Insert new route before the closing ];
  const closingIndex = routerContent.lastIndexOf("];");
  if (closingIndex === -1) {
    console.error("❌ Invalid router file format.");
    return;
  }

  const beforeClosing = routerContent.substring(0, closingIndex).trimEnd();
  const afterClosing = routerContent.substring(closingIndex);

  const finalRouterContent = `${beforeClosing},\n${newRoute}\n${afterClosing}`;

  fs.writeFileSync(routerFile, finalRouterContent, "utf8");

  console.log(`✅ Route "${routeName}" added successfully.`);
}
