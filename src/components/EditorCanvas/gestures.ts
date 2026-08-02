import type { CarouselAnimator } from './animator';

const HOLD_DELAY = 250;

const CLICK_MOVE_THRESHOLD = 5;
const DIRECTION_LOCK_DISTANCE = 15;

const PREVIEW_FADE_DISTANCE = 200;

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

  let dragStartPosition = 0;

  let moved = false;

  let holdTimer: number | undefined;

  function clearHoldTimer() {
    if (holdTimer !== undefined) {
      clearTimeout(holdTimer);
      holdTimer = undefined;
    }
  }

  function reset(target?: HTMLElement) {
    clearHoldTimer();

    if (target && pointerId !== -1 && target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }

    pointerId = -1;

    state = GestureState.Idle;

    moved = false;

    options.setOriginalOpacity(0);
  }

  function beginPreview() {
    if (state !== GestureState.PendingHold) {
      return;
    }

    state = GestureState.Preview;

    options.setOriginalOpacity(1);
  }

  return {
    pointerDown(e: PointerEvent) {
      const target = e.currentTarget as HTMLElement;

      target.setPointerCapture(e.pointerId);

      pointerId = e.pointerId;

      startX = e.clientX;
      startY = e.clientY;

      moved = false;

      state = GestureState.PendingHold;

      holdTimer = window.setTimeout(beginPreview, HOLD_DELAY);
    },

    pointerMove(e: PointerEvent) {
      if (state === GestureState.Idle) {
        return;
      }

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!moved && (Math.abs(dx) > CLICK_MOVE_THRESHOLD || Math.abs(dy) > CLICK_MOVE_THRESHOLD)) {
        moved = true;
      }

      switch (state) {
        case GestureState.PendingHold: {
          if (Math.abs(dx) < DIRECTION_LOCK_DISTANCE && Math.abs(dy) < DIRECTION_LOCK_DISTANCE) {
            return;
          }

          if (Math.abs(dx) > Math.abs(dy)) {
            clearHoldTimer();

            state = GestureState.HorizontalDrag;

            dragStartPosition = options.getCurrentIndex();

            options.animator.beginDrag();

            options.animator.drag(dragStartPosition);

            return;
          }

          // Вертикальное движение ничего не делает.
          // Ждем HOLD.
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
          const opacity = Math.max(0, Math.min(1, 1 - Math.max(0, dy) / PREVIEW_FADE_DISTANCE));

          options.setOriginalOpacity(opacity);

          return;
        }
      }
    },

    pointerUp(e: PointerEvent) {
      const target = e.currentTarget as HTMLElement;

      if (state === GestureState.HorizontalDrag) {
        const position = options.animator.getPosition();

        const targetIndex = Math.round(position);

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
