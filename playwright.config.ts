import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.PLAYWRIGHT_PORT || 4175)
const baseURL = `http://127.0.0.1:${port}`
const webServerTimeout = Number(process.env.PLAYWRIGHT_WEB_SERVER_TIMEOUT || 30_000)

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npm run start -- --port ${port} --host 127.0.0.1`,
    env: {
      SENTIENT_HSTS_ENABLED: 'true',
    },
    url: baseURL,
    reuseExistingServer: false,
    timeout: webServerTimeout,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
