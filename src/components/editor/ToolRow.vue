<script setup lang="ts">
import { computed, useSlots } from 'vue';

import { Switch } from '@/components/ui/switch';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const slots = useSlots();

const enabled = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const hasControl = computed(() => !!slots.default);
</script>

<template>
  <div class="flex items-start gap-4 py-3" :class="{ 'opacity-50': disabled }">
    <Switch v-model:checked="enabled" :disabled="disabled" class="min-h-5 shrink-0" />

    <div class="w-28 shrink-0 truncate text-sm font-medium">
      <div class="text-sm font-medium">
        {{ title }}
      </div>
    </div>

    <div v-if="hasControl" class="flex min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>
