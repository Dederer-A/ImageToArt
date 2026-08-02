<script setup lang="ts">
import { ref } from 'vue';

// import ActionToolControl from '@/components/tools/ActionToolControl.vue';
import BottomToolPanel from '@/components/editor/BottomToolPanel.vue';
// import CropToolControl from '@/components/tools/CropToolControl.vue';
import EditorCanvas from '@/components/EditorCanvas/EditorCanvas.vue';
import EditorToolbar from '@/components/editor/EditorToolbar.vue';
// import RotateToolControl from '@/components/tools/RotateToolControl.vue';
import SliderToolControl from '@/components/tools/SliderToolControl.vue';
import SliderRangeToolControl from '@/components/tools/SliderRangeToolControl.vue';

import ToolList from '@/components/editor/ToolList.vue';
import ToolRow from '@/components/editor/ToolRow.vue';

// const cropPresets = [['Portrait', 'Landscape'], ['Free', 'Original', '3:2', '16:9', '4:3', '1:1'], ['Instagram']];

import { useWorkplaceStore } from '@/workplace/index';

const workplace = useWorkplaceStore();

const uiVisible = ref(true);

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

function updateLayerProperty(layerType: string, propertyName: string, event: any) {
  workplace.updateLayerProperty(layerType, propertyName, event);
}

function updateLayerEnable(layerType: string, event: boolean | undefined) {
  workplace.updateLayerEnable(layerType, event ? event : false);
}
</script>

<template>
  <div class="relative h-dvh w-full overflow-hidden bg-background">
    <EditorCanvas @click="toggleUi">
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
      <div v-if="workplace.currentVariant.isOriginal" class="p-6">
        <p class="text-lg pb-5"><strong>Original Image</strong></p>
        <p>Swipe to the right to start working with variants</p>
      </div>
      <ToolList v-else class="divide-y divide-border">
        <ToolRow
          :model-value="workplace.currentVariant.layers['levels'].enabled"
          @update:model-value="updateLayerEnable('levels', $event)"
          title="Levels"
        >
          <SliderRangeToolControl
            :model-value="workplace.currentVariant.layers['levels'].properties.value"
            :min="0"
            :max="255"
            :step="1"
            @update:model-value="updateLayerProperty('levels', 'value', $event)"
          />
        </ToolRow>

        <!-- <ToolRow v-model="toolState.crop.enabled" title="Crop">
          <CropToolControl v-model="toolState.crop.preset" :presets="cropPresets" />
        </ToolRow> -->

        <!-- <ToolRow v-model="toolState.rotate.enabled" title="Rotate">
          <RotateToolControl v-model="toolState.rotate" />
        </ToolRow> -->

        <ToolRow
          :model-value="workplace.currentVariant.layers['contrast'].enabled"
          @update:model-value="updateLayerEnable('contrast', $event)"
          title="Contrast"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['contrast'].properties.value"
            @update:model-value="updateLayerProperty('contrast', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['gamma'].enabled"
          @update:model-value="updateLayerEnable('gamma', $event)"
          title="Gamma"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['gamma'].properties.value"
            @update:model-value="updateLayerProperty('gamma', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['blackAndWhite'].enabled"
          @update:model-value="updateLayerEnable('blackAndWhite', $event)"
          title="Black & White"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['blackAndWhite'].properties.value"
            @update:model-value="updateLayerProperty('blackAndWhite', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['posterize'].enabled"
          @update:model-value="updateLayerEnable('posterize', $event)"
          title="Posterize"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['posterize'].properties.value"
            @update:model-value="updateLayerProperty('posterize', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['squint'].enabled"
          @update:model-value="updateLayerEnable('squint', $event)"
          title="Squint"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['squint'].properties.value"
            @update:model-value="updateLayerProperty('squint', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['edge'].enabled"
          @update:model-value="updateLayerEnable('edge', $event)"
          title="Edge"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['edge'].properties.value"
            @update:model-value="updateLayerProperty('edge', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['blur'].enabled"
          @update:model-value="updateLayerEnable('blur', $event)"
          title="Blur"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['blur'].properties.value"
            @update:model-value="updateLayerProperty('blur', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['grid'].enabled"
          @update:model-value="updateLayerEnable('grid', $event)"
          title="Grid"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['grid'].properties.value"
            @update:model-value="updateLayerProperty('grid', 'value', $event)"
            :min="1"
            :max="8"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['goldenRatio'].enabled"
          @update:model-value="updateLayerEnable('goldenRatio', $event)"
          title="Golden Ratio"
        >
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['ruleOfThirds'].enabled"
          @update:model-value="updateLayerEnable('ruleOfThirds', $event)"
          title="Rule of Thirds"
        >
        </ToolRow>

        <!-- <ToolRow v-model="toolState.gridPresets.enabled" title="Grid Presets"> -->
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
        <!-- </ToolRow> -->

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
