import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import monkey, { cdn } from 'vite-plugin-monkey'

const { VITE_SITE_URL: url, VITE_PROJECT_NAME: project } = import.meta.env
if (url.length <= 0)
  throw new Error('Please provide correct VITE_SITE_URL env!')

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    minify: true,
  },
  plugins: [
    unocss(),
    vue(),
    monkey({
      entry: 'src/main.ts',
      server: {
        mountGmApi: true,
        open: false,
      },
      userscript: {
        name: `${project} Helper`,
        author: '27rogi',
        namespace: 'helperscript',
        match: [`*://*.${url}/administrator/*`],
        grant: [],
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.min.js'),
        },
        systemjs: 'inline',
      },
    }),
  ],
})
