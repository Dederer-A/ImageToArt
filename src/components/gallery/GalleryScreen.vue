<script setup lang="ts">
import { ImagePlus } from '@lucide/vue';

import { Button } from '@/components/ui/button';
import type { PersistedDocumentInfo } from '@/workplace';

defineProps<{
  images: PersistedDocumentInfo[];
}>();

const emit = defineEmits<{
  (e: 'upload'): void;
  (e: 'select', id: string): void;
}>();
</script>

<template>
  <div class="h-dvh flex flex-col justify-between px-6 py-8">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold">{{ $t('common.gallery.Title') }}</h1>
      <p class="text-muted-foreground">{{ $t('common.gallery.Description') }}</p>
    </div>

    <div class="flex-1 my-6 overflow-y-auto grid grid-cols-3 gap-3 content-start">
      <div
        v-for="img in images"
        :key="img.id"
        class="aspect-square relative cursor-pointer overflow-hidden rounded-lg bg-muted border border-border hover:opacity-90 transition"
        @click="emit('select', img.id)"
      >
        <img :src="img.thumbnailUrl" alt="Thumbnail" class="absolute inset-0 size-full object-cover" />
      </div>
    </div>

    <div class="w-full space-y-3">
      <Button class="w-full" size="lg" @click="emit('upload')">
        <ImagePlus class="mr-2 size-5" />
        {{ $t('common.Upload_Image') }}
      </Button>
    </div>
  </div>
</template>
