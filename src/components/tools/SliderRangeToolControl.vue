<script setup lang="ts">
// import { computed } from 'vue';

import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui';

const props = withDefaults(
  defineProps<{
    modelValue: any;

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
/*
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const sliderValue = computed({
  get: () => [props.modelValue],
  set: ([value]: number[]) => emit('update:modelValue', value),
});
*/
</script>

<template>
  <SliderRoot
    :default-value="[modelValue.minValue, modelValue.maxValue]"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    class="w-full min-h-5"
  >
    <SliderTrack>
      <SliderRange />
    </SliderTrack>
    <SliderThumb />
    <SliderThumb />
  </SliderRoot>
</template>
