import { defineStore } from 'pinia';

import type { HistoryRecord } from '@/history/HistoryRecord';
import { type Document } from './Document';

export interface DocumentRuntime {
  documentId: string;
  historyRecords: HistoryRecord[];
}

export const useDocumentRuntimeStore = defineStore('documentRuntime', {
  state: (): DocumentRuntime => {
    return {
      documentId: '',
      historyRecords: [],
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
