import { createTextField, createTextAreaField } from "@/utils/fieldUtils";
import { ref } from "vue";
import i18n from "@/utils/i18n";
import { useEnumsStore } from "@/stores/enums";

export const use__CRUD_CAPITAL__Schema = ({
  isCreate = false,
  isView = false,
}) => {
  const enumsStore = useEnumsStore();
  const t = i18n.global.t;
  const schema = ref([
    createTextField({
      t,
      key: "name.ar",
      label: "name_ar",
      inputStyle: isView ? "viewMode" : "flat",
      value: "",
      cols: { md: 6, lg: 6 },
    }),
    createTextField({
      t,
      key: "name.en",
      label: "name_en",
      inputStyle: isView ? "viewMode" : "flat",
      value: "",
      cols: { md: 6, lg: 6 },
    }),
    createTextAreaField({
      t,
      key: "description.ar",
      label: "description_ar",
      inputStyle: isView ? "viewMode" : "flat",
      value: "",
      cols: { md: 6, lg: 6 },
    }),
    createTextAreaField({
      t,
      key: "description.en",
      label: "description_en",
      inputStyle: isView ? "viewMode" : "flat",
      value: "",
      cols: { md: 6, lg: 6 },
    }),
  ]);

  return schema;
};
