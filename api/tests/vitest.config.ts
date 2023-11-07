import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: './tests/',
    forceRerunTriggers: [
      './src/**/*.ts',
      './src/main.ts',
      './seeds/seed.ts'
    ],
    setupFiles: ['./tests/setup.ts'],
    maxThreads: 1,
    minThreads: 1
  },
})
