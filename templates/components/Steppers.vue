<template>
  <v-stepper v-model="step">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <template v-for="item in steps" :key="item.key">
          <v-stepper-item
            :title="item?.title"
            :subtitle="item?.subtitle"
            :value="item.id"
            :complete="currentStep > item.id"
          ></v-stepper-item>
        </template>
      </v-stepper-header>
      <v-divider></v-divider>
      <v-stepper-window>
        <v-stepper-window-item v-for="item in steps" :key="item.id" :value="item.id">
          <slot :name="item.key" />
        </v-stepper-window-item>
      </v-stepper-window>
      <v-stepper-actions v-if="!hideActions">
        <template #prev>
          <Button type="close" @click="prev" title="الغاء" />
        </template>
        <template #next>
          <Button @click="next" title="التالي" />
        </template>
      </v-stepper-actions>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue'
import Button from '@/components/common/Button.vue'

const step = ref(0) // Start from 0 for the first step

const props = defineProps({
  steps: {
    type: Array,
    required: true
  },
  hideActions: {
    type: Boolean,
    default: false
  },
  currentStep: {
    type: Number,
    default: 0
  }
})

// Update local step when prop changes
watch(
  () => props.currentStep,
  (newStep) => {
    step.value = newStep
  }
)
</script>

<style lang="scss" scoped>
.v-stepper.v-sheet {
  border: none !important;
  border-radius: unset !important;
}
.v-stepper-header {
  justify-content: flex-start !important;
  align-items: center;
  gap: 36px;
  box-shadow: none;
  margin-bottom: 20px !important;
  padding: 0 30px;
  flex-wrap: wrap;
}
.v-stepper-actions {
  justify-content: flex-start;
  gap: 1rem;
}
.v-window,
.v-stepper-actions {
  margin: 0;
  padding: 0;
  border-radius: none !important;
}
:deep() {
  .v-stepper-header + hr {
    border: none !important;
  }
  .v-stepper-item {
    position: relative;
    height: 72px;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    background: rgba(var(--v-theme-dark_white), 1);
    border-radius: 12px;
    @media screen and (min-width: 991px) {
      width: 31.3333%;
    }

    &::before {
      content: '';
      position: absolute;
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      border-radius: 10px;
      transition: 0.4s;
      background: rgba(var(--v-theme-dark_white), 1);
    }
    &.v-stepper-item--complete {
      .v-avatar {
        background-color: rgba(var(--v-theme-primary), 1) !important;
        color: rgba(var(--v-theme-dark_25), 1) !important;
        border: none !important;
      }
    }
    &.v-stepper-item--selected {
      border: 2px solid #cae8f4 !important;
      background-color: rgba(var(--v-theme-primary), 1) !important;
      .v-stepper-item__avatar {
        border: 2px solid rgba(var(--v-theme-dark_25), 1) !important;
        color: rgba(var(--v-theme-dark_25), 1);
      }
      .v-stepper-item__title,
      .v-stepper-item__subtitle {
        color: rgba(var(--v-theme-dark_white), 1) !important;
        opacity: 1;
      }
      &::before {
        background-color: rgba(var(--v-theme-primary), 1) !important;
      }
    }
    &__avatar {
      width: 40px !important;
      height: 40px !important;
      border-radius: 50%;
      background-color: transparent !important;
      border: 2px solid #cfd6dc !important;
      color: #abb7c2;
      font-size: 1.1rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &__title,
    &__subtitle {
      color: #abb7c2 !important;
      opacity: 1;
    }
    &__content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 0.2rem;
    }
  }
}
</style>
