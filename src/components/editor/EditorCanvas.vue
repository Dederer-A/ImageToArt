<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { useViewport } from '@/composables/useViewport';

// import { debounce } from 'lodash-es';

import { useWorkplaceStore } from '@/workplace/index';

const workplace = useWorkplaceStore();

const originalImageRef = useTemplateRef<HTMLCanvasElement>('originalImageRef');
const displayImageRef = useTemplateRef<HTMLCanvasElement>('displayImageRef');

onMounted(() => {
  console.log('[EditorCanvas] onMounted');
  const imageData = workplace.currentSourceImageData;
  if (imageData) {
    drawToCanvas(imageData, originalImageRef.value!);
    drawToCanvas(imageData, displayImageRef.value!);
  }
});

watch(
  () => workplace.currentSourceImageData,
  (newValue) => {
    // console.log('[EditorCanvas] currentSourceImageData changed');
    drawToCanvas(newValue, originalImageRef.value!);
  }
);

watch(
  () => workplace.currentVariantImageData,
  (newValue) => {
    // console.log('[EditorCanvas] currentVariantImageData changed');
    if (!newValue) return; // TODO display canvas cleanup required here
    drawToCanvas(newValue, displayImageRef.value!);
  }
);

function drawToCanvas(imageData: ImageData | undefined, canvas: HTMLCanvasElement) {
  if (!imageData) return;
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
}

/*
const documentRuntime = useDocumentRuntimeStore();

const debouncedDraw = debounce(() => {
  console.log('[EditorCanvas] debouncedDraw');
  if (displayImageRef.value == null) return;
  ImageEngine.process();
  ImageRenderer.renderImageDataToCanvas(displayImageRef.value);
}, 5);

onUnmounted(() => {
  debouncedDraw.cancel();
});

watch(
  () => documentRuntime.version,
  (_newValue) => {
    debouncedDraw();
  }
);
*/

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const { transform } = useViewport(); // viewport,

const originalOpacity = ref(0);
const HOLD_DELAY = 250;
const OPACITY_DRAG_DISTANCE = 200;
let moved = false;
const CLICK_MOVE_THRESHOLD = 5;

let holdTimer: number | undefined;
let previewMode = false;

let startY = 0;

function onPointerDown(e: PointerEvent) {
  const target = e.currentTarget as HTMLElement;

  target.setPointerCapture(e.pointerId);

  startY = e.clientY;
  previewMode = false;
  moved = false;

  holdTimer = window.setTimeout(() => {
    previewMode = true;
    originalOpacity.value = 1;
  }, HOLD_DELAY);
}

function onPointerMove(e: PointerEvent) {
  const dy = e.clientY - startY;

  if (Math.abs(dy) > CLICK_MOVE_THRESHOLD) {
    moved = true;
  }

  if (!previewMode) return;

  originalOpacity.value = Math.max(0, 1 - Math.max(0, dy) / OPACITY_DRAG_DISTANCE);
}

function onPointerUp(e: PointerEvent) {
  const target = e.currentTarget as HTMLElement;

  if (target.hasPointerCapture(e.pointerId)) {
    target.releasePointerCapture(e.pointerId);
  }

  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = undefined;
  }

  const wasPreview = previewMode;

  previewMode = false;
  originalOpacity.value = 0;

  if (!wasPreview && !moved) {
    emit('click');
  }
}
</script>

<template>
  <main
    class="absolute inset-0 overflow-hidden bg-background select-none touch-manipulation"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div
      ref="viewport"
      :style="transform"
      class="absolute inset-0 flex items-center justify-center origin-center will-change-transform"
    >
      <div class="relative">
        <!-- Hidden source image -->
        <!-- <img ref="imageRef" style="display: none" @load="handleImageLoad" /> -->

        <!-- Edited -->
        <canvas ref="displayImageRef" class="block max-h-full max-w-full object-contain" />

        <!-- Original -->
        <canvas
          ref="originalImageRef"
          class="absolute inset-0 max-h-full max-w-full object-contain pointer-events-none"
          :style="{ opacity: originalOpacity }"
        />
      </div>

      <slot name="viewport-overlay" />
    </div>

    <div class="absolute inset-0 pointer-events-none">
      <slot name="screen-overlay" />
    </div>
  </main>
</template>
