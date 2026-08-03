<script setup lang="ts">
import { ImagePlus } from '@lucide/vue'; // Camera,

import { Button } from '@/components/ui/button';
import PrivacyModal from '@/components/home/PrivacyModal.vue';
import AboutModal from '@/components/home/AboutModal.vue';
import DisclaimerModal from '@/components/home/DisclaimerModal.vue';
import OpenSourceModal from '@/components/home/OpenSourceModal.vue';

const emit = defineEmits<{
  (e: 'upload'): void;
  (e: 'camera'): void;
}>();
</script>

<template>
  <div class="h-dvh flex flex-col items-center justify-center px-8 text-center">
    <div class="space-y-3">
      <h1 class="text-4xl font-bold">Image to Art</h1>

      <p class="text-muted-foreground">{{ $t('common.Transform_photos_into_art') }}</p>
    </div>

    <div class="mt-10 w-full space-y-3">
      <Button class="w-full" size="lg" @click="emit('upload')">
        <ImagePlus class="mr-2 size-5" />

        {{ $t('common.Upload_Image') }}
      </Button>
    </div>

    <div class="mt-10 space-y-2 text-sm">
      <div class="flex justify-center gap-4">
        <AboutModal /> | <DisclaimerModal /> | <PrivacyModal /> |
        <OpenSourceModal />
      </div>

      <div class="text-muted-foreground pt-20">{{ $t('common.Version') }} 1.0</div>

      <div class="text-muted-foreground">© 2026. Aleksandr Dederer</div>
    </div>
  </div>
</template>
