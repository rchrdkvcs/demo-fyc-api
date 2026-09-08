import { test } from '@japa/runner'

test.group('Endpoints de démonstration', () => {
  test('accueil HTML avec les liens vers les endpoints', async ({ client, assert }) => {
    const response = await client.get('/')

    response.assertStatus(200)
    response.assertHeader('content-type', 'text/html; charset=utf-8')
    assert.include(response.text(), 'L’API fonctionne')
    assert.include(response.text(), 'href="/health"')
    assert.include(response.text(), 'href="/api/products"')
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

  test('produits fictifs en JSON', async ({ client }) => {
    const response = await client.get('/api/products')

    response.assertStatus(200)
    response.assertHeader('content-type', 'application/json; charset=utf-8')
    response.assertBody({
      data: [
        { id: 1, name: 'Clavier', price: 49.9 },
        { id: 2, name: 'Souris', price: 24.9 },
        { id: 3, name: 'Écran', price: 199.9 },
      ],
    })
  })

  test('route inconnue', async ({ client }) => {
    const response = await client.get('/unknown').header('Accept', 'application/json')
    response.assertStatus(404)
  })
})
