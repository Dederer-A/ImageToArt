import { type Document } from './document';

import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

const DOCUMENTS_DIRECTORY = 'documents';

const CURRENT_FILE_NAME = 'current.json';

const THUMBNAIL_SUFFIX = '_thumbnail.jpg';
const ORIGINAL_SUFFIX = '_original.jpg';
const JSON_SUFFIX = '.json';

const THUMBNAIL_SIZE = 400;
const ORIGINAL_JPEG_QUALITY = 0.92;
const THUMBNAIL_JPEG_QUALITY = 0.75;

export interface PersistedDocumentInfo {
  id: string;
  thumbnailUrl: string;
}
  
interface CurrentDocument {
  id: string;
}

type SerializedDocument = Omit<Document, 'imageData'>;

export class Persistence {
  /**
   * Returns true when running as a native Capacitor application.
   */
  static isSupported(): boolean {
    return Capacitor.isNativePlatform();
  }

  // ===========================================================================
  // Documents
  // ===========================================================================

  /**
   * Saves a document.
   *
   * Three files are stored:
   *
   *   documents/<id>_thumbnail.jpg
   *   documents/<id>_original.jpg
   *   documents/<id>.json
   *
   * The id is taken from document.id.
   *
   * imageData is converted to JPEG and stored separately.
   * The JSON contains the Document without imageData.
   *
   * If anything fails, all three document files are removed.
   */
  static async save(document: Document): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    const id = document.id;

    try {
      const originalBlob = await imageDataToJpegBlob(document.imageData, ORIGINAL_JPEG_QUALITY);

      const thumbnailBlob = await imageDataToJpegBlob(document.imageData, THUMBNAIL_JPEG_QUALITY, THUMBNAIL_SIZE);

      const serializedDocument: SerializedDocument = {
        ...document,
      };

      // imageData is stored separately as JPEG.
      delete (serializedDocument as Partial<Document>).imageData;

      await Filesystem.writeFile({
        directory: Directory.Data,
        path: this.getOriginalPath(id),
        data: await blobToBase64(originalBlob),
        recursive: true,
      });

      await Filesystem.writeFile({
        directory: Directory.Data,
        path: this.getThumbnailPath(id),
        data: await blobToBase64(thumbnailBlob),
        recursive: true,
      });

      await Filesystem.writeFile({
        directory: Directory.Data,
        path: this.getJsonPath(id),
        data: JSON.stringify(serializedDocument),
        encoding: Encoding.UTF8,
        recursive: true,
      });
    } catch (error) {
      console.error(`[Persistence] Failed to save document ${id}`, error);

      // The document is considered invalid if any of its
      // files could not be written successfully.
      await this.deleteDocumentFilesQuietly(id);

      // Preserve the original save error.
      throw error;
    }
  }

  /**
   * Returns all persisted documents.
   *
   * Only thumbnail files are inspected.
   * JSON files are NOT read or parsed.
   *
   * The returned thumbnailUrl can be used directly as:
   *
   *   <img :src="item.thumbnailUrl">
   */
  static async list(): Promise<PersistedDocumentInfo[]> {
    if (!this.isSupported()) {
      return [];
    }

    try {
      const result = await Filesystem.readdir({
        directory: Directory.Data,
        path: DOCUMENTS_DIRECTORY,
      });

      const documents: PersistedDocumentInfo[] = [];

      for (const file of result.files) {
        const filename = typeof file === 'string' ? file : file.name;

        if (!filename.endsWith(THUMBNAIL_SUFFIX)) {
          continue;
        }

        const id = filename.slice(0, -THUMBNAIL_SUFFIX.length);

        const thumbnailUrl = await this.getThumbnailUrl(id);

        if (!thumbnailUrl) {
          continue;
        }

        documents.push({
          id,
          thumbnailUrl,
        });
      }

      return documents;
    } catch {
      return [];
    }
  }

  /**
   * Loads a complete document.
   *
   * The JSON contains the document structure.
   * The original JPG is loaded separately and converted
   * back into ImageData.
   */
  static async load(id: string): Promise<Document | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const jsonResult = await Filesystem.readFile({
        directory: Directory.Data,
        path: this.getJsonPath(id),
        encoding: Encoding.UTF8,
      });

      if (typeof jsonResult.data !== 'string') {
        return null;
      }

      const serialized = JSON.parse(jsonResult.data) as SerializedDocument;

      const imageData = await this.loadOriginalImageData(id);

      return {
        ...serialized,
        imageData,
      };
    } catch (error) {
      console.error(`[Persistence] Failed to load document ${id}`, error);

      return null;
    }
  }

  /**
   * Deletes a document.
   *
   * Deletes:
   *
   *   documents/<id>_thumbnail.jpg
   *   documents/<id>_original.jpg
   *   documents/<id>.json
   *
   * If this document is the current document,
   * current.json is deleted as well.
   */
  static async delete(id: string): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    const currentId = await this.getCurrentDocumentId();

    if (currentId === id) {
      await this.clearCurrentDocument();
    }

    const paths = [this.getThumbnailPath(id), this.getOriginalPath(id), this.getJsonPath(id)];

    const results = await Promise.allSettled(
      paths.map((path) =>
        Filesystem.deleteFile({
          directory: Directory.Data,
          path,
        })
      )
    );

    const errors = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result) => result.reason);

    if (errors.length > 0) {
      throw new AggregateError(errors, `Failed to delete document ${id}`);
    }
  }

  /**
   * Deletes all persisted documents and the current document marker.
   */
  static async clear(): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    await this.clearCurrentDocument();

    try {
      await Filesystem.rmdir({
        directory: Directory.Data,
        path: DOCUMENTS_DIRECTORY,
        recursive: true,
      });
    } catch {
      // Directory may not exist.
    }
  }

  // ===========================================================================
  // Current document
  // ===========================================================================

  /**
   * Marks a document as the currently active document.
   *
   * current.json contains only:
   *
   *   {
   *     "id": "..."
   *   }
   */
  static async setCurrentDocument(id: string): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    const currentDocument: CurrentDocument = {
      id,
    };

    await Filesystem.writeFile({
      directory: Directory.Data,
      path: CURRENT_FILE_NAME,
      data: JSON.stringify(currentDocument),
      encoding: Encoding.UTF8,
      recursive: true,
    });
  }

  /**
   * Returns the ID of the currently active document.
   *
   * Returns null when:
   *
   * - current.json does not exist;
   * - current.json cannot be read;
   * - current.json is invalid.
   */
  static async getCurrentDocumentId(): Promise<string | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const result = await Filesystem.readFile({
        directory: Directory.Data,
        path: CURRENT_FILE_NAME,
        encoding: Encoding.UTF8,
      });

      if (typeof result.data !== 'string') {
        return null;
      }

      const current = JSON.parse(result.data) as CurrentDocument;

      if (typeof current.id !== 'string' || current.id.length === 0) {
        return null;
      }

      return current.id;
    } catch {
      // current.json does not exist or is invalid.
      return null;
    }
  }

  /**
   * Clears the current document marker.
   *
   * After this call the next application launch
   * will open the document list instead of restoring
   * a previous editing session.
   */
  static async clearCurrentDocument(): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    try {
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: CURRENT_FILE_NAME,
      });
    } catch {
      // current.json may not exist.
    }
  }

  // ===========================================================================
  // Image URLs
  // ===========================================================================

  /**
   * Returns a URL for the document thumbnail.
   *
   * Can be used directly as:
   *
   *   <img :src="url">
   */
  static async getThumbnailUrl(id: string): Promise<string | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const result = await Filesystem.getUri({
        directory: Directory.Data,
        path: this.getThumbnailPath(id),
      });

      return Capacitor.convertFileSrc(result.uri);
    } catch {
      return null;
    }
  }

  /**
   * Returns a URL for the original image.
   *
   * Can be used directly as:
   *
   *   <img :src="url">
   */
  static async getOriginalUrl(id: string): Promise<string | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const result = await Filesystem.getUri({
        directory: Directory.Data,
        path: this.getOriginalPath(id),
      });

      return Capacitor.convertFileSrc(result.uri);
    } catch {
      return null;
    }
  }

  // ===========================================================================
  // Paths
  // ===========================================================================

  private static getThumbnailPath(id: string): string {
    return `${DOCUMENTS_DIRECTORY}/${id}${THUMBNAIL_SUFFIX}`;
  }

  private static getOriginalPath(id: string): string {
    return `${DOCUMENTS_DIRECTORY}/${id}${ORIGINAL_SUFFIX}`;
  }

  private static getJsonPath(id: string): string {
    return `${DOCUMENTS_DIRECTORY}/${id}${JSON_SUFFIX}`;
  }

  // ===========================================================================
  // Internal
  // ===========================================================================

  /**
   * Loads the original JPEG and converts it back into ImageData.
   */
  private static async loadOriginalImageData(id: string): Promise<ImageData> {
    const result = await Filesystem.readFile({
      directory: Directory.Data,
      path: this.getOriginalPath(id),
    });

    if (typeof result.data !== 'string') {
      throw new Error(`Unexpected image data type for document ${id}`);
    }

    const blob = base64ToBlob(result.data, 'image/jpeg');

    return blobToImageData(blob);
  }

  /**
   * Best-effort deletion used after a failed save.
   *
   * Errors are intentionally ignored here.
   * The original save error is propagated to the caller.
   */
  private static async deleteDocumentFilesQuietly(id: string): Promise<void> {
    await Promise.allSettled([
      Filesystem.deleteFile({
        directory: Directory.Data,
        path: this.getThumbnailPath(id),
      }),

      Filesystem.deleteFile({
        directory: Directory.Data,
        path: this.getOriginalPath(id),
      }),

      Filesystem.deleteFile({
        directory: Directory.Data,
        path: this.getJsonPath(id),
      }),
    ]);
  }
}

// =============================================================================
// Image conversion
// =============================================================================

/**
 * Converts ImageData to JPEG Blob.
 *
 * If maxSize is specified, the image is scaled down
 * so that neither width nor height exceeds maxSize.
 */
async function imageDataToJpegBlob(imageData: ImageData, quality: number, maxSize?: number): Promise<Blob> {
  let width = imageData.width;
  let height = imageData.height;

  if (maxSize !== undefined) {
    const scale = Math.min(1, maxSize / Math.max(width, height));

    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Cannot create 2D canvas context');
  }

  if (width === imageData.width && height === imageData.height) {
    context.putImageData(imageData, 0, 0);
  } else {
    const sourceCanvas = document.createElement('canvas');

    sourceCanvas.width = imageData.width;

    sourceCanvas.height = imageData.height;

    const sourceContext = sourceCanvas.getContext('2d');

    if (!sourceContext) {
      throw new Error('Cannot create source canvas context');
    }

    sourceContext.putImageData(imageData, 0, 0);

    context.drawImage(sourceCanvas, 0, 0, imageData.width, imageData.height, 0, 0, width, height);
  }

  return canvasToBlob(canvas, 'image/jpeg', quality);
}

/**
 * Converts Canvas to Blob.
 */
function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create image Blob'));
          return;
        }

        resolve(blob);
      },
      type,
      quality
    );
  });
}

/**
 * Converts Blob into base64 without a data URL prefix.
 */
async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();

  const bytes = new Uint8Array(arrayBuffer);

  let binary = '';

  const CHUNK_SIZE = 0x8000;

  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));

    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

/**
 * Converts base64 into Blob.
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

/**
 * Converts an image Blob into ImageData.
 */
async function blobToImageData(blob: Blob): Promise<ImageData> {
  const bitmap = await createImageBitmap(blob);

  try {
    const canvas = document.createElement('canvas');

    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Cannot create 2D canvas context');
    }

    context.drawImage(bitmap, 0, 0);

    return context.getImageData(0, 0, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}
