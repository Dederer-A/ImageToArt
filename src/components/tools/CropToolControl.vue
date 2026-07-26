<script setup lang="ts">
import { computed } from 'vue';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { RectangleHorizontal, RectangleVertical } from '@lucide/vue';

const props = defineProps<{
  modelValue: string;
  presets: string[][];

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
      <ButtonGroup v-for="(preset, index) in presets">
        <Button
          v-for="item in preset"
          :key="item + ':' + index"
          size="sm"
          :disabled="disabled"
          :variant="item === value ? 'secondary' : 'outline'"
          @click="value = item"
        >
          <span v-if="item == 'Portrait'">
            <RectangleVertical />
          </span>
          <span v-else-if="item == 'Landscape'">
            <RectangleHorizontal />
          </span>
          <span v-else>{{ item }}</span>
        </Button>
      </ButtonGroup>
    </div>

    <ScrollBar orientation="horizontal" class="hidden" />
  </ScrollArea>
</template>
