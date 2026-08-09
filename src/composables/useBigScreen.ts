import { ref, onMounted, onUnmounted } from 'vue';

export function useBigScreen(breakpoint: number = 768) {
  const isBigScreen = ref<boolean>(false);
  let mediaQuery: MediaQueryList | null = null;

  const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
    isBigScreen.value = e.matches;
  };

  onMounted(() => {
    // Matches screens wider than the breakpoint (e.g., tablets/desktops)
    mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    isBigScreen.value = mediaQuery.matches;
    mediaQuery.addEventListener('change', updateMatch);
  });

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', updateMatch);
  });

  return { isBigScreen };
}
