import type { Layer } from '@/layer/Layer';

export class Document {
  id: string;
  sourceImage: string | null; // base64 source image representation
  layers: Layer[];

  constructor(sourceImage: string | null) {
    this.id = crypto.randomUUID();
    this.sourceImage = sourceImage;
    this.layers = [];
  }
}
