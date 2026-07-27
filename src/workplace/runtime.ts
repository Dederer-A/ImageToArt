export class VariantRuntime {
  variantId: string;
  imageData: ImageData | null;
  cache: Map<string, ImageData>;

  constructor(variantId: string) {
    this.variantId = variantId;
    this.imageData = null;
    this.cache = new Map();
  }
}
