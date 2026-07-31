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
}
