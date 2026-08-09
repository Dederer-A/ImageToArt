<script setup lang="ts">
import { useBigScreen } from '@/composables/useBigScreen';

const { isBigScreen } = useBigScreen(768);
</script>

<template>
  <div v-if="!isBigScreen" class="relative h-dvh w-full overflow-hidden bg-background">
    <slot />
    <slot name="toolbar" />
  </div>

  <SidebarProvider v-else>
    <main class="flex-1">
      <slot />
    </main>

    <Sidebar side="right">
      <SidebarHeader> </SidebarHeader>
      <SidebarContent>
        <slot name="toolbar" />
      </SidebarContent>
      <SidebarFooter> </SidebarFooter>
    </Sidebar>
  </SidebarProvider>
</template>
