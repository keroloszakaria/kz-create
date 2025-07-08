<template>
  <div>
    <teleport to="#teleported-items" v-if="isRendered">
      <div class="flex items-center gap-2">
        <Button
          :icon="icons.documentDownload"
          iconPosition="right"
          :disabled="true"
          :title="$t('create_report')"
          type="close teleport"
        />
      </div>
    </teleport>

    <Table
      :headers="headers"
      :items="activityStore.items"
      :pagination="activityStore.pagination"
      :isLoading="activityStore.isLoading"
      :showSelect="true"
      tableName="users"
      @searchValue="getItems"
      @rowClicked="viewRow($event)"
      @isTrashed="getItems"
      @update:options="getItems"
    >
      <template #item.event="{ item }">
        <Badge :type="badgeType(item.event)" :label="item.event" />
      </template>
    </Table>

    <Modal
      :customAction="true"
      v-model="isShowModal"
      width="699"
      :title="$t('view_item', { item: $t('activity') })"
    >
      <template #content>
        <div class="flex flex-col gap-4 border-1 border-[#EBF0F7] !p-3 rounded-[12px]">
          <h3>{{ activityStore.selectedItem?.message }}</h3>
          <div class="flex items-center justify-between">
            <div class="flex gap-1">
              <span class="font-[500] text-dark_700 text-dark_700">{{ $t('type') }}:</span>
              <span class="font-[500] text-dark_bg">{{ activityStore.selectedItem?.type }}</span>
            </div>
            <div class="flex gap-1">
              <span class="font-[500] text-dark_700 text-dark_700">{{ $t('action') }}:</span>
              <span class="font-[500] text-dark_bg">{{ activityStore.selectedItem?.event }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex gap-1">
              <span class="font-[500] text-dark_700">{{ $t('date') }}:</span>
              <span class="font-[500] text-dark_bg">{{
                useDateTimeFormatter(activityStore.selectedItem?.created_at, { format: 'date' })
              }}</span>
            </div>
            <div class="flex gap-1">
              <span class="font-[500] text-dark_700">{{ $t('time') }}:</span>
              <span class="font-[500] text-dark_bg">{{
                useDateTimeFormatter(activityStore.selectedItem?.created_at, { format: 'time' })
              }}</span>
            </div>
          </div>
          <hr class="border-[#F0F4FA]" />
          <div class="flex flex-col gap-2">
            <h4 class="text-dark_700">{{ $t('changes') }}</h4>
            <div class="flex items-center justify-between gap-4">
              <div
                v-if="activityStore.selectedItem?.properties?.old"
                class="flex flex-col gap-4 flex-1"
              >
                <div
                  class="flex gap-1"
                  v-for="item in activityStore.selectedItem?.properties?.old"
                  :key="item.key"
                >
                  <span class="font-[500] text-dark_700">{{ item.key }}:</span>
                  <span class="font-[500] text-dark_bg break-all">{{ item.value }}</span>
                </div>
              </div>
              <div
                v-if="activityStore.selectedItem?.properties?.attributes"
                class="flex flex-col gap-4 flex-1"
              >
                <div
                  class="flex gap-1"
                  v-for="item in activityStore.selectedItem?.properties?.attributes"
                  :key="item.key"
                >
                  <span class="font-[500] text-dark_700">{{ item.key }}:</span>
                  <span class="font-[500] text-dark_bg break-all">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useActivityStore } from '../stores'
import { useI18n } from 'vue-i18n'
import { useTeleport } from '@/composables/useTeleport'
import Table from '@/components/common/Table/index.vue'
import Badge from '@/components/common/Badge.vue'
import Modal from '@/components/common/Modal.vue'
import { useBreadCrumbStore } from '@/stores/breadCrumb'
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter'

const { isRendered } = useTeleport('teleported-items')
const activityStore = useActivityStore()
const isShowModal = ref(false)
const { t } = useI18n()
const { setBreadcrumbs } = useBreadCrumbStore()

setBreadcrumbs([
  { title: t('dashboard'), disabled: false, to: '/' },
  { title: t('activities'), disabled: true, to: '' }
])
const headers = ref([
  { title: t('message'), key: 'message', align: 'start' },
  { title: t('type'), key: 'type', align: 'start' },
  { title: t('action'), key: 'event', align: 'start' },
  { title: t('create_at'), key: 'created_at' }
])

const badgeType = (type) => {
  switch (type) {
    case 'created':
      return 'success'
    case 'updated':
      return 'info'
    case 'viewed':
      return 'primary'
    case 'trashed':
      return 'danger'
    case 'deleted':
      return 'danger'
  }
}

const getItems = async (value) => await activityStore.getAll({ params: value })
const viewRow = (item) => {
  isShowModal.value = true
  activityStore.selectedItem = item
}
</script>

<style lang="scss" scoped></style>
