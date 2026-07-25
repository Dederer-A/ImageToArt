import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { HistoryRecord } from '@/history/HistoryRecord';

class DocumentRuntime {
  documentId: string;
  historyRecords: HistoryRecord[];

  constructor(documentId: string) {
    this.documentId = documentId;
    this.historyRecords = [];
  }
  render() {}
}

export const useDocumentRuntimeStore = defineStore(
  'documentRuntime',
  () => {
    const documentRuntime = ref<DocumentRuntime | null>(null);

    function initializeRuntime(documentId: string) {
      documentRuntime.value = new DocumentRuntime(documentId);
    }

    function clearRuntime() {
      documentRuntime.value = null;
    }

    return {
      documentRuntime,
      initializeRuntime,
      clearRuntime,
    };
  },
  { persist: false }
);
