<template>
  <div class="card">
    <GenericForm id="myForm" @submit="submitForm" :schema="schema" ref="formRef">
      <template #permissions="{ field }">
        <PermissionsList v-model="field.value" :isView="isView" />
      </template>
      <template #submit v-if="!isView"> </template>
    </GenericForm>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GenericForm from '@/components/common/GenericForm/index.vue'
import PermissionsList from './PermissionsList.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { transformSchemaToObject, updateSchemaValues } from '@/utils/formDataHandler'
import { useRolesSchema } from '../schema/roles'
import { useRolesStore } from '../stores/roles'

const props = defineProps({ isCreate: Boolean, isView: Boolean, buttonName: String })
const emit = defineEmits(['submit'])

const formRef = ref(null)
const { t } = useI18n()
const route = useRoute()
const schema = useRolesSchema({ isView: props.isView })
const rolesStore = useRolesStore()
const submitForm = async (data) => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  const payload = transformSchemaToObject(data)
  if (!props.isCreate) payload['id'] = route.params.id
  const form = { data: payload, schema: schema.value }
  emit('submit', form)
}
if (!props.isCreate) {
  await rolesStore.getRow(route.params.id)
  await updateSchemaValues(schema.value, rolesStore.selectedItem)
}
</script>

<style lang="scss" scoped></style>
