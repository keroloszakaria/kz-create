<template>
  <div class="theme-toggle" @click="switchTheme" :class="{ 'dark-mode': isDark }">
    <div class="toggle-track">
      <div class="toggle-thumb" :class="{ active: isDark }">
        <div class="icon sun-icon" v-html="icons.sun" :class="{ active: !isDark }"></div>
        <div class="icon moon-icon" v-html="icons.moon" :class="{ active: isDark }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import storage from '@/composables/useStorage'

const { global } = useTheme()
const isDark = computed(() => global.current.value.dark)

function switchTheme() {
  global.name.value = global.current.value.dark ? 'light' : 'dark'
  storage.set('mode', global.name.value)
}
</script>

<style lang="scss" scoped>
.theme-toggle {
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  .toggle-track {
    position: relative;
    width: 88px;
    height: 40px;
    background-color: #f8fafc;
    border-radius: 12px;
    padding: 4px 8px;
    transition: background-color 0.3s ease;
    .toggle-thumb {
      width: 32px;
      height: 32px;
      background: #ffffff;
      border-radius: 8px;
      position: absolute;
      top: 4px;
      left: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      &.active {
        transform: translateX(40px);
      }
    }
  }
}

.dark-mode {
  .toggle-track {
    background: #374151;
    border-color: #4b5563;
    .toggle-thumb {
      background: #1f2937;
    }
  }
}

.icon {
  position: absolute;
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);
  color: #9ca3af;
  &.active {
    opacity: 1;
    transform: scale(1);
  }
}

.sun-icon.active {
  color: rgba(var(--v-theme-dark_bg), 1);
}

.moon-icon.active {
  color: white;
}
</style>
