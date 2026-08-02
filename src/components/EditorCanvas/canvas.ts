export function drawImageData(canvas: HTMLCanvasElement, imageData: ImageData | null | undefined): void {
  if (!imageData) {
    return;
  }

  resizeCanvas(canvas, imageData.width, imageData.height);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }
  ctx.putImageData(imageData, 0, 0);
}

export function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void {
  if (canvas.width === width && canvas.height === height) {
    return;
  }

  canvas.width = width;
  canvas.height = height;
}
