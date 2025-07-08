<template>
  <div class="loading">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
</template>

<script setup></script>

<style lang="scss" scopped>
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .v-progress-circular {
    width: 50px !important;
    height: 50px !important;
  }
}
</style>
