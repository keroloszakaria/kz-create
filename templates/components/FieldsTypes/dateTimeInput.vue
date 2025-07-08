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
      {{ $t(label) }}
    </div>
    <VueDatePicker
      v-if="inputStyle !== 'viewMode'"
      ref="dpDatePicker"
      :class="$vuetify.locale.current === 'ar' ? 'is_rtl' : 'is_ltr'"
      :model-value="innerValue"
      @update:model-value="updateValue"
      v-bind="mergedOptions"
      :placeholder="$t(placeholder)"
      month-name-format="long"
      :model-type="dateFormat"
      :readonly="disabled || readonly"
      :hide-input-icon="false"
      :min-date="minDate"
      :max-date="maxDate"
      :min-time="minTime"
      :max-time="maxTime"
      :is-24="is24"
      :offset="0"
      :format="format || dateFormat"
      :select-text="$t('select_item')"
      :cancel-text="$t('cancel')"
      :now-button-label="$t('now')"
      :dark="$vuetify.theme.name == 'dark' ? true : false"
      arrow-navigation
      :clearable="!disabled && !readonly"
      :always-clearable="!disabled && !readonly"
      teleport-center
      :day-names="[t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')]"
    >
      <template #top-extra="{ value }">
        <div class="d-flex justify-center align-center py-2 mb-2 border-b-thin">
          <span v-if="value" class="fs-10">
            {{ formatDateArray(value) }}
          </span>
          <span v-else>{{ $t('select_item') }}</span>
        </div>
      </template>
      <template #calendar-header="{ index, day }">
        <div :class="index === 5 || index === 6 ? 'red-color' : ''">
          {{ day }}
        </div>
      </template>

      <template #day="{ day, date }">
        {{ useNumberConverter(day) }}
      </template>

      <template #hours="{ text, value }">
        {{ useNumberConverter(value) }}
      </template>

      <template #minutes="{ text, value }">
        {{ useNumberConverter(value) }}
      </template>

      <template #year="{ value }">
        {{ useNumberConverter(value) }}
      </template>

      <template #year-overlay-value="{ text, value }">
        {{ useNumberConverter(value) }}
      </template>

      <template #am-pm-button="{ toggle, value }">
        <button @click="toggle()" variant="text" class="bg-primary py-2 px-3 rounded-lg fs-12">
          {{ $vuetify.locale.current == 'ar' ? (value === 'AM' ? 'صباحا' : 'مساء') : value }}
        </button>
      </template>

      <template #action-preview="{ value }">
        <div class="d-flex justify-center align-center">
          <span v-if="value" class="fs-10">
            {{ formatDateArray(value) }}
          </span>
          <span v-else>{{ $t('select_item') }}</span>
        </div>
      </template>

      <template #clock-icon>
        <span class="d-flex ms-2 clock-icon" v-html="icons.time"></span>
      </template>

      <template #arrow-left>
        <span class="d-flex ms-2" v-html="icons.arrowLeft"></span>
      </template>

      <template #arrow-right>
        <span class="d-flex ms-2 rotate-180" v-html="icons.arrowLeft"></span>
      </template>

      <template #arrow-up>
        <span class="d-flex ms-2 rotate-180" v-html="icons.arrowDown"></span>
      </template>

      <template #arrow-down>
        <span class="d-flex ms-2" v-html="icons.arrowDown"></span>
      </template>

      <template
        #dp-input="{
          value,
          onInput,
          onEnter,
          onTab,
          onClear,
          onBlur,
          onKeypress,
          onPaste,
          isMenuOpen
        }"
      >
        <v-text-field
          hide-details="auto"
          :class="inputOptionsClass"
          variant="outlined"
          :model-value="innerValue"
          :placeholder="$t(placeholder)"
          :required="required"
          :disabled="disabled"
          :readonly="readonly"
          :rules="rules"
          flat
        >
          <template v-if="icon" v-slot:prepend-inner>
            <v-icon v-if="icon.startsWith('mdi-')" :icon="icon"></v-icon>
            <span v-else class="icon" v-html="icon"></span>
          </template>
        </v-text-field>
      </template>
    </VueDatePicker>
    <div v-else class="text-start">
      <p v-if="innerValue">{{ useDateTimeFormatter(innerValue) }}</p>
      <p v-else>{{ $t('no_found') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, useAttrs, computed, watch } from 'vue'
import { useNumberConverter } from '@/composables/useNumberConverter.js'
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter.js'
import { useI18n } from 'vue-i18n'
import { icons } from '@/plugins/icons.js'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { arEG, enUS } from 'date-fns/locale'
import { format as formatDate } from 'date-fns'

const { t, locale } = useI18n()

const props = defineProps({
  modelValue: [String, Array, Date, null],
  label: String,
  placeholder: String,
  icon: String,
  format: String,
  is24: { type: Boolean, default: false },
  minDate: [Date, String],
  maxDate: [Date, String],
  minTime: Object,
  maxTime: Object,
  options: Object,
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  inputStyle: String,
  classList: String,
  rules: Array,
  mode: {
    type: String,
    default: 'vertical',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  // New props for improved API
  dateType: {
    type: String,
    default: 'datetime',
    validator: (value) => ['datetime', 'date-only', 'time-only', 'date-with-day'].includes(value)
  }
})

const attrs = useAttrs()

// Merge props.options with any options provided via v-bind
const mergedOptions = computed(() => {
  const options = { ...(props.options || {}) }

  // Handle dateType prop
  if (props.dateType === 'date-only') {
    options['only-date'] = true
    options['time-picker'] = false
  } else if (props.dateType === 'time-only') {
    options['time-picker'] = true
    options['only-date'] = false
  } else if (props.dateType === 'date-with-day') {
    options['date-with-day'] = true
    options['time-picker'] = false
    options['only-date'] = false
  }

  // Add any additional attributes from v-bind
  if (attrs?.options) Object.assign(options, attrs.options)

  return options
})

const inputOptionsClass = computed(() => {
  let classList = ''
  if (mergedOptions.value['time-picker'] === true) classList += 'time-picker '
  else if (mergedOptions.value['date-with-day'] === true) classList += 'date-with-day '
  else if (mergedOptions.value['only-date'] === true) classList += 'only-date '
  return classList.trim()
})

const innerValue = ref(props.modelValue)

const emit = defineEmits(['update:modelValue'])
const updateValue = (value) => {
  innerValue.value = value
  emit('update:modelValue', value)
}

const dateFormat = computed(() => {
  if (mergedOptions.value['time-picker'] === true) {
    return props.is24 ? 'HH:mm' : 'hh:mm aa'
  } else if (mergedOptions.value['date-with-day'] === true) {
    return 'EEEE, yyyy-MM-dd'
  } else if (mergedOptions.value['only-date'] === true) {
    return 'yyyy-MM-dd'
  } else {
    return props.is24 ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd hh:mm aa'
  }
})

const formatDateArray = (value) => {
  if (!value) return ''

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        try {
          return useNumberConverter(formatDate(new Date(item), 'yyyy/MM/dd'))
        } catch (e) {
          console.error('Date formatting error:', e)
          return ''
        }
      })
      .filter(Boolean)
      .join(' & ')
  } else {
    try {
      return useNumberConverter(formatDate(new Date(value), 'yyyy/MM/dd'))
    } catch (e) {
      console.error('Date formatting error:', e)
      return ''
    }
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal
  }
)
</script>

<style lang="scss">
.dp__main {
  justify-content: center;
  &.is_rtl {
    .v-field__input::placeholder {
      direction: rtl;
      text-align: right;
    }
  }
  * {
    direction: var(--dp-direction, ltr);
  }
}

.dp__arrow_top {
  transform: translate(-50%, -50%) rotate(45deg);
}

.dp__today {
  border: 1px solid rgba(var(--v-theme-primary), 1);
  color: rgba(var(--v-theme-primary), 1);
}

.dp__calendar_item {
  color: rgba(var(--v-theme-text), 1);
}

.dp__cell_inner {
  padding: 0.2rem;
  width: 1.8rem;
  font-size: 0.875rem;
  font-weight: 400;
}

.dp__time_display {
  color: rgba(var(--v-theme-text), 1);
  font-size: 1rem;
  font-weight: 500;
}

.dp__range_end,
.dp__range_start,
.dp__active_date {
  background: rgba(var(--v-theme-primary), 1);
  color: rgba(var(--v-theme-dark_white), 1);
}
</style>

<style lang="scss" scoped>
:deep() {
  .v-input {
    &__control {
      .v-field {
        &__input {
          padding: 0 1rem;
        }
      }
    }
  }
}
.v-btn--icon {
  border-radius: 0.3rem !important;
}

.v-btn--icon.v-btn--density-default {
  width: 2rem;
  height: 2rem;
}

.v-btn--icon.v-btn--size-default {
  --v-btn-size: 0.8rem;
}

.red-color {
  color: rgba(var(--v-theme-error), 1);
}
</style>
