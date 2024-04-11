import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: './src',
    cache: { dir: '../../node_modules/.http-server' }
  },
})
