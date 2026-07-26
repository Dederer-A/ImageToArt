<script setup lang="ts">
import { useTemplateRef, watch, onUnmounted } from 'vue';
import { useViewport } from '@/composables/useViewport';

import { debounce } from 'lodash-es';

import { useDocumentStore } from '@/document/Document';
import { useDocumentRuntimeStore } from '@/document/DocumentRuntime';
import { ImageEngine } from '@/Image/ImageEngine';
import { ImageRenderer } from '@/Image/ImageRenderer';
import { Layer } from '@/layer/Layer';

const props = withDefaults(
  defineProps<{
    src?: string;
  }>(),
  {
    src: '',
  }
);

const imageRef = useTemplateRef<HTMLImageElement>('imageRef');
const displayImageRef = useTemplateRef<HTMLImageElement>('displayImageRef');

const documentRuntime = useDocumentRuntimeStore();

const debouncedDraw = debounce(() => {
  console.log('[EditorCanvas] watcher: documentRuntime');
  if (displayImageRef.value == null) return;
  ImageEngine.process();
  ImageRenderer.renderImageDataToImage(displayImageRef.value);
}, 50);

onUnmounted(() => {
  debouncedDraw.cancel();
});

watch(
  () => documentRuntime.version,
  (_newValue) => {
    console.log('[EditorCanvas] watcher: documentRuntime');
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

  const imageData = ImageEngine.imageToImageData(imageRef.value);
  const document = useDocumentStore();
  document.sourceImage = props.src;
  document.layers = [];
  document.layers.push(new Layer('blackAndWhite', true, { value: 25 }));

  // TODO fill layers with disabled by default

  const documentRuntime = useDocumentRuntimeStore();
  documentRuntime.initialize(document);
  documentRuntime.srcImageData = imageData;
  documentRuntime.currentImageData = null; // ImageEngine.cloneImageData(imageData);
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
      <img
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
