<template>
  <router-link
    :to="`/roles/view-role/${item.id}`"
    class="flex flex-col h-full gap-3 border-1 !border-[#EBF0F7] shadow-[0px_4px_20px_0px_#00000008] rounded-[12px] !px-[16px] !py-[20px] bg-dark_white"
  >
    <div class="flex flex-col gap-2 w-100">
      <div class="flex gap-1">
        <div class="flex flex-col gap-1 flex-1">
          <v-tooltip :text="item.translation_display_name" location="top">
            <template v-slot:activator="{ props }">
              <h3
                v-bind="props"
                class="w-fit font-[500] text-[14px] text_text_600 ellipsis line-clamp-1"
              >
                {{ item.translation_display_name }}
              </h3>
            </template>
          </v-tooltip>

          <p class="text-[10px] font-[500] text-dark_700">
            {{ useDateTimeFormatter(item.created_at, { format: 'date' }) }}
          </p>
        </div>
        <badge
          :label="item.is_active ? $t('active') : $t('inactive')"
          :type="item.is_active ? 'success' : 'danger'"
        />
      </div>
      <v-tooltip :text="item.translation_description" location="top">
        <template v-slot:activator="{ props }">
          <h3
            v-bind="props"
            class="w-fit h-[14px] text-[10px] font-[400] text-dark_700 ellipsis line-clamp-1"
          >
            {{ item.translation_description }}
          </h3>
        </template>
      </v-tooltip>
    </div>
    <ul class="flex">
      <li
        v-for="(user, index) in item.users"
        :key="user.id"
        :class="`z-[${index}]`"
        class="rounded-full border-1 border-dark_white overflow-hidden w-[20px] h-[20px] [&:not(:first-of-type)]:!ms-[-8px]"
      >
        <img :src="user.avatar" :alt="user.name" />
      </li>
      <li
        v-if="item.users.length - item.users_count"
        class="text-[10px] flex justify-center items-center bg-dark_100 !p-[3px] rounded-full border-1 border-dark_white !ms-[-8px] overflow-hidden w-[20px] h-[20px]"
      >
        {{ item.users.length - item.users_count }}+
      </li>
      <li v-if="!item.users.length" class="flex justify-center items-center gap-2">
        <span
          class="flex justify-center items-center rounded-full border-1 border-dark_white overflow-hidden w-[20px] h-[20px]"
          v-html="icons.profile"
        ></span>
        <p class="text-dark_700 text-[10px]">{{ $t('no_user') }}</p>
      </li>
    </ul>
  </router-link>
</template>

<script setup>
import Badge from '@/components/common/Badge.vue'
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter'
defineProps({ item: Object })
</script>

<style lang="scss" scoped>
.border-dark_white {
  border: 1px solid rgba(var(--v-theme-dark_white), 1) !important;
}
</style>
