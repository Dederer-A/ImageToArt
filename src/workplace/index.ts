import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { LayerRegistry, type Document, type Variant } from './document';
import { VariantRuntime } from './runtime';
import { ImageEngine } from '@/Image/ImageEngine';

export const useWorkplaceStore = defineStore('workplace', () => {
  // Properties
  const document = ref<Document>();
  const currentVariantId = ref<string>();
  const layerRegistry = new LayerRegistry();
  const variantRuntimes = ref<Record<string, VariantRuntime>>({}); // Where key is the variantId and value is the VariantRuntime instance

  // Computed properties
  const currentVariant = computed(() => {
    if (!document.value || !currentVariantId.value)
      throw new Error('[WorkplaceStore] currentVariant: document or currentVariantId is null');
    const variant = document.value.variants.find((v) => v.id === currentVariantId.value);
    if (!variant) throw new Error('[WorkplaceStore] currentVariant: variant not found');
    return variant;
  });

  const currentVariantRuntime = computed(() => {
    if (!currentVariantId.value) return undefined;
    return getVariantRuntime(currentVariantId.value);
  });

  const currentSourceImageData = computed(() => {
    console.log(`[WorkplaceStore] currentSourceImageData: document=${document.value ? 'exists' : 'null'}`);
    if (!document.value) return undefined;
    return document.value.imageData;
  });

  const currentVariantImageData = computed(() => {
    return currentVariantRuntime.value?.imageData;
  });

  // Functions
  // Local function to get or create a VariantRuntime for a given variantId
  function getVariantRuntime(variantId: string): VariantRuntime {
    let runtime = variantRuntimes.value[variantId];
    if (!runtime) {
      runtime = new VariantRuntime(variantId);
      variantRuntimes.value[variantId] = runtime;
    }
    return runtime;
  }

  function initializeDocument(filename: string, imageData: ImageData) {
    console.log(
      `[WorkplaceStore] initializeDocument(): filename=${filename}, imageData=${imageData.width}x${imageData.height}`
    );
    document.value = {
      id: crypto.randomUUID(),
      filename,
      imageData,
      variants: [],
    };
    createVariant();
    imageProcess();
  }

  function createVariant() {
    if (!document.value) return;
    const newVariant: Variant = {
      id: crypto.randomUUID(),
      readOnly: document.value.variants.length === 0, // The first variant is read-only
      layers: {},
    };
    layerRegistry.list().forEach((layerEngine) => {
      newVariant.layers[layerEngine.type] = {
        enabled: false,
        type: layerEngine.type,
        properties: { ...layerEngine.defaultProperties },
      };
    });
    // console.log(`[WorkplaceStore] createVariant[${document.value.variants.length}]: ${JSON.stringify(newVariant)}`);
    document.value.variants.push(newVariant);

    if (newVariant.readOnly) {
      createVariant();
    } else {
      currentVariantId.value = newVariant.id;
    }
  }

  function duplicateCurrentVariant() {
    if (!document.value || !currentVariantId.value) return;
    const newVariant = JSON.parse(JSON.stringify(currentVariant.value));
    newVariant.id = crypto.randomUUID();
    document.value.variants.push(newVariant);
    currentVariantId.value = newVariant.id;
  }

  function deleteCurrentVariant() {
    if (!document.value || !currentVariantId.value) return;
    const index = document.value.variants.findIndex((v) => v.id === currentVariantId.value);
    if (index !== -1) {
      document.value.variants.splice(index, 1);
      if (document.value.variants[index]) {
        currentVariantId.value = document.value.variants[index].id;
      } else {
        currentVariantId.value = document.value.variants[0]?.id;
      }
    }
  }

  function imageProcess() {
    if (!document.value || !currentVariant.value || !currentVariantRuntime.value) return;
    // TODO in case of the first Variant do need to render, just copy the source image data to the variant image data
    ImageEngine.processImageData(currentVariantRuntime.value);
  }

  function updateCurrentVariantImageData(imageData: ImageData) {
    if (!document.value || !currentVariant.value || !currentVariantRuntime.value) return;
    currentVariantRuntime.value.imageData = ImageEngine.cloneImageData(imageData);
  }

  function initialize() {
    layerRegistry.initialize();
  }

  function updateLayerProperty(layerType: string, property: string, value: any) {
    if (!document.value || !currentVariant.value || !currentVariantRuntime.value) return;
    const layer = currentVariant.value.layers[layerType];
    if (!layer) return;
    layer.enabled = true; // Right now it's not possible to change value without making layer enabled
    layer.properties[property] = value;
    imageProcess();
  }

  function updateLayerEnable(layerType: string, value: boolean) {
    if (!document.value || !currentVariant.value || !currentVariantRuntime.value) return;
    const layer = currentVariant.value.layers[layerType];
    if (!layer) return;
    layer.enabled = value;
    imageProcess();
  }

  return {
    // Properties
    layerRegistry,

    // Computed properties
    currentVariant,
    currentVariantRuntime,
    currentSourceImageData,
    currentVariantImageData,

    // Functions
    initialize,
    initializeDocument,

    createVariant,
    duplicateCurrentVariant,
    deleteCurrentVariant,

    updateLayerProperty,
    updateLayerEnable,
    updateCurrentVariantImageData, // Should be used only in ImageEngine
  };
});
