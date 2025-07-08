import fs from "fs";
import path from "path";
import { toKebabCase, toSnakeCase } from "./stringUtils.js";

const SIDEBAR_PATH = path.resolve("src/data/sidebarLinks.js");

export function updateSidebarLinks({
  moduleName,
  crudName,
  icon = "dashboard",
  isMultiple = false,
}) {
  const fileExists = fs.existsSync(SIDEBAR_PATH);
  const sidebarLinks = fileExists ? requireSidebarLinks() : { links: [] };

  const modulePath = `/${toKebabCase(moduleName)}`;
  const crudPath = isMultiple ? `/${toKebabCase(crudName)}` : modulePath;

  const moduleKey = `sidebar.${toSnakeCase(moduleName)}`;
  const crudKey = `sidebar.${toSnakeCase(crudName)}`;

  const newCrud = {
    to: crudPath,
    name: crudKey,
    permissions: "*",
    hipath: `icons.${icon}`,
  };

  if (isMultiple) {
    const existingModule = sidebarLinks.links.find(
      (link) => link.to === modulePath
    );

    if (existingModule) {
      if (!existingModule.children) existingModule.children = [];

      const alreadyExists = existingModule.children.some(
        (child) => child.to === crudPath
      );

      if (!alreadyExists) existingModule.children.push(newCrud);
    } else {
      sidebarLinks.links.push({
        to: modulePath,
        name: moduleKey,
        hipath: `icons.${icon}`,
        permissions: "*",
        children: [newCrud],
      });
    }
  } else {
    const alreadyExists = sidebarLinks.links.some(
      (link) => link.to === modulePath
    );

    if (!alreadyExists) {
      sidebarLinks.links.push({
        to: modulePath,
        name: moduleKey,
        permissions: "*",
        class: "mb-2",
        hipath: `icons.${icon}`,
      });
    }
  }

  writeSidebarLinks(sidebarLinks.links);
}

function requireSidebarLinks() {
  const content = fs.existsSync(SIDEBAR_PATH)
    ? fs.readFileSync(SIDEBAR_PATH, "utf8")
    : "";

  const exportsIndex = content.indexOf("export const links = ");
  if (exportsIndex === -1) return { links: [] };

  const jsonStart = content.indexOf("[", exportsIndex);
  const jsonEnd = content.lastIndexOf("]");

  if (jsonStart === -1 || jsonEnd === -1) return { links: [] };

  const jsonString = content.substring(jsonStart, jsonEnd + 1);

  try {
    const links = eval(jsonString);
    return { links };
  } catch {
    return { links: [] };
  }
}

function writeSidebarLinks(links) {
  const sidebarDir = path.resolve("src/data");
  const sidebarPath = path.join(sidebarDir, "sidebarLinks.js");

  if (!fs.existsSync(sidebarDir)) {
    fs.mkdirSync(sidebarDir, { recursive: true });
  }

  const content =
    `
import { icons } from '@/plugins/icons'

export const links = ${JSON.stringify(links, null, 2)}
`.trim() + "\n";

  fs.writeFileSync(sidebarPath, content, "utf8");
}
