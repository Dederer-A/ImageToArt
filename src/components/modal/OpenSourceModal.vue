<script setup lang="ts">
import ModalPage from './ModalPage.vue';

const open = defineModel<boolean>('open', {
  default: false,
});
</script>

<template>
  <ModalPage v-model:open="open" title="OpenSource">
    <section>
      <h2>Open Source Software</h2>

      <p>
        ImageToArt is built using open-source software. We are grateful to the developers and communities whose work
        makes this application possible.
      </p>

      <p>
        This application incorporates third-party software under their respective open-source licenses. Copyright
        remains with the original authors and contributors.
      </p>
    </section>

    <section>
      <h2>Core Technologies</h2>

      <p>
        ImageToArt is built with Vue, TypeScript, Vite, Capacitor, Pinia, Vue I18n, Tailwind CSS, and the shadcn-vue
        component collection, which is based on Reka UI.
      </p>

      <p>
        The application also makes use of additional open-source libraries for image processing, icons, form validation,
        user interface components, internationalization, and utility functions.
      </p>
    </section>

    <section>
      <h2>Major Third-Party Projects</h2>

      <p>
        • Vue<br />
        • TypeScript<br />
        • Vite<br />
        • Capacitor<br />
        • Pinia<br />
        • Vue I18n<br />
        • Tailwind CSS<br />
        • shadcn-vue<br />
        • Reka UI<br />
        • Lucide Icons<br />
        • StackBlur Canvas<br />
        • VueUse<br />
        • Zod<br />
        • VeeValidate<br />
        • Embla Carousel
      </p>
    </section>

    <section>
      <h2>Licenses</h2>

      <p>
        Most third-party libraries used by ImageToArt are distributed under permissive open-source licenses, including
        the MIT License, ISC License, and Apache License 2.0.
      </p>

      <p>Each library remains subject to its own license terms and copyright notices.</p>
    </section>

    <section>
      <h2>Acknowledgements</h2>

      <p>
        We sincerely thank the maintainers, contributors, and the open-source community for creating and maintaining the
        software that helps make ImageToArt possible.
      </p>
    </section>
  </ModalPage>
</template>
