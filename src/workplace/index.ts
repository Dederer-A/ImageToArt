import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { useDebounceFn } from '@vueuse/core';

import { LayerRegistry, type Document, type Variant } from './document';
import { VariantRuntime } from './runtime';
import { ImageEngine } from '@/Image/ImageEngine';
import { Persistence, type PersistedDocumentInfo } from './persistence';

export { type PersistedDocumentInfo } from './persistence';

export const useWorkplaceStore = defineStore('workplace', () => {
  // Properties
  const document = ref<Document>();
  const layerRegistry = new LayerRegistry();
  const variantRuntimes = ref<Record<string, VariantRuntime>>({}); // Where key is the variantId and value is the VariantRuntime instance

  // Computed properties
  const allVariants = computed(() => {
    if (!document.value) return [];
    return document.value.variants;
  });

  const currentVariantIndex = computed(() => {
    if (!document.value || !document.value.currentVariantId) return -1;
    return findVariantIndex(document.value.variants, document.value.currentVariantId);
  });

  function variantByVariantId(variantId: string): Variant | undefined {
    if (!document.value) return undefined;
    return document.value.variants.find((v) => v.id === variantId);
  }

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

  const currentDocument = computed(() => {
    if (!document.value) throw new Error('[WorkplaceStore] currentDocument: document is null');
    return document.value;
  });

  const currentVariant = computed(() => {
    if (!document.value || !document.value.currentVariantId) return undefined;
    // throw new Error('[WorkplaceStore] currentVariant: document or currentVariantId is null');
    const variant = document.value.variants.find((v) => v.id === document.value!.currentVariantId);
    if (!variant) return undefined;
    // throw new Error('[WorkplaceStore] currentVariant: variant not found');
    return variant;
  });

  function setCurrentVariantIndex(index: number) {
    if (!document.value) return;
    if (index < 0 || index >= document.value.variants.length) return;
    document.value.currentVariantId = document.value.variants[index].id;

    saveDocumentDebounced();
  }

  const currentVariantRuntime = computed(() => {
    if (!document.value?.currentVariantId) return undefined;
    return getVariantRuntime(document.value.currentVariantId);
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
    let runtime = variantRuntimes.value[variantId];
    if (!runtime) {
      if (!document.value) throw new Error('[WorkplaceStore] getVariantRuntime(): document is null or undefined');
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
      version: '1.0.0',
    };
    createVariant();
    imageProcess();
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
      document.value.currentVariantId = newVariant.id;
    }

    saveDocumentDebounced();
  }

  function resetCurrentVariant() {
    if (!document.value || !document.value.currentVariantId || !currentVariantRuntime.value) return;
    const variant = currentVariant.value;
    if (!variant) return;
    variant.layers = {};
    layerRegistry.list().forEach((layerEngine) => {
      variant.layers[layerEngine.type] = {
        enabled: false,
        type: layerEngine.type,
        properties: { ...layerEngine.defaultProperties },
      };
    });
    currentVariantRuntime.value.renderedImageData = ImageEngine.cloneImageData(document.value.imageData);

    saveDocumentDebounced();
  }

  function duplicateCurrentVariant() {
    if (!document.value || !document.value.currentVariantId || !currentVariantRuntime.value) return;
    const newVariant = JSON.parse(JSON.stringify(currentVariant.value));
    newVariant.id = crypto.randomUUID();
    newVariant.isOriginal = false;
    const newVariantRuntime = currentVariantRuntime.value.clone(newVariant.id);
    variantRuntimes.value[newVariantRuntime.variantId] = newVariantRuntime;
    document.value.variants.push(newVariant);
    document.value.currentVariantId = newVariant.id;

    saveDocumentDebounced();
  }

  function deleteCurrentVariant() {
    if (!document.value || !document.value.currentVariantId) return;
    const index = findVariantIndex(document.value.variants, document.value.currentVariantId);
    if (index !== -1) {
      // console.log('!!! ' + index + ' ' + document.value.variants.length + ' / ' + document.value.variants[index].id);
      document.value.variants.splice(index, 1);
      if (document.value.variants[index]) {
        document.value.currentVariantId = document.value.variants[index].id;
      } else {
        document.value.currentVariantId = document.value.variants[document.value.variants.length - 1]?.id;
      }
    }
    // console.log(`[WorkplaceStore] deleteCurrentVariant: variants: ${document.value.variants.length}`);
    if (document.value.variants.length === 1) {
      createVariant();
    }

    saveDocumentDebounced();
  }

  function imageProcess() {
    if (!document.value || !currentVariant.value || !currentVariantRuntime.value) return;
    // TODO in case of the first Variant do need to render, just copy the source image data to the variant image data
    ImageEngine.processImageData(document.value.imageData, currentVariantRuntime.value);
  }

  function updateVariantImageData(variantId: string, imageData: ImageData) {
    getVariantRuntime(variantId).renderedImageData = imageData;
  }

  function initialize() {
    console.log('[WorkplaceStore] initialize()');
    layerRegistry.initialize();
  }

  function updateLayerProperty(layerType: string, property: string, value: any) {
    if (!document.value || !currentVariant.value || !currentVariantRuntime.value) return;
    const layer = currentVariant.value.layers[layerType];
    if (!layer) return;
    layer.enabled = true; // Right now it's not possible to change value without making layer enabled
    layer.properties[property] = value;
    imageProcess();

    saveDocumentDebounced();
  }

  function updateLayerEnable(layerType: string, value: boolean) {
    if (!document.value || !currentVariant.value || !currentVariantRuntime.value) return;
    const layer = currentVariant.value.layers[layerType];
    if (!layer) return;
    layer.enabled = value;
    imageProcess();

    saveDocumentDebounced();
  }

  // Persistence functions
  async function listImages(): Promise<PersistedDocumentInfo[]> {
    return await Persistence.list();
  }

  async function deleteDocument(documentId: string): Promise<void> {
    if (document.value && document.value.id === documentId) {
      document.value = undefined;
    }
    await Persistence.delete(documentId);
    await Persistence.clearCurrentDocument();
  }

  async function setCurrentDocument(id: string): Promise<void> {
    await Persistence.setCurrentDocument(id);
  }

  async function getCurrentDocumentId(): Promise<string | null> {
    if (document.value) return document.value.id; // (property) Document.id: string
    return Persistence.getCurrentDocumentId();
  }

  async function clearCurrentDocument(): Promise<void> {
    document.value = undefined;
    await Persistence.clearCurrentDocument();
  }

  const saveDocumentDebounced = useDebounceFn(async () => {
    await saveDocument();
  }, 500);

  async function saveDocument() {
    console.log('[WorkplaceStore] saveDocument()');
    if (!document.value) return;
    await Persistence.save(document.value);
  }

  async function loadDocument(documentId: string) {
    console.log('[WorkplaceStore] loadDocument()');
    const doc = await Persistence.load(documentId);
    console.log(`[WorkplaceStore] loadDocument(): doc=${doc ? 'loaded' : 'null'}`);
    console.log(`[WorkplaceStore] loadDocument(): doc.imageData=${doc?.imageData ? 'exists' : 'null'}`);
    if (doc) {
      document.value = doc;
      // Create VariantRuntime instances for each variant in the loaded document
      doc.variants.forEach((variant) => {
        const runtime = new VariantRuntime(variant.id);
        variantRuntimes.value[variant.id] = runtime;
        ImageEngine.render(doc.imageData, runtime);
        console.log(`[WorkplaceStore] loadDocument(): created VariantRuntime for variantId=${variant.id}`);
        console.log(
          `[WorkplaceStore] loadDocument(): created VariantRuntime for renderedImageData=${runtime.renderedImageData ? 'exists' : 'null'}`
        );
      });
    }
  }

  async function clearDocument() {
    await Persistence.clear();
  }

  // ===================================

  return {
    // Properties
    layerRegistry,

    // Computed properties
    sourceImageData,
    allVariants,
    currentDocument,
    currentVariantIndex,
    currentVariant,
    currentVariantRuntime,
    currentSourceImageData,
    currentVariantImageData,
    variantByVariantId,
    variantRuntimeByIndex,

    // Functions
    initialize,
    initializeDocument,

    createVariant,
    resetCurrentVariant,
    duplicateCurrentVariant,
    deleteCurrentVariant,

    variantImageDataByIndex,
    setCurrentVariantIndex,

    updateLayerProperty,
    updateLayerEnable,
    updateVariantImageData, // Should be used only in ImageEngine

    clearDocument,

    // From persistence
    saveDocument,
    listImages,
    loadDocument,
    deleteDocument,
    setCurrentDocument,
    getCurrentDocumentId,
    clearCurrentDocument,
  };
});
