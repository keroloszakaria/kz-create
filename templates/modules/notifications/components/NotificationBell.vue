<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="closeOnContentClick"
    location="bottom start"
    offset="10"
  >
    <template #activator="{ props }">
      <v-btn icon v-bind="props" class="relative">
        <v-badge
          v-if="notificationsStore.unOpened > 0"
          :content="notificationsStore.unOpened"
          color="red"
          class="inset-inline-start-[-2px]"
          overlap
          size="small"
        >
          <span
            :key="isNewNotification"
            v-html="icons.notification"
            :class="{ 'animate-bell': isNewNotification }"
            class="bell-icon"
          />
        </v-badge>
        <span
          v-else
          :key="isNewNotification"
          v-html="icons.notification"
          :class="{ 'animate-bell': isNewNotification }"
          class="bell-icon"
        />
      </v-btn>
    </template>

    <v-card width="400" max-height="500" class="overflow-y-auto">
      <NotificationList />
    </v-card>
  </v-menu>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/modules/auth/stores/auth'
import { useNotificationsStore } from '../stores/useNotificationsStore'
import NotificationList from './NotificationList.vue'
import { icons } from '../plugins/icons'

const props = defineProps({
  closeOnContentClick: { type: Boolean, default: true }
})

const menu = ref(false)
const isNewNotification = ref(false)
const notificationsStore = useNotificationsStore()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

watch(
  () => notificationsStore.notifications.length,
  (newVal, oldVal) => {
    if (newVal > oldVal) {
      isNewNotification.value = true
      setTimeout(() => {
        isNewNotification.value = false
      }, 900)
    }
  }
)

watch(menu, (isOpen) => {
  if (isOpen) {
    notificationsStore.markAllNotificationsAsOpened()
  }
})
onMounted(() => {
  notificationsStore.fetchNotifications()
  notificationsStore.setChannel(`notification.admin.${user?.value?.id}`)
})
onBeforeUnmount(() => {
  notificationsStore.resetNotifications()
  notificationsStore.removeChannel()
})
</script>

<style lang="scss" scoped>
button {
  width: 40px !important;
  height: 40px !important;
  border-radius: 8px !important;
  background-color: rgba(var(--v-theme-primary), 0.25);
  color: rgba(var(--v-theme-primary), 1);
  > *:not(.v-btn__content) {
    display: none;
  }
  :deep() {
    .v-btn__content {
      display: flex;
      align-items: center;
      justify-content: center;

      .v-badge__badge {
        display: flex;
        top: -15px !important;
        right: unset !important;
        inset-inline-end: -15px !important;
      }
    }
  }
}

.bell-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}
.animate-bell {
  animation: shake 0.9s;
  animation-iteration-count: 1;
}
@keyframes shake {
  0%,
  100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(15deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}
</style>
