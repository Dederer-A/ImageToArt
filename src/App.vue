<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useWorkplaceStore } from '@/workplace/index';

import EditorScreen from '@/components/editor/EditorScreen.vue';
import HomeScreen from '@/components/home/HomeScreen.vue';
import { ImageEngine } from '@/Image/ImageEngine';
const fileInput = ref<HTMLInputElement>();
const image = ref('');

const workplace = useWorkplaceStore();

onMounted(() => {
  workplace.initialize(); // Initialize the workplace store after the app is mounted
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
  <HomeScreen v-if="!image" @upload="selectImage" />

  <EditorScreen v-else :image="image" />

  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />
</template>
