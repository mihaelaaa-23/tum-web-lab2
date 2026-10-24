import { defineConfig } from '@playwright/test';

const viewports = [
  { name: 'w320', width: 320, height: 740 },
  { name: 'w768', width: 768, height: 1024 },
  { name: 'w1024', width: 1024, height: 768 },
  { name: 'w1440', width: 1440, height: 900 },
];

export default defineConfig({
  testDir: 'tests/e2e',
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321' },
  projects: viewports.map(({ name, width, height }) => ({
    name,
    use: { viewport: { width, height } },
  })),
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
