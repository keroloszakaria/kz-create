<template>
  <div class="field" :class="{ 'required-field': required }">
    <div class="field-label">{{ label }}</div>
    <vue-tel-input
      defaultCountry="SA"
      @validate="onValidate"
      v-model="innerValue"
      :inputOptions="{ placeholder, required }"
      mode="international"
    ></vue-tel-input>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  required: Boolean
})

const emit = defineEmits(['update:modelValue'])
const innerValue = ref(props.modelValue)

const onValidate = (phone) => {
  if (phone.valid) emit('update:modelValue', phone.number)
}

watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal
  }
)
</script>

<style lang="scss" scoped>
:deep() {
  .vti__dropdown.open {
    background-color: transparent !important;
  }
  .vti__dropdown:hover {
    background-color: transparent !important;
  }
  .vue-tel-input {
    height: 56px;
    border-radius: 8px;
    border-color: #cac8cf;
    box-shadow: none;

    .vti__input,
    vti__phone {
      direction: ltr;
      text-align: right;
    }
    .vti__dropdown-list.below {
      top: 100%;
    }

    .vti__dropdown-item {
      direction: ltr;
    }
  }
}
</style>
