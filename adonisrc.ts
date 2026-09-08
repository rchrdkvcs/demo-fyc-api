import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  commands: [() => import('@adonisjs/core/commands')],
  providers: [() => import('@adonisjs/core/providers/app_provider')],
  preloads: [() => import('#start/routes'), () => import('#start/kernel')],
  tests: {
    suites: [
      {
        files: ['tests/functional/**/*.spec.{ts,js}'],
        name: 'functional',
        timeout: 30000,
      },
    ],
    forceExit: false,
  },
})
