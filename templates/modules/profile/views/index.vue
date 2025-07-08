<template>
  <div>
    <teleport to="#teleported-items" v-if="isRendered">
      <div class="flex gap-4">
        <Button @click="$router.push('/')" :title="$t('cancel')" type="close" />
        <Button
          :isLoading="profileStore.isLoading"
          form="myForm"
          :title="$t('edit')"
          action="submit"
        />
      </div>
    </teleport>
    <GenericForm id="myForm" @submit="submitForm" :schema="schema" ref="formRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GenericForm from '@/components/common/GenericForm/index.vue'
import { updateSchemaValues, transformSchemaToObject } from '@/utils/formDataHandler'
import { useProfileSchema } from '../schema'
import { useProfileStore } from '../stores'
import { useTeleport } from '@/composables/useTeleport'
import { useEnumsStore } from '@/stores/enums'
const { isRendered } = useTeleport('teleported-items')
const props = defineProps({ isCreate: Boolean, isView: Boolean, buttonName: String })
const enumsStore = useEnumsStore()
const emit = defineEmits(['submit'])

const formRef = ref(null)
const schema = useProfileSchema({ isView: props.isView })
const profileStore = useProfileStore()
const submitForm = async (data) => {
  const payload = transformSchemaToObject(data)

  if (typeof payload.country_id == 'string') {
    const selectedCountry = enumsStore.state['country'].find(
      (item) => item.phone_code == payload.country_id
    )
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

await updateSchemaValues(schema.value, profileStore.user)
</script>

<style lang="scss" scoped></style>
