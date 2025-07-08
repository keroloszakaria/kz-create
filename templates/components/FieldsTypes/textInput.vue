<template>
  <div
    :class="[
      'field',
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
    <div v-if="inputStyle === 'viewMode' && isEmpty" class="text-dark_bg">
      {{ $t('no_found') }}
    </div>
    <v-text-field
      v-else
      :class="{ '!w-full': mode === 'vertical' }"
      hide-details="auto"
      outlined
      v-model="modelValue"
      :placeholder="placeholder || ''"
      :required="required"
      :rules="rules"
      :disabled="disabled || inputStyle === 'viewMode'"
      dense
      :maxlength="maxLength"
      :counter="isCounter"
      :clearable="clearable"
      @click:clear="clearValue"
    >
      <template v-if="icon" #prepend-inner>
        <v-icon v-if="icon.startsWith('mdi-')" :icon="icon"></v-icon>
        <span v-else class="icon" v-html="icon"></span>
      </template>
    </v-text-field>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const modelValue = defineModel()
const props = defineProps({
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  isCounter: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  classList: { type: String, default: '' },
  mode: { type: String, default: 'horizontal' },
  icon: { type: String, default: '' },
  required: { type: Boolean, default: false },
  rules: { type: Array, default: () => [] },
  maxLength: { type: Number, default: null },
  clearable: { type: Boolean, default: false },
  inputStyle: { type: String, default: '' }
})
const clearValue = () => (modelValue.value = '')

const isEmpty = computed(() => {
  if (!modelValue.value) return true
  if (typeof modelValue.value === 'string') return modelValue.value.trim() === ''
  if (Array.isArray(modelValue.value)) return modelValue.value.length === 0
  return false
})
</script>
