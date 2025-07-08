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
    <v-combobox
      v-else
      :class="{ '!w-full': mode === 'vertical' }"
      v-model="modelValue"
      v-model:search="search"
      :placeholder="placeholder ? $t(placeholder) : ''"
      @keyup.enter="showChips"
      :hide-no-data="customAdding"
      :items="options"
      :disabled="disabled || inputStyle === 'viewMode'"
      :hint="hint"
      :item-value="itemValue"
      :item-title="itemTitle"
      :chips="chips"
      hide-selected
      :multiple="multiple"
      hide-details="auto"
      persistent-hint
      menu-icon="mdi-chevron-down"
    >
      <template v-if="icon" v-slot:prepend-inner>
        <v-icon v-if="icon.startsWith('mdi-')" :icon="icon"></v-icon>
        <span v-else class="icon" v-html="icon"></span>
      </template>
    </v-combobox>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  label: String,
  defaultValue: [String, Array, Number, Object],
  mode: { type: String, default: 'horizontal' },
  options: Array,
  multiple: Boolean,
  required: Boolean,
  classList: String,
  placeholder: String,
  itemTitle: String,
  itemValue: String,
  chips: Boolean,
  disabled: Boolean,
  icon: String,
  max: Number,
  customAdding: Boolean,
  hint: String,
  rules: Array,
  inputStyle: { type: String, default: '' }
})

const modelValue = defineModel({ type: [String, Array, Number, Object] })

const search = ref(null)

const showChips = () => {
  if (props.customAdding && Array.isArray(modelValue.value)) {
    search.value = null
    nextTick(() => {})
  }
}

watch(
  modelValue,
  (newVal) => {
    if (props.max && Array.isArray(newVal) && newVal.length > props.max) {
      nextTick(() => (modelValue.value = newVal.slice(0, props.max)))
    }
  },
  { deep: true }
)

// watch(
//   () => props.multiple,
//   () => {
//     if (props.multiple && !Array.isArray(modelValue.value)) {
//       modelValue.value = modelValue.value ? [modelValue.value] : []
//     } else if (!props.multiple && Array.isArray(modelValue.value)) {
//       modelValue.value = modelValue.value[0] || null
//     }
//   }
// )
</script>
