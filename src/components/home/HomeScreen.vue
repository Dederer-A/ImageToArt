<script setup lang="ts">
import { ImagePlus } from '@lucide/vue'; // Camera,

import { Button } from '@/components/ui/button';

const emit = defineEmits<{
  (e: 'upload'): void;
  (e: 'camera'): void;
}>();
</script>

<template>
  <div class="h-dvh flex flex-col items-center justify-center px-8 text-center">
    <div class="space-y-3">
      <h1 class="text-4xl font-bold">Image to Art</h1>

      <p class="text-muted-foreground">Transform photos into art</p>
    </div>

    <div class="mt-10 w-full space-y-3">
      <Button class="w-full" size="lg" @click="emit('upload')">
        <ImagePlus class="mr-2 size-5" />

        Upload Image
      </Button>

      <!-- <Button class="w-full" size="lg" variant="secondary" disabled @click="emit('camera')">
        <Camera class="mr-2 size-5" />

        Camera (Coming Soon)
      </Button> -->
    </div>

    <div class="mt-10 space-y-2 text-sm">
      <div class="flex justify-center gap-4">
        <a href="#">Disclaimer</a>

        <a href="#">Privacy</a>

        <a href="#">License</a>
      </div>

      <div class="text-muted-foreground">Version 0.1</div>

      <div class="text-muted-foreground">© 2026</div>
    </div>
  </div>
</template>
