import type { LayerEngine } from './layerEngine';

import { BlackWhiteLayer } from '@/layer/impl/BlackWhiteLayer.ts';
import { PosterizeLayer } from '@/layer/impl/Posterize.ts';
import { BlurLayer } from '@/layer/impl/Blur.ts';
import { GridLayer } from '@/layer/impl/Grid.ts';
import { ContrastLayer } from '@/layer/impl/Contrast.ts';
import { SaturationLayer } from '@/layer/impl/Saturation.ts';
import { SquintLayer } from '@/layer/impl/Squint.ts';
import { GammaLayer } from '@/layer/impl/Gamma.ts';
import { GoldenRatioLayer } from '@/layer/impl/GoldenRatio.ts';
import { RuleOfThirdsLayer } from '@/layer/impl/RuleOfThirds.ts';
import { EdgeLayer } from '@/layer/impl/Edge.ts';

export interface Document {
  id: string;
  filename?: string;
  imageData: ImageData;
  variants: Variant[];
}

export interface Variant {
  id: string;
  readOnly: boolean;
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

  public initialize() {
    // Register all Layer Implementation
    console.log('[WorkplaceStore] initialize(): Registering all Layer Engines');
    this.register(new BlackWhiteLayer());
    this.register(new PosterizeLayer());
    this.register(new BlurLayer());
    this.register(new GridLayer());
    this.register(new ContrastLayer());
    this.register(new SaturationLayer());
    this.register(new SquintLayer());
    this.register(new GammaLayer());
    this.register(new GoldenRatioLayer());
    this.register(new RuleOfThirdsLayer());
    this.register(new EdgeLayer());
  }

  private register(layerEngine: LayerEngine): void {
    console.log(`[LayerRegistry] register: ${layerEngine.type}`);
    this.registry.set(layerEngine.type, layerEngine);
    this.sortedLayerEngines = [...this.registry.values()].sort((a, b) => a.order - b.order);
  }

  public get(type: string): LayerEngine | undefined {
    return this.registry.get(type);
  }

  public list(): LayerEngine[] {
    // console.log(
    //   '[LayerRegistry] list: returning sorted layer engines\n' + JSON.stringify(this.sortedLayerEngines, null, 2)
    // );
    return this.sortedLayerEngines;
  }
}
