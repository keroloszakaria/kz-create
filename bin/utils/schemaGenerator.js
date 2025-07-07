export function generateSchemaFromPayload(
  payloadText,
  crudName,
  helpModels,
  helpEnums
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
    const [rawKey, rawType] = line.split(":").map((s) => s.trim());
    const key = rawKey.replace("[", ".").replace("]", "");
    const type = fieldMap[rawType?.toLowerCase()] || "createTextField";

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

    // Check if key ends with "ids" for multiple select
    const isMultipleSelect = isSelect && key.endsWith("ids");

    // Find matching model or enum for select fields
    let matchType = null;
    let matchName = null;

    if (isSelect) {
      // Check for model match first
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
        // Check for enum match - improved logic
        const enumMatch = helpEnums.find((e) => {
          const enumName = e.includes(".") ? e.split(".").pop() : e;
          return (
            key === enumName ||
            key.includes(enumName) ||
            key.replace("_id", "") === enumName ||
            key.replace("_ids", "") === enumName ||
            // Additional check for exact match
            enumName === key
          );
        });

        if (enumMatch) {
          matchType = "enum";
          matchName = enumMatch;
        }
      }
    }

    // Generate label based on key with specific rules
    let label = key;

    // Rule 1: If has dot, replace with underscore
    if (key.includes(".")) label = key.replace(/\./g, "_");
    // Rule 2: If ends with _id or _ids, remove it
    else if (key.endsWith("_id")) label = key.replace("_id", "");
    else if (key.endsWith("_ids")) label = key.replace("_ids", "");
    // Rule 3: If has underscore, keep as is
    else if (key.includes("_")) label = key;

    let updateKeyLine = "";
    let optionsLine = "";
    let itemLines = "";
    let valueLine = "";
    let extraProps = "";

    // Set default value based on field type
    if (isSelect || isComboBox || isRadio) {
      valueLine = isMultipleSelect ? "value: []," : "value: null,";
    } else if (isCheckbox) {
      valueLine = "value: false,";
    } else if (isNumber) {
      valueLine = "value: 0,";
    } else if (isDateTime) {
      valueLine = "value: null,";
    } else if (isOtp) {
      valueLine = "value: '',";
    } else if (isButton) {
      valueLine = ""; // Buttons don't have values
    } else {
      valueLine = 'value: "",';
    }

    // Handle select field with model match
    if (isSelect && matchType === "model") {
      const modelBase = matchName.includes(".")
        ? matchName.split(".").pop()
        : matchName;
      const baseKey = modelBase.slice(0, -1);

      // For model matches, override label with the base key
      if (key.endsWith("_id")) label = key.replace("_id", "");
      else if (key.endsWith("_ids")) label = key.replace("_ids", "");

      updateKeyLine = `updateKey: "${baseKey}.id",`;

      // Extract the last part for options
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

      // For enum matches, use the enum name as label
      label = enumBase.replace("user_", "").replace(/_/g, "_");

      // Extract the last part for options
      const optionsKey = matchName.includes(".")
        ? matchName.split(".").pop()
        : matchName;
      optionsLine = `options: computed(() => enumsStore.state["${optionsKey}"]),`;
      itemLines = `itemTitle: "label",
      itemValue: "value",`;
    } else if (isSelect && (key.endsWith("_id") || key.endsWith("_ids"))) {
      // Handle select fields that end with _id or _ids but don't match models/enums
      const baseKey = key.replace("_id", "").replace("_ids", "");
      label = baseKey;
      updateKeyLine = `updateKey: "${baseKey}.id",`;
      optionsLine = `options: computed(() => enumsStore.state["${baseKey}s"]),`;
      itemLines = `itemTitle: "title",
      itemValue: "id",`;
    } else if (isSelect) {
      // Handle select fields that don't end with _id/_ids and don't match models/enums
      // This is for cases like employee_type:select
      label = key;
      optionsLine = `options: computed(() => enumsStore.state["${key}"]),`;
      itemLines = `itemTitle: "label",
      itemValue: "value",`;
    } else if (isComboBox) {
      // Handle combo box fields
      optionsLine = `options: computed(() => enumsStore.state["${key}"]),`;
      itemLines = `itemTitle: "label",
      itemValue: "value",`;
    } else if (isRadio) {
      // Handle radio button fields
      optionsLine = `options: computed(() => enumsStore.state["${key}"]),`;
      itemLines = `itemTitle: "label",
      itemValue: "value",`;
    }

    // Handle special properties based on field type and key patterns
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
      // Handle datetime specific props
      if (rawType?.toLowerCase() === "date") extraProps = `dateOnly: true,`;
      else if (rawType?.toLowerCase() === "time")
        extraProps = `enableTimePicker: true,`;
    } else if (isNumber) extraProps = `min: 0,`;
    else if (isOtp) extraProps = `length: 6,`;
    else if (isCaptcha) extraProps = `length: 5,`;
    else if (isEditor) extraProps = `direction: "ltr",`;
    else if (isButton) extraProps = `click: () => {},`;

    // Add isMultiple for select fields ending with "ids"
    if (isMultipleSelect) {
      extraProps = extraProps
        ? `${extraProps}\n      isMultiple: true,`
        : `isMultiple: true,`;
    }

    // Build the field configuration
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

  // Generate imports
  const imports = `import { ${[...usedFields].join(
    ", "
  )} } from '@/utils/fieldUtils'`;

  // Capitalize function
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Generate the final schema code
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
  // Capitalize function
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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
