<template>
  <v-switch
    color="primary"
    v-model="modelValue"
    v-bind="$attrs"
    :label="label"
    :disabled="disabled"
    hide-details
    :true-value="trueValue"
    :false-value="falseValue"
    inset
  ></v-switch>
</template>

<script setup>
const modelValue = defineModel({ type: Number, default: 0 })

// Define other props
const props = defineProps({
  label: String,
  placeholder: String,
  icon: String,
  trueValue: [String, Number, Boolean],
  falseValue: [String, Number, Boolean],
  required: Boolean,
  disabled: Boolean
})
</script>
