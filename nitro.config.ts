import { defineConfig } from 'nitro'
import vue from 'unplugin-vue/rollup'
import mcp from 'nitro-mcp-toolkit/module'

export default defineConfig({
  modules: [mcp()],
  serverDir: './server',
  rollupConfig: {
    plugins: [vue()],
    external: ['@napi-rs/canvas', 'sharp', 'css-tree', 'mdn-data', 'source-map-js'],
  },
  // public/decor is also bundled for server-side rendering (read via useStorage('assets:decor'))
  serverAssets: [{ baseName: 'decor', dir: './public/decor' }],
  experimental: {
    tasks: true,
  },
  runtimeConfig: {
    app: {
      version: '',
      buildTime: '',
    },
  },
  storage: {
    // Uploaded imagery, brand decor and the font cache (fs in development; swap the driver for KV / S3 / R2 in production)
    data: {
      driver: 'fs',
      base: './.data',
    },
  },
  routeRules: {
    '/api/**': { cors: true },
  },
})
