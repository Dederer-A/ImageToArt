<script setup lang="ts">
import { computed, useSlots } from 'vue';

import { Switch } from '@/components/ui/switch';

interface Props {
  title: string;
}

defineProps<Props>();
const isEnabled = defineModel<boolean>({ required: false });

const slots = useSlots();
const hasControl = computed(() => !!slots.default);
</script>

<template>
  <div class="flex items-start gap-4 py-3" :class="{ 'opacity-50': false }">
    <Switch v-model="isEnabled" class="min-h-5 shrink-0" />

    <div class="w-28 shrink-0 truncate text-sm font-medium">
      <div class="text-sm font-medium">{{ title }}</div>
    </div>

    <div v-if="hasControl" class="flex min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>
