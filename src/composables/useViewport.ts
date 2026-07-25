import { computed, ref } from 'vue';

export function useViewport() {
  const viewport = ref<HTMLDivElement>();

  const scale = ref(1);
  const translateX = ref(0);
  const translateY = ref(0);
  const rotation = ref(0);

  const transform = computed(() => ({
    transform: `
      translate(${translateX.value}px, ${translateY.value}px)
      scale(${scale.value})
      rotate(${rotation.value}deg)
    `,
  }));

  function reset() {
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
  }

  function fit() {
    // TODO
    // Calculate the optimal scale and translation
    // once image dimensions are known.
  }

  return {
    viewport,

    scale,
    translateX,
    translateY,
    rotation,

    transform,

    reset,
    fit,
  };
}
