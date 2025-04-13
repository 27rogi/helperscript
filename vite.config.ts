import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import unocss from 'unocss/vite'

const { VITE_SITE_URL: url, VITE_PROJECT_NAME: project } = import.meta.env;
if (url.length <= 0) throw Error("Please provide correct VITE_SITE_URL env!")

export default defineConfig({
  build: {
    minify: true,
  },
  plugins: [,
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
        author: "27rogi",
        namespace: 'helperscript',
        match: [`*://*.${url}/administrator/*`],
        grant: [],
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.min.js'),
        },
        systemjs: 'inline'
      },
    }),
  ],
});
