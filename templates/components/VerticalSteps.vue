<template lang="">
  <div class="steps flex flex-col align-start">
    <div class="flex align-center gap-2" v-for="(step, index) in steps" :key="index">
      <div
        class="icon"
        :class="{ active: step.is_active }"
        v-if="step.is_active"
        v-html="icons.check"
      ></div>
      <div class="icon" v-else>{{ index >= 9 ? index + 1 : `0${index + 1}` }}</div>
      <h2>{{ step.title }}</h2>
      <div class="flex align-center gap-5">
        <div class="detail flex align-center gap-2">
          <div class="flex align-center" v-html="icons.clock"></div>
          <p>{{ step.time }}</p>
        </div>
        <div class="detail flex align-center gap-2">
          <div class="flex align-center" v-html="icons.calendar"></div>
          <p>{{ step.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  steps: Array
})
</script>
<style lang="scss" scoped>
.steps {
  display: flex;
  flex-direction: column;
  gap: 50px;
  > div {
    &:not(:first-child) {
      .icon {
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          top: -52px;
          width: 1px;
          height: 60px;
          background-color: rgba(var(--v-theme-primary), 1);
          z-index: -1;
        }
      }
    }
  }
}
.icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(var(--v-theme-primary), 1);
  background-color: rgba(var(--v-theme-dark_25), 1);
  font-weight: 500;
  font-size: 14px;
  color: #242e39;
  &.active {
    background: rgba(var(--v-theme-primary), 1);
    color: #ffffff;
  }
}
h2 {
  font-weight: 500;
  font-size: 1rem;
  color: #000000;
}
.detail {
  div {
    color: #475467;
  }
  p {
    font-size: 14px;
    color: #000000;
  }
}
</style>
