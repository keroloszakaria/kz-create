<template>
  <div class="flex gap-4 bg-dark_white !p-6 border-1 border-[#F0F4FA] rounded-[1rem]">
    <div class="flex flex-col gap-4 min-w-[230px] pe-4 border-e-1 border-[#F0F4FA]">
      <v-row class="">
        <FieldRenderer :field="searchField" :fieldIndex="1" @update:value="handleSearch" />
      </v-row>
      <ul class="h-[456px] overflow-y-auto flex flex-col gap-3">
        <li
          class="!px-3 !py-2 min-h-[40px] flex justify-between items-center transition-all duration-200 rounded-[8px] cursor-pointer"
          :class="selectedGroup.name === group.name && 'active'"
          @click="selectedGroup = group"
          v-for="group in filteredGroups"
          :key="group"
        >
          <h3 class="text-dark_600 text-[14px]">{{ group.name }}</h3>
          <span
            v-if="getSelectedCountForGroup(group) > 0"
            class="bg-[#FBFDFE] !font-[600] text-dark_600 text-[12px] px-2 py-1 rounded-[6px] w-6 h-6 text-center"
          >
            {{ getSelectedCountForGroup(group) }}
          </span>
        </li>
      </ul>
    </div>
    <div class="flex-1 flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <h3 class="text-dark_bg text-[18px] !font-[600]">تفاصيل الصلاحيات</h3>
        <p class="text-dark_700 text-[12px]">
          هذا النص مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد
        </p>
      </div>
      <div class="max-h-[443] h-full overflow-y-auto overflow-x-hidden">
        <v-row>
          <v-col
            lg="4"
            cols="12"
            v-for="permission in selectedGroup.permissions"
            :key="permission.id"
          >
            <div class="field" :class="{ selected: selectedPermissions.includes(permission.name) }">
              <v-checkbox
                hide-details
                v-model="selectedPermissions"
                :label="permission.display_name"
                :value="permission.name"
                :disabled="isView"
              />
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePermissionsStore } from '../stores/permissions'
import FieldRenderer from '@/components/common/GenericForm/FieldRenderer.vue'
import { createTextField } from '@/utils/fieldUtils'
import { icons } from '@/plugins/icons'
const selectedGroup = ref([])
const permissionsStore = usePermissionsStore()
const selectedPermissions = defineModel({ type: Array, default: () => [] })
const { t } = useI18n()
const props = defineProps({ isView: { type: Boolean, default: false } })
const searchValue = ref('')
const filteredGroups = computed(() => {
  if (!searchValue.value) {
    return permissionsStore.permssionGroups
  }
  return permissionsStore.permssionGroups.filter((group) =>
    group.name.toLowerCase().includes(searchValue.value.toLowerCase())
  )
})

const searchField = ref(
  createTextField({
    t,
    key: 'search',
    placeholder: t('search'),
    type: 'text',
    required: false,
    icon: icons.search,
    cols: { md: 12, lg: 12 }
  })
)

const handleSearch = (value) => {
  searchValue.value = value
  selectedGroup.value = []
}

permissionsStore.getAll({ params: {} })

const getSelectedCountForGroup = (group) => {
  if (!group.permissions || !selectedPermissions.value) return 0

  const groupPermissionNames = group.permissions.map((p) => p.name)
  return selectedPermissions.value.filter((selected) => groupPermissionNames.includes(selected))
    .length
}
</script>

<style lang="scss" scoped>
.active {
  background-color: rgba(var(--v-theme-primary), 0.25);
  h3 {
    color: rgba(var(--v-theme-primary), 1) !important;
    font-weight: 600 !important;
  }
  span {
    background-color: #ffffff !important;
    color: rgba(var(--v-theme-primary), 1) !important;
  }
}

.field {
  border: 1px solid var(--Dark-200, #e2e7ee);
  border-radius: 10px;
  padding: 10px;
  transition: all 0.2s ease-in-out;

  &.selected {
    border: 1px solid rgba(var(--v-theme-primary), 1) !important;
  }
}

:deep() {
  .v-selection-control {
    gap: 8px !important;
  }
}
</style>
