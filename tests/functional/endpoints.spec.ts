import { test } from '@japa/runner'

test.group('Endpoints de démonstration', () => {
  test('accueil HTML avec les liens vers les endpoints', async ({ client, assert }) => {
    const response = await client.get('/')

    response.assertStatus(200)
    response.assertHeader('content-type', 'text/html; charset=utf-8')
    assert.include(response.text(), 'L’API fonctionne')
    assert.include(response.text(), 'href="/health"')
    assert.include(response.text(), 'href="/ready"')
    assert.include(response.text(), 'href="/api/tweets"')
  })

  test('état du serveur en JSON sans cache', async ({ client, assert }) => {
    const response = await client.get('/health')

    response.assertStatus(200)
    response.assertHeader('content-type', 'application/json; charset=utf-8')
    response.assertHeader('cache-control', 'no-store')
    response.assertBodyContains({ status: 'ok' })
    assert.isAtLeast(response.body().uptime, 0)
    assert.isFalse(Number.isNaN(Date.parse(response.body().timestamp)))
  })

  test('base de données prête', async ({ client }) => {
    const response = await client.get('/ready')

    response.assertStatus(200)
    response.assertBody({ status: 'ready' })
  })

  test('route inconnue', async ({ client }) => {
    const response = await client.get('/unknown').header('Accept', 'application/json')
    response.assertStatus(404)
  })
})
