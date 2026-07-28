import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { Document, Variant } from './document';
import { LayerRegistry } from './document';
import type { LayerEngine } from './layerEngine';
import { VariantRuntime } from './runtime';

export const useWorkplaceStore = defineStore('workplace', () => {
  // Properties
  const document = ref<Document>();
  const currentVariantId = ref<string>();
  const layerRegistry = new LayerRegistry();
  const variantRuntimes = ref<Record<string, VariantRuntime>>({}); // Where key is the variantId and value is the VariantRuntime instance

  // Computed properties
  const currentVariant = computed(() => {
    if (!document.value || !currentVariantId.value) return undefined;
    return document.value.variants.find((v) => v.id === currentVariantId.value);
  });

  const currentVariantRuntime = computed(() => {
    if (!currentVariantId.value) return undefined;
    return getVariantRuntime(currentVariantId.value);
  });

  const currentSourceImageData = computed(() => {
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
    document.value = {
      id: crypto.randomUUID(),
      filename,
      imageData,
      variants: [],
    };
    createVariant();
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
    /*
    newVariant.layers['contrast'] = { enabled: true, type: 'contrast', properties: { value: 50 } };
    newVariant.layers['saturation'] = { enabled: true, type: 'saturation', properties: { value: 0 } };
    newVariant.layers['gamma'] = { enabled: true, type: 'gamma', properties: { value: 50 } };
    newVariant.layers['blur'] = { enabled: true, type: 'blur', properties: { value: 0 } };
    newVariant.layers['blackAndWhite'] = { enabled: true, type: 'blackAndWhite', properties: { value: 50 } };
    newVariant.layers['posterize'] = { enabled: true, type: 'posterize', properties: { value: 0 } };
    newVariant.layers['squint'] = { enabled: true, type: 'squint', properties: { value: 0 } };
    newVariant.layers['edge'] = { enabled: true, type: 'edge', properties: { value: 0 } };

    // Grid and others should be the last
    newVariant.layers['grid'] = { enabled: true, type: 'grid', properties: { value: 4 } };
    newVariant.layers['goldenRatio'] = { enabled: true, type: 'goldenRatio', properties: {} };
    newVariant.layers['ruleOfThirds'] = { enabled: true, type: 'ruleOfThirds', properties: {} };
    */
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

  function registerLayerEngine(layerEngine: LayerEngine) {
    layerRegistry.register(layerEngine);
  }

  function getLayerEngine(name: string): LayerEngine | undefined {
    return layerRegistry.get(name);
  }

  return {
    // Computed properties
    currentVariant,
    currentVariantRuntime,
    currentSourceImageData,
    currentVariantImageData,

    // Functions
    initializeDocument,

    createVariant,
    duplicateCurrentVariant,
    deleteCurrentVariant,

    registerLayerEngine,
    getLayerEngine,
  };
});
