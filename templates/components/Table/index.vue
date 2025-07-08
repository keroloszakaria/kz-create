<template>
  <div>
    <div v-if="showHeader" class="d-flex mb-4">
      <div class="flex align-center gap-4 justify-between w-100">
        <div class="flex-1">
          <TableFilter
            v-if="finilFilterSchema.length"
            :emitOnChange="emitOnChange"
            :schema="finilFilterSchema"
            @submit="filterData"
          />
        </div>
        <div class="flex gap-4 items-center justify-end">
          <slot name="customBtns"></slot>
          <Button
            v-if="addButtonTitle"
            @click="openModal"
            iconPosition="right"
            :icon="icons.addSquare"
            :title="addButtonTitle"
          />
          <div v-if="selectedRows.length">
            <Button
              @click="deleteRows"
              iconPosition="right"
              :icon="icons.DeleteIcon"
              :title="$t('delete')"
              type="danger"
            />
          </div>
          <div v-if="showTrashed">
            <div class="custom-option">
              <Tabs
                :selectedTab="0"
                :tabs="tabsData"
                :showContent="false"
                @updateTab="toggleCheckbox"
              />
            </div>
          </div>
          <AdvancedFilter
            @submit="filterData"
            :schema="advancedFilterSchema"
            v-if="advancedFilterSchema.length"
          />
          <HeaderCustomization
            v-if="tableName"
            :headers="headers"
            :tableName="tableName"
            @updateHeaders="updateVisibleHeaders"
          />
        </div>
      </div>
    </div>

    <slot name="header"></slot>
    <div class="flex flex-col tableContainer">
      <v-data-table-server
        :headers="visibleHeaders"
        :items="items"
        v-model="selectedRows"
        item-value="id"
        class="flex-grow-1 cursor-pointer table-with-gap"
        :items-per-page="pagination?.pageSize"
        :items-length="pagination?.total"
        :show-select="showSelect"
        :loading="isLoading"
        :hide-default-footer="true"
        :show-expand="showExpand"
        @update:options="updatePagination"
        @click:row="rowClicked"
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <template v-slot:tfoot> </template>
        <template #item.id="{ item }">
          <span>{{ useNumberConverter(item.id) }}</span>
        </template>
        <template #item.created_at="{ item }">
          {{ useDateTimeFormatter(item.created_at) }}
        </template>
        <template v-for="(_, slot) in $slots" v-slot:[slot]="slotProps">
          <slot :name="slot" v-bind="slotProps" />
        </template>
        <template #no-data>
          <div class="flex flex-col gap-2 p-8 no-data justify-center text-center">
            <span v-html="icons.empty"></span>
            <h3 v-if="emptyMessage">{{ emptyMessage }}</h3>
            <slot v-else name="no-data-text">{{ $t('no_data') }}</slot>
          </div>
        </template>
      </v-data-table-server>
      <Pagination
        v-if="!hidePagination && !isLoading"
        :pagination="pagination"
        @update:options="updatePagination"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { useNumberConverter } from '@/composables/useNumberConverter'
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter'
import Pagination from '@/components/common/Pagination.vue'
import AdvancedFilter from './AdvancedFilter.vue'
import Tabs from '@/components/common/Tabs.vue'
import TableFilter from '@/components/common/Table/TableFilter.vue'
import { icons } from '@/plugins/icons'
import HeaderCustomization from './HeaderCustomization.vue'
import { useI18n } from 'vue-i18n'
import { createTextField } from '@/utils/fieldUtils'
const { t } = useI18n()

const emit = defineEmits([
  'searchValue',
  'deleteRows',
  'openModal',
  'isTrashed',
  'update:options',
  'selectedRows',
  'rowClicked',
  'searchfilter'
])

const props = defineProps({
  headers: Array,
  items: { type: Array, default: () => [] },
  pagination: { type: Object, default: () => {} },
  tableName: String,
  addButtonTitle: String,
  addButtonLink: String,
  isLoading: Boolean,
  isShowSearchLabel: Boolean,
  search: String,
  showExpand: Boolean,
  showSelect: { type: Boolean, default: false },
  searchPlaceholder: String,
  showTrashed: { type: Boolean, default: false },
  filterSchema: { type: Array, default: () => [] },
  advancedFilterSchema: { type: Array, default: () => [] },
  addSearch: { type: Boolean, default: true },
  emptyMessage: { type: String, default: '' },
  reloadTable: { type: Boolean, default: false },
  emitOnChange: { type: Boolean, default: true },
  isShowBlocked: { type: Boolean, default: true },
  showHeader: { type: Boolean, default: true },
  hidePagination: { type: Boolean, default: false },
  showHeaderBtns: { type: Boolean, default: true },
  defaultSelectedRows: { type: Array, default: () => [] }
})

const finilFilterSchema = computed(() => {
  const searchField = createTextField({
    t,
    key: 'search',
    placeholder: t('search'),
    setToFilter: true,
    required: false,
    icon: icons.search,
    cols: { md: 4, lg: 4 },
    clearable: true
  })
  if (props.addSearch) return [searchField, ...props.filterSchema]
  else return props.filterSchema
})

const tabsData = props.isShowBlocked
  ? [
      { label: t('general'), slot: 'dafault' },
      { label: t('deleted'), slot: 'trashed' },
      { label: t('blocked'), slot: 'blocked' }
    ]
  : [
      { label: t('general'), slot: 'dafault' },
      { label: t('deleted'), slot: 'trashed' }
    ]

let defaultPagination = {
  pageSize: 10,
  page: 1,
  search: '',
  sortDirection: '',
  trashed: 0,
  blacklist: 0,
  tableStatus: '',
  sortColumn: ''
}

const selectedRows = ref([])

const filterData = (value) => emit('searchValue', { ...props.pagination, ...value })

const visibleHeaders = ref([...props.headers])
const updateVisibleHeaders = (updatedHeaders) => (visibleHeaders.value = updatedHeaders)

const toggleCheckbox = (value) => {
  switch (value) {
    case 'dafault':
      defaultPagination.trashed = 0
      defaultPagination.blacklist = 0
      defaultPagination.tableStatus = 'default'
      break
    case 'trashed':
      defaultPagination.trashed = 1
      defaultPagination.blacklist = 0
      defaultPagination.tableStatus = 'trashed'
      break
    case 'blocked':
      defaultPagination.trashed = 0
      defaultPagination.blacklist = 1
      defaultPagination.tableStatus = 'blocked'
      break
  }
  emit('isTrashed', defaultPagination)
}

const updatePagination = (value) => {
  defaultPagination.page = value.page || defaultPagination.page
  defaultPagination.pageSize = value.pageSize || defaultPagination.pageSize
  if (value.sortBy && value.sortBy.length > 0) {
    defaultPagination.sortColumn = value.sortBy[0].key
    defaultPagination.sortDirection = value.sortBy[0].order
  } else {
    defaultPagination.sortColumn = '' // or a default value
    defaultPagination.sortDirection = '' // or a default value
  }

  emit('update:options', defaultPagination)
}

const openModal = () => emit('openModal')
const rowClicked = (e, { item }) => {
  let targetElement = e.target
  let buttonFound = false
  while (targetElement) {
    if (targetElement.tagName === 'BUTTON') {
      buttonFound = true
      break
    }
    targetElement = targetElement.parentElement
  }
  if (!buttonFound) emit('rowClicked', item)
}

const deleteRows = () => {
  emit('deleteRows', selectedRows.value)
  selectedRows.value = []
}

watch(
  () => props.defaultSelectedRows,
  (newVal) => (selectedRows.value = newVal),
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
