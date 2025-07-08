<template>
  <div
    class="field"
    :class="[
      {
        'required-field': required,
        '!flex-col !items-start': mode === 'vertical'
      },
      inputStyle,
      classList
    ]"
  >
    <div
      v-if="label"
      :class="{
        '!w-full !max-w-full': mode === 'vertical'
      }"
      class="field-label"
    >
      {{ label }}
    </div>
    <div v-if="inputStyle === 'viewMode' && !modelValue" class="text-dark_bg">
      {{ $t('no_found') }}
    </div>
    <div v-else :class="{ '!w-full': mode === 'vertical' }" class="flex gap-2">
      <v-select
        :items="options"
        v-model="modelValue"
        :placeholder="placeholder ? placeholder : ''"
        :multiple="isMultiple"
        :required="required"
        :rules="rules"
        :item-value="itemValue"
        :disabled="disabled || inputStyle === 'viewMode'"
        :item-title="itemTitle"
        :clearable="clearable"
        :chips="chips"
        :return-object="returnObject"
        hide-details="auto"
        menu-icon="mdi-chevron-down"
      />
      <div class="addingCase" v-if="schema">
        <Button @click="showAddingModal = true" class="openModal" :icon="icons.plus" />
        <Modal v-model="showAddingModal" width="1000" :custom-action="true">
          <template #content>
            <GenericForm :schema="schema" @submit="submitAdding" ref="form">
              <template #submit>
                <div class="flex gap-3">
                  <Button
                    class="mt-5"
                    :title="'close'"
                    type="close"
                    @click="showAddingModal = false"
                  />
                  <Button class="mt-5" :title="'add'" action="submit" />
                </div>
              </template>
            </GenericForm>
          </template>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Modal from '@/components/common/Modal.vue'
import GenericForm from '@/components/common/GenericForm/index.vue'

const form = ref(null)
const showAddingModal = ref(false)

const modelValue = defineModel({ type: [String, Array, Number, Object] })

const props = defineProps({
  label: String,
  defaultValue: [String, Array, Number, Object],
  options: Array,
  isMultiple: Boolean,
  required: Boolean,
  placeholder: String,
  itemTitle: String,
  disabled: Boolean,
  schema: Array,
  chips: Boolean,
  classList: String,
  mode: String,
  itemValue: { default: 'value' },
  returnObject: { default: false },
  rules: Array,
  inputStyle: { type: String, default: '' }
})

const emit = defineEmits(['addingData'])

const submitAdding = async (value) => {
  const { valid } = await form.value.validate()
  if (!valid) return
  emit('addingData', value)
  showAddingModal.value = false
}

watch(
  () => props.options,
  (newVal) => {
    if (props.defaultValue == undefined) return
    if (newVal.length !== 0) {
      if (props.returnObject) {
        const selectItem = newVal.find((option) => option[props.itemValue] === modelValue.value)
        modelValue.value = selectItem
      } else {
        modelValue.value = modelValue.value
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
:deep() {
  .openModal {
    padding: 10px;
    width: 58px;
    height: 58px !important;
  }
}
</style>
