import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// configure paths and extensions
import { fileURLToPath, URL } from 'url';

// configure mkcert
import mkcert from 'vite-plugin-mkcert';

// import version
import version from 'vite-plugin-package-version';

// import components and primeVueResolver
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineConfig({
  server: {
    https: true,
    host: true,
    port: 443,
  },
  plugins: [
    vue(),
    version(),
    mkcert(),
    Components({
      resolvers: [ PrimeVueResolver() ]
    })
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
  publicpath: '',
  define: {
    'process.env': process.env
  }
})
