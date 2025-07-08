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
    <div
      v-if="inputStyle === 'viewMode' && (!modelValue || modelValue.trim() === '')"
      class="text-dark_bg"
    >
      {{ $t('no_found') }}
    </div>
    <v-textarea
      v-else
      :class="{ '!w-full': mode === 'vertical' }"
      hide-details="auto"
      v-model="modelValue"
      :placeholder="placeholder"
      :required="required"
      :rules="rules"
      :disabled="disabled || inputStyle === 'viewMode'"
      dense
      :maxlength="maxLength"
      :rows="inputStyle === 'viewMode' ? null : 5"
      :counter="isCounter"
      :clearable="clearable"
      v-bind="$attrs"
      @click:clear="clearValue"
      outlined
    >
      <template v-if="icon" v-slot:prepend-inner>
        <v-icon v-if="icon.startsWith('mdi-')" :icon="icon"></v-icon>
        <span v-else class="icon" v-html="icon"></span>
      </template>
    </v-textarea>
  </div>
</template>

<script setup>
const modelValue = defineModel()

const props = defineProps({
  classList: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  icon: { type: String, default: '' },
  clearable: { type: Boolean, default: false },
  mode: { type: String, default: 'horizontal' },
  required: { type: Boolean, default: false },
  rules: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  isCounter: { type: Boolean, default: false },
  maxLength: { type: Number, default: null },
  inputStyle: { type: String, default: '' }
})
const clearValue = () => (modelValue.value = '')
</script>

<style scoped>
:deep(textarea) {
  overflow: auto !important;
  pointer-events: auto !important;
}
</style>
