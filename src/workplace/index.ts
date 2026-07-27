import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Document, Layer } from './document';
import { LayerRegistry } from './document';
import type { LayerEngine } from './layerEngine';
import type { VariantRuntime } from './runtime';

export const useWorkplaceStore = defineStore('workplace', () => {
  // Properties
  const document = ref<Document>();
  const currentVariantId = ref<string>();
  const layerRegistry = new LayerRegistry();
  const variantRuntimes = ref<Record<string, VariantRuntime>>({});

  // Computed properties
  const currentVariant = computed(() => {
    if (!document.value || !currentVariantId.value) return undefined;
    return document.value.variants.find((v) => v.id === currentVariantId.value);
  });

  const currentVariantRuntime = computed(() => {
    if (!currentVariantId.value) return undefined;
    return variantRuntimes.value[currentVariantId.value];
  });

  const currentSourceImageData = computed(() => {
    if (!document.value) return undefined;
    return document.value.imageData;
  });

  const currentVariantImageData = computed(() => {
    return currentVariantRuntime.value?.imageData;
  });

  // Functions
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
    const newVariant = {
      id: crypto.randomUUID(),
      layers: new Map<string, Layer>(),
    };
    layerRegistry.list().forEach((layerEngine) => {
      newVariant.layers.set(layerEngine.name, {
        enabled: false,
        type: layerEngine.name,
        properties: { ...layerEngine.defaultProperties },
      });
    });
    /*
    newVariant.layers.set('contrast', { enabled: true, type: 'contrast', properties: { value: 50 } });
    newVariant.layers.set('saturation', { enabled: true, type: 'saturation', properties: { value: 0 } });
    newVariant.layers.set('gamma', { enabled: true, type: 'gamma', properties: { value: 50 } });
    newVariant.layers.set('blur', { enabled: true, type: 'blur', properties: { value: 0 } });
    newVariant.layers.set('blackAndWhite', { enabled: true, type: 'blackAndWhite', properties: { value: 50 } });
    newVariant.layers.set('posterize', { enabled: true, type: 'posterize', properties: { value: 0 } });
    newVariant.layers.set('squint', { enabled: true, type: 'squint', properties: { value: 0 } });
    newVariant.layers.set('edge', { enabled: true, type: 'edge', properties: { value: 0 } });

    // Grid and others should be the last
    newVariant.layers.set('grid', { enabled: true, type: 'grid', properties: { value: 4 } });
    newVariant.layers.set('goldenRatio', { enabled: true, type: 'goldenRatio', properties: {} });
    newVariant.layers.set('ruleOfThirds', { enabled: true, type: 'ruleOfThirds', properties: {} });
    */
    document.value.variants.push(newVariant);
    currentVariantId.value = newVariant.id;
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
