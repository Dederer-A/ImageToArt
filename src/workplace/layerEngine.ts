import type { VariantRuntime } from './runtime';

export interface LayerEngine {
  type: string;
  version: string;
  order: number;
  defaultProperties: any;

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData;
}
