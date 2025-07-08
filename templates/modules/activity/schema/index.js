import {
  createTextField,
  createDateTimeField,
  createSelectField,
  createPasswordField,
  createPhoneField
} from '@/utils/fieldUtils'
import { ref, computed } from 'vue'
import i18n from '@/utils/i18n'
import { useEnumsStore } from '@/stores/enums'

export const useUsersSchema = ({ isCreate = false, isView = false }) => {
  const t = i18n.global.t
  const enumsStore = useEnumsStore()
  const phoneLength = ref(null)

  const schema = ref([
    createTextField({
      t,
      key: 'name',
      label: 'name',
      inputStyle: isView ? 'viewMode' : 'flat',
      value: '',
      cols: { md: 6, lg: 6 }
    }),
    createSelectField({
      t,
      key: 'country_id',
      label: 'phone_code',
      updateKey: 'phone_code',
      inputStyle: isView ? 'viewMode' : 'flat',
      cols: { md: 2, lg: 2 },
      value: null,
      autoComplete: true,
      colClassList: 'phone_code',
      itemTitle: 'phone_code',
      itemClasses: 'direction-initial',
      itemValue: 'id',
      returnObject: true,
      options: computed(() => enumsStore.state['country']),
      updateValueHandler: (value, field) => {
        if (!value) return
        phoneLength.value = value?.phone_length
      }
    }),
    createTextField({
      t,
      key: 'phone',
      label: 'phone',
      colClassList: 'phone_input',
      inputStyle: isView ? 'viewMode' : 'flat',
      value: '',
      cols: { md: 4, lg: 4 },
      maxLength: computed(() => phoneLength.value),
      required: true
    }),
    createSelectField({
      t,
      key: 'roles',
      label: 'roles',
      updateKey: 'roles.id',
      cols: { md: 6, lg: 6 },
      value: null,
      isMultiple: true,
      itemTitle: 'name',
      itemValue: 'id',
      inputStyle: isView ? 'viewMode' : 'flat',
      options: computed(() => enumsStore.state['roles'])
    }),
    createSelectField({
      t,
      key: 'departments',
      label: 'departments',
      updateKey: 'departments.id',
      cols: { md: 6, lg: 6 },
      value: null,
      isMultiple: true,
      itemTitle: 'name',
      itemValue: 'id',
      inputStyle: isView ? 'viewMode' : 'flat',
      options: computed(() => enumsStore.state['departments'])
    }),
    createTextField({
      t,
      key: 'email',
      label: 'email',
      inputStyle: isView ? 'viewMode' : 'flat',
      isEmail: true,
      value: '',
      cols: { md: 6, lg: 6 }
    }),
    createSelectField({
      t,
      key: 'gender',
      label: 'gender',
      cols: { md: 6, lg: 6 },
      value: null,
      itemTitle: 'label',
      itemValue: 'value',
      inputStyle: isView ? 'viewMode' : 'flat',
      options: computed(() => enumsStore.state['user_gender'])
    }),
    createPasswordField({
      t,
      key: 'password',
      inputStyle: isView ? 'viewMode' : 'flat',
      label: 'password',
      cols: { md: 6, lg: 6 },
      minLength: 8,
      value: '',
      required: isCreate
    }),
    createPasswordField({
      t,
      key: 'password_confirmation',
      label: 'confirm_password',
      inputStyle: isView ? 'viewMode' : 'flat',
      cols: { md: 6, lg: 6 },
      minLength: 8,
      value: '',
      required: isCreate,
      rules: [
        (v) => v === schema.value.find((f) => f.key === 'password').value || t('password_not_match')
      ]
    })
  ])

  return schema
}
