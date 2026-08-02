import { ImageEngine } from '@/Image/ImageEngine';

export class VariantRuntime {
  readonly variantId: string;
  renderedImageData: ImageData | null = null;
  layerCache: Map<string, ImageData> = new Map();

  constructor(variantId: string) {
    this.variantId = variantId;
  }

  public invalidate() {
    this.layerCache.clear();
    this.renderedImageData = null;
  }

  public clone(variantId: string): VariantRuntime {
    const newRuntime = new VariantRuntime(variantId);
    newRuntime.renderedImageData = ImageEngine.cloneImageData(this.renderedImageData);
    newRuntime.layerCache = new Map();
    return newRuntime;
  }
}
