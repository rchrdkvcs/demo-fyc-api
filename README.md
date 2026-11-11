# demo-fyc-api

API de démonstration du cours **Déployer une API à différentes échelles**.
AdonisJS 7 (TypeScript, Node.js 24) et PostgreSQL 16 : un CRUD `tweets` et deux
sondes, `/health` et `/ready`.

## Fil rouge

La même API est déployée à quatre échelles, sans changer son code :

1. **1 poste** — conteneur Docker et Docker Compose ;
2. **1 serveur** — image publiée sur GHCR, VPS avec Nginx et TLS ;
3. **1 cluster** — Kubernetes local avec k3d ;
4. **déploiement automatisé** — GitOps avec Argo CD.

Chaque chapitre correspond à un tag Git annoté `module.chapitre`
(`2.1` = module 2, chapitre 1). Le détail est dans
[`docs/repository-map.md`](docs/repository-map.md) et dans
[`docs/chapters/`](docs/chapters/).

## Parcours

| Tag   | Chapitre                                   | Ajout dans le dépôt                                              |
| ----- | ------------------------------------------ | ---------------------------------------------------------------- |
| `0.1` | Socle                                      | CRUD tweets, `/health`, tests                                    |
| `1.1` | Du serveur au conteneur                    | `/ready`, documentation du parcours                              |
| `1.2` | Construire l'image                         | `Dockerfile` multi-stage non-root, `.dockerignore`               |
| `1.3` | Lancer la stack avec Compose               | `compose.yaml` : API + PostgreSQL + volume + healthchecks        |
| `2.1` | Publier l'image                            | Workflow GitHub Actions → GHCR                                   |
| `2.2` | Déployer sur un VPS                        | `deploy/vps/` : Compose (image GHCR), Nginx, Certbot             |
| `2.3` | Les limites d'une machine                  | Grille de panne (pas de code)                                    |
| `3.1` | État désiré et architecture Kubernetes     | Cluster k3d, `deploy/k8s/00-namespace.yaml`                      |
| `3.2` | Déployer l'API sur k3d                     | PostgreSQL + PVC, ConfigMap/Secret, migration, API, Ingress      |
| `3.3` | Résister et scaler                         | requests/limits, rolling update, HPA                             |
| `4.1` | Git comme source de vérité                 | CI de validation des manifestes (kubeconform)                    |
| `4.2` | Déployer avec Argo CD                      | Application Argo CD → `deploy/k8s`                               |
| `4.3` | Cas pratique : livrer une nouvelle version | Corrigé : route `/version`, image `4.3`                          |

```sh
git clone https://github.com/rchrdkvcs/demo-fyc-api.git
cd demo-fyc-api
git switch -c mon-essai 1.3   # partir d'un checkpoint sans modifier le tag
```

## Démarrer en local

Prérequis : Node.js 24+, pnpm 11 et PostgreSQL 16 (ou Docker à partir du tag `1.3`).

```sh
pnpm install --frozen-lockfile
cp .env.example .env
node ace generate:key
createdb -h 127.0.0.1 -U postgres demo_fyc
node ace migration:run
pnpm dev
```

L'API écoute sur <http://localhost:3333>. Les variables `DB_*` de `.env`
décrivent la connexion PostgreSQL.

## Routes

| Méthode     | Route             | Réponse                                                  |
| ----------- | ----------------- | -------------------------------------------------------- |
| GET         | `/`               | Page HTML avec les liens utiles                          |
| GET         | `/health`         | `200` si le processus répond (sonde de vie)              |
| GET         | `/ready`          | `200` si PostgreSQL répond à `select 1`, sinon `503`     |
| GET         | `/api/tweets`     | Liste des tweets, du plus récent au plus ancien          |
| POST        | `/api/tweets`     | Création (`201`), `content` obligatoire, 280 caractères  |
| GET         | `/api/tweets/:id` | Un tweet, `404` s'il n'existe pas                        |
| PUT / PATCH | `/api/tweets/:id` | Modification du contenu, `422` si invalide               |
| DELETE      | `/api/tweets/:id` | Suppression (`204`)                                      |

```sh
curl -i http://localhost:3333/ready
curl -X POST http://localhost:3333/api/tweets \
  -H 'Content-Type: application/json' -d '{"content":"Mon premier tweet"}'
curl http://localhost:3333/api/tweets
```

Les routes sont publiques, sans authentification : usage pédagogique uniquement.

## Tests

Les tests fonctionnels utilisent la base `demo_fyc_test` (voir `.env.test`) :
ne jamais pointer vers une base contenant des données à conserver.

```sh
createdb -h 127.0.0.1 -U postgres demo_fyc_test
pnpm test
pnpm lint
pnpm typecheck
```

Les tests démarrent leur propre serveur sur le port configuré : arrêter
`pnpm dev` avant de les lancer.
