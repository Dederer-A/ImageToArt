<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { ImagePlus, ChevronDownIcon, Info, TriangleAlert, Shield, Code2 } from '@lucide/vue';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { PersistedDocumentInfo } from '@/workplace';
import { UpdateService, type VersionInfo } from '@/services/UpdateService';

import PrivacyModal from '@/components/modal/PrivacyModal.vue';
import AboutModal from '@/components/modal/AboutModal.vue';
import DisclaimerModal from '@/components/modal/DisclaimerModal.vue';
import OpenSourceModal from '@/components/modal/OpenSourceModal.vue';
import UpdateModal from '@/components/modal/UpdateModal.vue';

defineProps<{
  images: PersistedDocumentInfo[];
}>();

const emit = defineEmits<{
  (e: 'upload'): void;
  (e: 'select', id: string): void;
}>();

const aboutOpen = ref(false);
const disclaimerOpen = ref(false);
const privacyOpen = ref(false);
const openSourceOpen = ref(false);
const updateModalOpen = ref(false);
const versionInfo = ref<VersionInfo | null>(null);

const scrollContainer = ref<HTMLElement | null>(null);

// Persist scroll position across mounts
const savedScrollPosition = sessionStorage.getItem('galleryScrollPosition') || '0';

onMounted(async () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = parseInt(savedScrollPosition, 10);
  }

  await UpdateService.checkAndShowUpdate((info) => {
    versionInfo.value = info;
    updateModalOpen.value = true;
  });
});

function handleScroll(e: Event) {
  const target = e.target as HTMLElement;
  sessionStorage.setItem('galleryScrollPosition', target.scrollTop.toString());
}
</script>

<template>
  <div class="h-full w-full relative">
    <div class="h-dvh flex flex-col justify-between px-6 py-8">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold">{{ $t('common.gallery.Title') }}</h1>
      <p class="text-muted-foreground">{{ $t('common.gallery.Description') }}</p>
    </div>

    <!-- Scrollable gallery -->
    <div ref="scrollContainer" class="flex-1 min-h-0 my-6 overflow-y-auto" @scroll="handleScroll">
      <div class="grid grid-cols-3 gap-3 content-start">
        <div
          v-for="img in images"
          :key="img.id"
          class="relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-border bg-muted transition hover:opacity-90"
          @click="emit('select', img.id)"
        >
          <img :src="img.thumbnailUrl" alt="Thumbnail" class="absolute inset-0 size-full object-cover" />
        </div>
      </div>
    </div>

    <ButtonGroup class="w-full">
      <Button class="flex-1 min-w-0" size="icon" @click="emit('upload')">
        <ImagePlus class="mr-2 size-5" />
        {{ $t('common.Upload_Image') }}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button size="icon" class="shrink-0">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          class="[--radius:1rem] border border-border/50 bg-background/80 shadow-xl backdrop-blur-xl"
        >
          <!--
          class="rounded-2xl border border-border/50 bg-background/80 shadow-xl backdrop-blur-xl"
          class="[--radius:1rem]"
          -->
          <DropdownMenuItem @select="aboutOpen = true">
            <Info class="mr-2 size-4" /> {{ $t('common.About') }}
          </DropdownMenuItem>

          <DropdownMenuItem @select="disclaimerOpen = true">
            <TriangleAlert class="mr-2 size-4" /> {{ $t('common.Disclaimer') }}
          </DropdownMenuItem>

          <DropdownMenuItem @select="privacyOpen = true">
            <Shield class="mr-2 size-4" /> {{ $t('common.Privacy') }}
          </DropdownMenuItem>

          <DropdownMenuItem @select="openSourceOpen = true">
            <Code2 class="mr-2 size-4" /> {{ $t('common.OpenSource') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  </div>

  <AboutModal v-model:open="aboutOpen" />
  <DisclaimerModal v-model:open="disclaimerOpen" />
  <PrivacyModal v-model:open="privacyOpen" />
  <OpenSourceModal v-model:open="openSourceOpen" />
  <UpdateModal
    v-model:open="updateModalOpen"
    :version="versionInfo?.version ?? 0"
    :updates="versionInfo?.updates ?? []"
  />
  </div>
</template>
