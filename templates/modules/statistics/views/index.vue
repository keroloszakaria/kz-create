<template>
  <Loading v-if="isLoading" />
  <div v-else class="">
    <Tabs :tabs="tabsData" :selectedTab="0" @updateTab="changeTab">
      <template v-for="tab in tabsData" :key="tab.slot" v-slot:[tab.slot]="slotProps">
        <reportDetails v-if="tab.slot === selectedTab" :page="tab.slot" />
      </template>
    </Tabs>
  </div>
</template>

<script setup>
import { useEnumsStore } from '@/stores/enums'
import { useBreadcrumbs } from '@/composables/useBreadcrumbs'
import { onMounted, ref } from 'vue'
import Tabs from '@/components/common/Tabs.vue'
import reportDetails from './Tabs/reportDetails.vue'
import Loading from '@/components/common/Loading.vue'
const { setBreadcrumbs } = useBreadcrumbs()
const enumsStore = useEnumsStore()
setBreadcrumbs([
  {
    title: 'SIDEBAR.DASHBOARD',
    disabled: false,
    to: '/'
  }
])

const tabsData = ref([])
const selectedTab = ref(0)
const isLoading = ref(false)
const changeTab = (tab) => (selectedTab.value = tab)

onMounted(async () => {
  try {
    isLoading.value = true
    const { report_export_page } = await enumsStore.getHelpEnums([
      {
        name: 'report.report_export_page'
      }
    ])
    tabsData.value = transformResponseToTabsData(report_export_page)
    if (!tabsData.value.length) return
    selectedTab.value = tabsData.value[0].slot
  } finally {
    isLoading.value = false
  }
})

const transformResponseToTabsData = (response) => {
  return response.map((item) => ({
    label: item.label,
    slot: item.value
  }))
}
</script>
