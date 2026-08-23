<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Capacitor } from '@capacitor/core';
import { APP_STORE_URL } from '@/services/UpdateService';

defineProps<{
  version: number;
  updates: string[];
}>();

const open = defineModel<boolean>('open', {
  default: false,
});

const isIOS = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';

function openAppStore() {
  window.open(APP_STORE_URL, '_blank');
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ $t('common.Update') }}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div class="grid gap-4">
        <ScrollArea class="h-[300px]">
          <section>
            <p>{{ $t('common.Version_Available', { version }) }}</p>
          </section>
          <section class="mt-6">
            <h2 class="text-lg font-semibold mb-2">{{ $t('common.Whats_New') }}</h2>
            <ul class="list-disc pl-5 space-y-1 text-muted-foreground">
              <li v-for="(update, index) in updates" :key="index">
                {{ update }}
              </li>
            </ul>
          </section>
        </ScrollArea>
      </div>
      <DialogFooter class="flex gap-2 sm:justify-end">
        <DialogClose as-child>
          <Button variant="outline"> {{ $t('common.Close') }} </Button>
        </DialogClose>
        <Button v-if="isIOS" @click="openAppStore"> {{ $t('common.Open_App_Store') }} </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
