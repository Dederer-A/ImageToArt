import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.imagetoart.app',
  appName: 'ImageToArt',
  webDir: 'dist',
  plugins: {
    CapacitorShareTarget: {
      appGroupId: 'group.com.imagetoart.app',
    },
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;
