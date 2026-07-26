import { useDocumentRuntimeStore } from '@/document/DocumentRuntime';

export class ImageRenderer {
  static renderImageDataToImage(displayImage: HTMLImageElement) {
    const documentRuntime = useDocumentRuntimeStore();
    const imageData = documentRuntime.currentImageData;

    console.log('[ImageRender] renderImageDataToImage');
    if (imageData == null) return;

    // Create an in-memory, invisible canvas
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    // Paint the raw pixel data onto the canvas
    const ctx = canvas.getContext('2d');
    if (ctx == null) return;
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to a lightweight Blob URL and assign it to <img>
    canvas.toBlob((blob) => {
      if (blob && displayImage) {
        // Clean up previous URL if it exists to avoid memory leaks
        if (displayImage.src.startsWith('blob:')) {
          URL.revokeObjectURL(displayImage.src);
        }
        console.log('[ImageRender] displayImage.src');
        displayImage.src = URL.createObjectURL(blob);
      }
    }, 'image/png');
  }
}
