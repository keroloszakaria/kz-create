import { defineStore } from "pinia";
import { ref, computed } from "vue";
import echo from "../plugins/echo";
import { httpRequest } from "@/services/api";
import moment from "moment";
import notificationSound from "../assets/sounds/notification.mp3";

export const useNotificationsStore = defineStore("notifications", () => {
  const notifications = ref([]);
  const unOpened = ref(0);
  const isLoading = ref(false);
  const isMarkingOpened = ref(false);
  const isMarkingRead = ref(false);
  const hasMore = ref(true);
  const page = ref(1);
  const perPage = 10;
  const nextPageUrl = ref(null);
  const channelName = ref("");
  const currentLocale = localStorage.getItem("locale");

  const isEmpty = computed(() => notifications.value.length === 0);

  async function fetchNotifications() {
    if (isLoading.value || !hasMore.value) return;

    isLoading.value = true;
    try {
      const response = await httpRequest(
        `/notifications?page=${page.value}&pageSize=${perPage}`
      );
      const notificationsData = response?.data?.notifications?.data || [];
      const newNextPageUrl = response?.data?.notifications?.next_page_url;

      if (notificationsData.length) {
        notifications.value.push(...notificationsData);
        unOpened.value = response?.data?.count || unOpened.value;
        page.value++;
        nextPageUrl.value = newNextPageUrl;
        if (!nextPageUrl.value) {
          hasMore.value = false;
        }
      } else {
        hasMore.value = false;
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function markNotificationAsRead(notificationId) {
    isMarkingRead.value = true;
    try {
      await httpRequest(`/notifications`, {
        method: "PUT",
        data: {
          action: "read",
          ids: [notificationId],
        },
      });
      const notification = notifications.value.find(
        (n) => n.id === notificationId
      );
      if (notification && !notification.read_at) {
        notification.read_at = moment().toISOString();
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      isMarkingRead.value = false;
    }
  }

  async function markAllNotificationsAsOpened() {
    isMarkingOpened.value = true;
    try {
      await httpRequest(`/notifications`, {
        method: "PUT",
        data: {
          action: "open",
        },
      });
      unOpened.value = 0;
    } catch (error) {
      console.error("Failed to mark notifications as opened", error);
    } finally {
      isMarkingOpened.value = false;
    }
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => {
      n.read_at = moment().toISOString();
    });
    unOpened.value = 0;
  }

  function setChannel(name) {
    channelName.value = name;
    listen();
  }

  function removeChannel() {
    if (!channelName.value || !echo) return;
    try {
      echo.leave(channelName.value);
      channelName.value = null;
    } catch (error) {
      console.error("Error removing channel:", error);
      channelName.value = null;
    }
  }

  function resetNotifications() {
    notifications.value = [];
    unOpened.value = 0;
    page.value = 1;
    nextPageUrl.value = null;
    hasMore.value = true;
  }

  function listen() {
    if (!channelName.value) return;
    echo.channel(channelName.value).listen(".notification.event", (e) => {
      const notification = {
        ...e,
        title: e.title[currentLocale],
        message: e.message[currentLocale],
      };
      if (notification) {
        notifications.value.unshift(notification);
        new Audio(notificationSound).play();
        unOpened.value++;
      }
    });
  }

  return {
    notifications,
    unOpened,
    isLoading,
    isMarkingOpened,
    isMarkingRead,
    isEmpty,
    hasMore,
    nextPageUrl,
    fetchNotifications,
    setChannel,
    markNotificationAsRead,
    markAllNotificationsAsOpened,
    markAllAsRead,
    removeChannel,
    resetNotifications,
  };
});
