# API de démonstration — AdonisJS

Une petite application pour comparer le déploiement sur un serveur, un VPS,
Docker Compose ou Kubernetes. Les tweets sont stockés dans PostgreSQL via Lucid.
Les produits restent des données fictives définies dans le code. Aucun compte requis.

## Fil rouge du cours

Ce dépôt est utilisé comme fil rouge du cours **Déployer une API à différentes échelles**.
Les checkpoints sont disponibles avec des tags Git annotés : consultez
[`docs/repository-map.md`](docs/repository-map.md) pour la correspondance complète
entre modules, chapitres et états du dépôt.

```sh
git clone https://github.com/rchrdkvcs/demo-fyc-api.git
cd demo-fyc-api
git checkout 1.1
```

La convention est `module.chapitre` : `2.1` signifie module 2, chapitre 1.

## Construire l'image Docker

Le checkpoint Dockerfile est tagué `1.3` :

```sh
docker build -t demo-fyc-api:1.3 .
```

L'image est multi-stage et démarre `node bin/server.js` depuis le build de
production. Elle attend au minimum `APP_KEY`, `HOST`, `PORT` et les variables
`DB_*`. Pour le détail de l'atelier et du cache de build, voir
[`docs/chapters/1.3-dockerfile.md`](docs/chapters/1.3-dockerfile.md).

## Lancer la stack avec Docker Compose

Le checkpoint Compose est tagué `1.4` :

```sh
cp .env.example .env
node ace generate:key
docker compose up --build -d
curl -i http://localhost:3333/ready
```

`compose.yaml` connecte l'API au service PostgreSQL `db`, attend son healthcheck
et persiste les données dans `postgres_data`. Les commandes de diagnostic et la
procédure de remise à zéro sont détaillées dans
[`docs/chapters/1.4-compose.md`](docs/chapters/1.4-compose.md).

## Publier l'image

Le checkpoint registre est tagué `1.5`. L'image peut être publiée manuellement
ou automatiquement dans GHCR :

```sh
docker build -t ghcr.io/rchrdkvcs/demo-fyc-api:1.5 .
docker login ghcr.io
docker push ghcr.io/rchrdkvcs/demo-fyc-api:1.5
```

Le workflow [`publish-image.yml`](.github/workflows/publish-image.yml) reprend
la même convention pour les tags `module.chapitre`. Voir
[`docs/chapters/1.5-registre.md`](docs/chapters/1.5-registre.md) avant de rendre
le package public ou de l'utiliser depuis un cluster.

## Déployer manuellement sur un VPS

Le checkpoint VPS est tagué `1.6`. Les modèles Nginx et systemd se trouvent dans
[`deploy/vps/`](deploy/vps/) et la procédure complète dans
[`docs/chapters/1.6-vps.md`](docs/chapters/1.6-vps.md). Les secrets restent dans
`/etc/demo-fyc-api/`, hors du dépôt.

## Comparer avec Docker Swarm

Le premier checkpoint du module 2 est `2.1`. Le fichier
[`deploy/swarm/stack.yaml`](deploy/swarm/stack.yaml) déclare trois réplicas de
l'API et une base PostgreSQL volontairement simple. L'atelier et ses limites
sont décrits dans [`docs/chapters/2.1-swarm.md`](docs/chapters/2.1-swarm.md).

## Déployer sur Kubernetes local

Le checkpoint Kubernetes est tagué `2.2`. Les manifestes sont dans
[`deploy/kubernetes/local/`](deploy/kubernetes/local/) et le déroulé est décrit
dans [`docs/chapters/2.2-kubernetes-local.md`](docs/chapters/2.2-kubernetes-local.md).
Ils utilisent l'image locale `demo-fyc-api:2.2`, un Job de migration séparé,
trois réplicas API, un PVC PostgreSQL, des probes et un Ingress optionnel.

## Passer sur un Kubernetes managé

Le premier checkpoint cloud est `3.1`. Le fichier
[`deploy/kubernetes/cloud/01-loadbalancer.yaml`](deploy/kubernetes/cloud/01-loadbalancer.yaml)
transforme le Service API en `LoadBalancer` ; la checklist provider-neutral se
trouve dans [`deploy/kubernetes/cloud/README.md`](deploy/kubernetes/cloud/README.md).

Le checkpoint `3.2` ajoute le HPA portable
[`deploy/kubernetes/cloud/02-hpa.yaml`](deploy/kubernetes/cloud/02-hpa.yaml) et
les vérifications PVC/Metrics Server dans
[`docs/chapters/3.2-stockage-autoscaling.md`](docs/chapters/3.2-stockage-autoscaling.md).

Le checkpoint `3.3` propose le manifeste CloudNativePG
[`deploy/kubernetes/cloud/03-cloudnativepg.yaml`](deploy/kubernetes/cloud/03-cloudnativepg.yaml)
et les prérequis de l'opérateur, de la connexion API et des snapshots dans
[`docs/chapters/3.3-cloudnativepg.md`](docs/chapters/3.3-cloudnativepg.md).

## Automatiser le provisioning et la configuration

Le checkpoint IaC est `4.1`. Les squelettes Terraform/OpenTofu et Ansible se
trouvent dans [`infra/`](infra/) ; le dépôt ne contient aucun provider cloud,
credential ou état Terraform. La distinction et les commandes de validation
sont dans [`docs/chapters/4.1-iac.md`](docs/chapters/4.1-iac.md).

Le checkpoint `4.2` ajoute la base et les overlays Kustomize dans
[`deploy/kustomize/`](deploy/kustomize/) : `staging` et `production` peuvent
être rendus ou appliqués séparément avec `kubectl kustomize` / `kubectl apply -k`.

## Démarrer en local

Prérequis : **Node.js 24 ou supérieur**, **pnpm 11.7.0** et **PostgreSQL**.

```sh
pnpm install --frozen-lockfile
cp .env.example .env # uniquement si .env n’existe pas encore
node ace generate:key
# Créer la base demo_fyc dans PostgreSQL et renseigner DB_* dans .env
node ace migration:run
pnpm dev
```

L’application écoute sur <http://localhost:3333> par défaut.

## Routes

| Méthode | Route         | Réponse                                                           |
| ------- | ------------- | ----------------------------------------------------------------- |
| GET     | /             | Page HTML avec des liens vers les deux endpoints                  |
| GET     | /health       | JSON : état `ok`, durée de fonctionnement en secondes et date UTC |
| GET     | /ready        | JSON `ready` si PostgreSQL répond, sinon HTTP 503               |
| GET     | /api/products | JSON : trois produits fictifs sous la clé `data`                  |

```sh
curl -i http://localhost:3333/
curl -i http://localhost:3333/health
curl -i http://localhost:3333/ready
curl -i http://localhost:3333/api/products
```

Les trois routes renvoient HTTP 200. Une route inconnue renvoie HTTP 404.
`/health` est une sonde de vie du processus, pas une vérification de services externes.
`/ready` est une sonde de disponibilité qui vérifie PostgreSQL. Sa réponse n’est pas
mise en cache.

## Tweets — CRUD minimal

Un tweet contient un `id`, un `content` et les dates `createdAt` / `updatedAt`.
Le contenu est obligatoire, nettoyé des espaces en début/fin et limité à 280 caractères.
Pas d’authentification : ces routes sont publiques, pour la démonstration uniquement.

| Méthode     | Route           | Action                                                |
| ----------- | --------------- | ----------------------------------------------------- |
| GET         | /api/tweets     | Lister tous les tweets, du plus récent au plus ancien |
| POST        | /api/tweets     | Créer un tweet (201)                                  |
| GET         | /api/tweets/:id | Consulter un tweet                                    |
| PUT / PATCH | /api/tweets/:id | Modifier le contenu                                   |
| DELETE      | /api/tweets/:id | Supprimer un tweet (204, sans corps)                  |

Les réponses JSON utilisent la clé `data`. Un tweet inexistant renvoie 404 ;
un contenu invalide renvoie 422.

Après avoir démarré PostgreSQL, créer les bases (adapter l’utilisateur si besoin) :

```sh
createdb -h 127.0.0.1 -U postgres demo_fyc
createdb -h 127.0.0.1 -U postgres demo_fyc_test
```

Configurer `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` et `DB_DATABASE`
dans `.env` (voir `.env.example`), puis exécuter `node ace migration:run`.

```sh
curl http://localhost:3333/api/tweets
curl -X POST http://localhost:3333/api/tweets -H 'Content-Type: application/json' -d '{"content":"Mon premier tweet"}'
# Remplacer 1 par l’id renvoyé à la création
curl http://localhost:3333/api/tweets/1
curl -X PATCH http://localhost:3333/api/tweets/1 -H 'Content-Type: application/json' -d '{"content":"Tweet modifié"}'
curl -X DELETE http://localhost:3333/api/tweets/1
```

La migration est réversible avec `node ace migration:rollback` :
attention, cela supprime la table et ses tweets.

## Vérifier le projet

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Les tests des tweets utilisent la base dédiée `demo_fyc_test` définie dans `.env.test`.
Ne jamais utiliser une base contenant des données à conserver : les migrations sont
annulées après les tests. Chaque test s’exécute dans une transaction annulée.

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
DB_HOST=<hôte PostgreSQL>
DB_PORT=5432
DB_USER=<utilisateur>
DB_PASSWORD=<mot de passe>
DB_DATABASE=<base de données>
```

Puis, depuis le dossier `build` :

```sh
node ace migration:run --force
pnpm start
```

Le dossier `build` constitue l’application à déployer. Le fichier `.env` local
n’est pas copié pendant le build. Ne jamais versionner la clé ni les secrets.
`HOST=0.0.0.0` permet l’accès depuis l’extérieur du processus, notamment dans un
conteneur ; le pare-feu et le reverse proxy restent à configurer selon le déploiement.
PostgreSQL doit être accessible et ses données persistées indépendamment du build.

## Structure utile

- `start/routes.ts` : les routes de l’API.
- `app/models/tweet.ts` et `database/migrations/` : modèle Lucid et table PostgreSQL.
- `app/validators/tweet.ts` : validation du contenu.
- `app/controllers/` : un contrôleur par endpoint. Le HTML est directement dans
  `HomeController` pour éviter un moteur de templates sur cette simple page.
- `start/env.ts` et `config/` : configuration du serveur, des logs et du chiffrement AdonisJS.
- `tests/functional/endpoints.spec.ts` : vérification des réponses HTML, JSON et 404.
