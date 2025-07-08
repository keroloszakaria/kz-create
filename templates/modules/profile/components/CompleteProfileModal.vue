<template>
  <Modal
    :isCloseable="false"
    v-model="dialog"
    :title="$t('complete_profile')"
    :persistent="true"
    width="600"
  >
    <template #content>
      <GenericForm id="myForm" :schema="schema" @submit="submitForm" />
    </template>
    <template #actions>
      <div class="flex flex-1">
        <div class="flex gap-4 w-100">
          <Button
            class="w-50 flex-1"
            action="submit"
            form="myForm"
            :title="$t('update_profile')"
            type="primary w-100"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/common/Modal.vue'
import GenericForm from '@/components/common/GenericForm/index.vue'
import { useProfileSchema } from '../schema'
import { useProfileStore } from '../stores'
import { onMounted, ref } from 'vue'
import { transformSchemaToObject, updateSchemaValues } from '@/utils/formDataHandler'
import { useEnumsStore } from '@/stores/enums'

const enumsStore = useEnumsStore()
const schema = useProfileSchema({ isCreate: true, isView: false })
const profileStore = useProfileStore()
const dialog = ref(!profileStore.user?.is_profile_completed)

onMounted(() => updateSchemaValues(schema.value, profileStore.user))

const submitForm = async (data) => {
  const payload = transformSchemaToObject(data)
  if (typeof payload.country_id == 'string') {
    const selectedCountry = enumsStore.state['country'].find(
      (item) => item.phone_code == payload.country_id
    )
    payload['country_id'] = selectedCountry.id
    payload['phone_code'] = selectedCountry.phone_code
    payload['phone_length'] = selectedCountry.phone_length
  }
  await profileStore.updateUser(payload)
}

await Promise.all([
  enumsStore.getHelpModels([
    { name: 'roles' },
    { name: 'departments' },
    { name: 'country', extra: ['phone_code', 'phone_length'] }
  ]),
  enumsStore.getHelpEnums([{ name: 'user.user_gender' }]),
  profileStore.getUser()
])
</script>

<style lang="scss" scoped></style>
