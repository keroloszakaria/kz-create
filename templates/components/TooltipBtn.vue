<template>
  <span class="v-app-tooltip-btn d-inline-block">
    <v-btn :aria-label="path" :variant="variant" v-bind="$attrs" :icon="!!btnIcon">
      <slot v-if="$slots.icon" name="icon" />

      <v-icon v-else :icon="icon" />

      <v-tooltip
        v-if="path"
        activator="parent"
        class="v-app-tooltip-btn__content"
        location="bottom"
        open-delay="200"
      >
        {{ t(path) }}
      </v-tooltip>
    </v-btn>
  </span>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  icon: String,
  path: String,
  btnIcon: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'text',
  },
});

const { t } = useI18n();
</script>
