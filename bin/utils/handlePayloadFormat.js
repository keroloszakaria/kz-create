export default function parsePayloadFormat(payloadText) {
  const fieldMap = [
    "text",
    "textarea",
    "select",
    "image",
    "file",
    "number",
    "password",
    "checkbox",
    "radio",
    "radiobutton",
    "phone",
    "datetime",
    "date",
    "time",
    "combobox",
    "combo",
    "button",
    "otp",
    "captcha",
    "editor",
  ];

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // 2023-05-20
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; // 14:30

  const lines = payloadText.trim().split("\n");
  const convertedLines = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const colonIndex = trimmedLine.indexOf(":");
    if (colonIndex === -1) continue;

    const keyPart = trimmedLine.substring(0, colonIndex).trim();
    const valuePart = trimmedLine.substring(colonIndex + 1).trim();

    const convertedKey = keyPart.replace(/\[([^\]]+)\]/g, ".$1");
    let type = "text";

    const valueLower = valuePart.toLowerCase();

    if (fieldMap.includes(valueLower)) {
      type = valueLower;
    } else if (valueLower === "true" || valueLower === "false") {
      type = "checkbox";
    } else if (
      convertedKey.includes("id") ||
      convertedKey.includes("ids") ||
      convertedKey.endsWith("_id") ||
      convertedKey.endsWith("_ids")
    ) {
      type = "select";
    } else if (dateRegex.test(valuePart)) {
      type = "date";
    } else if (timeRegex.test(valuePart)) {
      type = "time";
    } else if (!isNaN(valuePart) && valuePart !== "") {
      type = "number";
    } else {
      type = "text";
    }

    convertedLines.push(`${convertedKey}: ${type}`);
  }

  return convertedLines.join(", ");
}
