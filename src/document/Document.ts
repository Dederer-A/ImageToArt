import { defineStore } from 'pinia';
import type { Layer } from '@/layer/Layer';
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
  // actions: {},
  persist: {
    storage: localStorage,
    afterHydrate: (ctx) => {
      const documentStore = useDocumentRuntimeStore();
      documentStore.initialize(ctx.store.id);
    },
  },
});
