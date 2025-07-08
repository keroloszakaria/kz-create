<template>
  <v-row no-gutters>
    <v-col cols="12" md="7" class="d-none d-md-block">
      <authSide :bgImage="authbg" title="login_title" desc="login_description" />
    </v-col>
    <v-col cols="12" md="5" class="h-100">
      <div class="flex flex-col gap-5 !p-4 justify-center h-100">
        <div class="flex justify-end">
          <LanuageSwitch />
        </div>
        <div class="flex-1 flex max-w-[409px] !m-auto">
          <slot></slot>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { useIsDark } from '@/composables/useIsDark'
import { useI18n } from 'vue-i18n'
import { useLogo } from '@/composables/useLogo'
import arFlag from '@/assets/images/svg/ar.svg'
import enFlag from '@/assets/images/svg/en.svg'
import authSide from '../components/authSide.vue'
import { useLocale } from 'vuetify'
import { useAppStore } from '@/stores/app'
import storage from '@/composables/useStorage'
import { ref, onMounted } from 'vue'
import ThemeSwitch from '@/components/specific/dashboard/Navbar/ThemeSwith.vue'
import authbg from '../assets/auth-bg.png'
import LanuageSwitch from '@/components/specific/dashboard/Navbar/LanuageSwitch.vue'

const appStore = useAppStore()
const toggleLanguage = ref('ar')
const { t, locale } = useI18n()
const { appLogo, onError } = useLogo()
const locales = [
  { title: 'English', value: 'en', img: enFlag },
  { title: 'Arabic', value: 'ar', img: arFlag }
]
const local = useLocale()
const isDark = useIsDark()
const toggleLanguageChange = (lang) => {
  storage.set('locale', lang)
  local.current.value = lang
  appStore.locale.current = lang
}
onMounted(() => {
  toggleLanguage.value = storage.get('locale')
})
</script>

<style lang="scss" scoped>
.navbar {
  padding: 14px 8px;
  background-color: rgba(var(--v-theme-dark_white), 1);
  border-radius: 8px;
}
.options {
  background-color: rgba(var(--v-theme-dark_white), 1);
  border-radius: 8px;
  padding: 4px;
}
</style>
