import { debounce } from 'lodash-es';

import { useWorkplaceStore } from '@/workplace/index';

const MAX_SIDE_SIZE = 1500;

const debouncedDraw = debounce((documentRuntime: any) => {
  console.time('ImageEngine');
  const workspaceStore = useWorkplaceStore();
  const layers = Object.values(workspaceStore.currentVariant.layers);
  const srcImageData = workspaceStore.currentSourceImageData;
  if (!srcImageData) return;
  const cloned = ImageEngine.cloneImageData(srcImageData);
  if (cloned == null) return;
  let currentImageData: ImageData = cloned; // TODO optimization required here
  for (const layer of layers) {
    const layerEngine = workspaceStore.layerRegistry.get(layer.type);
    // TODO change if logic. If something goes wrong stop processing
    if (layer.enabled && layerEngine != null) {
      // console.log(`[ImageEngine] render: ${layer.type} | ${JSON.stringify(layer.properties)}`);
      console.time(layer.type);
      currentImageData = layerEngine.render(documentRuntime, currentImageData, layer.properties);
      console.timeEnd(layer.type);
    }
  }
  console.timeEnd('ImageEngine');
  workspaceStore.updateCurrentVariantImageData(currentImageData);
}, 5);

export class ImageEngine {
  public static processImageData(documentRuntime: any) {
    debouncedDraw(documentRuntime);
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

  static resizeFileToImageData(file: File): Promise<ImageData> {
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
          const imageData = ctx.getImageData(0, 0, width, height);
          resolve(imageData);
        };
        img.onerror = () => reject(new Error('Failed to load image file into element'));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file source'));
      reader.readAsDataURL(file);
    });
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
