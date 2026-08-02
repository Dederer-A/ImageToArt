import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.imagetoart.app',
  appName: 'ImageToArt',
  webDir: 'dist',
  plugins: {
    CapacitorShareTarget: {
      iosAppGroup: 'group.com.imagetoart.app',
    },
  },
};

export default config;
