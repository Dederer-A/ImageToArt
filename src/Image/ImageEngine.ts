import { type Document } from '@/document/Document';
import { type DocumentRuntime } from '@/document/DocumentRuntime';

export class ImageEngine {
  public static process(document: Document, _documentRuntime: DocumentRuntime) {
    console.log(`[ImageEngine] process(${document.id})`);
  }
}
