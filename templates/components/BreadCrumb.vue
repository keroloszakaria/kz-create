<template>
  <section class="pb-3">
    <div class="d-flex align-center justify-space-between">
      <div>
        <h3 v-if="BreadcrumbItems.length">
          {{ BreadcrumbItems[BreadcrumbItems.length - 1].title }}
        </h3>
        <v-breadcrumbs
          density="compact"
          :items="BreadcrumbItems"
          color="primary"
          class="px-0 py-0"
          v-if="BreadcrumbItems.length > 1"
        >
          <template v-slot:title="{ item }">
            {{ item.title }}
          </template>
          <template v-slot:divider>
            <v-icon :class="currentLang" icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </div>
      <div id="teleported-items"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import storage from "@/composables/useStorage";
import { useBreadCrumbStore } from "@/stores/breadCrumb";
const breadCrumbStore = useBreadCrumbStore();

const BreadcrumbItems = computed(() => breadCrumbStore.breadCrumb);
const lang = ref(storage.get("locale"));

watch(
  () => storage.get("locale"),
  (newVal) => {
    lang.value = newVal;
  }
);

const currentLang = computed(() => lang.value);
</script>

<style lang="scss" scoped>
:deep() {
  .v-icon.ar {
    transform: rotate(180deg);
  }
  .v-icon.en {
    transform: rotate(0deg);
  }
}

h3 {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 32px;
  color: rgba(var(--v-theme-primary_900), 1) !important;
}

.v-breadcrumbs {
  font-size: 14px;
  &__item {
    font-size: 12px;
  }
}

:deep() {
  .v-breadcrumbs-item {
    color: rgba(var(--v-theme-dark_400), 1) !important;
  }

  .v-breadcrumbs-item--disabled {
    opacity: 1;
    color: rgba(var(--v-theme-dark_bg), 1) !important;
  }
}
</style>
