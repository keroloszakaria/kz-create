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
    <div class="flex flex-col">
      <v-checkbox
        :class="{ '!w-full': mode === 'vertical' }"
        hide-details
        v-model="modelValue"
        :label="label"
        :true-value="trueValue"
        :false-value="falseValue"
        :rules="rules"
        :disabled="disabled || inputStyle === 'viewMode'"
        :required="required"
      ></v-checkbox>

      <div v-if="inputStyle == 'viewMode'">
        <div v-if="modelValue == trueValue">{{ $t('yes') }}</div>
        <div v-else-if="modelValue == falseValue">{{ $t('no') }}</div>
        <div v-else>{{ $t('no_found') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const modelValue = defineModel()

const props = defineProps({
  classList: { type: String, default: '' },
  mode: { type: String, default: 'horizontal' },
  inputStyle: { type: String, default: '' },
  label: String,
  disabled: Boolean,
  trueValue: [String, Number, Boolean],
  falseValue: [String, Number, Boolean],
  switchPassword: Boolean,
  required: Boolean,
  rules: Array
})
</script>

<style lang="scss" scoped>
:deep() {
  .v-selection-control__wrapper {
    color: #cbd5e0;
  }
  .v-selection-control__input > .v-icon {
    opacity: 1;
  }
}
</style>
