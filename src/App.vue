<script setup lang="ts">
import { ref } from 'vue';

import EditorScreen from '@/components/editor/EditorScreen.vue';
import HomeScreen from '@/components/home/HomeScreen.vue';
import { ImageEngine } from '@/Image/ImageEngine';

const fileInput = ref<HTMLInputElement>();
const image = ref('');

function selectImage() {
  fileInput.value?.click();
}

async function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  const file = input.files?.[0];
  if (!file) {
    return;
  }

  image.value = await ImageEngine.resizeFileToBase64(file);

  // Allow selecting the same file again.
  input.value = '';
}
</script>

<template>
  <HomeScreen v-if="!image" @upload="selectImage" />

  <EditorScreen v-else :image="image" />

  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />
</template>
