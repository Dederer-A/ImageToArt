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
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <a href="#">{{ $t('common.' + title) }}</a>
      <!-- <Button variant="outline"> Open Dialog </Button> -->
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ $t('common.' + title) }}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div class="grid gap-4">
        <ScrollArea class="h-[500px]">
          <slot />
        </ScrollArea>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline"> Close </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style>
.legal-scroll {
  height: 500px;
}

section + section {
  margin-top: 2.5rem;
}

h2 {
  margin-bottom: 1rem;

  font-size: 1.75rem; /* 28px */
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.025em;
}
p {
  margin-top: 0.75rem;

  color: hsl(var(--muted-foreground));

  font-size: 1rem;
  line-height: 1.75;
}

strong {
  color: hsl(var(--foreground));
  font-weight: 600;
}
</style>
