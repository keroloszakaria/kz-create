<template>
  <div class="demo">
    <div class="before"></div>
    <div class="beta-badge d-none d-md-block">
      <span>{{ $t('demo') }}</span>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.demo {
  .before {
    content: '';
    position: absolute;
    inset-inline-start: 19px;
    top: -6px;
    transform: rotate(63deg);
    border-right: 6px solid rgba(var(--v-theme-primary), 1);
    border-left: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-top: 6px solid rgba(var(--v-theme-primary), 1);
  }
  .beta-badge {
    width: 54px;
    min-width: 50px;
    height: 60px;
    position: absolute;
    background-color: rgba(var(--v-theme-primary), 1);
    inset: -8px 22px;
    z-index: 99999;
    &::before {
      content: '';
      position: absolute;
      bottom: -26px;
      left: 50%;
      transform: translateX(-50%);
      height: 0;
      z-index: -1;
      border-left: 27px solid transparent;
      border-right: 27px solid transparent;
      border-top: 27px solid rgba(var(--v-theme-primary), 1);
    }

    span {
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;
      justify-content: center;
      color: #fff;
      font-weight: 500;
      font-size: 14px;
      margin-top: 8px;
      text-align: center;
    }
  }
}
</style>
