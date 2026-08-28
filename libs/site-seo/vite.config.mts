/// <reference types="vitest" />
import { join } from 'node:path';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: join(import.meta.dirname),
  cacheDir: '../../node_modules/.vite/libs/site-seo',
  plugins: [
    angular({ tsconfig: join(import.meta.dirname, 'tsconfig.spec.json') }),
    nxViteTsPaths(),
  ],
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/site-seo',
      provider: 'v8' as const,
    },
  },
}));
