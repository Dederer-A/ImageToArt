<script setup lang="ts">
import { ArrowLeft, Download } from '@lucide/vue';

import { Button } from '@/components/ui/button';

withDefaults(
  defineProps<{
    visible?: boolean;
  }>(),
  {
    visible: true,
  }
);

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'export'): void;
}>();
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <header
      v-if="visible"
      class="safe-top absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 py-2"
    >
      <Button variant="ghost" size="icon" @click="emit('back')">
        <ArrowLeft class="size-5" />
      </Button>

      <Button variant="ghost" size="icon" @click="emit('export')">
        <Download class="size-5" />
      </Button>
    </header>
  </Transition>
</template>
