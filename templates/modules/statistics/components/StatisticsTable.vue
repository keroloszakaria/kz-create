<template>
  <v-col :cols="table?.size.cols ?? '12'" :md="table?.size?.md ?? '6'" :lg="table?.size?.lg ?? '3'">
    <v-card class="flex flex-col gap-3">
      <h4>{{ table.title }}</h4>
      <Table
        :headers="table.columns"
        :items="table.data"
        :showSelect="false"
        :showHeader="false"
        :hidePagination="true"
        :showHeaderBtns="false"
        :showTrashed="false"
      />
    </v-card>
  </v-col>
</template>

<script setup>
import Table from '@/components/common/Table/index.vue'

defineProps({
  table: {
    type: Object,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped>
.v-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;

  h4 {
    font-size: 1.1rem;
    font-weight: 500;
  }
}
</style>
