import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  index({ response }: HttpContext) {
    return response.type('html').send(`<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>API de démonstration</title>
    <style>
      body { max-width: 42rem; margin: 4rem auto; padding: 0 1.5rem; font-family: system-ui, sans-serif; line-height: 1.6; color: #172033; background: #f8fafc; }
      a { color: #174bb5; }
      li { margin-block: 1rem; }
      code { font-size: 1rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>L’API fonctionne</h1>
      <p>Cette application AdonisJS sert de support pour comparer les méthodes de déploiement.</p>
      <ul>
        <li><a href="/health">Vérifier l’état du serveur</a> — <code>GET /health</code></li>
        <li><a href="/api/products">Afficher les produits en JSON</a> — <code>GET /api/products</code></li>
      </ul>
      <p>Les données sont fictives. Aucune base de données ni authentification n’est nécessaire.</p>
    </main>
  </body>
</html>`)
  }
}
