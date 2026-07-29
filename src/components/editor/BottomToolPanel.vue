<script setup lang="ts">
withDefaults(
  defineProps<{
    visible?: boolean;
    /**
     * Panel height in dynamic viewport height (dvh).
     */
    height?: number;
  }>(),
  {
    visible: true,
    height: 50,
  }
);
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <aside
      v-show="visible"
      :style="{ height: `${height}dvh` }"
      class="absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-3xl border-t border-border bg-background/80 backdrop-blur-xl shadow-lg"
    >
      <div class="safe-bottom flex-1 overflow-hidden px-4 pt-4">
        <slot />
      </div>
    </aside>
  </Transition>
</template>
