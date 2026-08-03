<script setup lang="ts">
import ModalPage from './ModalPage.vue';
</script>

<template>
  <ModalPage title="Privacy">
    <section>
      <h2>Privacy</h2>
      <p>Your privacy is important.</p>
      <p>This application is designed with a <strong>local-first</strong> approach.</p>
    </section>

    <section>
      <h2>Local Storage</h2>
      <p>
        All of your data — including images, settings, projects, and application preferences—is stored locally on your
        device.
      </p>
      <p>The application does <strong>not</strong> upload your files or personal data to our servers.</p>
    </section>

    <section>
      <h2>No Account Required</h2>
      <p>You can use the application without creating an account or providing personal information.</p>
    </section>

    <section>
      <h2>Internet Access</h2>
      <p>The core functionality works entirely offline.</p>
      <p>
        If the application ever offers optional online features (such as checking for updates or connecting to
        third-party services), those features will be clearly identified and will never upload your files without your
        explicit permission.
      </p>
    </section>

    <section>
      <h2>Your Images</h2>
      <p>Your reference images remain your property at all times.</p>
      <p>
        Image analysis is performed locally on your device whenever possible. Your images are never shared or
        transmitted without your knowledge and consent.
      </p>
    </section>

    <section>
      <h2>Data Collection</h2>
      <p>The application does not collect or sell your personal data.</p>
      <p>
        If anonymous diagnostic or crash reports are ever introduced, they will be optional and disabled unless you
        choose to enable them.
      </p>
    </section>

    <section>
      <h2>Changes</h2>
      <p>
        If this privacy policy changes in future releases, the updated version will be published with the application.
      </p>
    </section>

    <section>
      <p>
        <strong>In short:</strong> your images stay on your device, your data stays under your control, and the
        application is designed to respect your privacy by default.
      </p>
    </section>
  </ModalPage>
</template>
