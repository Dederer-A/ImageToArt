import type { LayerEngine } from './layerEngine';

import { BlackWhiteLayer } from '@/Image/layers/BlackWhiteLayer';
import { PosterizeLayer } from '@/Image/layers/Posterize';
import { BlurLayer } from '@/Image/layers/Blur';
import { GridLayer } from '@/Image/layers/Grid';
import { ContrastLayer } from '@/Image/layers/Contrast';
import { SaturationLayer } from '@/Image/layers/Saturation';
import { SquintLayer } from '@/Image/layers/Squint';
import { GammaLayer } from '@/Image/layers/Gamma';
import { GoldenRatioLayer } from '@/Image/layers/GoldenRatio';
import { RuleOfThirdsLayer } from '@/Image/layers/RuleOfThirds';
import { EdgeLayer } from '@/Image/layers/Edge';
import { LevelsLayer } from '@/Image/layers/Levels';
import { ThresholdLayer } from '@/Image/layers/Threshold';
import { FalseColorLayer } from '@/Image/layers/FalseColor';

export interface Document {
  id: string;
  filename?: string;
  imageData: ImageData;
  variants: Variant[];
  currentVariantId?: string;
  version: string;
}

export interface Variant {
  id: string;
  isOriginal: boolean;
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
    this.register(new LevelsLayer());
    this.register(new ThresholdLayer());
    this.register(new FalseColorLayer());

    this.list().forEach((layer: LayerEngine) => {
      console.log(`[LayerRegistry] ${layer.order} : ${layer.type}`);
    });
  }

  private register(layerEngine: LayerEngine): void {
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
