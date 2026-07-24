import cv from '@techstark/opencv-js';
import type { Document } from './Document';
import type { HistoryRecord } from '@/history/HistoryRecord';

// Non serializable
export class DocumentRuntime {
  document: Document; // serializable
  historyRecords: HistoryRecord[];

  srcMat: cv.Mat | null = null;
  processedMat: cv.Mat | null = null; // Stays updated after each step
  _isLoaded: boolean = false;

  constructor(document: Document) {
    this.document = document;
    this.historyRecords = [];
  }

  /**
   * Initializes or resets the image state.
   */
  public loadSource(imageElement: HTMLImageElement): void {
    this.dispose();

    try {
      this.srcMat = cv.imread(imageElement);
      // processedMat starts as a perfect clone of the source
      this.processedMat = this.srcMat.clone();
      this._isLoaded = true;
    } catch (error) {
      this.dispose();
      throw new Error(`Failed to load source image: ${error}`);
    }
  }

  /**
   * Modifies the CURRENT state continuously.
   * Operations stack sequentially on top of previous calls.
   */
  public modify(filterType: 'grayscale' | 'blur' | 'canny'): void {
    if (!this.processedMat || !this._isLoaded) {
      throw new Error('No image loaded. Call loadSource() first.');
    }

    // 1. Create a temporary clone of the CURRENT processed state.
    // This serves as our safe computational source buffer.
    const tempIn = this.processedMat.clone();

    try {
      switch (filterType) {
        case 'grayscale':
          // If the image is already 1-channel (gray), cvtColor will crash.
          // We check the channels first to allow safe continuous clicks.
          if (tempIn.channels() > 1) {
            cv.cvtColor(tempIn, this.processedMat, cv.COLOR_RGBA2GRAY);
          }
          break;

        case 'blur':
          const ksize = new cv.Size(15, 15);
          cv.GaussianBlur(tempIn, this.processedMat, ksize, 0, 0, cv.BORDER_DEFAULT);
          break;

        case 'canny':
          // Canny works best on single-channel grayscale images
          if (tempIn.channels() > 1) {
            cv.cvtColor(tempIn, this.processedMat, cv.COLOR_RGBA2GRAY);
            cv.Canny(this.processedMat, this.processedMat, 50, 100, 3, false);
          } else {
            cv.Canny(tempIn, this.processedMat, 50, 100, 3, false);
          }
          break;
      }
    } catch (error) {
      console.error(`Filter ${filterType} failed:`, error);
    } finally {
      // 2. CRITICAL: Free up the temporary operational buffer immediately
      tempIn.delete();
    }
  }

  /**
   * Resets the operational matrix back to the raw uploaded image.
   */
  public resetToOriginal(): void {
    if (!this.srcMat || !this._isLoaded) return;

    if (this.processedMat) this.processedMat.delete();
    this.processedMat = this.srcMat.clone();
  }

  /**
   * Renders the current continuous state to the canvas view layer.
   */
  public render(canvasElement: HTMLCanvasElement): void {
    if (!this.processedMat || !this._isLoaded) {
      throw new Error('No processed matrix content ready to render.');
    }
    cv.imshow(canvasElement, this.processedMat);
  }

  public dispose(): void {
    if (this.srcMat) {
      this.srcMat.delete();
      this.srcMat = null;
    }
    if (this.processedMat) {
      this.processedMat.delete();
      this.processedMat = null;
    }
    this._isLoaded = false;
  }

  public get isLoaded(): boolean {
    return this._isLoaded;
  }
}
