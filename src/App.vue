<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useWorkplaceStore } from '@/workplace/index';

import EditorScreen from '@/components/editor/EditorScreen.vue';
import HomeScreen from '@/components/home/HomeScreen.vue';
import GalleryScreen from '@/components/gallery/GalleryScreen.vue';
import type { PersistedDocumentInfo } from '@/workplace';
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
  await refreshWorkplaceState();
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
