import type { OpenCV } from '@opencvjs/web';

export class OpenCVService {
  private static instance: OpenCVService | null = null;
  public cv!: typeof OpenCV;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): OpenCVService {
    if (!OpenCVService.instance) {
      OpenCVService.instance = new OpenCVService();
    }
    return OpenCVService.instance;
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const { loadOpenCV } = await import('@opencvjs/web');
      this.cv = await loadOpenCV();
      this.isInitialized = true;
      console.log('✔ [OpenCVService]: Загружен');
    } catch (error) {
      console.error('❌ [OpenCVService]: Ошибка:', error);
      throw error;
    }
  }

  /**
   * Конвертация из IMG элемента в OUTPUT CANVAS
   * @param sourceImgIdOrElement - ID строки или сам HTMLImageElement
   * @param targetCanvasId - ID canvas элемента для результата
   */
  public convertToGray(sourceImgIdOrElement: string | HTMLImageElement, targetCanvasId: string): void {
    if (!this.isInitialized) {
      throw new Error('[OpenCVService]: Вызовите init() перед использованием метода');
    }

    const cv = this.cv;
    let src = null;
    let dst = null;

    try {
      // cv.imread одинаково хорошо принимает и ID строки, и сам DOM-элемент <img>
      src = cv.imread(sourceImgIdOrElement);
      dst = new cv.Mat();

      // Конвертируем в градации серого
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

      // Выводим результат в Canvas (OpenCV всегда выводит результат в canvas)
      cv.imshow(targetCanvasId, dst);
    } catch (err) {
      console.error('Ошибка OpenCV при чтении из img:', err);
    } finally {
      // Чистим память WebAssembly кучи
      if (src) src.delete();
      if (dst) dst.delete();
    }
  }
}
