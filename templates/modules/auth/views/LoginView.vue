<template>
  <AuthLayout>
    <div class="w-100 gap-8 flex flex-col items-center justify-center">
      <v-progress-linear
        :active="authStore.isLoading"
        color="primary"
        indeterminate
        absolute
        bottom
      />
      <authHeading classHeading="ui-h4" class="mb-6" title="login" description="login_first" />
      <div class="w-100">
        <GenericForm :schema="schema" @submit="login" ref="formRef">
          <template #forgot-password>
            <div class="flex justify-end">
              <router-link class="text-dark_700 text-[12px]" :to="{ name: 'forgot-password' }">
                {{ $t('forget_password') }}
              </router-link>
            </div>
          </template>
          <template #submit>
            <div class="mt-5">
              <Button
                action="submit"
                type="primary"
                class="w-100"
                :isLoading="authStore.isLoading"
                min-height="50"
                :title="$t('sign_in')"
              />
            </div>
          </template>
        </GenericForm>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../layout/authLayout.vue'
import authHeading from '../components/authHeading.vue'
import GenericForm from '@/components/common/GenericForm/index.vue'
import { handleErrors, transformSchemaToObject } from '@/utils/formDataHandler'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/modules/auth/stores/auth'
import { ref } from 'vue'
import { createTextField, createPasswordField } from '@/utils/fieldUtils'
import { icons } from '@/plugins/icons'
const { t } = useI18n()
const authStore = useAuthStore()

const formRef = ref(null)
const login = async (data) => {
  const { valid } = await formRef.value.validate()
  if ((!valid, authStore.isLoading)) return
  const form = transformSchemaToObject(data)
  const { errors } = await authStore.login(form)
  if (errors) handleErrors(schema.value, errors)
}

const schema = ref([
  createTextField({
    t,
    key: 'email',
    label: 'email',
    icon: icons.sms,
    cols: { md: 12, lg: 12 }
  }),
  createPasswordField({
    t,
    key: 'password',
    label: 'password',
    cols: { md: 12, lg: 12 },
    icon: icons.lock,
    disableValidation: true
  }),
  {
    type: 'slot',
    key: 'forgot-password',
    cols: { md: 12, lg: 12 }
  }
])
</script>
