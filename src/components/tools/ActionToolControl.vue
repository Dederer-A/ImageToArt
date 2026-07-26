<script setup lang="ts">
// import { ChevronRight } from '@lucide/vue';
// import { Button } from '@/components/ui/button';

withDefaults(
  defineProps<{
    label?: string;
    disabled?: boolean;
  }>(),
  {
    label: 'Manage',
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <div class="w-28 shrink-0 truncate text-sm font-medium">
    <div class="text-sm font-medium">
      {{ label }}
    </div>
  </div>
  <!-- <span class="min-h-5">{{ label }}</span> -->

  <!-- <Button variant="ghost" :disabled="disabled" class="gap-1 px-2" @click="emit('click')">
  </Button> -->
</template>
