import { capitalize } from "./stringUtils.js";
export function generateSchemaFromPayload(
  payloadText,
  crudName,
  helpModels = [],
  helpEnums = []
) {
  const lines = payloadText
    .split(/[\n,]/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const fieldMap = {
    text: "createTextField",
    textarea: "createTextAreaField",
    select: "createSelectField",
    image: "createImageInput",
    file: "createImageInput",
    number: "createNumberField",
    password: "createPasswordField",
    checkbox: "createCheckBoxField",
    radio: "createRadioButtonField",
    radiobutton: "createRadioButtonField",
    phone: "createPhoneField",
    datetime: "createDateTimeField",
    date: "createDateTimeField",
    time: "createDateTimeField",
    combobox: "createComboBoxField",
    combo: "createComboBoxField",
    button: "createButton",
    otp: "createOtpInput",
    captcha: "createCaptchaField",
    editor: "createEditorField",
  };

  const usedFields = new Set();

  const schemaEntries = lines.map((line) => {
    const [rawKey, rawTypeOrValue] = line.split(":").map((s) => s.trim());
    const key = rawKey.replace("[", ".").replace("]", "");

    let typeGuess = rawTypeOrValue?.toLowerCase();
    let valueIsBinary = [0, 1, true, false].includes(rawTypeOrValue);
    // Initial type inference
    let type = fieldMap[typeGuess] || "createTextField";

    // Override with checkbox if value is 0/1 and key is boolean-like
    if (valueIsBinary || key.startsWith("is_") || key.includes("status"))
      type = "createCheckBoxField";

    usedFields.add(type);

    const isSelect = type === "createSelectField";
    const isDateTime = type === "createDateTimeField";
    const isNumber = type === "createNumberField";
    const isCheckbox = type === "createCheckBoxField";
    const isRadio = type === "createRadioButtonField";
    const isPhone = type === "createPhoneField";
    const isComboBox = type === "createComboBoxField";
    const isPassword = type === "createPasswordField";
    const isOtp = type === "createOtpInput";
    const isCaptcha = type === "createCaptchaField";
    const isEditor = type === "createEditorField";
    const isButton = type === "createButton";

    const isMultipleSelect = isSelect && key.endsWith("ids");

    let matchType = null;
    let matchName = null;

    if (isSelect) {
      const modelMatch = helpModels.find((m) => {
        const modelName = m.includes(".") ? m.split(".").pop() : m;
        return (
          key.includes(modelName.slice(0, -1)) ||
          key.replace("_id", "") === modelName.slice(0, -1) ||
          key.replace("_ids", "") === modelName.slice(0, -1)
        );
      });

      if (modelMatch) {
        matchType = "model";
        matchName = modelMatch;
      } else {
        const enumMatch = helpEnums.find((e) => {
          const enumName = e.includes(".") ? e.split(".").pop() : e;
          return (
            key === enumName ||
            key.includes(enumName) ||
            key.replace("_id", "") === enumName ||
            key.replace("_ids", "") === enumName
          );
        });

        if (enumMatch) {
          matchType = "enum";
          matchName = enumMatch;
        }
      }
    }

    let label = key;
    if (key.includes(".")) label = key.replace(/\./g, "_");
    else if (key.endsWith("_id")) label = key.replace("_id", "");
    else if (key.endsWith("_ids")) label = key.replace("_ids", "");
    else if (key.includes("_")) label = key;

    let updateKeyLine = "";
    let optionsLine = "";
    let itemLines = "";
    let valueLine = "";
    let extraProps = "";

    if (isSelect || isComboBox || isRadio)
      valueLine = isMultipleSelect ? "value: []," : "value: null,";
    else if (isCheckbox) valueLine = "value: 0,";
    else if (isNumber) valueLine = "value: 0,";
    else if (isDateTime) valueLine = "value: null,";
    else if (isOtp) valueLine = "value: '',";
    else if (isButton) valueLine = "";
    else valueLine = 'value: "",';

    if (isSelect && matchType === "model") {
      const modelBase = matchName.includes(".")
        ? matchName.split(".").pop()
        : matchName;
      const baseKey = modelBase.slice(0, -1);

      if (key.endsWith("_id")) label = key.replace("_id", "");
      else if (key.endsWith("_ids")) label = key.replace("_ids", "");

      updateKeyLine = `updateKey: "${baseKey}.id",`;

      const optionsKey = matchName.includes(".")
        ? matchName.split(".").pop()
        : matchName;
      optionsLine = `options: computed(() => enumsStore.state["${optionsKey}"]),`;

      itemLines = `itemTitle: "name",
      itemValue: "id",`;
    } else if (isSelect && matchType === "enum") {
      const enumBase = matchName.includes(".")
        ? matchName.split(".").pop()
        : matchName;

      label = enumBase.replace("user_", "").replace(/_/g, "_");

      const optionsKey = matchName.includes(".")
        ? matchName.split(".").pop()
        : matchName;
      optionsLine = `options: computed(() => enumsStore.state["${optionsKey}"]),`;
      itemLines = `itemTitle: "label",
      itemValue: "value",`;
    } else if (isSelect && (key.endsWith("_id") || key.endsWith("_ids"))) {
      const baseKey = key.replace("_id", "").replace("_ids", "");
      label = baseKey;
      updateKeyLine = `updateKey: "${baseKey}.id",`;
      optionsLine = `options: computed(() => enumsStore.state["${baseKey}s"]),`;
      itemLines = `itemTitle: "title",
      itemValue: "id",`;
    } else if (isSelect) {
      label = key;
      optionsLine = `options: computed(() => enumsStore.state["${key}"]),`;
      itemLines = `itemTitle: "label",
      itemValue: "value",`;
    } else if (isComboBox || isRadio) {
      optionsLine = `options: computed(() => enumsStore.state["${key}"]),`;
      itemLines = `itemTitle: "label",
      itemValue: "value",`;
    }

    if (
      key.endsWith(".ar") &&
      (type === "createTextField" || type === "createTextAreaField")
    ) {
      extraProps = `isArabicOnly: true,`;
    } else if (
      key.endsWith(".en") &&
      (type === "createTextField" || type === "createTextAreaField")
    ) {
      extraProps = `isEnglishOnly: true,`;
    } else if (type === "createImageInput") {
      extraProps = `required: true,
      maxSize: "30 MB",`;
    } else if (isDateTime) {
      if (typeGuess === "date") extraProps = `dateOnly: true,`;
      else if (typeGuess === "time") extraProps = `enableTimePicker: true,`;
    } else if (isNumber) extraProps = `min: 0,`;
    else if (isOtp) extraProps = `length: 6,`;
    else if (isCaptcha) extraProps = `length: 5,`;
    else if (isEditor) extraProps = `direction: "ltr",`;
    else if (isButton) extraProps = `click: () => {},`;

    if (isCheckbox) {
      extraProps = `${extraProps}
      trueValue: 1,
      falseValue: 0,`;
    }

    if (
      key.toLowerCase().includes("email") &&
      (type === "createTextField" || type === "createTextAreaField")
    ) {
      extraProps = extraProps
        ? `${extraProps}\n      isEmail: true,`
        : `isEmail: true,`;
    }

    if (isMultipleSelect) {
      extraProps = extraProps
        ? `${extraProps}\n      isMultiple: true,`
        : `isMultiple: true,`;
    }

    const fieldConfig = [];

    if (!isButton) {
      fieldConfig.push(`t,`);
    }

    fieldConfig.push(`key: "${key}",`);
    fieldConfig.push(`label: "${label}",`);

    if (updateKeyLine) fieldConfig.push(updateKeyLine);

    if (!isButton)
      fieldConfig.push(`inputStyle: isView ? "viewMode" : "flat",`);

    fieldConfig.push(`cols: { md: 6, lg: 6 },`);

    if (valueLine) fieldConfig.push(valueLine);
    if (extraProps) fieldConfig.push(extraProps);
    if (itemLines) fieldConfig.push(itemLines);
    if (optionsLine) fieldConfig.push(optionsLine);

    return `${type}({
      ${fieldConfig.join("\n      ")}
    })`;
  });

  const imports = `import { ${[...usedFields].join(
    ", "
  )} } from '@/utils/fieldUtils'`;

  const schemaCode = `${imports}
import { ref, computed } from 'vue'
import i18n from '@/utils/i18n'
import { useEnumsStore } from '@/stores/enums'

export const use${capitalize(
    crudName
  )}Schema = ({ isCreate = false, isView = false }) => {
  const t = i18n.global.t
  const enumsStore = useEnumsStore()

  const schema = ref([
    ${schemaEntries.join(",\n    ")},
  ])

  return schema
}`;

  return schemaCode;
}

export function generateBasicSchema(crudName) {
  // Generate the basic schema code with empty array
  const schemaCode = `import { ref, computed } from "vue";
import i18n from "@/utils/i18n";

export const use${capitalize(
    crudName
  )}Schema = ({ isCreate = false, isView = false }) => {
  const t = i18n.global.t;

  const schema = ref([]);

  return schema;
};`;

  return schemaCode;
}
