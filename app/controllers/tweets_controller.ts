import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import { tweetValidator } from '#validators/tweet'

export default class TweetsController {
  async index() {
    return { data: await Tweet.query().orderBy('id', 'desc') }
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(tweetValidator)
    const tweet = await Tweet.create(payload)
    return response.created({ data: tweet })
  }

  async show({ params }: HttpContext) {
    return { data: await Tweet.findOrFail(params.id) }
  }

  async update({ params, request }: HttpContext) {
    const tweet = await Tweet.findOrFail(params.id)
    const payload = await request.validateUsing(tweetValidator)
    await tweet.merge(payload).save()
    return { data: tweet }
  }

  async destroy({ params, response }: HttpContext) {
    const tweet = await Tweet.findOrFail(params.id)
    await tweet.delete()
    return response.noContent()
  }
}
