<template>
  <div class="actions">
    <v-tooltip v-for="action in actions" :key="action.name" :text="$t(action.name)" location="top">
      <template v-slot:activator="{ props }">
        <Button
          :type="getClass(action.name)"
          v-permission="action.permissions"
          v-bind="props"
          @click="handleAction(action.name, item, action.link)"
          :icon="getIcon(action.name)"
        />
      </template>
    </v-tooltip>
    <slot></slot>
  </div>
</template>

<script setup>
import { icons } from '@/plugins/icons'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  actions: {
    type: Array,
    required: true
  },
  editLink: {
    type: String,
    default: ''
  },
  viewLink: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'edit',
  'view',
  'block',
  'restore',
  'cancel',
  'forceDelete',
  'fastAction',
  'unblock',
  'delete',
  'barcode'
])

const handleAction = (actionName, item, link = '') => {
  if (actionName == 'edit') link !== '' ? router.push({ path: props.editLink }) : emit('edit', item)
  else if (actionName == 'view')
    link !== '' ? router.push({ path: props.viewLink }) : emit('view', item)
  else emit(actionName, item)
}

const getIcon = (actionName) => {
  const iconsList = {
    view: icons.ViewIcon,
    edit: icons.EditIcon,
    cancel: icons.cross_circle,
    delete: icons.DeleteIcon,
    restore: icons.RestoreIcon,
    forceDelete: icons.DeleteIcon,
    unblock: icons.unblockIcon,
    barcode: icons.ScanQR
  }
  return iconsList[actionName] || ''
}

const getClass = (actionName) => {
  const classes = {
    view: 'table-icon view',
    cancel: 'table-icon cancel',
    edit: 'table-icon edit',
    block: 'table-icon block',
    delete: 'table-icon delete',
    restore: 'table-icon restore',
    forceDelete: 'table-icon delete',
    fastAction: 'table-icon restore',
    unblock: 'table-icon unblock',
    barcode: 'table-icon restore'
  }
  return classes[actionName] || ''
}
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;

  .v-btn {
    padding: 8px 7px;
    border-radius: 8px;
    height: 36px;
    width: 34px;
    box-shadow: none;
    min-width: unset;

    :deep() {
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  &__restore {
    border: 1px solid #e5dfff;
    color: rgba(var(--v-theme-primary), 1);
  }

  &__edit {
    border: 1px solid #e5dfff;
    color: rgba(var(--v-theme-primary), 1);
  }
  &__unblock {
    border: 1px solid #e5dfff;
    color: rgba(var(--v-theme-primary), 1);
  }

  &__view {
    border: 1px solid #cae8f4;
    color: rgba(var(--v-theme-primary), 1);
  }

  &__delete {
    border: 1px solid #fecdca;
    color: rgba(var(--v-theme-error), 1);
  }

  &__cancel {
    border: 1px solid #fecdca;
    color: rgba(var(--v-theme-error), 1);
  }
}
</style>
