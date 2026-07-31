<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { useViewport } from '@/composables/useViewport';

// import { debounce } from 'lodash-es';

import { useWorkplaceStore } from '@/workplace/index';

const workplace = useWorkplaceStore();

enum GestureState {
  Idle,
  PendingHold,
  Preview,
  HorizontalSwipe,
}

const gestureState = ref(GestureState.Idle);

interface GestureContext {
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
  holdTimer?: number;
}

const gesture: GestureContext = {
  pointerId: -1,
  startX: 0,
  startY: 0,
  moved: false,
};

function dispatchHoldTimeout() {
  if (gestureState.value !== GestureState.PendingHold) {
    return;
  }
  gestureState.value = GestureState.Preview;
  originalOpacity.value = 1;
}

function resetGesture(target?: HTMLElement) {
  if (gesture.holdTimer) {
    clearTimeout(gesture.holdTimer);
    gesture.holdTimer = undefined;
  }
  if (target && target.hasPointerCapture(gesture.pointerId)) {
    target.releasePointerCapture(gesture.pointerId);
  }
  originalOpacity.value = 0;
  gestureState.value = GestureState.Idle;
  swipeOffset.value = 0;
}

// =========

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
const CLICK_MOVE_THRESHOLD = 5;
const DIRECTION_LOCK_DISTANCE = 15;
const SWIPE_DISTANCE = 80;

const swipeOffset = ref(0);

function onPointerDown(e: PointerEvent) {
  const target = e.currentTarget as HTMLElement;
  target.setPointerCapture(e.pointerId);
  gesture.pointerId = e.pointerId;
  gesture.startX = e.clientX;
  gesture.startY = e.clientY;
  gesture.moved = false;
  gestureState.value = GestureState.PendingHold;
  gesture.holdTimer = window.setTimeout(dispatchHoldTimeout, HOLD_DELAY);
}

function handlePendingHold(e: PointerEvent) {
  const dx = e.clientX - gesture.startX;
  const dy = e.clientY - gesture.startY;
  if (!gesture.moved && (Math.abs(dx) > CLICK_MOVE_THRESHOLD || Math.abs(dy) > CLICK_MOVE_THRESHOLD)) {
    gesture.moved = true;
  }
  if (Math.abs(dx) < DIRECTION_LOCK_DISTANCE && Math.abs(dy) < DIRECTION_LOCK_DISTANCE) {
    return;
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    if (gesture.holdTimer) {
      clearTimeout(gesture.holdTimer);
      gesture.holdTimer = undefined;
    }
    gestureState.value = GestureState.HorizontalSwipe;
    swipeOffset.value = dx;
  }
  // vertical gesture do nothing in purpose. awaiting Hold event
}

function handleHorizontalSwipe(e: PointerEvent) {
  swipeOffset.value = e.clientX - gesture.startX;
}

function handlePreview(e: PointerEvent) {
  const dy = e.clientY - gesture.startY;
  originalOpacity.value = Math.max(0, 1 - Math.max(0, dy) / OPACITY_DRAG_DISTANCE);
}

function onPointerMove(e: PointerEvent) {
  switch (gestureState.value) {
    case GestureState.PendingHold:
      handlePendingHold(e);
      break;
    case GestureState.Preview:
      handlePreview(e);
      break;
    case GestureState.HorizontalSwipe:
      handleHorizontalSwipe(e);
      break;
  }
}

function onPointerUp(e: PointerEvent) {
  const target = e.currentTarget as HTMLElement;
  const state = gestureState.value;
  const moved = gesture.moved;
  if (state === GestureState.HorizontalSwipe) {
    if (swipeOffset.value < -SWIPE_DISTANCE) {
      workplace.nextVariant();
    }
    if (swipeOffset.value > SWIPE_DISTANCE) {
      workplace.previousVariant();
    }
  }
  resetGesture(target);
  if (state === GestureState.PendingHold && !moved) {
    emit('click');
  }
}

function onPointerCancel(e: PointerEvent) {
  resetGesture(e.currentTarget as HTMLElement);
}
</script>

<template>
  <main
    class="absolute inset-0 overflow-hidden bg-background select-none touch-manipulation"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
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
