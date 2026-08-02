import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { useWorkplaceStore } from '@/workplace/index';

// const fileName = `ImageToArt-${Date.now()}.jpg`;

export class ShareService {
  static async shareImage(imageData: ImageData) {
    const blob = await imageDataToBlob(imageData);

    if (Capacitor.isNativePlatform()) {
      await this.shareNative(blob);
      return;
    }

    if (navigator.share && navigator.canShare) {
      const file = new File([blob], buildExportFilename(), {
        type: 'image/jpeg',
      });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'ImageToArt',
        });
        return;
      }
    }

    this.download(blob);
  }

  private static async shareNative(blob: Blob) {
    const base64 = await blobToBase64(blob);

    const result = await Filesystem.writeFile({
      path: buildExportFilename(),
      data: base64,
      directory: Directory.Cache,
    });

    await Share.share({
      title: 'ImageToArt',
      url: result.uri,
    });
  }

  private static download(blob: Blob) {
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = buildExportFilename();
    a.click();

    URL.revokeObjectURL(url);
  }
}
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const data = reader.result as string;

      resolve(data.split(',')[1]);
    };

    reader.readAsDataURL(blob);
  });
}

async function imageDataToBlob(imageData: ImageData): Promise<Blob> {
  const canvas = document.createElement('canvas');

  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext('2d')!;

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.92);
  });
}

function buildExportFilename(): string {
  if (!useWorkplaceStore().currentDocument || useWorkplaceStore().currentDocument.filename === undefined) {
    return `ImageToArt-Untitled-${Date.now()}.jpg`;
  }
  const originalFilename = useWorkplaceStore().currentDocument.filename;
  const name = originalFilename ?? `Untitled-${Date.now()}`;

  const baseName = name.replace(/\.[^.]+$/, '');

  return `ImageToArt-${baseName}.jpg`;
}
