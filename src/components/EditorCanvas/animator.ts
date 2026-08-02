export interface CarouselAnimatorOptions {
  onPosition: (position: number) => void;
}

const EPSILON = 0.001;
const LERP = 0.18;

enum AnimatorState {
  Idle,
  Dragging,
  Animating,
}

export interface CarouselAnimator {
  getPosition(): number;

  jumpTo(position: number): void;

  animateTo(position: number): void;

  beginDrag(): void;

  drag(position: number): void;

  endDrag(target: number): void;

  dispose(): void;
}

export function createCarouselAnimator(
  options: CarouselAnimatorOptions,
): CarouselAnimator {
  let currentPosition = 0;
  let targetPosition = 0;

  let animationFrameId: number | null = null;
  let state = AnimatorState.Idle;

  function render() {
    options.onPosition(currentPosition);
  }

  function stopAnimation() {
    if (animationFrameId == null) return;

    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  function frame() {
    if (state !== AnimatorState.Animating) {
      stopAnimation();
      return;
    }

    const delta = targetPosition - currentPosition;

    if (Math.abs(delta) < EPSILON) {
      currentPosition = targetPosition;
      render();

      state = AnimatorState.Idle;
      stopAnimation();
      return;
    }

    currentPosition += delta * LERP;

    render();

    animationFrameId = requestAnimationFrame(frame);
  }

  function startAnimation() {
    if (animationFrameId != null) return;

    animationFrameId = requestAnimationFrame(frame);
  }

  return {
    getPosition() {
      return currentPosition;
    },

    jumpTo(position: number) {
      stopAnimation();

      state = AnimatorState.Idle;

      currentPosition = position;
      targetPosition = position;

      render();
    },

    animateTo(position: number) {
      targetPosition = position;

      state = AnimatorState.Animating;

      startAnimation();
    },

    beginDrag() {
      stopAnimation();

      state = AnimatorState.Dragging;

      targetPosition = currentPosition;
    },

    drag(position: number) {
      if (state !== AnimatorState.Dragging) {
        return;
      }

      currentPosition = position;

      render();
    },

    endDrag(target: number) {
      if (state !== AnimatorState.Dragging) {
        return;
      }

      targetPosition = target;

      state = AnimatorState.Animating;

      startAnimation();
    },

    dispose() {
      stopAnimation();
      state = AnimatorState.Idle;
    },
  };
}