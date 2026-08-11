<script setup lang="ts">
import { ref } from 'vue';

import { ImagePlus } from '@lucide/vue'; // Camera,

import { Button } from '@/components/ui/button';
import PrivacyModal from '@/components/modal/PrivacyModal.vue';
import AboutModal from '@/components/modal/AboutModal.vue';
import DisclaimerModal from '@/components/modal/DisclaimerModal.vue';
import OpenSourceModal from '@/components/modal/OpenSourceModal.vue';

const emit = defineEmits<{
  (e: 'upload'): void;
  (e: 'camera'): void;
}>();

const aboutOpen = ref(false);
const disclaimerOpen = ref(false);
const privacyOpen = ref(false);
const openSourceOpen = ref(false);
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
        <a href="#" @click.prevent="aboutOpen = true"> {{ $t('common.About') }} </a>

        <span>|</span>

        <a href="#" @click.prevent="disclaimerOpen = true"> {{ $t('common.Disclaimer') }} </a>

        <span>|</span>

        <a href="#" @click.prevent="privacyOpen = true"> {{ $t('common.Privacy') }} </a>

        <span>|</span>

        <a href="#" @click.prevent="openSourceOpen = true"> {{ $t('common.OpenSource') }} </a>
      </div>

      <div class="text-muted-foreground pt-20">{{ $t('common.Version') }} 1.0</div>

      <div class="text-muted-foreground">© 2026. Aleksandr Dederer</div>
    </div>
  </div>

  <AboutModal v-model:open="aboutOpen" />
  <DisclaimerModal v-model:open="disclaimerOpen" />
  <PrivacyModal v-model:open="privacyOpen" />
  <OpenSourceModal v-model:open="openSourceOpen" />
</template>
