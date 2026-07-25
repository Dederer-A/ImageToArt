<script setup lang="ts">
import { ref } from 'vue';

import EditorScreen from '@/components/editor/EditorScreen.vue';
import HomeScreen from '@/components/home/HomeScreen.vue';

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

  image.value = await readAsBase64(file);

  // Allow selecting the same file again.
  input.value = '';
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
</script>

<template>
  <HomeScreen v-if="!image" @upload="selectImage" />

  <EditorScreen v-else :image="image" />

  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />
</template>
