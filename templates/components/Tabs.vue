<template>
  <div :class="{ 'flex-col': !isVertical }" class="flex items-start gap-5">
    <div :class="{ 'w-full': !isVertical }" class="flex justify-between items-center">
      <v-tabs :direction="isVertical ? 'vertical' : 'horizontal'" v-model="tab">
        <v-tab v-for="tabItem in tabs" :key="tabItem.slot" :value="tabItem.slot">
          <span class="tab-icon" v-if="tabItem.icon" v-html="tabItem.icon"></span>
          {{ tabItem.label }}
          <span class="tab-notification" v-if="tabItem.notification">{{
            tabItem.notification
          }}</span>
        </v-tab>
      </v-tabs>
      <slot name="actions"></slot>
    </div>

    <v-card-text class="w-full">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="tabItem in tabs" :key="tabItem.slot" :value="tabItem.slot">
          <template v-if="tabItem.content">
            {{ tabItem.content }}
          </template>
          <template v-else>
            <slot :name="tabItem.slot"></slot>
          </template>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isVertical: { type: Boolean, default: () => false },
  tabs: { type: Array, required: true, default: () => [] },
  selectedTab: { type: [String, Number], required: false, default: '' }
})

const tab = ref(props.selectedTab)
const emits = defineEmits(['updateTab'])
watch(
  () => props.selectedTab,
  (newVal) => (tab.value = newVal)
)
watch(tab, (newVal) => {
  emits('updateTab', newVal)
})
</script>

<style lang="scss" scoped>
.v-tabs {
  width: fit-content !important;
  height: fit-content !important;
}
:deep() {
  .v-card-text {
    width: 100% !important;
    padding: 0 !important;
  }

  .v-slide-group {
    &--vertical {
      .v-slide-group__content {
        min-width: 213px;
        padding: 1.25rem !important;
        border-radius: 20px;
        gap: 12px;
        .v-btn {
          width: 100% !important  ;

          &.v-tab-item--selected {
            background-color: rgba(var(--v-theme-primary_25), 1) !important;
            color: rgba(var(--v-theme-primary), 1) !important;
          }

          &:not(:first-child) {
            &::before {
              content: unset !important;
            }
          }
        }
      }
    }
    &__content {
      display: flex;
      align-items: center;
      gap: 1rem;
      background-color: rgba(var(--v-theme-dark_white), 1);
      border: 1px solid rgba(var(--v-theme-dark_100), 1);
      border-radius: 12px;
      padding: 4px;
      .v-btn {
        color: rgba(var(--v-theme-dark_700), 1) !important;
        padding: 8px 22px;
        border-radius: 8px !important;
        font-size: 16px;
        font-weight: 500;
        position: relative;
        margin: 0;
        &:not(:first-child) {
          &::before {
            content: '';
            position: absolute;
            inset-inline-start: -8px;
            width: 1px;
            background-color: rgba(var(--v-theme-dark_100), 1);
            height: 32px;
            z-index: 999;
          }
        }
        .v-tab__slider {
          display: none;
        }
      }
      .v-btn__content {
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        .tab-notification {
          width: 29px;
          height: 24px;
          background-color: #f9fafb;
          border: 1px solid #eaecf0;
          border-radius: 50%;
          padding: 2px 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #344054;
          font-size: 14px;
          font-weight: 500;
        }
      }

      .v-tab-item {
        &--selected {
          background-color: rgba(var(--v-theme-primary), 1);
          color: #fff !important;
        }
      }
    }
  }
}
</style>
