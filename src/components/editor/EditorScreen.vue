<script setup lang="ts">
import { ref } from 'vue';

import { Grid2x2, FlipHorizontal, FlipVertical, Contrast, Palette, Sparkles } from '@lucide/vue';

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

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

const emit = defineEmits<{
  (e: 'go-back'): void;
}>();

function toggleUi() {
  uiVisible.value = !uiVisible.value;
}

function toggleGrig() {
  if (!workplace || !workplace.currentVariant || workplace.currentVariant.isOriginal) return;
  workplace.updateLayerEnable('grid', !workplace.currentVariant.layers['grid'].enabled);
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
  console.log(`[EditorScreen] updateLayerProperty: ${layerType} : ${propertyName} : ${event}`);
  workplace.updateLayerProperty(layerType, propertyName, event);
}

function updateLayerEnable(layerType: string, event: boolean | undefined) {
  console.log(`[EditorScreen] updateLayerEnable: ${layerType} : ${event}`);
  workplace.updateLayerEnable(layerType, event ? event : false);
}
</script>

<template>
  <div class="relative h-dvh w-full overflow-hidden bg-background">
    <EditorCanvas :ui-visible="uiVisible" @click="toggleUi" @double-click="toggleGrig" @swipe-down="goBack">
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
      <div v-if="workplace.currentVariant.isOriginal">
        <p>
          <strong>{{ $t('toolbar.Original_Image_title') }}</strong>
        </p>
        <p>{{ $t('toolbar.Original_Image_description_1') }}</p>
        <p>{{ $t('toolbar.Original_Image_description_2') }}</p>
        <p>{{ $t('toolbar.Original_Image_description_3') }}</p>
      </div>
      <ToolList v-else class="divide-y divide-border">
        <ToolRow
          title="toolbar.Transform"
          :model-value="workplace.currentVariant.layers['transform'].enabled"
          @update:model-value="updateLayerEnable('transform', $event)"
        >
          <div class="flex flex-wrap items-center gap-2">
            <Toggle
              variant="outline"
              size="sm"
              class="data-[state=on]:bg-black data-[state=on]:text-white shrink-0"
              :model-value="workplace.currentVariant.layers['transform'].properties.mirrorHorizontal"
              @update:model-value="
                updateLayerProperty('transform', 'mirrorHorizontal', $event);
                updateLayerEnable(
                  'transform',
                  $event ||
                    workplace.currentVariant.layers['transform'].properties.mirrorVertical ||
                    workplace.currentVariant.layers['transform'].properties.falseColor ||
                    workplace.currentVariant.layers['transform'].properties.inverse ||
                    workplace.currentVariant.layers['transform'].properties.stippling
                );
              "
              aria-label="Toggle Mirror Horizontal"
            >
              <FlipHorizontal class="h-4 w-4" />
            </Toggle>
            <Toggle
              variant="outline"
              size="sm"
              class="data-[state=on]:bg-black data-[state=on]:text-white shrink-0"
              :model-value="workplace.currentVariant.layers['transform'].properties.mirrorVertical"
              @update:model-value="
                updateLayerProperty('transform', 'mirrorVertical', $event);
                updateLayerEnable(
                  'transform',
                  workplace.currentVariant.layers['transform'].properties.mirrorHorizontal ||
                    $event ||
                    workplace.currentVariant.layers['transform'].properties.falseColor ||
                    workplace.currentVariant.layers['transform'].properties.inverse ||
                    workplace.currentVariant.layers['transform'].properties.stippling
                );
              "
              aria-label="Toggle Mirror Vertical"
            >
              <FlipVertical class="h-4 w-4" />
            </Toggle>
            <Toggle
              variant="outline"
              size="sm"
              class="data-[state=on]:bg-black data-[state=on]:text-white shrink-0"
              :model-value="workplace.currentVariant.layers['transform'].properties.falseColor"
              @update:model-value="
                updateLayerProperty('transform', 'falseColor', $event);
                updateLayerEnable(
                  'transform',
                  workplace.currentVariant.layers['transform'].properties.mirrorHorizontal ||
                    workplace.currentVariant.layers['transform'].properties.mirrorVertical ||
                    $event ||
                    workplace.currentVariant.layers['transform'].properties.inverse ||
                    workplace.currentVariant.layers['transform'].properties.stippling
                );
              "
              aria-label="Toggle False Color"
            >
              <Palette class="h-4 w-4" />
            </Toggle>
            <Toggle
              variant="outline"
              size="sm"
              class="data-[state=on]:bg-black data-[state=on]:text-white shrink-0"
              :model-value="workplace.currentVariant.layers['transform'].properties.inverse"
              @update:model-value="
                updateLayerProperty('transform', 'inverse', $event);
                updateLayerEnable(
                  'transform',
                  workplace.currentVariant.layers['transform'].properties.mirrorHorizontal ||
                    workplace.currentVariant.layers['transform'].properties.mirrorVertical ||
                    workplace.currentVariant.layers['transform'].properties.falseColor ||
                    $event ||
                    workplace.currentVariant.layers['transform'].properties.stippling
                );
              "
              aria-label="Toggle Inverse"
            >
              <Contrast class="h-4 w-4" />
            </Toggle>
            <Toggle
              variant="outline"
              size="sm"
              class="data-[state=on]:bg-black data-[state=on]:text-white shrink-0"
              :model-value="workplace.currentVariant.layers['transform'].properties.stippling"
              @update:model-value="
                updateLayerProperty('transform', 'stippling', $event);
                updateLayerEnable(
                  'transform',
                  workplace.currentVariant.layers['transform'].properties.mirrorHorizontal ||
                    workplace.currentVariant.layers['transform'].properties.mirrorVertical ||
                    workplace.currentVariant.layers['transform'].properties.falseColor ||
                    workplace.currentVariant.layers['transform'].properties.inverse ||
                    $event
                );
              "
              aria-label="Toggle Stippling"
            >
              <Sparkles class="h-4 w-4" />
            </Toggle>
          </div>
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
          :model-value="workplace.currentVariant.layers['posterize'].enabled"
          @update:model-value="updateLayerEnable('posterize', $event)"
          title="toolbar.Posterize"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['posterize'].properties.value"
            @update:model-value="updateLayerProperty('posterize', 'value', $event)"
          />
        </ToolRow>
<!--
        <ToolRow
          :model-value="workplace.currentVariant.layers['inkHatching'].enabled"
          @update:model-value="updateLayerEnable('inkHatching', $event)"
          title="toolbar.inkHatching"
        >
          <SliderToolControl
            :model-value="workplace.currentVariant.layers['inkHatching'].properties.value"
            @update:model-value="updateLayerProperty('inkHatching', 'value', $event)"
          />
        </ToolRow> -->

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
              :model-value="workplace.currentVariant.layers['grid'].properties.proportional"
              @update:model-value="
                updateLayerProperty(
                  'grid',
                  'proportional',
                  $event
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
      </ToolList>
    </BottomToolPanel>
  </div>
</template>
