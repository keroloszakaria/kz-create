<template>
  <v-col :cols="card?.size.cols ?? '12'" :md="card?.size?.md ?? '6'" :lg="card?.size?.lg ?? '3'">
    <v-card class="stats-card">
      <div class="stat_item d-flex">
        <div class="mark text-primary">
          <CardEdge />
        </div>
        <div class="item w-100 d-flex align-center px-3">
          <VAvatar color="primary" variant="tonal" id="avatar" size="55" class="me-3">
            <span v-html="getCardIcon(card?.key)" />
          </VAvatar>

          <div class="d-flex flex-column">
            <h5 class="font-weight-bold">{{ card?.label }}</h5>
            <h4 class="font-weight-bold">
              {{ useNumberConverter(card?.value) }}
            </h4>
          </div>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import CardEdge from '../assets/cardEdge.svg'
import { icons } from '@/plugins/icons'
import { useNumberConverter } from '@/composables/useNumberConverter.js'
import { useI18n } from 'vue-i18n'
const props = defineProps({
  card: Object,
  title: String
})

const { locale } = useI18n()

const getCardIcon = (key) => {
  if (key.includes('count')) return icons.Licenses
  else if (key.includes('visitor')) return icons.UserIcon
}
</script>

<style lang="scss" scoped>
.stats-card {
  border-radius: 12px;
  border-color: rgba(var(--v-theme-dark_white), 1) !important;
  .stat_item {
    position: relative;
    z-index: 1;
    min-height: 95px;
    border-radius: 12px;

    box-shadow:
      0 1px 3px 0 rgba(16, 24, 40, 0.1),
      0 1px 2px 0 rgba(16, 24, 40, 0.06);

    &:before {
      content: '';
      position: absolute;
      z-index: -1;
      top: -16px;
      left: -16px;
      background: rgba(var(--v-theme-primary));
      height: 32px;
      width: 32px;
      border-radius: 32px;
      transform: scale(1);
      transform-origin: 50% 50%;
      transition: all 0.25s ease-in-out;
    }

    #avatar {
      background-color: #fff !important;
    }

    h4,
    h5 {
      transition-delay: 0.1s;
    }

    &:hover {
      &:before {
        transform: scale(50);
      }

      .item {
        h4,
        h5 {
          color: #fff;
        }
      }
    }

    h2 {
      font-weight: bolder;
    }

    .item {
      border-radius: 12px;
    }

    .mark {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 0;
    }
  }
}
</style>
