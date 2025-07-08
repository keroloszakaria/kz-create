<template>
  <teleport to="#teleported-items" v-if="isRendered">
    <div class="flex gap-4">
      <Button
        :title="$t('edit_item')"
        type="close"
        @click="$router.push(`/roles/edit-role/${$route.params.id}`)"
      />
      <Button @click="deleteRow($route.params.id)" :title="$t('delete')" type="danger" />
    </div>
  </teleport>

  <AddEditRole
    @submit="submitForm"
    :buttonName="$t('view_item')"
    :isView="true"
    :isCreate="false"
  />
</template>

<script setup></script>

<script setup>
import AddEditRole from '../components/AddEditRole.vue'
import { useRolesStore } from '../stores/roles'
import { useBreadCrumbStore } from '@/stores/breadCrumb'
import { handleErrors } from '@/utils/formDataHandler'
import { useTeleport } from '@/composables/useTeleport'
import { confirmDelete, showAlert } from '@/composables/useAlert'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isRendered } = useTeleport('teleported-items')
const { setBreadcrumbs } = useBreadCrumbStore()
const rolesStore = useRolesStore()
const submitForm = async (form) => {
  const { errors } = await rolesStore.updateRow(form.data, true)
  if (errors) handleErrors(form.schema, errors)
}

const deleteRow = (id) => {
  confirmDelete(`${t('ALERTS.DELETE')} ${id}`).then((result) => {
    if (result) rolesStore.deleteRow(id, true)
  })
}

setBreadcrumbs([
  {
    title: t('dashboard'),
    disabled: false,
    to: '/'
  },
  {
    title: t('roles'),
    disabled: false,
    to: '/roles'
  },
  {
    title: t('view_item', { item: t('role') }),
    disabled: true,
    to: ''
  }
])
</script>

<style lang="scss" scoped></style>
