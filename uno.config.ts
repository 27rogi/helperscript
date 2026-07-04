import { defineConfig, presetWind4 } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import transformerClass from '@unocss/transformer-compile-class'
import transformerVariant from '@unocss/transformer-variant-group'

export default defineConfig({
  presets: [
    presetWind4(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariant(),
    transformerClass(),
  ],
  theme: {
    font: {
      base: `'Inter', 'Segoe UI', 'sans-serif'`,
    }
  },
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        "(components|src)/**/*.{js,ts}",
      ],
    },
  }
})