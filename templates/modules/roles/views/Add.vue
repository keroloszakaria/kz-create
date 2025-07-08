<template>
  <teleport to="#teleported-items" v-if="isRendered">
    <div class="flex gap-4">
      <Button @click="$router.push('/roles')" :title="$t('cancel')" type="close" />
      <Button :isLoading="rolesStore.isLoading" form="myForm" :title="$t('add')" action="submit" />
    </div>
  </teleport>
  <AddEditRole @submit="submitForm" :buttonName="$t('add_item')" :isCreate="true" />
</template>

<script setup></script>

<script setup>
import AddEditRole from '../components/AddEditRole.vue'
import { useRolesStore } from '../stores/roles'
const rolesStore = useRolesStore()
import { useBreadCrumbStore } from '@/stores/breadCrumb'
const { setBreadcrumbs } = useBreadCrumbStore()
import { handleErrors } from '@/utils/formDataHandler'
import { useTeleport } from '@/composables/useTeleport'
const { isRendered } = useTeleport('teleported-items')
const submitForm = async (form) => {
  const { errors } = await rolesStore.createRow(form.data, true)
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
    title: t('add_item', { item: t('role') }),
    disabled: true,
    to: ''
  }
])
</script>

<style lang="scss" scoped></style>
