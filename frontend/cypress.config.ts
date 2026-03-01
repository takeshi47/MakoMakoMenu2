// frontend/cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // ★ SymfonyサーバーのURLを指定
    baseUrl: 'http://127.0.0.1:8000',
    setupNodeEvents() {
      // ...
    },
  },
});
