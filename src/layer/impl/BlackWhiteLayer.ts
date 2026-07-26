import { type LayerImplementation } from '@/layer/LayerRegistry';
// import { OpenCVService } from '@/Image/OpenCVService';
// import { useDocumentRuntimeStore } from '@/document/DocumentRuntime';

export class BlackWhiteLayer implements LayerImplementation {
  name: string = 'blackAndWhite';
  version: string = '1.0.0';
  properties: any = { value: 0 };

  render(src: ImageData, parameters: any): ImageData {
    console.log(`[BlackWhiteLayer] render(): ${JSON.stringify(parameters)}`);
    return blackAndWhite(src, parameters.value);
  }
}

export function blackAndWhite(src: ImageData, value: number): ImageData {
  const dst = new ImageData(src.width, src.height);

  const t = Math.max(0, Math.min(100, value)) / 100;

  const wr = t;
  const wg = 1 - Math.abs(t - 0.5) * 2;
  const wb = 1 - t;

  const sum = wr + wg + wb;

  const rWeight = wr / sum;
  const gWeight = wg / sum;
  const bWeight = wb / sum;

  const s = src.data;
  const d = dst.data;

  for (let i = 0; i < s.length; i += 4) {
    const gray = s[i] * rWeight + s[i + 1] * gWeight + s[i + 2] * bWeight;

    d[i] = d[i + 1] = d[i + 2] = gray;
    d[i + 3] = s[i + 3];
  }

  return dst;
}

/*
export function blackAndWhite(src: ImageData, value: number): ImageData {
  const dst = new ImageData(src.width, src.height);

  const s = Math.max(0, Math.min(100, value)) / 100;

  // плавное изменение коэффициентов
  const wr = 0.15 + 0.4 * s;
  const wg = 0.7 - 0.35 * s;
  const wb = 1.0 - wr - wg;

  const srcData = src.data;
  const dstData = dst.data;

  for (let i = 0; i < srcData.length; i += 4) {
    // небольшая линейзация как в фотопроцессах
    const r = Math.pow(srcData[i] / 255, 2.2);
    const g = Math.pow(srcData[i + 1] / 255, 2.2);
    const b = Math.pow(srcData[i + 2] / 255, 2.2);

    // смешивание
    let gray = wr * r + wg * g + wb * b;

    // обратно в sRGB
    gray = Math.pow(gray, 1 / 2.2) * 255;

    const y = Math.max(0, Math.min(255, gray));

    dstData[i] = dstData[i + 1] = dstData[i + 2] = y;

    dstData[i + 3] = srcData[i + 3];
  }

  return dst;
}

function grayscale(imageData: ImageData): ImageData {
  const src = imageData.data;
  const dst = new ImageData(imageData.width, imageData.height);

  for (let i = 0; i < src.length; i += 4) {
    const gray = (src[i] + src[i + 1] + src[i + 2]) / 3;

    dst.data[i] = gray;
    dst.data[i + 1] = gray;
    dst.data[i + 2] = gray;
    dst.data[i + 3] = src[i + 3];
  }

  return dst;
}
*/
