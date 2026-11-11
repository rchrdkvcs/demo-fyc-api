import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ReadyController {
  async show({ response }: HttpContext) {
    try {
      await db.rawQuery('select 1')
      return { status: 'ready' }
    } catch {
      return response.status(503).json({ status: 'not_ready' })
    }
  }
}
