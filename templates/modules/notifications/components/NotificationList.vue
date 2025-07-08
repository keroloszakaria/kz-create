<template>
  <v-card flat>
    <v-toolbar flat density="compact">
      <v-toolbar-title>{{ $t('notifications') }}</v-toolbar-title>
    </v-toolbar>

    <v-divider />

    <v-list ref="scrollContainer" class="scroll-container">
      <template v-if="notificationsStore.isEmpty && !notificationsStore.isLoading">
        <v-list-item>
          <v-list-item-title class="text-center">
            {{ $t('no_notifications') }} 📭
          </v-list-item-title>
        </v-list-item>
      </template>

      <template v-else>
        <div class="px-2" v-for="(group, groupName) in groupedNotifications" :key="groupName">
          <template v-if="group.length">
            <v-subheader class="font-weight-bold group-title">{{ $t(groupName) }}</v-subheader>
            <v-list-item
              v-for="item in group"
              :key="item.notification_id"
              :class="{ 'bg-blue-lighten-5': !item.read_at }"
              @click="handleNotificationClick(item)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.message }}</v-list-item-subtitle>
                <div class="d-flex justify-space-between mt-2">
                  <span class="d-flex align-center gap-2">
                    <span class="notification-icon" v-html="icons.calendar" />
                    <small class="text-grey">{{
                      useDateTimeFormatter(item.created_at, { format: 'date' })
                    }}</small>
                  </span>
                  <span class="d-flex align-center gap-2">
                    <span class="notification-icon" v-html="icons.clock" />
                    <small class="text-grey">{{
                      useDateTimeFormatter(item.created_at, { format: 'time' })
                    }}</small>
                  </span>
                </div>
              </v-list-item-content>
            </v-list-item>
          </template>
        </div>

        <v-list-item v-if="notificationsStore.isLoading || notificationsStore.isMarkingRead">
          <v-list-item-title class="text-center">
            <v-progress-circular indeterminate color="primary" size="24" />
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="
            !notificationsStore.hasMore &&
            !notificationsStore.isEmpty &&
            !notificationsStore.isLoading
          "
        >
          <v-list-item-title class="text-center">
            {{ $t('no_more_notifications') }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useNotificationsStore } from '../stores/useNotificationsStore'
import { useRouter } from 'vue-router'
import { useScroll } from '@vueuse/core'
import moment from 'moment'
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter'
import { useLocale } from 'vuetify'
const { current } = useLocale()

const notificationsStore = useNotificationsStore()
const router = useRouter()
const scrollContainer = ref(null)

const { y } = useScroll(scrollContainer)

watch(y, (scrollY) => {
  if (!scrollContainer.value) return
  const el = scrollContainer.value.$el || scrollContainer.value
  const scrollBottom = el.scrollTop + el.clientHeight
  const scrollThreshold = el.scrollHeight - 20

  if (scrollBottom >= scrollThreshold && !notificationsStore.isLoading) {
    notificationsStore.fetchNotifications()
  }
})

async function handleNotificationClick(notification) {
  if (notification.page) {
    notificationsStore.markNotificationAsRead(notification.id)
    if (notification.page) {
      router.push(notification.page)
    }
  }
}

const notificationLinksMap = {
  'App\\Models\\Complaint': '/complaints?tab=complaints&is_modal=true',
  'App\\Models\\Appointment': '/appointments?tab=all&is_modal=true',
  'App\\Models\\Blog': '/articals?tab=blogs&is_modal=true'
}

const groupedNotifications = computed(() => {
  const groups = {
    today: [],
    yesterday: [],
    older: []
  }

  notificationsStore.notifications.forEach((item) => {
    const createdAt = moment(item.created_at)
    item.page = `${notificationLinksMap[item.type]}&id=${item.type_id}`
    if (createdAt.isSame(moment(), 'day')) {
      groups.today.push(item)
    } else if (createdAt.isSame(moment().subtract(1, 'day'), 'day')) {
      groups.yesterday.push(item)
    } else {
      groups.older.push(item)
    }
  })

  return groups
})
</script>

<style lang="scss" scoped>
.bg-blue-lighten-5 {
  background-color: #e3f2fd;
}
.text-grey {
  color: #777;
}
.notification-icon {
  width: 20px;
  height: 20px;
  svg {
    width: 100%;
    height: 100%;
  }
}
.group-title {
  font-size: 0.75rem;
  font-weight: 600;
}
.scroll-container {
  height: 400px;
  overflow-y: auto;
}
</style>
