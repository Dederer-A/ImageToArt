<script setup lang="ts">
import { Switch } from '@/components/ui/switch';

interface Props {
  title: string;
}

defineProps<Props>();
const isEnabled = defineModel<boolean>({ required: true });

function handleSwitchChange(newValue: boolean) {
  console.log('Свитчер изменил состояние на:', newValue);
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <span class="text-sm font-medium">{{ title }}</span>
    <Switch v-model="isEnabled" @update:model-value="handleSwitchChange" />
  </div>
</template>
