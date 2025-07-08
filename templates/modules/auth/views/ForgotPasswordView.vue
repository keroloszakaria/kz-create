<template>
  <AuthLayout>
    <div
      v-if="!isReset"
      class="w-100 gap-8 flex flex-col items-center justify-center"
    >
      <v-progress-linear
        :active="authStore.isLoading"
        color="primary"
        indeterminate
        absolute
        bottom
      />

      <authHeading
        title="forget_password_title"
        description="forget_password_description"
      />

      <div class="w-100">
        <GenericForm :schema="schema" @submit="forget" ref="formRef">
          <template #submit>
            <div class="mt-5">
              <Button
                action="submit"
                type="primary"
                :isLoading="authStore.isLoading"
                min-height="50"
                :title="$t('next')"
              />
            </div>
          </template>
        </GenericForm>
        <router-link
          to="/login"
          class="text-decoration-none text-dark_700 text-[12px] flex justify-center mt-5"
          >{{ $t("return_to_login") }}</router-link
        >
      </div>
    </div>
    <div v-else class="w-100 gap-8 flex flex-col items-center justify-center">
      <v-progress-linear
        :active="authStore.isLoading"
        color="primary"
        indeterminate
        absolute
        bottom
      />

      <authHeading title="forget_password_title" description="otp_description">
        <div
          class="flex gap-2 !font-[500] text-[12px] justify-center items-center"
        >
          <span>{{ email }}</span>
          <button @click="resetForm" class="text-primary">
            {{ $t("edit") }}
          </button>
        </div>
      </authHeading>

      <div class="w-100">
        <GenericForm :schema="OTPSchema" @submit="verifyOTP" ref="otpformRef">
          <template #submit>
            <div class="flex flex-col gap-4 mt-5">
              <Button
                action="submit"
                type="primary"
                :isLoading="authStore.isLoading"
                min-height="50"
                :title="$t('verify')"
              />
              <Button
                type="close w-full"
                min-height="50"
                @click="resetForm"
                :title="$t('cancel')"
              />
            </div>
          </template>
        </GenericForm>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from "../layout/authLayout.vue";
import authHeading from "../components/authHeading.vue";
import GenericForm from "@/components/common/GenericForm/index.vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/modules/auth/stores/auth";
import {
  handleErrors,
  resetSchemaValues,
  transformSchemaToObject,
} from "@/utils/formDataHandler";
import { ref } from "vue";
import { useRouter } from "vue-router";
import storage from "@/composables/useStorage";
import { createTextField } from "@/utils/fieldUtils";

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const formRef = ref(null);
const otpformRef = ref(null);
const email = storage.get("email");
const isReset = ref(!!email);

const forget = async (data) => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  const form = transformSchemaToObject(data);
  const { code, errors } = await authStore.forgetPassword(form);
  if (code == 200) {
    isReset.value = true;
    storage.set("email", form.email);
  } else {
    handleErrors(schema.value, errors);
  }
};

const verifyOTP = async (data) => {
  const { valid } = await otpformRef.value.validate();
  if (!valid) return;
  const form = transformSchemaToObject(data);
  form.email = storage.get("email");
  const { code, errors } = await authStore.verifyOTP(form);
  if (code == 200) {
    storage.set("otp", form.otp);
    router.push("/new-password");
  } else {
    resetSchemaValues(OTPSchema.value);
  }
};

const resetForm = () => {
  isReset.value = false;
  resetSchemaValues(OTPSchema.value);
  storage.remove("email");
  storage.remove("otp");
};

const schema = ref([
  createTextField({
    t,
    key: "email",
    label: "email",
    isEmail: true,
    cols: { md: 12, lg: 12 },
  }),
]);

const OTPSchema = ref([
  {
    type: "otp",
    key: "otp",
    length: 4,
    cols: { lg: 12, md: 12 },
  },
]);
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

@import "./index.scss";
</style>
