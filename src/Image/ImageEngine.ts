import { useDocumentStore } from '@/document/Document';
import { useDocumentRuntimeStore } from '@/document/DocumentRuntime';

import { LayerRegistry } from '@/layer/LayerRegistry';

export class ImageEngine {
  public static process() {
    const document = useDocumentStore();
    const documentRuntime = useDocumentRuntimeStore();

    console.log(`[ImageEngine] process(${document.id})`);
    if (documentRuntime.srcImageData == null) return;
    documentRuntime.currentImageData = ImageEngine.cloneImageData(documentRuntime.srcImageData);

    for (const layer of document.layers) {
      const layerImplementation = LayerRegistry.getInstance().get(layer.type);
      if (layerImplementation != null && documentRuntime.currentImageData != null) {
        documentRuntime.currentImageData = layerImplementation.render(
          documentRuntime.currentImageData,
          layer.parameters
        );
      }
    }
    documentRuntime.version++;
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
