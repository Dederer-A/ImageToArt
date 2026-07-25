<script setup lang="ts">
import { useViewport } from '@/composables/useViewport';

withDefaults(
  defineProps<{
    src?: string;
  }>(),
  {
    src: '',
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const { transform } = useViewport(); // viewport,
</script>

<template>
  <main class="absolute inset-0 overflow-hidden bg-background select-none touch-manipulation" @click="emit('click')">
    <!-- Viewport -->
    <div
      ref="viewport"
      :style="transform"
      class="absolute inset-0 flex items-center justify-center origin-center will-change-transform"
    >
      <img
        v-if="src"
        :src="src"
        alt="Image"
        draggable="false"
        class="max-h-full max-w-full object-contain pointer-events-none"
      />

      <!--
        Perspective Grid
        Crop Rectangle
        Measurement Lines
        ...
      -->
      <slot name="viewport-overlay" />
    </div>

    <!--
      Screen-space overlay.
      Not affected by viewport transforms.
    -->
    <div class="absolute inset-0 pointer-events-none">
      <slot name="screen-overlay" />
    </div>
  </main>
</template>
