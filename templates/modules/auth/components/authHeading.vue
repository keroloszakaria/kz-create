<template lang="">
  <div class="w-100 flex flex-col gap-2 text-center">
    <h2 class="text-dark_bg !font-[600] text-[1.8rem]" v-if="title">{{ $t(title) }}</h2>
    <p class="text-dark_500 text-[.825rem]" v-if="description">{{ $t(description) }}</p>
    <slot></slot>
  </div>
</template>
<script setup>
defineProps({
  title: String,
  description: String
})
</script>
<style lang=""></style>
