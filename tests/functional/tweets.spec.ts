import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Tweets', (group) => {
  group.setup(() => testUtils.db().migrate())
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('créer, lister, consulter, modifier et supprimer un tweet', async ({ client, assert }) => {
    const empty = await client.get('/api/tweets')
    empty.assertStatus(200)
    empty.assertBody({ data: [] })

    const created = await client.post('/api/tweets').json({ content: ' Bonjour ! ' })
    created.assertStatus(201)
    const id = created.body().data.id
    assert.equal(created.body().data.content, 'Bonjour !')
    assert.isString(created.body().data.createdAt)

    const second = await client.post('/api/tweets').json({ content: 'Deuxième tweet' })
    second.assertStatus(201)

    const list = await client.get('/api/tweets')
    list.assertStatus(200)
    assert.deepEqual(
      list.body().data.map((tweet: { id: number }) => tweet.id),
      [second.body().data.id, id]
    )

    const shown = await client.get(`/api/tweets/${id}`)
    shown.assertStatus(200)
    shown.assertBodyContains({ data: { id, content: 'Bonjour !' } })

    const updated = await client.patch(`/api/tweets/${id}`).json({ content: 'Modifié' })
    updated.assertStatus(200)
    updated.assertBodyContains({ data: { id, content: 'Modifié' } })

    const persisted = await client.get(`/api/tweets/${id}`)
    persisted.assertBodyContains({ data: { id, content: 'Modifié' } })

    const invalid = await client.patch(`/api/tweets/${id}`).json({ content: '' })
    invalid.assertStatus(422)

    const deleted = await client.delete(`/api/tweets/${id}`)
    deleted.assertStatus(204)

    for (const method of ['get', 'patch', 'delete'] as const) {
      const missing = await client[method](`/api/tweets/${id}`).header('Accept', 'application/json')
      missing.assertStatus(404)
    }
  })

  test('refuser un contenu absent, vide, trop long ou non textuel', async ({ client }) => {
    for (const payload of [{}, { content: '   ' }, { content: 'a'.repeat(281) }, { content: 42 }]) {
      const response = await client.post('/api/tweets').json(payload)
      response.assertStatus(422)
    }

    const response = await client.post('/api/tweets').json({ content: 'a'.repeat(280) })
    response.assertStatus(201)
  })
})
