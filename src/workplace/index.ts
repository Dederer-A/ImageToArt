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
  const allVariants = computed(() => {
    if (!document.value) return [];
    return document.value.variants;
  });

  const currentVariantIndex = computed(() => {
    if (!document.value || !currentVariantId.value) return -1;
    return findVariantIndex(document.value.variants, currentVariantId.value);
  });

  const variantRuntimeByIndex = computed(() => {
    if (!document.value || currentVariantIndex.value === -1) return undefined;
    return getVariantRuntime(document.value.variants[currentVariantIndex.value].id);
  });

  function variantImageDataByIndex(index: number): ImageData {
    if (!document.value)
      throw new Error('[WorkplaceStore] variantImageDataByIndex: document or currentVariantIndex is null');
    const variantId = document.value.variants[index].id;
    const runtime = getVariantRuntime(variantId);
    if (!runtime.renderedImageData) throw new Error('[WorkplaceStore] variantImageDataByIndex: runtime is null');
    return runtime.renderedImageData;
  }

  const sourceImageData = computed(() => {
    if (!document.value) return undefined;
    return document.value.imageData;
  });

  const currentVariant = computed(() => {
    if (!document.value || !currentVariantId.value)
      throw new Error('[WorkplaceStore] currentVariant: document or currentVariantId is null');
    const variant = document.value.variants.find((v) => v.id === currentVariantId.value);
    if (!variant) throw new Error('[WorkplaceStore] currentVariant: variant not found');
    return variant;
  });

  function setCurrentVariantIndex(index: number) {
    if (!document.value) return;
    if (index < 0 || index >= document.value.variants.length) return;
    currentVariantId.value = document.value.variants[index].id;
  }

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
    return currentVariantRuntime.value?.renderedImageData;
  });

  // Functions
  // Local function to get or create a VariantRuntime for a given variantId
  function getVariantRuntime(variantId: string): VariantRuntime {
    if (!document.value) throw new Error('[WorkplaceStore] getVariantRuntime(): document is null or undefined');
    let runtime = variantRuntimes.value[variantId];
    if (!runtime) {
      runtime = new VariantRuntime(variantId);
      runtime.renderedImageData = ImageEngine.cloneImageData(document.value.imageData);
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

  function nextVariant() {
    setCurrentVariantIndex(currentVariantIndex.value + 1);
    console.log(`[Workplace] nextVariant: currentVariantId: ${currentVariantId.value}`);
  }

  function previousVariant() {
    setCurrentVariantIndex(currentVariantIndex.value - 1);
    console.log(`[Workplace] previousVariant: currentVariantId: ${currentVariantId.value}`);
  }

  function findVariantIndex(variants: Variant[], variantId: string): number {
    return variants.findIndex((variant) => variant.id === variantId);
  }

  function createVariant() {
    if (!document.value) return;
    const newVariant: Variant = {
      id: crypto.randomUUID(),
      isOriginal: document.value.variants.length === 0, // The first variant is read-only
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

    if (newVariant.isOriginal) {
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
    currentVariantRuntime.value.renderedImageData = ImageEngine.cloneImageData(imageData);
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
    sourceImageData,
    allVariants,
    currentVariantIndex,
    currentVariant,
    currentVariantRuntime,
    currentSourceImageData,
    currentVariantImageData,
    variantRuntimeByIndex,

    // Functions
    initialize,
    initializeDocument,

    createVariant,
    duplicateCurrentVariant,
    deleteCurrentVariant,
    nextVariant,
    previousVariant,

    variantImageDataByIndex,
    setCurrentVariantIndex,

    updateLayerProperty,
    updateLayerEnable,
    updateCurrentVariantImageData, // Should be used only in ImageEngine
  };
});
