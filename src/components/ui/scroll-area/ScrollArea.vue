<script setup lang="ts">
import type { ScrollAreaRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui';
import { cn } from '@/lib/utils';
import ScrollBar from './ScrollBar.vue';

const props = withDefaults(
  defineProps<ScrollAreaRootProps & { class?: HTMLAttributes['class']; hideScrollbar?: boolean }>(),
  { hideScrollbar: false }
);

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <ScrollAreaRoot data-slot="scroll-area" v-bind="delegatedProps" :class="cn('relative', props.class)">
    <ScrollAreaViewport
      data-slot="scroll-area-viewport"
      class="cn('focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-3 focus-visible:outline-1', hideScrollbar && '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden')"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar v-if="!hideScrollbar" />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
