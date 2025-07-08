<template>
  <Suspense>
    <slot></slot>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script setup>
import Loading from '@/components/common/Loading.vue'
</script>

<style lang="scss" scoped>
.loader-parent {
  height: 200px;
  .loader {
    width: 100px;
    height: 100px;
    border: 10px solid #fff;
    border-bottom-color: rgba(var(--v-theme-primary), 1);
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
