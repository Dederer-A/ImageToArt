<script setup lang="ts">
import { computed } from 'vue';
import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw } from '@lucide/vue';
import { Button } from '@/components/ui/button';

const props = withDefaults(
  defineProps<{
    modelValue: {
      rotateLeft: boolean;
      rotateRight: boolean;
      flipHorizontal: boolean;
      flipVertical: boolean;
    };

    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const emit = defineEmits<{
  (
    e: 'update:modelValue',
    value: {
      rotateLeft: boolean;
      rotateRight: boolean;
      flipHorizontal: boolean;
      flipVertical: boolean;
    }
  ): void;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function toggle<K extends keyof typeof value.value>(key: K) {
  value.value = {
    ...value.value,
    [key]: !value.value[key],
  };
}
</script>

<template>
  <div class="flex min-h-5 items-center gap-1">
    <Button
      size="icon"
      :variant="value.rotateLeft ? 'secondary' : 'ghost'"
      :disabled="disabled"
      @click="toggle('rotateLeft')"
    >
      <RotateCcw class="size-4" />
    </Button>

    <Button
      size="icon"
      :variant="value.rotateRight ? 'secondary' : 'ghost'"
      :disabled="disabled"
      @click="toggle('rotateRight')"
    >
      <RotateCw class="size-4" />
    </Button>

    <Button
      size="icon"
      :variant="value.flipHorizontal ? 'secondary' : 'ghost'"
      :disabled="disabled"
      @click="toggle('flipHorizontal')"
    >
      <FlipHorizontal class="size-4" />
    </Button>

    <Button
      size="icon"
      :variant="value.flipVertical ? 'secondary' : 'ghost'"
      :disabled="disabled"
      @click="toggle('flipVertical')"
    >
      <FlipVertical class="size-4" />
    </Button>
  </div>
</template>
