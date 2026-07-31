<script setup lang="ts">
import { Slider } from '@/components/ui/slider';

withDefaults(
  defineProps<{
    modelValue: number[];

    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[] | undefined): void;
}>();
</script>

<template>
  <Slider
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    class="w-full min-h-5"
  />
</template>
