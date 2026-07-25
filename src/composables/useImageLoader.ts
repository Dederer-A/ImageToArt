import { ref } from 'vue';

export interface LoadedImage {
  file: File;
  image: HTMLImageElement;

  base64: string;

  width: number;
  height: number;

  fileName: string;
  mimeType: string;
  fileSize: number;
}

export function useImageLoader() {
  const loading = ref(false);

  async function load(file: File): Promise<LoadedImage> {
    loading.value = true;

    try {
      const image = await loadImage(file);
      const base64 = await toBase64(file);

      return {
        file,

        image,
        base64,

        width: image.naturalWidth,
        height: image.naturalHeight,

        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      };
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    load,
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;

    image.src = URL.createObjectURL(file);
  });
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
