<template>
  <div class="side" :style="backgroundStyle">
    <!-- Background Video -->
    <video class="background-video" v-if="video" autoplay muted loop>
      <source :src="video" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Auth Background -->
    <div class="auth-bg" :class="{ transparent: video || bgImage }">
      <!-- Background Image -->
      <img v-if="img" :src="img" style="width: 100%; max-width: 100%" />
      <v-img
        :src="appLogo.large"
        @error="onError('large')"
        height="56"
        width="107"
        class="!max-h-[56px] w-[107px]"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <!-- Content Section -->
      <div class="content">
        <h1 v-if="title">{{ $t(title) }}</h1>
        <p v-if="desc">{{ $t(desc) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLogo } from "@/composables/useLogo";

const { appLogo, onError } = useLogo();

const props = defineProps({
  title: String,
  desc: String,
  video: String,
  bgImage: String,
  img: String,
});

// Dynamic background style
const backgroundStyle = computed(() => {
  if (props.bgImage && !props.video) {
    return {
      backgroundImage: `url(${props.bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "bottom",
    };
  }
  return {};
});
</script>

<style scoped lang="scss">
.side {
  position: relative;
  max-height: calc(100vh - 24px * 2);
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(4px);
    z-index: 2;
  }
}
.background-video {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  z-index: 1;
}

.auth-bg {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  padding: 3rem 3rem;
  gap: 1.5rem;
  z-index: 2;
  color: rgba(var(--v-theme-dark_white), $alpha: 1);
  &.transparent {
    background: transparent;
  }

  img {
    max-width: 592px !important;
    max-height: 557px;
    height: 60vh;
    object-fit: contain;
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;
  }
  h1 {
    font-weight: 500;
    font-size: 1.5rem;
    color: rgba(var(--v-theme-dark_bg), 1);
  }
  p {
    text-align: center;
    max-width: 480px;
    font-size: 1rem;
    font-weight: 500;
    color: rgba(var(--v-theme-dark_700), 1);
  }
}
</style>
