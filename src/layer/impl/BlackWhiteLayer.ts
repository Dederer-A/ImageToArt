import { type LayerImplementation } from '@/layer/LayerRegistry';

export class BlackWhiteLayer implements LayerImplementation {
  name: string = 'BlackWhite';
  version: string = '1.0.0';
}
