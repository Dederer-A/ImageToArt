import { ImageEngine } from '@/Image/ImageEngine';

export class VariantRuntime {
  readonly variantId: string;
  renderedImageData: ImageData | null = null;

  constructor(variantId: string) {
    this.variantId = variantId;
  }

  public invalidate() {
    this.renderedImageData = null;
  }

  public clone(variantId: string): VariantRuntime {
    const newRuntime = new VariantRuntime(variantId);
    newRuntime.renderedImageData = ImageEngine.cloneImageData(this.renderedImageData);
    return newRuntime;
  }
}
