import { defineStore } from 'pinia';

import type { OpenCV } from '@opencvjs/web';

import type { HistoryRecord } from '@/history/HistoryRecord';
import { type Document } from './Document';

export interface DocumentRuntime {
  documentId: string;
  historyRecords: HistoryRecord[];
  srcMat: OpenCV.Mat | null;
  currentMat: OpenCV.Mat | null;
}

export const useDocumentRuntimeStore = defineStore('documentRuntime', {
  state: (): DocumentRuntime => {
    return {
      documentId: '',
      historyRecords: [],
      srcMat: null,
      currentMat: null,
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
