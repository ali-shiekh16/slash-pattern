import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  server: {
    hmr: {
      protocol: 'ws',
      port: 3000,
    },
  },
});
