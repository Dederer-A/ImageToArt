import { useDocumentStore } from '@/document/Document';
import { useDocumentRuntimeStore } from '@/document/DocumentRuntime';

import { LayerRegistry } from '@/layer/LayerRegistry';

const MAX_SIDE_SIZE = 2000;

export class ImageEngine {
  public static process() {
    const document = useDocumentStore();
    const documentRuntime = useDocumentRuntimeStore();

    console.log(`[ImageEngine] process(${document.id})`);
    if (documentRuntime.srcImageData == null) return;
    documentRuntime.currentImageData = ImageEngine.cloneImageData(documentRuntime.srcImageData);

    for (const layer of document.layers) {
      const layerImplementation = LayerRegistry.getInstance().get(layer.type);
      if (layer.enabled && layerImplementation != null && documentRuntime.currentImageData != null) {
        documentRuntime.currentImageData = layerImplementation.render(
          documentRuntime.currentImageData,
          layer.parameters
        );
      }
    }
  }

  static cloneImageData(image: ImageData | null): ImageData | null {
    if (image == null) return null;
    return new ImageData(new Uint8ClampedArray(image.data), image.width, image.height);
  }

  static imageToImageData(img: HTMLImageElement | null): ImageData {
    if (img == null) {
      throw new Error("[ImageEngine] imageToImageData(): ITMLImageElement can't be a null");
    }

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    if (img.naturalHeight == 0) {
      throw new Error('[cloneImageData] Original image is zero');
    }
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  static resizeFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const img = new Image();

        img.onload = () => {
          const maxSide = MAX_SIDE_SIZE;
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Calculate aspect ratio scaling
          if (width > maxSide || height > maxSide) {
            if (width > height) {
              height = Math.round((height * maxSide) / width);
              width = maxSide;
            } else {
              width = Math.round((width * maxSide) / height);
              height = maxSide;
            }
          }

          // Render to canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not get 2D canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Export to Base64 JPEG (90% quality)
          const base64 = canvas.toDataURL('image/jpeg', 0.9);
          resolve(base64);
        };

        img.onerror = () => reject(new Error('Failed to load image file into element'));
        img.src = readerEvent.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file source'));
      reader.readAsDataURL(file);
    });
  }

  static resizeImageToBase64(img: HTMLImageElement): string | null {
    const maxSide = 2000;
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    // Calculate new dimensions while maintaining aspect ratio
    if (width > maxSide || height > maxSide) {
      if (width > height) {
        height = Math.round((height * maxSide) / width);
        width = maxSide;
      } else {
        width = Math.round((width * maxSide) / height);
        height = maxSide;
      }
    }

    // Create an off-screen canvas to perform the resize
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw and export
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  /*
  static async base64ToImageData(base64: string): Promise<ImageData> {
    // If only the Base64 payload is provided, prepend a Data URL prefix.
    const dataUrl = base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;

    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const bitmap = await createImageBitmap(blob);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get 2D context.');
    }

    ctx.drawImage(bitmap, 0, 0);

    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  }
    */
}
