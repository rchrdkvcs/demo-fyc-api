import { test } from '@japa/runner'
import env from '#start/env'

test.group('Version', () => {
  test('renvoie dev quand APP_VERSION est absente', async ({ client }) => {
    const response = await client.get('/version')

    response.assertStatus(200)
    response.assertBody({ version: 'dev' })
  }).skip(env.get('APP_VERSION') !== undefined, 'APP_VERSION est définie dans l’environnement')

  test('renvoie la valeur de APP_VERSION', async ({ client }) => {
    env.set('APP_VERSION', '4.3')
    const response = await client.get('/version')

    response.assertStatus(200)
    response.assertBody({ version: '4.3' })
  })
})
