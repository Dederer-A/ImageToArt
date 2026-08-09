import { debounce } from 'lodash-es';

import { useWorkplaceStore } from '@/workplace/index';

const debouncedDraw = debounce((srcImageData: ImageData, documentRuntime: any) => {
  render(srcImageData, documentRuntime);
}, 5);

function render(srcImageData: ImageData, documentRuntime: any) {
  console.time('ImageEngine');
  const workspaceStore = useWorkplaceStore();
  const variant = workspaceStore.variantByVariantId(documentRuntime.variantId);
  if (!variant) {
    console.error(`[ImageEngine] render(): Variant with id ${documentRuntime.variantId} not found`);
    return;
  }
  const layers = Object.values(variant.layers);
  if (!srcImageData) return;

  const cloned = ImageEngine.cloneImageData(srcImageData);
  if (cloned == null) return;

  let currentImageData: ImageData = cloned;
  for (const layer of layers) {
    const layerEngine = workspaceStore.layerRegistry.get(layer.type);
    // TODO change if logic. If something goes wrong stop processing
    if (layer.enabled && layerEngine != null) {
      // console.log(
      //   `[ImageEngine] render: processing layer ${layer.type} with properties ${JSON.stringify(layer.properties)}`
      // );
      // console.time(layer.type);
      currentImageData = layerEngine.render(documentRuntime, currentImageData, layer.properties);
      // console.timeEnd(layer.type);
    }
  }
  console.timeEnd('ImageEngine');
  workspaceStore.updateVariantImageData(documentRuntime.variantId, currentImageData);
}

export class ImageEngine {
  public static processImageData(srcImageData: ImageData, documentRuntime: any) {
    debouncedDraw(srcImageData, documentRuntime);
  }

  public static render(srcImageData: ImageData, documentRuntime: any) {
    render(srcImageData, documentRuntime);
  }

  static cloneImageData(image: ImageData | null): ImageData | null {
    if (image == null) return null;
    return new ImageData(new Uint8ClampedArray(image.data), image.width, image.height);
  }
}
