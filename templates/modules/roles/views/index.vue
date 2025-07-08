<template>
  <div>
    <v-card class="">
      <teleport to="#teleported-items" v-if="isRendered">
        <div class="flex items-center gap-2">
          <router-link class="text-decoration-none" :to="`/roles/add`">
            <Button
              :icon="icons.plus"
              iconPosition="right"
              :title="$t('add_item', { item: $t('role') })"
              type="primary teleport"
            />
          </router-link>
        </div>
      </teleport>

      <v-row>
        <v-col v-for="role in rolesStore.items" :key="role.id" lg="3" md="4" cols="12">
          <RoleCard :item="role" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RoleCard from '../components/RoleCard.vue'
import { useRolesStore } from '../stores/roles'
import { usePermissionsStore } from '../stores/permissions'
import { useI18n } from 'vue-i18n'
import { useBreadCrumbStore } from '@/stores/breadCrumb'
import { useTeleport } from '@/composables/useTeleport'
const { isRendered } = useTeleport('teleported-items')

const { t } = useI18n()
const rolesStore = useRolesStore()
const permissionsStore = usePermissionsStore()
const isLoading = ref(true)
const { setBreadcrumbs } = useBreadCrumbStore()
setBreadcrumbs([
  { title: t('dashboard'), disabled: false, to: '/' },
  { title: t('roles'), disabled: true, to: '' }
])
await Promise.all([permissionsStore.getAll({ params: {} })])

const getItems = async (value) => {
  await rolesStore.getAll({ params: value })
  isLoading.value = false
}

getItems()
</script>

<style lang="scss" scoped></style>
