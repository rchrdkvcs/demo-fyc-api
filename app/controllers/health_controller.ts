import type { HttpContext } from '@adonisjs/core/http'

export default class HealthController {
  show({ response }: HttpContext) {
    response.header('Cache-Control', 'no-store')

    return {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    }
  }
}
