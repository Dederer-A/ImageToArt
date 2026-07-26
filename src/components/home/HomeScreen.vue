<script setup lang="ts">
import { ImagePlus } from '@lucide/vue'; // Camera,

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

const emit = defineEmits<{
  (e: 'upload'): void;
  (e: 'camera'): void;
}>();
</script>

<template>
  <div class="h-dvh flex flex-col items-center justify-center px-8 text-center">
    <div class="space-y-3">
      <h1 class="text-4xl font-bold">Image to Art</h1>

      <p class="text-muted-foreground">Transform photos into art</p>
    </div>

    <div class="mt-10 w-full space-y-3">
      <Button class="w-full" size="lg" @click="emit('upload')">
        <ImagePlus class="mr-2 size-5" />

        Upload Image
      </Button>

      <!-- <Button class="w-full" size="lg" variant="secondary" disabled @click="emit('camera')">
        <Camera class="mr-2 size-5" />

        Camera (Coming Soon)
      </Button> -->
    </div>

    <div class="mt-10 space-y-2 text-sm">
      <div class="flex justify-center gap-4">
        <Dialog>
          <DialogTrigger as-child>
            <a href="#">Disclaimer</a>
            <!-- <Button variant="outline"> Open Dialog </Button> -->
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Disclaimer</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div class="grid gap-4">
              <ScrollArea class="h-[500px] border p-4">
                <h2>Privacy</h2>
                <p>Your privacy is important.</p>
                <p>This application is designed with a <strong>local-first</strong> approach.</p>

                <h2>Local Storage</h2>
                <p>
                  All of your data—including images, settings, projects, and application preferences—is stored locally
                  on your device.
                </p>
                <p>The application does <strong>not</strong> upload your files or personal data to our servers.</p>

                <h2>No Account Required</h2>
                <p>You can use the application without creating an account or providing personal information.</p>

                <h2>Internet Access</h2>
                <p>The core functionality works entirely offline.</p>
                <p>
                  If the application ever offers optional online features (such as checking for updates or connecting to
                  third-party services), those features will be clearly identified and will never upload your files
                  without your explicit permission.
                </p>

                <h2>Your Images</h2>
                <p>Your reference images remain your property at all times.</p>
                <p>
                  Image analysis is performed locally on your device whenever possible. Your images are never shared or
                  transmitted without your knowledge and consent.
                </p>

                <h2>Data Collection</h2>
                <p>The application does not collect or sell your personal data.</p>
                <p>
                  If anonymous diagnostic or crash reports are ever introduced, they will be optional and disabled
                  unless you choose to enable them.
                </p>

                <h2>Changes</h2>
                <p>
                  If this privacy policy changes in future releases, the updated version will be published with the
                  application.
                </p>
                <br />
                <p>
                  <strong>In short:</strong> your images stay on your device, your data stays under your control, and
                  the application is designed to respect your privacy by default.
                </p>
              </ScrollArea>
            </div>
            <DialogFooter>
              <DialogClose as-child>
                <Button variant="outline"> Close </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <a href="#">Privacy</a>

        <a href="#">License</a>
      </div>

      <div class="text-muted-foreground">Version 0.1</div>

      <div class="text-muted-foreground">© 2026. Aleksandr Dederer</div>
    </div>
  </div>
</template>
