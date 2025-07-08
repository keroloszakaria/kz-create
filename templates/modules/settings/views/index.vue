<template>
  <Tabs :isVertical="true" :tabs="tabsData" :syncWithQuery="true">
    <template #site_info>
      <generalSettings />
    </template>
    <template #properties>
      <properties />
    </template>
    <template #MailServer>
      <mailserver />
    </template>
  </Tabs>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import Tabs from '@/components/common/Tabs.vue'
import { useBreadcrumbs } from '@/composables/useBreadcrumbs'
import { useI18n } from 'vue-i18n'
import generalSettings from '../components/generalSettings.vue'
import properties from '../components/properties.vue'
import mailserver from '../components/mailserver.vue'
import icons from '../plugins/icons'
const { setBreadcrumbs } = useBreadcrumbs()
const { t } = useI18n()
setBreadcrumbs([
  {
    title: 'sidebar.dashboard',
    disabled: false,
    to: '/'
  },
  {
    title: 'sidebar.settings',
    disabled: true,
    to: ''
  },
  {
    title: 'sidebar.general',
    disabled: true,
    to: ''
  }
])
const tabsData = computed(() => [
  { label: t('site_info'), slot: 'site_info', icon: icons.global },
  { label: t('properties'), slot: 'properties', icon: icons.settings }
  // { label: t('mail_server'), slot: 'MailServer', icon: icons.settings }
])

onMounted(() => {})
</script>
