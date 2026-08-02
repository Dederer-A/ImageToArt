<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Capacitor } from '@capacitor/core';
import { CapacitorShareTarget } from '@capgo/capacitor-share-target';

import { useWorkplaceStore } from '@/workplace/index';

import EditorScreen from '@/components/editor/EditorScreen.vue';
import HomeScreen from '@/components/home/HomeScreen.vue';
import { ImageEngine } from '@/Image/ImageEngine';
const fileInput = ref<HTMLInputElement>();
const image = ref('');

interface ProcessedImage {
  nativeUri: string;
  webUrl: string;
  mimeType: string;
}

const sharedImages = ref<ProcessedImage[]>([]);

const workplace = useWorkplaceStore();

onMounted(() => {
  workplace.initialize(); // Initialize the workplace store after the app is mounted

  CapacitorShareTarget.addListener('shareReceived', (event) => {
    if (event.files && event.files.length > 0) {
      // Обрабатываем каждый полученный файл
      const processedImages = event.files.map((file) => {
        // file.uri имеет вид "file:///var/mobile/Containers/Shared/AppGroup/..."
        // Конвертируем нативный путь в безопасный URL для WebView
        const webViewUrl = Capacitor.convertFileSrc(file.uri);

        return {
          nativeUri: file.uri, // Нужен для чтения/загрузки на сервер
          webUrl: webViewUrl, // Нужен для тега <img :src="...">
          mimeType: file.mimeType, // Например, "image/jpeg"
        };
      });

      // Сохраняем в реактивную переменную
      sharedImages.value = [...sharedImages.value, ...processedImages];
    }
  });
});

function selectImage() {
  fileInput.value?.click();
}

async function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  const file = input.files?.[0];
  if (!file) {
    return;
  }
  const imageBase64 = await ImageEngine.resizeFileToImageData(file);
  workplace.initializeDocument(file.name, imageBase64);
  image.value = 'loaded';

  // Allow selecting the same file again.
  input.value = '';
}
</script>

<template>
  <main class="absolute inset-0 pt-safe-top pb-safe-bottom">
    <HomeScreen v-if="!image" @upload="selectImage" />

    <EditorScreen v-else :image="image" />

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />
  </main>
  <!--
  <div class="share-container">
    <h2>Полученные изображения:</h2>

    <div v-if="sharedImages.length === 0">Ожидание отправки картинок...</div>

    <div v-else class="grid">
      <div v-for="(img, index) in sharedImages" :key="index" class="card">
        <img :src="img.webUrl" alt="Shared content" />
        <p>{{ img.mimeType }}</p>
      </div>
    </div>
  </div>
--></template>

<style scoped>
.grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.card img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
