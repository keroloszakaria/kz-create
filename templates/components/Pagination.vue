<template>
  <div class="flex justify-between items-center py-4 px-4 mt-2">
    <div class="flex gap-2 align-center">
      <div class="pagination_details text-dark_400">
        <span> {{ $t('from') }} </span>
        <span class="number">{{ useNumberConverter(from) }} </span>
        <span>{{ $t('to') }} </span>
        <span class="number">{{ useNumberConverter(to) }} </span>
        <span>{{ $t('from_origin') }} </span>
        <span class="number"> {{ useNumberConverter(total) }} </span>
        <span>{{ $t('result') }} </span>
      </div>
      <!-- <selectBox
        :options="translatedPaginationList"
        v-model="translatedPaginationValue"
        :placeholder="$t('show')"
        @update:modelValue="handlePaginationChange"
      /> -->
    </div>
    <v-pagination
      v-model="paginationData.currentPage"
      :length="totalPages"
      :total-visible="5"
      :disabled="totalPages === 1"
    >
      <template #item="{ page, isActive, props }">
        <v-btn :class="[{ active: isActive }]" variant="text" v-bind="props">
          {{ useNumberConverter(page) }}
        </v-btn>
      </template>

      <template #next="{ onClick, disabled }">
        <v-btn height="32" variant="tonal" :disabled @click="onClick">
          <template #append>
            <span class="flex rotate-90" v-html="icons.chevronDown"></span>
          </template>
          <template #default>
            {{ $t('next') }}
          </template>
        </v-btn>
      </template>
      <template #prev="{ onClick, disabled }">
        <v-btn variant="tonal" :disabled @click="onClick">
          <template #prepend>
            <span class="flex rotate-270" v-html="icons.chevronDown"></span>
          </template>
          <template #default>
            {{ $t('prev') }}
          </template>
        </v-btn>
      </template>
    </v-pagination>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import selectBox from './FieldsTypes/selectBox.vue'
import { useNumberConverter } from '@/composables/useNumberConverter.js'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  pagination: {
    type: Object,
    required: true
  },
  paginationFetch: {
    type: [Boolean],
    default: false
  }
})

const { from, to, total, currentPage, pageSize } = props.pagination

const emit = defineEmits(['update:options'])
const { locale } = useI18n()
const paginationData = ref({
  currentPage: currentPage,
  pageSize: pageSize
})
const paginationList = ref([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])

const translatedPaginationList = computed(() => {
  return paginationList.value.map((item) => {
    return useNumberConverter(item)
  })
})

const translatedPaginationValue = computed(() => useNumberConverter(paginationData.value.pageSize))

const handlePaginationChange = (newValue) => {
  if (locale.value === 'ar') {
    newValue = String(newValue).replace(/[٠١٢٣٤٥٦٧٨٩]/g, (match) => {
      return '٠١٢٣٤٥٦٧٨٩'.indexOf(match)
    })
  }
  paginationData.value.pageSize = newValue
}

const totalPages = computed(() => Math.ceil(total / paginationData.value.pageSize))

watch(
  paginationData.value,
  (newValue) => {
    emit('update:options', {
      page: paginationData.value.currentPage,
      pageSize: paginationData.value.pageSize
    })
  },
  { immediate: props?.paginationFetch }
)

watch(
  () => props.pagination,
  (newPagination) => {
    if (newPagination) {
      paginationData.value.currentPage =
        newPagination.currentPage || paginationData.value.currentPage
      paginationData.value.pageSize = newPagination.pageSize || paginationData.value.pageSize
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.flip-icon {
  transform: rotate(180deg);
}

.pagination_details {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 160%;
  display: flex;
  gap: 0.25rem;
  .number {
    font-weight: 500;
    color: rgba(var(--v-theme-dark_bg), 1);
  }
}

:deep() {
  .v-pagination {
    &__prev,
    &__next,
    &__item {
      margin-block: 0;
    }
    .v-btn {
      .v-btn__content {
        font-weight: 500 !important;
      }

      .v-btn__underlay {
        display: none;
      }
    }
    &__list {
      display: flex;
      align-items: center;
      .v-btn {
        font-size: 0.875rem;
        border-radius: 0.5rem;
        height: 100%;
        width: unset;
        padding: 0.3rem 0.4rem;
        gap: 0.25rem;
        &--icon {
          width: 32px;
          height: 32px;
          padding: 0.3rem 0.6rem;
        }
        &--icon:not(.active) {
          width: 32px;
          height: 32px;
          padding: 0.3rem 0.6rem;
          border: 1px solid rgba(var(--v-theme-dark_100), 1);
        }

        &__append,
        &__prepend {
          margin-inline: 0;
          justify-content: center;
        }
      }
    }
    &__prev {
      height: 100%;
      margin-inline-start: 0;
      margin-inline-end: 0.75rem;
      .v-btn {
        color: rgba(var(--v-theme-dark_bg), 1);
        background-color: rgba(var(--v-theme-dark_75), 1) !important;
        border: 1px solid transparent;
      }
    }
    &__next {
      margin-inline-end: 0;
      margin-inline-start: 0.75rem;
      .v-btn {
        color: rgba(var(--v-theme-primary), 1);
        background-color: rgba(var(--v-theme-primary_50), 1);
      }
    }
    &__item {
      margin-inline: 0.25rem;
      .v-btn {
        background-color: transparent !important;
        max-width: 2rem;
      }
      &--is-active {
        .v-btn {
          color: rgba(var(--v-theme-primary), 1);
          background-color: rgba(var(--v-theme-primary_50), 1);
        }
      }
    }
  }
}
</style>
