<template>
  <v-skeleton-loader :type="type"></v-skeleton-loader>
</template>
<script setup>
defineProps({
  type: String,
});
</script>
<style lang="scss" scoped></style>
