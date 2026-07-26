<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue';

import ActionToolControl from '@/components/tools/ActionToolControl.vue';
import BottomToolPanel from '@/components/editor/BottomToolPanel.vue';
import CropToolControl from '@/components/tools/CropToolControl.vue';
import EditorCanvas from '@/components/editor/EditorCanvas.vue';
import EditorToolbar from '@/components/editor/EditorToolbar.vue';
import RotateToolControl from '@/components/tools/RotateToolControl.vue';
import SliderToolControl from '@/components/tools/SliderToolControl.vue';
import ToolList from '@/components/editor/ToolList.vue';
import ToolRow from '@/components/editor/ToolRow.vue';

import { useDocumentStore } from '@/document/Document';
import { useDocumentRuntimeStore } from '@/document/DocumentRuntime';

const props = defineProps<{
  image: string; // Base64 image representation compatible with IMG Tag
}>();

const cropPresets = [['Portrait', 'Landscape'], ['Free', 'Original', '3:2', '16:9', '4:3', '1:1'], ['Instagram']];

const uiVisible = ref(true);

// -----------------------------------------------------------------------------
// Temporary editor state.
// Later this state will move into Pinia.
// -----------------------------------------------------------------------------

const toolState = reactive({
  crop: {
    enabled: false,
    preset: 'Original',
  },
  rotate: {
    enabled: false,
    rotateLeft: false,
    rotateRight: false,
    flipHorizontal: false,
    flipVertical: false,
  },
  blackAndWhite: {
    enabled: true,
    value: 50,
  },
  posterize: {
    enabled: false,
    value: 50,
  },
  enhancement: {
    enabled: false,
    value: 50,
  },
  blur: {
    enabled: false,
    value: 0,
  },
  grid: {
    enabled: false,
    value: 50,
  },
  perspectiveGrid: {
    enabled: false,
  },
  rulers: {
    enabled: false,
  },
  measurements: {
    enabled: false,
  },
});

watch(toolState.blackAndWhite, (newValue) => {
  applyChanges('blackAndWhite', newValue);
});
watch(toolState.posterize, (newValue) => {
  applyChanges('posterize', newValue);
});
watch(toolState.blur, (newValue) => {
  applyChanges('blur', newValue);
});

function applyChanges(type: string, newValue: any) {
  console.log(`Изменилось свойство внутри ${type}: ${newValue}`);
  const document = useDocumentStore();
  const layers = document.layers;
  for (const layer of layers) {
    if (layer.type == type) {
      layer.enabled = newValue.enabled;
      layer.parameters = newValue;
    }
  }
  const documentRuntime = useDocumentRuntimeStore();
  documentRuntime.version++;
}

onMounted(() => {
  const documentRuntime = useDocumentRuntimeStore();
  documentRuntime.version++;
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

    <BottomToolPanel :visible="uiVisible" :height="35">
      <ToolList class="divide-y divide-border">
        <ToolRow v-model="toolState.crop.enabled" title="Crop">
          <CropToolControl v-model="toolState.crop.preset" :presets="cropPresets" />
        </ToolRow>

        <ToolRow v-model="toolState.rotate.enabled" title="Rotate">
          <RotateToolControl v-model="toolState.rotate" />
        </ToolRow>

        <ToolRow v-model="toolState.blackAndWhite.enabled" title="Black & White">
          <SliderToolControl v-model="toolState.blackAndWhite.value" />
        </ToolRow>

        <ToolRow v-model="toolState.posterize.enabled" title="Posterize">
          <SliderToolControl v-model="toolState.posterize.value" />
        </ToolRow>

        <ToolRow v-model="toolState.enhancement.enabled" title="Enhancement">
          <SliderToolControl v-model="toolState.enhancement.value" />
        </ToolRow>

        <ToolRow v-model="toolState.blur.enabled" title="Blur">
          <SliderToolControl v-model="toolState.blur.value" />
        </ToolRow>

        <ToolRow v-model="toolState.grid.enabled" title="Grid">
          <SliderToolControl v-model="toolState.grid.value" />
        </ToolRow>

        <ToolRow v-model="toolState.perspectiveGrid.enabled" title="Perspective Grid">
          <ActionToolControl @click="managePerspectiveGrid" />
        </ToolRow>

        <ToolRow v-model="toolState.rulers.enabled" title="Rulers">
          <ActionToolControl @click="manageRulers" />
        </ToolRow>

        <ToolRow v-model="toolState.measurements.enabled" title="Measurements">
          <ActionToolControl @click="manageMeasurements" />
        </ToolRow>
      </ToolList>
    </BottomToolPanel>
  </div>
</template>
