<template lang="">
  <div>
    <v-chip :color="type" :class="[type, classList]" label small>
      <span v-if="icon" class="icon" v-html="icon"></span>
      <span>{{ label }}</span>
    </v-chip>
  </div>
</template>
<script setup>
defineProps({
  label: String,
  classList: String,
  type: {
    type: String,
    default: 'primary',
    validator(value) {
      return ['primary', 'success', 'danger', 'warning', 'icon', 'info'].includes(value)
    }
  },
  icon: String
})
</script>
<style lang="scss" scoped>
:deep() {
  .v-chip {
    &.success {
      --bg: rgba(var(--v-theme-success_50), 1);
      --fontColor: rgba(var(--v-theme-success_600), 1);
    }
    &.primary {
      --bg: #f0f9ff;
      --fontColor: #026aa2;
    }
    &.primarybtn {
      --bg: rgba(var(--v-theme-primary), 1);
      --fontColor: #fff;
    }
    &.danger {
      --bg: rgba(var(--v-theme-danger_50), 1);
      --fontColor: rgba(var(--v-theme-danger_600), 1);
    }
    &.warning {
      --bg: rgba(var(--v-theme-warning_50), 1);
      --fontColor: rgba(var(--v-theme-warning_600), 1);
    }
    &.icon {
      --bg: #eff8ff;
      --fontColor: #101828;
    }
    &.info {
      --bg: rgba(var(--v-theme-info_50), 1);
      --fontColor: rgba(var(--v-theme-info_600), 1);
    }
    &.check {
      .icon {
        color: #11044c;
      }
    }
    &.uncheck {
      .icon {
        color: #d92d20;
      }
    }
    border-radius: 24px;
    // border: 1px solid var(--borderColor);
    background-color: var(--bg);
    padding: 0;
    height: 24px;
    &__content {
      padding: 0 12px;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 7px;

      span {
        color: var(--fontColor);
      }
    }
  }
}
</style>
