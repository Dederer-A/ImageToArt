import { defineStore } from 'pinia';

import type { HistoryRecord } from '@/history/HistoryRecord';

interface DocumentRuntime {
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
    initialize(documentId: string) {
      console.log('DocumentRuntime initialized for Document: ' + documentId);
      this.documentId = documentId;
      this.historyRecords = [];
    },
  },
  persist: false,
});
