import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
    maxThreads: 1,
    minThreads: 1
  },
})