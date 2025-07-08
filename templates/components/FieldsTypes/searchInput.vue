<template lang="">
  <v-text-field
    :dirty="dirty"
    :placeholder="placeholder"
    hide-details="true"
    prepend-inner-icon="mdi-magnify"
    class="rounded-pill"
    :clearable="clearable"
    @keyup="passingSearchValue"
  />
</template>
<script setup>
const props = defineProps({
  dirty: Boolean,
  placeholder: String,
  clearable: Boolean
})

const emit = defineEmits(['searchValue'])
const passingSearchValue = (event) => emit('searchValue', event.target.value)
</script>
