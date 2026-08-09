<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
</script>

<template>
  <ScrollArea
    :hideScrollbar="true"
    class="h-full w-full [&>div]:!overflow-y-auto [&>div]:[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <div class="flex-1 overflow-y-auto pb-3">
      <slot />
    </div>
  </ScrollArea>
</template>
