export class LayerRegistry {
  private static instance: LayerRegistry;
  private registry = new Map<string, LayerImplementation>();

  private constructor() {}

  public static getInstance(): LayerRegistry {
    if (!LayerRegistry.instance) {
      LayerRegistry.instance = new LayerRegistry();
    }
    return LayerRegistry.instance;
  }

  public register(layerImplementation: LayerImplementation): void {
    this.registry.set(layerImplementation.name, layerImplementation);
  }

  public get(name: string): LayerImplementation | undefined {
    return this.registry.get(name);
  }

  public list(): LayerImplementation[] {
    return [...this.registry.values()];
  }
}

export interface LayerImplementation {
  name: string;
  version: string;
}
