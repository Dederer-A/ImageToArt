import { defineStore } from 'pinia';

import type { HistoryRecord } from '@/history/HistoryRecord';
import { type Document } from './Document';

export interface DocumentRuntime {
  documentId: string;
  historyRecords: HistoryRecord[];
  srcImageData: ImageData | null;
  currentImageData: ImageData | null;
  version: number;
}

export const useDocumentRuntimeStore = defineStore('documentRuntime', {
  state: (): DocumentRuntime => {
    return {
      documentId: '',
      historyRecords: [],
      srcImageData: null,
      currentImageData: null,
      version: 0,
    };
  },
  actions: {
    initialize(document: Document) {
      console.log('DocumentRuntime initialized for Document: ' + document.id);
      this.documentId = document.id;
      this.historyRecords = [];
    },
  },
  persist: false,
});
