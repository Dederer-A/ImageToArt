import { defineStore } from 'pinia';

import type { Layer } from '@/layer/Layer';

interface Document {
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
      console.log('Document afterHydrate event: ' + ctx.store.$id);
    },
  },
});
