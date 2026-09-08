# API de démonstration — AdonisJS

Une petite application pour comparer le déploiement sur un serveur, un VPS,
Docker Compose ou Kubernetes. Elle ne nécessite ni base de données, ni compte,
ni service externe. Les produits sont des données fictives définies dans le code.

## Démarrer en local

Prérequis : **Node.js 24 ou supérieur** et **pnpm 11.7.0**.

```sh
pnpm install --frozen-lockfile
cp .env.example .env # uniquement si .env n’existe pas encore
node ace generate:key
pnpm dev
```

L’application écoute sur <http://localhost:3333> par défaut.

## Routes

| Méthode | Route         | Réponse                                                           |
| ------- | ------------- | ----------------------------------------------------------------- |
| GET     | /             | Page HTML avec des liens vers les deux endpoints                  |
| GET     | /health       | JSON : état `ok`, durée de fonctionnement en secondes et date UTC |
| GET     | /api/products | JSON : trois produits fictifs sous la clé `data`                  |

```sh
curl -i http://localhost:3333/
curl -i http://localhost:3333/health
curl -i http://localhost:3333/api/products
```

Les trois routes renvoient HTTP 200. Une route inconnue renvoie HTTP 404.
`/health` est une sonde de vie du processus, pas une vérification de services externes.
Sa réponse n’est pas mise en cache.

## Vérifier le projet

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Les tests démarrent et arrêtent automatiquement un serveur HTTP sur le port
configuré. Arrêter le serveur de développement avant de les lancer sur le même port.

## Exécuter le build de production

```sh
pnpm build
cd build
pnpm install --prod --frozen-lockfile
```

Fournir ensuite les variables suivantes via le système de déploiement ou un fichier
`build/.env` non versionné :

```dotenv
NODE_ENV=production
HOST=0.0.0.0
PORT=3333
LOG_LEVEL=info
APP_KEY=<une clé générée avec node ace generate:key>
```

Puis, depuis le dossier `build` :

```sh
pnpm start
```

Le dossier `build` constitue l’application à déployer. Le fichier `.env` local
n’est pas copié pendant le build. Ne jamais versionner la clé ni les secrets.
`HOST=0.0.0.0` permet l’accès depuis l’extérieur du processus, notamment dans un
conteneur ; le pare-feu et le reverse proxy restent à configurer selon le déploiement.
Aucune migration ni aucun volume de données n’est nécessaire.

## Structure utile

- `start/routes.ts` : les trois routes.
- `app/controllers/` : un contrôleur par endpoint. Le HTML est directement dans
  `HomeController` pour éviter un moteur de templates sur cette simple page.
- `start/env.ts` et `config/` : configuration du serveur, des logs et du chiffrement AdonisJS.
- `tests/functional/endpoints.spec.ts` : vérification des réponses HTML, JSON et 404.
