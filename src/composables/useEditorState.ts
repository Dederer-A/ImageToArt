import { reactive } from 'vue';

export function useEditorState() {
  const crop = reactive({
    enabled: false,
    preset: 'Original',
  });

  const rotate = reactive({
    enabled: false,

    rotateLeft: false,
    rotateRight: false,

    flipHorizontal: false,
    flipVertical: false,
  });

  const blackAndWhite = reactive({
    enabled: false,
    value: 0,
  });

  const posterize = reactive({
    enabled: false,
    value: 50,
  });

  const enhancement = reactive({
    enabled: false,
    value: 50,
  });

  const blur = reactive({
    enabled: false,
    value: 0,
  });

  const grid = reactive({
    enabled: false,
    value: 50,
  });

  const perspectiveGrid = reactive({
    enabled: false,
  });

  const rulers = reactive({
    enabled: false,
  });

  const measurements = reactive({
    enabled: false,
  });

  return {
    crop,
    rotate,

    blackAndWhite,
    posterize,
    enhancement,
    blur,
    grid,

    perspectiveGrid,
    rulers,
    measurements,
  };
}
