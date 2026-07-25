<script setup lang="ts">
import { ref, onMounted } from 'vue';

import Button from '@/components/ui/button/Button.vue';

import { useDocumentStore } from '@/document/Document';

import imgTiger from '@/assets/tiger.jpg';
import { OpenCVService } from '../Image/OpenCVService';

const documentStore = useDocumentStore();

const openCVService = OpenCVService.getInstance();
const isCvLoading = ref(true);
const isImageLoaded = ref(false);

// Ссылка на DOM-элемент картинки (Vue template ref)
const sourceImgRef = ref<HTMLImageElement | null>(null);

onMounted(async () => {
  try {
    await openCVService.init();
    isCvLoading.value = false;
  } catch (error) {
    console.error("Can't initialize OpenCV. Reason: " + error);
  }
});

// Срабатывает, когда браузер загрузил картинку по указанному src
const onImageLoad = () => {
  isImageLoaded.value = true;
};

const processImage = () => {
  if (!sourceImgRef.value) return;

  try {
    // Вариант А: Передаем сам DOM элемент по ссылке (наиболее надежно во Vue)
    openCVService.convertToGray(sourceImgRef.value, 'canvas-output');

    // Вариант Б: Можно было бы передать строку id, как раньше:
    // openCVService.convertToGray('my-image-id', 'canvas-output')
  } catch (e) {
    console.error("Can't process image. Reason: " + e);
  }
};
</script>

<template>
  <div class="processor">
    <div>Document id: {{ documentStore.id }}</div>
    <div v-if="isCvLoading" class="loader">⏳ Загрузка OpenCV WASM...</div>

    <div v-else class="content">
      <p>🟢 OpenCV готов к работе.</p>

      <div class="images-container">
        <!-- Исходный элемент IMG -->
        <div class="box" :hidden="true">
          <h3>Оригинал (img)</h3>
          <img
            ref="sourceImgRef"
            id="my-image-id"
            :src="imgTiger"
            crossorigin="anonymous"
            @load="onImageLoad"
            alt="Source"
          />
        </div>

        <div>
          <Button :disabled="!isImageLoaded" @click="processImage" size="xs">
            {{ isImageLoaded ? 'Сделать черно-белым' : 'Ожидание загрузки картинки...' }}
          </Button>
        </div>

        <!-- Canvas для вывода результата обработки -->
        <div class="box">
          <h3>Результат (canvas)</h3>
          <canvas id="canvas-output" width="300" height="200"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.images-container {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}
.box {
  text-align: center;
}
img,
canvas {
  border: 1px solid #ccc;
  display: block;
  max-width: 100%;
  height: auto;
}
button {
  padding: 10px 20px;
  cursor: pointer;
}
button:disabled {
  background-color: #eaeaea;
  cursor: not-allowed;
}
</style>
