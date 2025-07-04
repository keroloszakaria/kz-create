export function generateSchemaFromPayload(payloadText) {
  const lines = payloadText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const fieldTypeMap = {
    text: "text",
    number: "number",
    textarea: "textarea",
    select: "select",
    combobox: "combobox",
    radio: "radioButton",
    checkbox: "checkbox",
    phone: "phone",
    datetime: "datetime",
    image: "imageUploader",
    password: "password",
    editor: "editor",
    otp: "otp",
    captcha: "captcha",
  };

  const schema = lines.map((line) => {
    const [rawKey, rawType] = line.split(":").map((s) => s.trim());
    const key = rawKey || "unknown";
    const type = fieldTypeMap[rawType?.toLowerCase()] || "text";

    return {
      key,
      type,
      label: key,
      value: "",
      required: true,
      cols: { sm: 12, md: 4, lg: 4 },
    };
  });

  return schema;
}
