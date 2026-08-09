<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';

import { useWorkplaceStore } from '@/workplace';
import { createCarouselAnimator } from './animator';
import { drawImageData } from './canvas';
import { createGestures } from './gestures';

const workplace = useWorkplaceStore();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

// -----------------------------------------------------------------------------
// DOM
// -----------------------------------------------------------------------------

const trackRef = ref<HTMLDivElement>();
const originalCanvasRef = ref<HTMLCanvasElement>();
// const rulersSvgRef = ref<SVGSVGElement>();

const variantCanvasMap = new Map<number, HTMLCanvasElement>();

function registerVariantCanvas(index: number, element: unknown) {
  if (!(element instanceof HTMLCanvasElement)) {
    variantCanvasMap.delete(index);
    return;
  }

  variantCanvasMap.set(index, element);

  const imageData = workplace.variantImageDataByIndex(index);
  if (imageData) {
    drawImageData(element, imageData);
  }
}

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

let viewportWidth = ref(0);
let viewportHeight = ref(0);

function updateViewportSize() {
  viewportWidth.value = window.innerWidth;
  viewportHeight.value = window.innerHeight;
}

// -----------------------------------------------------------------------------
// Animator
// -----------------------------------------------------------------------------

const animator = createCarouselAnimator({
  onPosition(position) {
    if (!trackRef.value) return;

    trackRef.value.style.transform = `translate3d(${-position * viewportWidth.value}px, 0, 0)`;
  },
});

const gestures = createGestures({
  animator,

  getCurrentIndex: () => workplace.currentVariantIndex,

  getVariantCount: () => workplace.allVariants.length,

  getViewportWidth: () => viewportWidth.value,

  setCurrentIndex: workplace.setCurrentVariantIndex,

  setOriginalOpacity(opacity) {
    if (originalCanvasRef.value) {
      originalCanvasRef.value.style.opacity = opacity.toString();
    }
  },

  onTap() {
    emit('click');
  },
});

// -----------------------------------------------------------------------------
// Rendering
// -----------------------------------------------------------------------------

function redrawVariants() {
  for (let i = 0; i < workplace.allVariants.length; i++) {
    const canvas = variantCanvasMap.get(i);
    if (!canvas) continue;

    const imageData = workplace.variantImageDataByIndex(i);

    if (imageData) {
      drawImageData(canvas, imageData);
    }
  }
}

function redrawOriginal() {
  if (!originalCanvasRef.value) return;

  drawImageData(originalCanvasRef.value, workplace.currentSourceImageData);
}

// -----------------------------------------------------------------------------
// Watches
// -----------------------------------------------------------------------------

watch(
  () => workplace.allVariants,
  async () => {
    await nextTick();
    redrawVariants();
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => workplace.currentSourceImageData,
  () => {
    redrawOriginal();
  },
  {
    immediate: true,
  }
);

watch(
  () => workplace.currentVariantIndex,
  (index) => {
    animator.animateTo(index);
  },
  {
    immediate: true,
  }
);

// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------

function onResize() {
  updateViewportSize();
  animator.jumpTo(workplace.currentVariantIndex);
}

onMounted(() => {
  updateViewportSize();

  window.addEventListener('resize', onResize);

  redrawVariants();
  redrawOriginal();

  animator.jumpTo(workplace.currentVariantIndex);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  animator.dispose();
});
</script>

<template>
  <main
    @pointerdown="gestures.pointerDown"
    @pointermove="gestures.pointerMove"
    @pointerup="gestures.pointerUp"
    @pointercancel="gestures.pointerCancel"
    class="absolute inset-0 overflow-hidden bg-background select-none touch-manipulation"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div ref="trackRef" class="absolute inset-0 flex will-change-transform">
        <div
          v-for="(_, index) in workplace.allVariants"
          :key="workplace.allVariants[index].id"
          class="relative shrink-0 overflow-hidden"
          :style="{
            width: viewportWidth + 'px',
            height: viewportHeight + 'px',
          }"
        >
          <canvas
            v-if="
              index === workplace.currentVariantIndex ||
              index === workplace.currentVariantIndex - 1 ||
              index === workplace.currentVariantIndex + 1
            "
            :ref="(el) => registerVariantCanvas(index, el)"
            class="absolute left-1/2 top-1/2 block max-h-full max-w-full"
            style="transform: translate(-50%, -50%)"
          />
        </div>
      </div>

      <canvas
        ref="originalCanvasRef"
        class="pointer-events-none absolute left-1/2 top-1/2 block max-h-full max-w-full"
        style="transform: translate(-50%, -50%); opacity: 0"
      />
      <!--
      <svg
        ref="rulersSvgRef"
        class="pointer-events-none absolute left-1/2 top-1/2 block max-h-full max-w-full overflow-visible"
        style="transform: translate(-50%, -50%); width: 100%; height: 100%"
      >
        <g stroke="#3b82f6" stroke-width="2">
          <line x1="100" y1="100" x2="300" y2="100" />
          <circle cx="100" cy="100" r="4" fill="#3b82f6" />
          <circle cx="300" cy="100" r="4" fill="#3b82f6" />
        </g>
        <text x="200" y="90" fill="#3b82f6" font-size="12" text-anchor="middle">1.0x (Ref)</text>
      </svg>
    -->
      <slot name="viewport-overlay" />
    </div>

    <div class="pointer-events-none absolute inset-0">
      <slot name="screen-overlay" />
    </div>
  </main>
</template>
