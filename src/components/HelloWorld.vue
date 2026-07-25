<script setup lang="ts">
import { onMounted, ref } from 'vue';
// import { useI18n } from 'vue-i18n';
import viteLogo from '../assets/vite.svg';
import heroImg from '../assets/hero.png';
import vueLogo from '../assets/vue.svg';
import { LayerRegistry } from '@/layer/LayerRegistry';

import type { OpenCV } from '@opencvjs/web';

const count = ref(0);
const isReady = ref(false);
const buildInfo = ref('');
const matrixSize = ref('');

const layerList = LayerRegistry.getInstance().list();

console.log('!!!!!!!!!!!! custom log');
// const { t, locale } = useI18n();
// Example function to programmatically switch languages
// const switchLanguage = (lang) => {
//   locale.value = lang;
// }

onMounted(async () => {
  try {
    // 1. Динамический импорт загрузчика, чтобы Vite не ругался при сборке
    const { loadOpenCV } = await import('@opencvjs/web');

    // 2. Инициализируем WebAssembly модуль OpenCV
    const cv: typeof OpenCV = await loadOpenCV();
    isReady.value = true;

    // 3. Получаем информацию о сборке (для проверки работоспособности)
    buildInfo.value = cv.getBuildInformation().split('\n')[0]; // Берём первую строку

    // 4. Пример создания и деструктуризации матрицы
    const mat = new cv.Mat(150, 300, cv.CV_8UC4); // 150x300 пикселей, RGBA
    matrixSize.value = `${mat.cols}x${mat.rows} (каналов: ${mat.channels()})`;
    console.log('CV: ' + `${mat.cols}x${mat.rows} (каналов: ${mat.channels()})`);

    // Обязательно очищаем память WASM после работы с объектами cv.Mat!
    mat.delete();
  } catch (error) {
    console.error('Не удалось загрузить OpenCV.js:', error);
  }
});
</script>

<template>
  <section id="center">
    <div class="hero">
      <img :src="heroImg" class="base" width="170" height="179" alt="" />
      <img :src="vueLogo" class="framework" alt="Vue logo" />
      <img :src="viteLogo" class="vite" alt="Vite logo" />
    </div>
    <div>
      <h1>{{ $t('common.welcome.title') }}</h1>
      <p>Edit <code>src/App.vue</code> and save to test <code>HMR</code></p>
    </div>
    <button type="button" class="counter" @click="count++">Count is {{ count }}</button>
    <div>
      List of Layer Implementations:
      <ul>
        <li v-for="layer in layerList">{{ layer.name }} v.{{ layer.version }}</li>
      </ul>
    </div>
  </section>

  <div class="ticks"></div>

  <section id="next-steps">
    <div id="docs">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#documentation-icon"></use>
      </svg>
      <h2>Documentation</h2>
      <p>Your questions, answered</p>
      <ul>
        <li>
          <a href="https://vite.dev/" target="_blank">
            <img class="logo" :src="viteLogo" alt="" />
            Explore Vite
          </a>
        </li>
        <li>
          <a href="https://vuejs.org/" target="_blank">
            <img class="button-icon" :src="vueLogo" alt="" />
            Learn more
          </a>
        </li>
      </ul>
    </div>
    <div id="social">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#social-icon"></use>
      </svg>
      <h2>Connect with us</h2>
      <p>Join the Vite community</p>
      <ul>
        <li>
          <a href="https://github.com/vitejs/vite" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#github-icon"></use>
            </svg>
            GitHub
          </a>
        </li>
        <li>
          <a href="https://chat.vite.dev/" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#discord-icon"></use>
            </svg>
            Discord
          </a>
        </li>
        <li>
          <a href="https://x.com/vite_js" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#x-icon"></use>
            </svg>
            X.com
          </a>
        </li>
        <li>
          <a href="https://bsky.app/profile/vite.dev" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#bluesky-icon"></use>
            </svg>
            Bluesky
          </a>
        </li>
      </ul>
    </div>
  </section>

  <div class="ticks"></div>
  <section id="spacer"></section>
</template>
