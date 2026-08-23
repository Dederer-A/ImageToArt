<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useWorkplaceStore } from '@/workplace/index';

import EditorScreen from '@/components/editor/EditorScreen.vue';
import HomeScreen from '@/components/home/HomeScreen.vue';
import GalleryScreen from '@/components/gallery/GalleryScreen.vue';
import type { PersistedDocumentInfo } from '@/workplace';
import { Persistence } from '@/workplace/persistence';
import { CapacitorShareTarget } from '@capgo/capacitor-share-target';
import { Capacitor } from '@capacitor/core';
import { resizeFileToImageData } from './lib/utils';

const fileInput = ref<HTMLInputElement>();
const workplace = useWorkplaceStore();

const currentDocumentId = ref<string | null>(null);
const imagesList = ref<PersistedDocumentInfo[]>([]);

async function refreshWorkplaceState() {
  currentDocumentId.value = await workplace.getCurrentDocumentId();
  imagesList.value = await workplace.listImages();
}

onMounted(async () => {
  workplace.initialize();
  
  const currentId = await Persistence.getCurrentDocumentId();
  if (currentId) {
    await workplace.loadDocument(currentId);
  }
  
  await refreshWorkplaceState();

  if (Persistence.isSupported()) {
    console.log('[App] Persistence is supported. Registering CapacitorShareTarget listener...');
    void CapacitorShareTarget.addListener('shareReceived', async (event) => {
      console.log('[App] shareReceived event received:', event);
      const files = event.files?.slice(0, 10) || [];
      console.log(`[App] Processing ${files.length} shared files`);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isLast = i === files.length - 1;
        try {
          console.log(`[App] Processing shared file [${i}]: name=${file.name}, uri=${file.uri}, mimeType=${file.mimeType}`);
          const assetUrl = Capacitor.convertFileSrc(file.uri);
          console.log(`[App] Converted file src: ${assetUrl}`);
          const response = await fetch(assetUrl);
          const blob = await response.blob();
          const imageFile = new File([blob], file.name || `shared_${i}.jpg`, { type: file.mimeType || 'image/jpeg' });
          const imageData = await resizeFileToImageData(imageFile);
          console.log(`[App] Resized shared image to ImageData: ${imageData.width}x${imageData.height}. Saving document (isLast=${isLast})...`);
          await workplace.importAndSaveDocument(file.name || 'Shared Image', imageData, isLast);
        } catch (err) {
          console.error('[App] Failed to process shared file:', err);
        }
      }
      await refreshWorkplaceState();
      console.log('[App] Workplace state refreshed after handling shared files.');
    });
  }
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
  const imageBase64 = await resizeFileToImageData(file);
  workplace.initializeDocument(file.name, imageBase64);
  await refreshWorkplaceState();

  input.value = '';
}

async function onSelectImage(id: string) {
  await workplace.loadDocument(id);
  await refreshWorkplaceState();
}

async function goBack() {
  workplace.clearCurrentDocument();
  await refreshWorkplaceState();
}
</script>

<template>
  <main class="absolute inset-0 pt-safe-top pb-safe-bottom">
    <EditorScreen v-if="currentDocumentId" :image="currentDocumentId" @go-back="goBack" />

    <GalleryScreen
      v-else-if="imagesList.length > 0"
      :images="imagesList"
      @upload="selectImage"
      @select="onSelectImage"
    />

    <HomeScreen v-else @upload="selectImage" />

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />
  </main>
</template>
