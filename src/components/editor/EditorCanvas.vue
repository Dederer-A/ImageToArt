<script setup lang="ts">
import { useTemplateRef, watch, onUnmounted } from 'vue';
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

// Update Document state and create new DocumentRuntime when image changed
// watch(
//   () => props.src,
//   (newValue) => {
//     initializeDocument(newValue);
//   },
//   { deep: true, immediate: true }
// );

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
}
</script>

<template>
  <main class="absolute inset-0 overflow-hidden bg-background select-none touch-manipulation" @click="emit('click')">
    <!-- Viewport -->
    <div
      ref="viewport"
      :style="transform"
      class="absolute inset-0 flex items-center justify-center origin-center will-change-transform"
    >
      <img ref="imageRef" :src="src" style="display: none" @load="handleImageLoad" />
      <!-- <img
        ref="displayImageRef"
        alt="Image"
        draggable="false"
        class="max-h-full max-w-full object-contain pointer-events-none"
      /> -->
      <canvas
        ref="displayImageRef"
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
