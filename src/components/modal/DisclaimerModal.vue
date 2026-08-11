<script setup lang="ts">
import ModalPage from './ModalPage.vue';

const open = defineModel<boolean>('open', {
  default: false,
});
</script>

<template>
  <ModalPage v-model:open="open" title="Disclaimer">
    <section>
      <h2>General Disclaimer</h2>

      <p>
        ImageToArt is provided for educational and artistic reference purposes only. The application is intended to
        assist artists in analyzing reference images and should not be considered a substitute for professional
        instruction, artistic judgment, or creative skill.
      </p>
    </section>

    <section>
      <h2>No Warranty</h2>

      <p>
        This application is provided <strong>"as is"</strong> and <strong>"as available"</strong>, without warranties of
        any kind, whether express or implied. To the fullest extent permitted by applicable law, the developers disclaim
        all warranties, including but not limited to merchantability, fitness for a particular purpose, and
        non-infringement.
      </p>

      <p>
        We do not guarantee that the application will be error-free, uninterrupted, secure, or suitable for every device
        or use case.
      </p>
    </section>

    <section>
      <h2>Limitation of Liability</h2>

      <p>
        To the fullest extent permitted by law, the developers shall not be liable for any direct, indirect, incidental,
        consequential, or special damages arising from the use of, or inability to use, this application, even if
        advised of the possibility of such damages.
      </p>
    </section>

    <section>
      <h2>Reference Images</h2>

      <p>
        Users are solely responsible for ensuring they have the necessary rights, permissions, or licenses to use any
        images imported into the application. The developers do not verify ownership or copyright status of
        user-provided content.
      </p>
    </section>

    <section>
      <h2>Generated Results</h2>

      <p>
        The analysis results and visual transformations produced by ImageToArt are intended solely as drawing and
        painting aids. They should not be considered technically accurate measurements or professional advice.
      </p>
    </section>

    <section>
      <h2>Third-Party Software</h2>

      <p>
        ImageToArt incorporates third-party open-source software. Their respective licenses and copyright notices are
        available in the <strong>Open Source Licenses</strong>
        section of the application.
      </p>
    </section>

    <section>
      <h2>Changes</h2>

      <p>
        This disclaimer may be updated from time to time to reflect improvements to the application or changes in legal
        requirements. Continued use of the application constitutes acceptance of the current version of this disclaimer.
      </p>
    </section>
  </ModalPage>
</template>
