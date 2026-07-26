import { defineStore } from 'pinia';
import { Layer } from '@/layer/Layer';
import { useDocumentRuntimeStore } from './DocumentRuntime';

export interface Document {
  id: string;
  sourceImage: string | null; // base64 source image representation
  layers: Layer[];
}

export const useDocumentStore = defineStore('document', {
  state: (): Document => {
    return {
      id: crypto.randomUUID(),
      sourceImage: null,
      layers: [],
    };
  },
  // getters: {},
  actions: {
    initialize(srcImage: string) {
      this.sourceImage = srcImage;
      this.layers = [];
      this.layers.push(new Layer('contrast', false, { value: 0 }));
      this.layers.push(new Layer('saturation', false, { value: 0 }));
      this.layers.push(new Layer('gamma', false, { value: 50 }));
      this.layers.push(new Layer('blur', false, { value: 0 }));
      this.layers.push(new Layer('blackAndWhite', false, { value: 25 }));
      this.layers.push(new Layer('posterize', false, { value: 50 }));
      this.layers.push(new Layer('squint', false, { value: 0 }));
      this.layers.push(new Layer('edge', false, { value: 0 }));

      // Grid and others should be the last
      this.layers.push(new Layer('grid', false, { value: 1 }));
      this.layers.push(new Layer('goldenRatio', false, { value: 1 }));
      this.layers.push(new Layer('ruleOfThirds', false, { value: 1 }));
    },
  },
  persist: {
    storage: localStorage,
    afterHydrate: (ctx) => {
      const documentStore = useDocumentRuntimeStore();
      documentStore.initialize(ctx.store.id);
    },
  },
});
