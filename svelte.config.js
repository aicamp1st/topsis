import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// GitHub Pages menyajikan repo di https://<user>.github.io/topsis/
// Jadi base path = '/topsis' saat build production, kosong saat dev.
const base = process.env.NODE_ENV === 'production' ? '/topsis' : ''

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true,
    }),
    paths: { base },
    alias: {
      $components: 'src/lib/components',
    },
  },
}

export default config
