import { type LayerImplementation } from '@/layer/LayerRegistry';
// import { OpenCVService } from '@/Image/OpenCVService';
// import { useDocumentRuntimeStore } from '@/document/DocumentRuntime';

export class BlackWhiteLayer implements LayerImplementation {
  name: string = 'blackAndWhite';
  version: string = '1.0.0';
  properties: any = { value: 0 };
}

/*
function render(value: number) {
  const openCVService = OpenCVService.getInstance();
  const cv = openCVService.cv;

  const w = getWeights(value);

  const M = cv.matFromArray(1, 3, cv.CV_32F, [w.b, w.g, w.r]);

  const _gray = new cv.Mat();

  const documentRuntime = useDocumentRuntimeStore();
  // cv.transform(src, gray, M);

  M.delete();
}

interface RGBWeights {
  r: number;
  g: number;
  b: number;
}

const presets = [
  { pos: 0, r: 1.0, g: 0.0, b: 0.0 }, // Red
  { pos: 25, r: 0.5, g: 0.5, b: 0.0 }, // Yellow
  { pos: 50, r: 0.333, g: 0.333, b: 0.333 }, // Neutral
  { pos: 75, r: 0.0, g: 0.5, b: 0.5 }, // Cyan
  { pos: 100, r: 0.0, g: 0.0, b: 1.0 }, // Blue
];

function getWeights(value: number): RGBWeights {
  value = Math.max(0, Math.min(100, value));

  for (let i = 0; i < presets.length - 1; i++) {
    const a = presets[i];
    const b = presets[i + 1];

    if (value >= a.pos && value <= b.pos) {
      const t = (value - a.pos) / (b.pos - a.pos);

      return {
        r: a.r + (b.r - a.r) * t,
        g: a.g + (b.g - a.g) * t,
        b: a.b + (b.b - a.b) * t,
      };
    }
  }

  return presets[2];
}
*/
