<script setup lang="ts">
import ModalPage from './ModalPage.vue';
</script>

<template>
  <ModalPage title="About">
    <section>
      <h2>About ImageToArt</h2>

      <p>
        ImageToArt is a reference analysis tool designed to help artists study and understand photographs before drawing
        or painting. Rather than editing photos for artistic effect, the application reveals structure, values,
        composition, and other visual information that can improve observation and artistic decision-making.
      </p>

      <p>
        The application follows a <strong>local-first</strong> philosophy. Images are processed directly on your device,
        allowing you to work privately and without an internet connection.
      </p>
    </section>

    <section>
      <h2>Features</h2>

      <p>
        ImageToArt provides a collection of analysis tools, including grayscale, contrast adjustment, blur, edge
        detection, posterization, composition guides, grids, and other non-destructive filters. Multiple variants can be
        created to compare different analyses of the same reference image.
      </p>

      <p>
        All processing is performed using your device's computing resources. No cloud processing is required for the
        core functionality.
      </p>
    </section>

    <section>
      <h2>Our Goal</h2>

      <p>
        The goal of ImageToArt is to support learning and artistic practice by making it easier to recognize shapes,
        values, proportions, and composition. The application is intended as a study aid and does not replace artistic
        skill, observation, or creativity.
      </p>
    </section>

    <section>
      <h2>Open Source</h2>

      <p>
        ImageToArt is built using modern open-source technologies. We are grateful to the developers and communities
        whose work makes this application possible.
      </p>
    </section>

    <section>
      <p>Version 1.0</p>

      <p>© 2026 Aleksandr Dederer. All rights reserved.</p>
    </section>
  </ModalPage>
</template>
