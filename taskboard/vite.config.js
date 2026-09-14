import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      exclude: ['src/main.jsx', 'src/**/*.test.{js,jsx}'],
      thresholds: { statements: 40, branches: 40, functions: 40 },
    },
  },
})
