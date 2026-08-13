<script setup lang="ts">
import { ref } from 'vue';

import { Grid2x2 } from '@lucide/vue';

import { Toggle } from '@/components/ui/toggle';

import BottomToolPanel from '@/components/editor/BottomToolPanel.vue';
import EditorCanvas from '@/components/EditorCanvas/EditorCanvas.vue';
import EditorToolbar from '@/components/editor/EditorToolbar.vue';
import SliderToolControl from '@/components/tools/SliderToolControl.vue';
import SliderRangeToolControl from '@/components/tools/SliderRangeToolControl.vue';

import ToolList from '@/components/editor/ToolList.vue';
import ToolRow from '@/components/editor/ToolRow.vue';

// const cropPresets = [['Portrait', 'Landscape'], ['Free', 'Original', '3:2', '16:9', '4:3', '1:1'], ['Instagram']];

import { useWorkplaceStore } from '@/workplace/index';
import { ShareService } from '@/Image/ShareService';

const workplace = useWorkplaceStore();

const uiVisible = ref(true);

const isDragging = ref(false);

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
      <!--
      :class="
        isDragging
          ? 'bg-background/10 border-border/20 backdrop-blur-sm'
          : 'bg-background/90 border-border backdrop-blur-md'
      "
  -->
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
            @pointerdown="isDragging = true"
            @pointerup="isDragging = false"
            @value-commit="isDragging = false"
          />
        </ToolRow>

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
        <!--
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
        -->
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
          :model-value="workplace.currentVariant.layers['threshold'].enabled"
          @update:model-value="updateLayerEnable('threshold', $event)"
          title="toolbar.Threshold"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['threshold'].properties.value"
            @update:model-value="updateLayerProperty('threshold', 'value', $event)"
            :min="0"
            :max="255"
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
              class="data-[state=on]:bg-black data-[state=on]:text-white shrink-0"
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
        <ToolRow
          :model-value="workplace.currentVariant.layers['falseColor'].enabled"
          @update:model-value="updateLayerEnable('falseColor', $event)"
          title="toolbar.FalseColor"
        >
        </ToolRow>
      </ToolList>
    </BottomToolPanel>
  </div>
</template>
