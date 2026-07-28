<script setup lang="ts">
import { ref, useTemplateRef, watch, onUnmounted } from 'vue';
import { useViewport } from '@/composables/useViewport';

import { debounce } from 'lodash-es';

import { useDocumentStore } from '@/document/Document';
import { useDocumentRuntimeStore } from '@/document/DocumentRuntime';
import { ImageEngine } from '@/Image/ImageEngine';
import { ImageRenderer } from '@/Image/ImageRenderer';

const props = withDefaults(
  defineProps<{
    src?: string;
  }>(),
  {
    src: '',
  }
);

const imageRef = useTemplateRef<HTMLImageElement>('imageRef');
const originalImageRef = useTemplateRef<HTMLCanvasElement>('originalImageRef');
const displayImageRef = useTemplateRef<HTMLCanvasElement>('displayImageRef');

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

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const { transform } = useViewport(); // viewport,

function handleImageLoad() {
  console.log(`[EditorCanvas] handleImageLoad`);

  if (imageRef.value == null) return;
  if (displayImageRef.value == null) return;

  const document = useDocumentStore();
  document.initialize(props.src);

  const documentRuntime = useDocumentRuntimeStore();
  const imageData = ImageEngine.imageToImageData(imageRef.value);

  documentRuntime.initialize(document);
  documentRuntime.srcImageData = imageData;
  documentRuntime.currentImageData = null;
  console.log('[EditorScreen] new Document and DocumentRuntime configured');

  ImageEngine.process();

  const canvas = originalImageRef.value;
  const image = imageRef.value;
  if (!canvas) return;
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
}

const originalOpacity = ref(0);
const HOLD_DELAY = 1000;
const OPACITY_DRAG_DISTANCE = 200;

let holdTimer: number | undefined;
let previewMode = false;

let startY = 0;

function onPointerDown(e: PointerEvent) {
  const target = e.currentTarget as HTMLElement;
  target.setPointerCapture(e.pointerId);
  startY = e.clientY;
  previewMode = false;
  holdTimer = window.setTimeout(() => {
    previewMode = true;
    originalOpacity.value = 1;
  }, HOLD_DELAY);
}

function onPointerMove(e: PointerEvent) {
  if (!previewMode) return;
  const dy = Math.max(0, e.clientY - startY);
  originalOpacity.value = Math.max(0, 1 - dy / OPACITY_DRAG_DISTANCE);
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
  previewMode = false;
  originalOpacity.value = 0;
}
</script>

<template>
  <main
    class="absolute inset-0 overflow-hidden bg-background select-none touch-manipulation"
    @click="emit('click')"
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
        <img ref="imageRef" :src="src" style="display: none" @load="handleImageLoad" />

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
