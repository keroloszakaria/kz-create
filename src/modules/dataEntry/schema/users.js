import { createTextField } from '@/utils/fieldUtils'
import { ref, computed } from 'vue'
import i18n from '@/utils/i18n'
import { useEnumsStore } from '@/stores/enums'

export const useUsersSchema = ({ isCreate = false, isView = false }) => {
  const t = i18n.global.t
  const enumsStore = useEnumsStore()

  const schema = ref([
    createTextField({
      t,
      key: ""name.ar"",
      label: ""name_ar"",
      inputStyle: isView ? "viewMode" : "flat",
      cols: { md: 6, lg: 6 },
      value: "",
    }),
    createTextField({
      t,
      key: ""name.en"",
      label: ""name_en"",
      inputStyle: isView ? "viewMode" : "flat",
      cols: { md: 6, lg: 6 },
      value: "",
    }),
    createTextField({
      t,
      key: ""nationality.ar"",
      label: ""nationality_ar"",
      inputStyle: isView ? "viewMode" : "flat",
      cols: { md: 6, lg: 6 },
      value: "",
    }),
    createTextField({
      t,
      key: ""nationality.en"",
      label: ""nationality_en"",
      inputStyle: isView ? "viewMode" : "flat",
      cols: { md: 6, lg: 6 },
      value: "",
    }),
    createTextField({
      t,
      key: ""code"",
      label: ""code"",
      inputStyle: isView ? "viewMode" : "flat",
      cols: { md: 6, lg: 6 },
      value: "",
    }),
    createTextField({
      t,
      key: ""phone_code"",
      label: ""phone_code"",
      inputStyle: isView ? "viewMode" : "flat",
      cols: { md: 6, lg: 6 },
      value: "",
    }),
    createTextField({
      t,
      key: ""phone_length"",
      label: ""phone_length"",
      inputStyle: isView ? "viewMode" : "flat",
      cols: { md: 6, lg: 6 },
      value: "",
    }),
  ])

  return schema
}