<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue';

// import ActionToolControl from '@/components/tools/ActionToolControl.vue';
import BottomToolPanel from '@/components/editor/BottomToolPanel.vue';
// import CropToolControl from '@/components/tools/CropToolControl.vue';
import EditorCanvas from '@/components/editor/EditorCanvas.vue';
import EditorToolbar from '@/components/editor/EditorToolbar.vue';
// import RotateToolControl from '@/components/tools/RotateToolControl.vue';
import SliderToolControl from '@/components/tools/SliderToolControl.vue';
import ToolList from '@/components/editor/ToolList.vue';
import ToolRow from '@/components/editor/ToolRow.vue';

import { useDocumentStore } from '@/document/Document';
import { useDocumentRuntimeStore } from '@/document/DocumentRuntime';

const props = defineProps<{
  image: string; // Base64 image representation compatible with IMG Tag
}>();

// const cropPresets = [['Portrait', 'Landscape'], ['Free', 'Original', '3:2', '16:9', '4:3', '1:1'], ['Instagram']];

const uiVisible = ref(true);

// -----------------------------------------------------------------------------
// Temporary editor state.
// Later this state will move into Pinia.
// -----------------------------------------------------------------------------

const toolState = reactive({
  gridPresets: {
    enabled: false,
    preset: 'Grid',
  },
  rotate: {
    enabled: false,
    rotateLeft: false,
    rotateRight: false,
    flipHorizontal: false,
    flipVertical: false,
  },
  contrast: {
    enabled: true,
    value: 50,
  },
  blackAndWhite: {
    enabled: true,
    value: 50,
  },
  posterize: {
    enabled: false,
    value: 50,
  },
  blur: {
    enabled: false,
    value: 0,
  },
  squint: {
    enabled: false,
    value: 0,
  },
  edge: {
    enabled: false,
    value: 0,
  },
  gamma: {
    enabled: false,
    value: 50,
  },
  grid: {
    enabled: false,
    value: 1,
  },
  goldenRatio: {
    enabled: false,
  },
  ruleOfThirds: {
    enabled: false,
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
watch(toolState.grid, (newValue) => {
  applyChanges('grid', newValue);
});

watch(toolState.contrast, (newValue) => {
  applyChanges('contrast', newValue);
});
watch(toolState.gamma, (newValue) => {
  applyChanges('gamma', newValue);
});
// watch(toolState.saturation, (newValue) => {
//   applyChanges('saturation', newValue);
// });
watch(toolState.squint, (newValue) => {
  applyChanges('squint', newValue);
});
watch(toolState.edge, (newValue) => {
  applyChanges('edge', newValue);
});
watch(toolState.goldenRatio, (newValue) => {
  applyChanges('goldenRatio', newValue);
});
watch(toolState.ruleOfThirds, (newValue) => {
  applyChanges('ruleOfThirds', newValue);
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
/*
function managePerspectiveGrid() {
  // TODO
}

function manageRulers() {
  // TODO
}

function manageMeasurements() {
  // TODO
}
*/
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

    <BottomToolPanel :visible="uiVisible" :height="30">
      <ToolList class="divide-y divide-border">
        <!-- <ToolRow v-model="toolState.crop.enabled" title="Crop">
          <CropToolControl v-model="toolState.crop.preset" :presets="cropPresets" />
        </ToolRow> -->

        <!-- <ToolRow v-model="toolState.rotate.enabled" title="Rotate">
          <RotateToolControl v-model="toolState.rotate" />
        </ToolRow> -->

        <ToolRow v-model="toolState.contrast.enabled" title="Contrast">
          <SliderToolControl v-model="toolState.contrast.value" />
        </ToolRow>

        <ToolRow v-model="toolState.gamma.enabled" title="Gamma">
          <SliderToolControl v-model="toolState.gamma.value" />
        </ToolRow>

        <ToolRow v-model="toolState.blackAndWhite.enabled" title="Black & White">
          <SliderToolControl v-model="toolState.blackAndWhite.value" />
        </ToolRow>

        <ToolRow v-model="toolState.posterize.enabled" title="Posterize">
          <SliderToolControl v-model="toolState.posterize.value" />
        </ToolRow>

        <ToolRow v-model="toolState.squint.enabled" title="Squint">
          <SliderToolControl v-model="toolState.squint.value" />
        </ToolRow>

        <ToolRow v-model="toolState.edge.enabled" title="Edge">
          <SliderToolControl v-model="toolState.edge.value" />
        </ToolRow>

        <ToolRow v-model="toolState.blur.enabled" title="Blur">
          <SliderToolControl v-model="toolState.blur.value" />
        </ToolRow>

        <ToolRow v-model="toolState.grid.enabled" title="Grid">
          <SliderToolControl v-model="toolState.grid.value" :min="1" :max="8" />
        </ToolRow>

        <ToolRow v-model="toolState.goldenRatio.enabled" title="Golden Ratio"> </ToolRow>

        <ToolRow v-model="toolState.ruleOfThirds.enabled" title="Rule of Thirds"> </ToolRow>

        <ToolRow v-model="toolState.gridPresets.enabled" title="Grid Presets">
          <!-- <div class="flex gap-2 pb-1">
            <ButtonGroup>
              <Button size="sm" variant="outline">Grid</Button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="outline" size="icon" aria-label="More Options">
                    <MoreHorizontalIcon />
                  </Button>
                  <DropdownMenuContent align="end" class="w-52">
                    <DropdownMenuItem> 2 </DropdownMenuItem>
                    <DropdownMenuItem> 3 </DropdownMenuItem>
                    <DropdownMenuItem> 4 </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </ButtonGroup>
          </div> -->
        </ToolRow>

        <!-- <ToolRow v-model="toolState.perspectiveGrid.enabled" title="Perspective Grid">
          <ActionToolControl @click="managePerspectiveGrid" />
        </ToolRow> -->

        <!-- <ToolRow v-model="toolState.rulers.enabled" title="Rulers">
          <ActionToolControl @click="manageRulers" />
        </ToolRow> -->

        <!-- <ToolRow v-model="toolState.measurements.enabled" title="Measurements">
          <ActionToolControl @click="manageMeasurements" />
        </ToolRow> -->
      </ToolList>
    </BottomToolPanel>
  </div>
</template>
