<template>
  <GenericForm
    stopValidation
    :emitOnChange="emitOnChange"
    :schema="schemaFilter"
    @submit="submitForm"
    @updateSchema="submitForm"
    formClass="align-center"
  >
    <template #submit>
      <div v-if="!emitOnChange" class="flex justify-center gap-2 mt-4">
        <Button
          :icon="icons.filter"
          :isTootltip="true"
          :title="$t('search')"
          action="submit"
          type="primary"
        />
        <Button
          :icon="icons.reset"
          :isTootltip="true"
          :title="$t('reset')"
          @click="clearFilter"
          type="close"
        />
      </div>
    </template>
  </GenericForm>
</template>

<script setup>
import { computed } from 'vue'
import GenericForm from '@/components/common/GenericForm/index.vue'
import { transformSchemaToObject, resetSchemaValuesToNull } from '@/utils/formDataHandler'

const props = defineProps({ schema: Array, emitOnChange: { type: Boolean, default: false } })

const emit = defineEmits(['submit', 'clear'])

const schemaFilter = computed(() => {
  return props.schema.filter((item) => item !== null && item.setToFilter)
})

const submitForm = (data) => {
  const payload = transformSchemaToObject(data)
  emit('submit', payload)
}

const clearFilter = () => {
  resetSchemaValuesToNull(props.schema)
  emit('clear', {})
}
</script>

<style lang="scss" scoped>
:deep(.v-btn) {
  height: 40px;
  margin-bottom: 12px;
}

:deep() {
  .v-field {
    border-radius: 8px !important;
  }
  .v-row {
    gap: 0.5rem;
    margin: 0;
    > div {
      padding: 0;
    }
  }
  .field {
    max-height: 42px;
  }
  .v-field__input,
  .v-input,
  .v-input__control,
  .v-field__field,
  .v-field__input,
  input {
    min-height: 42px !important;
    height: 42px !important;
  }
}
:deep() {
  svg {
    color: rgba(var(--v-theme-dark_300), 1) !important;
  }
}
</style>
