<script setup lang="ts">
import { computed } from 'vue';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const props = defineProps<{
  modelValue: string;
  presets: string[];

  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <ScrollArea class="w-full whitespace-nowrap">
    <div class="flex gap-2 pb-1">
      <Button
        v-for="preset in presets"
        :key="preset"
        size="sm"
        :disabled="disabled"
        :variant="preset === value ? 'secondary' : 'outline'"
        @click="value = preset"
      >
        {{ preset }}
      </Button>
    </div>

    <ScrollBar orientation="horizontal" class="hidden" />
  </ScrollArea>
</template>
