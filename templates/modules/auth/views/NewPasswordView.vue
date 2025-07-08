<template>
  <AuthLayout>
    <div class="w-100 d-flex align-center flex-column justify-center">
      <v-progress-linear
        :active="authStore.isLoading"
        color="primary"
        indeterminate
        absolute
        bottom
      />
      <div class="w-100">
        <GenericForm :schema="schema" @submit="changePassword" ref="formRef">
          <template #submit>
            <div class="mt-5">
              <Button
                action="submit"
                type="primary w-100"
                :isLoading="authStore.isLoading"
                min-height="50"
                :title="$t('confirm')"
              />
            </div>
          </template>
        </GenericForm>
        <router-link
          to="/login"
          class="text-decoration-none text-dark_700 text-[12px] flex justify-center mt-5"
          >{{ $t('return_to_login') }}</router-link
        >
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../layout/authLayout.vue'
import GenericForm from '@/components/common/GenericForm/index.vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/modules/auth/stores/auth'
import { transformSchemaToObject } from '@/utils/formDataHandler'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import storage from '@/composables/useStorage'
const { t } = useI18n()
const authStore = useAuthStore()
const isOTPSubmit = ref(false)
const formRef = ref(null)
const router = useRouter()
import { createPasswordField } from '@/utils/fieldUtils'

const changePassword = async (data) => {
  const allValid = customValidation.value.every((validation) => validation.isValid)
  if (!allValid) return
  const form = transformSchemaToObject(data)
  form.email = storage.get('email')
  form.otp = storage.get('otp')
  const { code } = await authStore.changePassword(form)
  if (code == 200) {
    router.push('/login')
    storage.remove('email')
    storage.remove('otp')
  }
}

const schema = ref([
  createPasswordField({
    t,
    key: 'password',
    label: 'new_password',
    required: true,
    switchPassword: true,
    autocomplete: 'current-password',
    value: null,
    cols: { lg: 12, md: 12 },
    classList: 'mb-4 '
  }),
  createPasswordField({
    t,
    key: 'password_confirmation',
    label: 'confirm_password',
    required: true,
    switchPassword: true,
    value: null,
    autocomplete: 'current-password',
    cols: { lg: 12, md: 12 },
    classList: 'mb-4 '
  })
])
</script>

<style scoped lang="scss">
.auth-form {
  padding: 7.81rem !important;
}

.min-h-100 {
  min-height: 100vh;
}

@media (min-width: 960px) {
  .h-md-100 {
    height: 100% !important;
  }
}

@media (max-width: 500px) {
  .h-120vh {
    height: 120vh !important;
  }
}
.validation-rule {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-inline-start: 1rem;
  margin-bottom: 8px;
  font-size: 0.875rem;
}
</style>
