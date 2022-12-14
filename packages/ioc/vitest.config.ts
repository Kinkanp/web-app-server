import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: './tests',
    cache: { dir: '../../node_modules/.ioc' }
  },
})
