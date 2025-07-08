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
    <div v-if="inputStyle === 'viewMode' && !modelValue" class="text-dark_bg">
      {{ $t('no_found') }}
    </div>
    <v-number-input
      v-else
      :class="{ '!w-full': mode === 'vertical', 'hide-arrows': hideArrows }"
      hide-details="auto"
      hide-label
      v-model="modelValue"
      :placeholder="placeholder ? placeholder : ''"
      :required="required"
      :disabled="disabled || inputStyle === 'viewMode'"
      :rules="rules"
      :control-variant="variant"
      v-bind="$attrs"
      :clearable="clearable"
      :max="max"
      :min="min"
      :step="step"
      @click:clear="clearValue"
    />
  </div>
</template>

<script setup>
const modelValue = defineModel()
const props = defineProps({
  label: String,
  inputStyle: { type: String, default: '' },
  classList: { type: String, default: '' },
  clearable: { type: Boolean, default: false },
  mode: String,
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  variant: String,
  hideArrows: Boolean,
  max: Number,
  min: Number,
  step: Number,
  rules: Array
})
const clearValue = () => (modelValue.value = '')
</script>

<style lang="scss" scoped>
.hide-arrows {
  :deep() {
    .v-number-input__control {
      display: none;
    }
  }
}
</style>
