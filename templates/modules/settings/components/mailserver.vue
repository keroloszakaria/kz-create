<template lang="">
  <div class="bg-dark_white !p-5 rounded-[20px] flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h3 class="text-dark_900 !text-[16px] !font-[600]">{{ $t('mail_server') }}</h3>
      <div class="flex gap-4">
        <!-- <Button @click="$router.push('/')" :title="$t('cancel')" type="close" /> -->
        <Button form="myForm" :title="$t('save')" action="submit" />
      </div>
    </div>

    <GenericForm id="myForm" :schema="settingsStore.mailServer" @submit="updateSettings" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../stores'
import { handleErrors, handleFormData } from '@/utils/formDataHandler'
import GenericForm from '@/components/common/GenericForm/index.vue'

const settingsStore = useSettingsStore()
const isLoading = ref(false)

const updateSettings = (value) => {
  isLoading.value = true
  let formData = handleFormData(value, 'settings', 'mail_server')
  let { errors } = settingsStore.updateSettings(formData)
  if (errors) handleErrors(settingsStore.mailServer, errors)
  isLoading.value = false
}
</script>
