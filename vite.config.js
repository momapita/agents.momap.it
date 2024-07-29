import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// configure paths and extensions
import { fileURLToPath, URL } from 'url';

// configure mkcert
import mkcert from 'vite-plugin-mkcert';

// import path and VueI18nPlugin
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { dirname, resolve } from 'path';

// import version
import version from 'vite-plugin-package-version';

// import components and primeVueResolver
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineConfig({
  server: {
    https: true,
    host: true,
    port: 8080,
  },
  plugins: [
    vue(),
    version(),
    VueI18nPlugin({
      runtimeOnly: false,
      include: [
        resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
      ],
    }),
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
