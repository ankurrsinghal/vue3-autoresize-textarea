import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts({
    insertTypesEntry: true,
  })],
  build: {
    lib: {
      entry: resolve(__dirname, './src/AutoResizeTextarea/index.ts'),
      name: 'AutoResizeTextarea',
      fileName: 'AutoResizeTextarea'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
