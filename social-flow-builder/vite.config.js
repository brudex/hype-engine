import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  ...(mode === 'lib'
    ? {
        // --mode lib is not "production", so without this the UMD bundle keeps
        // `process.env.NODE_ENV` and throws in the browser (process is undefined).
        define: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
        build: {
          lib: {
            entry: 'src/embed.js',
            name: 'FlowBuilder',
            fileName: 'flow-builder',
            formats: ['umd', 'es'],
          },
          rollupOptions: {
            external: [],
          },
        },
      }
    : {
        build: {
          outDir: 'dist-app',
        },
      }),
}));
