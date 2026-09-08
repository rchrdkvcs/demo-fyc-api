import { defineConfig } from '@adonisjs/core/http'

export const http = defineConfig({
  generateRequestId: true,
  allowMethodSpoofing: false,
  useAsyncLocalStorage: false,
})
