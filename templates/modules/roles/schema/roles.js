import { createTextField, createTextAreaField, createCheckBoxField } from '@/utils/fieldUtils'
import { ref } from 'vue'
import { filterSchemaByLanguages } from '@/utils/formDataHandler'
import i18n from '@/utils/i18n'
export const useRolesSchema = ({ isView = false }) => {
  const t = i18n.global.t
  const schema = ref([
    createTextField({
      t,
      key: 'name',
      label: 'name',
      inputStyle: isView ? 'viewMode' : 'flat',
      value: '',
      cols: { md: 12, lg: 12 }
    }),
    createTextField({
      t,
      key: 'display_name.ar',
      label: 'display_name_ar',
      inputStyle: isView ? 'viewMode' : 'flat',
      value: '',
      cols: { md: 6, lg: 6 }
    }),
    createTextField({
      t,
      key: 'display_name.en',
      label: 'display_name_en',
      inputStyle: isView ? 'viewMode' : 'flat',
      value: '',
      cols: { md: 6, lg: 6 }
    }),
    createTextAreaField({
      t,
      key: 'description.ar',
      label: 'description_ar',
      inputStyle: isView ? 'viewMode' : 'flat',
      value: '',
      cols: { md: 6, lg: 6 }
    }),
    createTextAreaField({
      t,
      key: 'description.en',
      label: 'description_en',
      inputStyle: isView ? 'viewMode' : 'flat',
      value: '',
      cols: { md: 6, lg: 6 }
    }),
    createCheckBoxField({
      t,
      key: 'is_active',
      label: 'is_active',
      inputStyle: isView ? 'viewMode' : 'flat',
      value: false,
      cols: { md: 12, lg: 12 }
    }),
    {
      type: 'slot',
      key: 'permissions',
      updateKey: 'permissions.name',
      value: [],
      cols: { md: 12, lg: 12 }
    }
  ])

  return schema
}
