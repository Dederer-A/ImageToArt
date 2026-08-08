<script setup lang="ts">
import { ArrowLeft, CopyPlus, RotateCcw, Trash2, Trash, FileX, Share } from '@lucide/vue';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWorkplaceStore } from '@/workplace/';
import { computed } from 'vue';
import AlertDialog from '@/components/AlertDialog.vue';

withDefaults(
  defineProps<{
    visible?: boolean;
  }>(),
  {
    visible: true,
  }
);

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'duplicate'): void;
  (e: 'delete', type: 'variant' | 'document'): void;
  (e: 'export'): void;
  (e: 'reset'): void;
}>();

const variantsLabel = computed(() => {
  return useWorkplaceStore().currentVariantIndex + 1 + ' / ' + useWorkplaceStore().allVariants.length;
});

const canDelete = computed(() => {
  const store = useWorkplaceStore();
  return store.allVariants.length > 1 && !store.currentVariant?.isOriginal;
});

const canDuplicate = computed(() => {
  const store = useWorkplaceStore();
  return store.allVariants.length < 10;
});

const canReset = computed(() => {
  const store = useWorkplaceStore();
  return !store.currentVariant?.isOriginal;
});
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <header
      v-if="visible"
      class="safe-top absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 py-2"
    >
      <!-- Left group -->
      <Button variant="ghost" size="icon" @click="emit('back')">
        <ArrowLeft class="size-5" />
      </Button>

      <!-- Right group -->
      <div class="flex items-center gap-2">
        <span class="pr-5">{{ variantsLabel }}</span>

        <AlertDialog @action="emit('reset')">
          <Button variant="ghost" size="icon" :disabled="!canReset">
            <RotateCcw class="size-5" />
          </Button>
        </AlertDialog>

        <Button variant="ghost" size="icon" @click="emit('duplicate')" :disabled="!canDuplicate">
          <CopyPlus class="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
              <Trash2 class="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('delete', 'variant')" :disabled="!canDelete">
              <Trash class="mr-2 size-4" />
              {{ $t('toolbar.delete_variant') }}
            </DropdownMenuItem>
            <DropdownMenuItem @click="emit('delete', 'document')">
              <FileX class="mr-2 size-4" />
              {{ $t('toolbar.delete_image') }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button variant="ghost" size="icon" @click="emit('export')">
        <Share class="size-5" />
      </Button>
    </header>
  </Transition>
</template>
