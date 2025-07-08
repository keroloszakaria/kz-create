<template>
  <ul class="list-dark_white d-flex justify-end align-center ga-2 mb-3">
    <li
      v-for="(item, index) in items"
      :key="index"
      :class="{
        activeBg: item.title === type
      }"
      @click="$emit('updateType', item.title)"
    >
      <v-icon
        :color="item.title === type ? 'white' : 'primary'"
        :icon="item.icon"
        size="small"
      ></v-icon>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  type: String
})
const items = [
  { title: 'spline', icon: 'mdi-chart-bell-curve-cumulative' },
  { title: 'column', icon: 'mdi-chart-bar' },
  { title: 'bar', icon: 'mdi-land-rows-horizontal' },
  // { title: 'line', icon: 'mdi-chart-line' },
  { title: 'area', icon: 'mdi-chart-areaspline' },
  { title: 'pie', icon: 'mdi-chart-pie' }
]
</script>

<style lang="scss" scoped>
.list-dark_white {
  border: 2px solid rgba(var(--v-theme-primary), 1);
  border-radius: 10px;
  padding-block: 4px 3px;
  padding-inline: 6px;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    border-radius: 4px;
    padding: 2px 4px;
  }
  .activeBg {
    background-color: rgba(var(--v-theme-primary), 1);
  }
}
</style>
