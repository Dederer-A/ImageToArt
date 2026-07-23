// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,vue}',
  ],
  theme: {
    extend: {
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
      },
    },
  },
  plugins: [],
};