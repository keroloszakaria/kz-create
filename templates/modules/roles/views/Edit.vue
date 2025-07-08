<template>
  <teleport to="#teleported-items" v-if="isRendered">
    <div class="flex gap-4">
      <Button @click="$router.push('/roles')" :title="$t('cancel')" type="close" />
      <Button :isLoading="rolesStore.isLoading" form="myForm" :title="$t('save')" action="submit" />
    </div>
  </teleport>

  <AddEditRole @submit="submitForm" :buttonName="$t('edit_item')" :isCreate="false" />
</template>

<script setup></script>

<script setup>
import AddEditRole from '../components/AddEditRole.vue'
import { useRolesStore } from '../stores/roles'
import { useBreadCrumbStore } from '@/stores/breadCrumb'
import { handleErrors } from '@/utils/formDataHandler'
import { useTeleport } from '@/composables/useTeleport'
const { isRendered } = useTeleport('teleported-items')
const { setBreadcrumbs } = useBreadCrumbStore()
const rolesStore = useRolesStore()
const submitForm = async (form) => {
  const { errors } = await rolesStore.updateRow(form.data, true)
  if (errors) handleErrors(form.schema, errors)
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
    title: t('edit_item', { item: t('role') }),
    disabled: true,
    to: ''
  }
])
</script>

<style lang="scss" scoped></style>
