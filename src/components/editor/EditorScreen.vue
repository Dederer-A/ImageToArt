<script setup lang="ts">
import { ref } from 'vue';

import { Grid2x2 } from '@lucide/vue';

import { Toggle } from '@/components/ui/toggle';

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
import { ShareService } from '@/Image/ShareService';

const workplace = useWorkplaceStore();

const uiVisible = ref(true);

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

const emit = defineEmits<{
  (e: 'go-back'): void;
}>();

function toggleUi() {
  uiVisible.value = !uiVisible.value;
}

function goBack() {
  emit('go-back');
}

function reset() {
  workplace.resetCurrentVariant();
}

async function downloadImage() {
  await ShareService.shareImage(workplace.currentVariantImageData!);
}

function deleteEvent(type: 'variant' | 'document') {
  console.log('[EditorScreen] deleteEvent', type);
  if (type === 'variant') {
    workplace.deleteCurrentVariant();
  } else {
    workplace.deleteDocument(workplace.currentDocument.id);
    emit('go-back');
  }
}

function duplicateVariant() {
  workplace.duplicateCurrentVariant();
}

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

    <EditorToolbar
      :visible="uiVisible"
      @back="goBack"
      @reset="reset"
      @export="downloadImage"
      @delete="deleteEvent"
      @duplicate="duplicateVariant"
    />

    <BottomToolPanel v-if="workplace.currentVariant" :visible="uiVisible" :height="30">
      <div v-if="workplace.currentVariant.isOriginal" class="p-4">
        <p class="text-lg pb-1">
          <strong>{{ $t('toolbar.Original_Image_title') }}</strong>
        </p>
        <p>{{ $t('toolbar.Original_Image_description_1') }}</p>
        <p>{{ $t('toolbar.Original_Image_description_2') }}</p>
      </div>
      <ToolList v-else class="divide-y divide-border">
        <ToolRow
          :model-value="workplace.currentVariant.layers['levels'].enabled"
          @update:model-value="updateLayerEnable('levels', $event)"
          title="toolbar.Shadow_Highlight"
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
          title="toolbar.Contrast"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['contrast'].properties.value"
            @update:model-value="updateLayerProperty('contrast', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['gamma'].enabled"
          @update:model-value="updateLayerEnable('gamma', $event)"
          title="toolbar.Gamma"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['gamma'].properties.value"
            @update:model-value="updateLayerProperty('gamma', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['blackAndWhite'].enabled"
          @update:model-value="updateLayerEnable('blackAndWhite', $event)"
          title="toolbar.Black_White"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['blackAndWhite'].properties.value"
            @update:model-value="updateLayerProperty('blackAndWhite', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['posterize'].enabled"
          @update:model-value="updateLayerEnable('posterize', $event)"
          title="toolbar.Posterize"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['posterize'].properties.value"
            @update:model-value="updateLayerProperty('posterize', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['squint'].enabled"
          @update:model-value="updateLayerEnable('squint', $event)"
          title="toolbar.Squint"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['squint'].properties.value"
            @update:model-value="updateLayerProperty('squint', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['edge'].enabled"
          @update:model-value="updateLayerEnable('edge', $event)"
          title="toolbar.Edge"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['edge'].properties.value"
            @update:model-value="updateLayerProperty('edge', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['blur'].enabled"
          @update:model-value="updateLayerEnable('blur', $event)"
          title="toolbar.Blur"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['blur'].properties.value"
            @update:model-value="updateLayerProperty('blur', 'value', $event)"
          />
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['grid'].enabled"
          @update:model-value="updateLayerEnable('grid', $event)"
          title="toolbar.Grid"
        >
          <div class="flex w-full items-center gap-3">
            <SliderToolControl
              class="flex-1"
              :model-value="workplace.currentVariant.layers['grid'].properties.value"
              @update:model-value="updateLayerProperty('grid', 'value', $event)"
              :min="1"
              :max="8"
            />
            <Toggle
              variant="outline"
              size="sm"
              class="shrink-0"
              :class="{
                'bg-accent text-accent-foreground': workplace.currentVariant.layers['grid'].properties.proportional,
              }"
              @click="
                updateLayerProperty(
                  'grid',
                  'proportional',
                  !workplace.currentVariant.layers['grid'].properties.proportional
                )
              "
              aria-label="Toggle Proportional Grid"
            >
              <Grid2x2 class="h-4 w-4" />
            </Toggle>
          </div>
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['goldenRatio'].enabled"
          @update:model-value="updateLayerEnable('goldenRatio', $event)"
          title="toolbar.Golden_Ratio"
        >
        </ToolRow>

        <ToolRow
          :model-value="workplace.currentVariant.layers['ruleOfThirds'].enabled"
          @update:model-value="updateLayerEnable('ruleOfThirds', $event)"
          title="toolbar.Rule_of_Thirds"
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
