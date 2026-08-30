<script setup lang="ts">
import { computed, useSlots } from 'vue';

import { Switch } from '@/components/ui/switch';

interface Props {
  title: string;
  withSwitch?: boolean;
}

withDefaults(defineProps<Props>(), {
  withSwitch: true,
});
const isEnabled = defineModel<boolean>({ required: false });

const slots = useSlots();
const hasControl = computed(() => !!slots.default);
</script>

<template>
  <div class="flex items-start gap-3 py-3" :class="{ 'opacity-50': false }">
    <div v-if="withSwitch" class="flex h-8 items-center shrink-0">
      <Switch v-model="isEnabled" />
    </div>

    <div class="w-35 shrink-0 truncate text-sm font-medium h-8 flex items-center">
      <div class="text-sm font-medium leading-none">{{ $t(title) }}</div>
    </div>

    <div v-if="hasControl" class="flex min-w-0 flex-1 items-center min-h-8">
      <slot />
    </div>
  </div>
</template>
