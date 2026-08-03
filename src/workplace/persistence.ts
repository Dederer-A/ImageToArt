import { type Document } from './document';

import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

const FILE_NAME = 'current-document.json';

export class Persistence {
  /**
   * Returns true when running as a native Capacitor application.
   */
  static isSupported(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Saves the document.
   * Does nothing when running as a web application.
   */
  static async save(document: Document): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    const persistedDocument = {
      ...document,
      imageData: serializeImageData(document.imageData),
    };

    await Filesystem.writeFile({
      directory: Directory.Data,
      path: FILE_NAME,
      data: JSON.stringify(persistedDocument),
      encoding: Encoding.UTF8,
      recursive: true,
    });
  }

  /**
   * Loads the previously saved document.
   * Returns null when no document exists or when running as a web application.
   */
  static async load(): Promise<Document | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const result = await Filesystem.readFile({
        directory: Directory.Data,
        path: FILE_NAME,
        encoding: Encoding.UTF8,
      });

      const data = result.data;
      if (typeof data !== 'string') {
        return null;
      }

      const parsed = JSON.parse(data) as Omit<Document, 'imageData'> & {
        imageData: SerializedImageData;
      };
      const document: Document = {
        ...parsed,
        imageData: deserializeImageData(parsed.imageData),
      };

      return document;
    } catch {
      // File does not exist or cannot be parsed.
      return null;
    }
  }

  /**
   * Deletes the persisted document.
   * Does nothing when running as a web application.
   */
  static async clear(): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    try {
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: FILE_NAME,
      });
    } catch {
      // Ignore if the file does not exist.
    }
  }
}

export interface SerializedImageData {
  width: number;
  height: number;
  data: number[];
}

export function serializeImageData(imageData: ImageData): SerializedImageData {
  return {
    width: imageData.width,
    height: imageData.height,
    data: Array.from(imageData.data),
  };
}

export function deserializeImageData(serialized: SerializedImageData): ImageData {
  return new ImageData(new Uint8ClampedArray(serialized.data), serialized.width, serialized.height);
}
