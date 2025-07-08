<template>
  <div
    :class="[
      'field',
      {
        'required-field': required,
        '!flex-col !items-start': mode === 'vertical',
        inputStyle
      },
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
    <div class="otp-container" dir="ltr">
      <v-text-field
        v-for="(digit, index) in otpDigits"
        :key="index"
        :ref="(el) => setInputRef(el, index)"
        v-model="otpDigits[index]"
        :type="inputType"
        :disabled="disabled"
        :required="required"
        variant="solo-filled"
        bg-color="transparent"
        hide-details="auto"
        density="compact"
        placeholder="_"
        maxlength="1"
        @input="handleInput($event, index)"
        @keydown="handleKeydown($event, index)"
        @paste="handlePaste($event, index)"
        @focus="handleFocus(index)"
      />
    </div>
    <div v-if="errorMessage" class="text-error text-caption mt-1">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  label: String,
  classList: { type: String, default: '' },
  mode: { type: String, default: 'horizontal' },
  inputStyle: { type: String, default: '' },
  length: { type: Number, default: 6 },
  required: { type: Boolean, default: false },
  rules: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  patternType: {
    type: String,
    default: 'number',
    validator: (value) => ['number', 'text', 'alphanumeric'].includes(value)
  }
})

const modelValue = defineModel('modelValue', { default: '' })

// Reactive data
const otpDigits = ref(Array(props.length).fill(''))
const inputRefs = ref([])
const errorMessage = ref('')

// Computed properties
const inputType = computed(() => {
  return props.patternType === 'number' ? 'tel' : 'text'
})

// Methods
const setInputRef = (el, index) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const validateInput = (value) => {
  switch (props.patternType) {
    case 'number':
      return /^\d*$/.test(value)
    case 'text':
      return /^[a-zA-Z]*$/.test(value)
    case 'alphanumeric':
      return /^[a-zA-Z0-9]*$/.test(value)
    default:
      return true
  }
}

const updateModelValue = () => {
  const value = otpDigits.value.join('')
  modelValue.value = value

  // Run validation rules
  if (props.rules.length > 0) {
    for (const rule of props.rules) {
      const result = rule(value)
      if (result !== true) {
        errorMessage.value = result
        return
      }
    }
  }
  errorMessage.value = ''
}

const handleInput = (event, index) => {
  const value = event.target.value

  // Validate input based on pattern type
  if (!validateInput(value)) {
    event.target.value = otpDigits.value[index] // Reset to previous value
    return
  }

  // Handle multiple characters (paste scenario)
  if (value.length > 1) {
    handlePaste({ clipboardData: { getData: () => value } }, index)
    return
  }

  // Update the digit
  otpDigits.value[index] = value

  // Move to next input if value is entered
  if (value && index < props.length - 1) {
    nextTick(() => {
      focusInput(index + 1)
    })
  }

  updateModelValue()
}

const handleKeydown = (event, index) => {
  const key = event.key

  // Handle backspace
  if (key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      // If current input is empty, move to previous and clear it
      otpDigits.value[index - 1] = ''
      nextTick(() => {
        focusInput(index - 1)
      })
    } else {
      // Clear current input
      otpDigits.value[index] = ''
    }
    updateModelValue()
    return
  }

  // Handle arrow keys
  if (key === 'ArrowLeft' && index > 0) {
    focusInput(index - 1)
    return
  }

  if (key === 'ArrowRight' && index < props.length - 1) {
    focusInput(index + 1)
    return
  }

  // Handle delete key
  if (key === 'Delete') {
    otpDigits.value[index] = ''
    updateModelValue()
    return
  }

  // Prevent invalid characters
  if (!validateInput(key) && key.length === 1) {
    event.preventDefault()
  }
}

const handlePaste = (event, startIndex) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text/plain')

  if (!validateInput(pastedData)) {
    return
  }

  const pastedDigits = pastedData.split('').slice(0, props.length - startIndex)

  pastedDigits.forEach((digit, i) => {
    const targetIndex = startIndex + i
    if (targetIndex < props.length) {
      otpDigits.value[targetIndex] = digit
    }
  })

  // Focus on the next empty input or the last filled input
  const nextEmptyIndex = otpDigits.value.findIndex((digit, i) => i > startIndex && !digit)
  const focusIndex =
    nextEmptyIndex !== -1
      ? nextEmptyIndex
      : Math.min(startIndex + pastedDigits.length, props.length - 1)

  nextTick(() => {
    focusInput(focusIndex)
  })

  updateModelValue()
}

const handleFocus = (index) => {
  nextTick(() => {
    const input = inputRefs.value[index]?.$el?.querySelector('input')
    if (input) {
      input.select()
    }
  })
}

const focusInput = (index) => {
  if (index >= 0 && index < props.length && inputRefs.value[index]) {
    const input = inputRefs.value[index].$el.querySelector('input')
    if (input) {
      input.focus()
    }
  }
}

const clear = () => {
  otpDigits.value = Array(props.length).fill('')
  updateModelValue()
  focusInput(0)
}

const focus = () => {
  const firstEmptyIndex = otpDigits.value.findIndex((digit) => !digit)
  focusInput(firstEmptyIndex !== -1 ? firstEmptyIndex : 0)
}

watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue !== otpDigits.value.join('')) {
      const digits = (newValue || '').split('').slice(0, props.length)
      while (digits.length < props.length) {
        digits.push('')
      }
      otpDigits.value = digits
    }
  },
  { immediate: true }
)

defineExpose({
  clear,
  focus
})

onMounted(() => {
  if (modelValue.value) {
    const digits = modelValue.value.split('').slice(0, props.length)
    while (digits.length < props.length) {
      digits.push('')
    }
    otpDigits.value = digits
  }
})
</script>
