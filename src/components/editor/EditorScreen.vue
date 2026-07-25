<script setup lang="ts">
import { reactive, ref } from 'vue';

import ActionToolControl from '@/components/tools/ActionToolControl.vue';
import BottomToolPanel from '@/components/editor/BottomToolPanel.vue';
import CropToolControl from '@/components/tools/CropToolControl.vue';
import EditorCanvas from '@/components/editor/EditorCanvas.vue';
import EditorToolbar from '@/components/editor/EditorToolbar.vue';
import RotateToolControl from '@/components/tools/RotateToolControl.vue';
import SliderToolControl from '@/components/tools/SliderToolControl.vue';
import ToolList from '@/components/editor/ToolList.vue';
import ToolRow from '@/components/editor/ToolRow.vue';
import SwitchWrapper from '@/components/tools/SwitchWrapper.vue';

import Switch from '@/components/ui/switch/Switch.vue';

defineProps<{
  image: string; // Base64 image representation compatible with IMG Tag
}>();

const cropPresets = ['Free', 'Original', '3:2', '16:9', '4:3', '1:1', 'Portrait', 'Landscape'];

const uiVisible = ref(true);

// -----------------------------------------------------------------------------
// Temporary editor state.
// Later this state will move into Pinia.
// -----------------------------------------------------------------------------

const crop = reactive({
  enabled: false,
  preset: 'Original',
});

const rotate = reactive({
  enabled: true,

  rotateLeft: false,
  rotateRight: false,

  flipHorizontal: false,
  flipVertical: false,
});

const blackAndWhite = reactive({
  enabled: true,
  value: 0,
});

const posterize = reactive({
  enabled: false,
  value: 50,
});

const enhancement = reactive({
  enabled: false,
  value: 50,
});

const blur = reactive({
  enabled: false,
  value: 0,
});

const grid = reactive({
  enabled: false,
  value: 50,
});

const perspectiveGrid = reactive({
  enabled: false,
});

const rulers = reactive({
  enabled: false,
});

const measurements = reactive({
  enabled: false,
});

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

function toggleUi() {
  uiVisible.value = !uiVisible.value;
}

function goBack() {
  // TODO
}

function downloadImage() {
  // TODO
}

function managePerspectiveGrid() {
  // TODO
}

function manageRulers() {
  // TODO
}

function manageMeasurements() {
  // TODO
}

function blackAndWhiteSwitcher(value: boolean) {
  console.log('blackAndWhiteSwitcher: ' + value);
}
function blackAndWhiteValue(value: number) {
  console.log('blackAndWhiteValue: ' + value);
  blackAndWhite.enabled = true;
}
</script>

<template>
  <div class="relative h-dvh w-full overflow-hidden bg-background">
    <EditorCanvas :src="image" @click="toggleUi">
      <template #viewport-overlay>
        <!-- Perspective Grid -->
        <!-- Crop Overlay -->
      </template>

      <template #screen-overlay>
        <!-- Handles -->
      </template>
    </EditorCanvas>

    <EditorToolbar :visible="uiVisible" @back="goBack" @export="downloadImage" />

    <BottomToolPanel :visible="uiVisible" :height="50">
      <ToolList class="divide-y divide-border">
        <ToolRow v-model="crop.enabled" title="Crop">
          <CropToolControl v-model="crop.preset" :presets="cropPresets" />
        </ToolRow>

        <ToolRow v-model="rotate.enabled" title="Rotate">
          <RotateToolControl v-model="rotate" />
        </ToolRow>

        <ToolRow v-model="blackAndWhite.enabled" title="Black & White" @update:model-value="blackAndWhiteSwitcher">
          <SliderToolControl v-model="blackAndWhite.value" @update:model-value="blackAndWhiteValue" />
        </ToolRow>

        <ToolRow v-model="posterize.enabled" title="Posterize">
          <SliderToolControl v-model="posterize.value" />
        </ToolRow>

        <ToolRow v-model="enhancement.enabled" title="Enhancement">
          <SliderToolControl v-model="enhancement.value" />
        </ToolRow>

        <ToolRow v-model="blur.enabled" title="Blur">
          <SliderToolControl v-model="blur.value" />
        </ToolRow>

        <ToolRow v-model="grid.enabled" title="Grid">
          <SliderToolControl v-model="grid.value" />
        </ToolRow>

        <ToolRow v-model="perspectiveGrid.enabled" title="Perspective Grid">
          <ActionToolControl @click="managePerspectiveGrid" />
        </ToolRow>

        <ToolRow v-model="rulers.enabled" title="Rulers">
          <ActionToolControl @click="manageRulers" />
        </ToolRow>

        <ToolRow v-model="measurements.enabled" title="Measurements">
          <ActionToolControl @click="manageMeasurements" />
        </ToolRow>
      </ToolList>
    </BottomToolPanel>
  </div>
</template>
