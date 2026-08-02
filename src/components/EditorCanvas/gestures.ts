import type { CarouselAnimator } from './animator';

const HOLD_DELAY = 300;

const CLICK_MOVE_THRESHOLD = 10;
const DIRECTION_LOCK_DISTANCE = 20;

const PREVIEW_FADE_DISTANCE = 200;
const FLICK_VELOCITY = 0.6; // px/ms

enum GestureState {
  Idle,
  PendingHold,
  Preview,
  HorizontalDrag,
}

export interface GestureOptions {
  animator: CarouselAnimator;

  getCurrentIndex(): number;

  getVariantCount(): number;

  getViewportWidth(): number;

  setCurrentIndex(index: number): void;

  setOriginalOpacity(opacity: number): void;

  onTap(): void;
}

export interface GestureController {
  pointerDown(e: PointerEvent): void;
  pointerMove(e: PointerEvent): void;
  pointerUp(e: PointerEvent): void;
  pointerCancel(e: PointerEvent): void;
}

export function createGestures(options: GestureOptions): GestureController {
  let state = GestureState.Idle;

  let pointerId = -1;

  let startX = 0;
  let startY = 0;

  let currentX = 0;
  let currentY = 0;

  let previewStartY = 0;

  let dragStartPosition = 0;

  let moved = false;

  let holdTimer: number | undefined;

  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;

  function clearHoldTimer() {
    if (holdTimer !== undefined) {
      clearTimeout(holdTimer);
      holdTimer = undefined;
    }
  }

  function beginPreview() {
    if (state !== GestureState.PendingHold) {
      return;
    }

    state = GestureState.Preview;

    previewStartY = currentY;

    options.setOriginalOpacity(1);
  }

  function reset(target?: HTMLElement) {
    clearHoldTimer();

    if (target && pointerId !== -1 && target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }

    pointerId = -1;

    state = GestureState.Idle;

    moved = false;

    velocity = 0;

    options.setOriginalOpacity(0);
  }

  return {
    pointerDown(e: PointerEvent) {
      const target = e.currentTarget as HTMLElement;

      target.setPointerCapture(e.pointerId);

      pointerId = e.pointerId;

      startX = currentX = e.clientX;
      startY = currentY = e.clientY;

      lastX = currentX;
      lastTime = performance.now();
      velocity = 0;

      moved = false;

      state = GestureState.PendingHold;

      holdTimer = window.setTimeout(beginPreview, HOLD_DELAY);
    },

    pointerMove(e: PointerEvent) {
      if (state === GestureState.Idle) {
        return;
      }

      currentX = e.clientX;
      currentY = e.clientY;

      const dx = currentX - startX;
      const dy = currentY - startY;

      const now = performance.now();
      const dt = now - lastTime;

      if (dt > 0) {
        velocity = (currentX - lastX) / dt;
      }

      lastX = currentX;
      lastTime = now;

      if (!moved && (Math.abs(dx) > CLICK_MOVE_THRESHOLD || Math.abs(dy) > CLICK_MOVE_THRESHOLD)) {
        moved = true;
      }

      switch (state) {
        case GestureState.PendingHold: {
          if (Math.abs(dx) < DIRECTION_LOCK_DISTANCE && Math.abs(dy) < DIRECTION_LOCK_DISTANCE) {
            return;
          }

          if (Math.abs(dx) > Math.abs(dy) * 1.5) {
            clearHoldTimer();

            state = GestureState.HorizontalDrag;

            dragStartPosition = options.animator.getPosition();

            options.animator.beginDrag();
            options.animator.drag(dragStartPosition);
          }

          return;
        }

        case GestureState.HorizontalDrag: {
          const viewportWidth = options.getViewportWidth();

          if (viewportWidth <= 0) {
            return;
          }

          const maxIndex = Math.max(0, options.getVariantCount() - 1);

          let position = dragStartPosition - dx / viewportWidth;

          position = Math.max(0, Math.min(maxIndex, position));

          options.animator.drag(position);

          return;
        }

        case GestureState.Preview: {
          const opacity = Math.max(0, Math.min(1, 1 - Math.max(0, currentY - previewStartY) / PREVIEW_FADE_DISTANCE));

          options.setOriginalOpacity(opacity);

          return;
        }
      }
    },

    pointerUp(e: PointerEvent) {
      const target = e.currentTarget as HTMLElement;

      if (state === GestureState.HorizontalDrag) {
        let targetIndex = Math.round(options.animator.getPosition());

        if (Math.abs(velocity) > FLICK_VELOCITY) {
          targetIndex += velocity < 0 ? 1 : -1;
        }

        targetIndex = Math.max(0, Math.min(options.getVariantCount() - 1, targetIndex));

        options.animator.endDrag(targetIndex);

        if (targetIndex !== options.getCurrentIndex()) {
          options.setCurrentIndex(targetIndex);
        }
      } else if (state === GestureState.PendingHold && !moved) {
        options.onTap();
      }

      reset(target);
    },

    pointerCancel(e: PointerEvent) {
      reset(e.currentTarget as HTMLElement);
    },
  };
}
