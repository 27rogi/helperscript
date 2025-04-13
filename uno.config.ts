import { defineConfig, presetWind3 } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import transformerClass from '@unocss/transformer-compile-class'
import transformerVariant from '@unocss/transformer-variant-group'

export default defineConfig({
  presets: [
    presetWind3(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariant(),
    transformerClass(),
  ],
  theme: {
    fontFamily: {
      base: `'Inter', 'Segoe UI', 'sans-serif'`,
    }
  },
})