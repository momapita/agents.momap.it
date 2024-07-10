import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// configure paths and extensions
import { fileURLToPath, URL } from 'url';

// configure mkcert
import mkcert from 'vite-plugin-mkcert';

// import version
import version from 'vite-plugin-package-version';

export default defineConfig({
  server: {
    https: true,
    host: true,
    port: 446,
  },
  plugins: [
    vue(),
    version(),
    mkcert()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.vue','.js','.json']
  },
  build: {
    chunkSizeWarningLimit: 2000,
    target: 'esnext'
  },
  transpileDependencies: true,
  lintonsave: false,
  publicpath: ''
})
