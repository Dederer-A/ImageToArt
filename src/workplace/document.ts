import type { LayerEngine } from './layerEngine';

export interface Document {
  id: string;
  filename?: string;
  imageData: ImageData;
  variants: Variant[];
}

export interface Variant {
  id: string;
  layers: Record<string, Layer>; // Where key is the layer type (LayerEngine) and value is the layer instance
}

export interface Layer {
  enabled: boolean;
  type: string;
  properties: any;
}

export class LayerRegistry {
  private registry = new Map<string, LayerEngine>();
  private sortedLayerEngines: LayerEngine[] = [];

  constructor() {}

  public register(layerEngine: LayerEngine): void {
    console.log(`[LayerRegistry] register: ${layerEngine.type}`);
    this.registry.set(layerEngine.type, layerEngine);
    this.sortedLayerEngines = [...this.registry.values()].sort((a, b) => a.order - b.order);
  }

  public get(type: string): LayerEngine | undefined {
    return this.registry.get(type);
  }

  public list(): LayerEngine[] {
    return this.sortedLayerEngines;
  }
}
