<script setup lang="ts">
import { computed } from 'vue';

import { Slider } from '@/components/ui/slider';

const props = withDefaults(
  defineProps<{
    modelValue: number;

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
  (e: 'update:modelValue', value: number): void;
}>();

const sliderValue = computed({
  get: () => [props.modelValue],
  set: ([value]: number[]) => emit('update:modelValue', value),
});
</script>

<template>
  <Slider v-model="sliderValue" :min="min" :max="max" :step="step" :disabled="disabled" class="w-full min-h-5" />
</template>
