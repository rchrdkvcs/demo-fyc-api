# Parcours du dépôt — `demo-fyc-api`

Chaque chapitre du cours correspond à un tag Git annoté `module.chapitre`.
Le tag `0.1` est le socle fourni avant le parcours.

| Tag   | Module / chapitre                              | État du dépôt                                                        | Doc                                                  |
| ----- | ---------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| `0.1` | Socle                                          | API AdonisJS + PostgreSQL : CRUD tweets, `/health`, tests            | —                                                    |
| `1.1` | M1 — Du serveur au conteneur                   | `/ready` (contrôle PostgreSQL), `docs/` du parcours                  | [1.1](chapters/1.1-serveur-conteneur.md)             |
| `1.2` | M1 — Construire l'image                        | `Dockerfile` multi-stage non-root + `.dockerignore`                  | [1.2](chapters/1.2-image.md)                         |
| `1.3` | M1 — Lancer la stack avec Compose              | `compose.yaml` API + PostgreSQL + volume + healthchecks              | [1.3](chapters/1.3-compose.md)                       |
| `2.1` | M2 — Publier l'image                           | `.github/workflows/publish-image.yml` (GHCR)                         | [2.1](chapters/2.1-registre.md)                      |
| `2.2` | M2 — Déployer sur un VPS                       | `deploy/vps/` : Compose (image GHCR), Nginx, procédure Certbot       | [2.2](chapters/2.2-vps.md)                           |
| `2.3` | M2 — Les limites d'une machine                 | Grille de panne, pas de code                                         | [2.3](chapters/2.3-limites.md)                       |
| `3.1` | M3 — État désiré et architecture Kubernetes    | Cluster k3d + `deploy/k8s/00-namespace.yaml`                         | [3.1](chapters/3.1-etat-desire.md)                   |
| `3.2` | M3 — Déployer l'API sur k3d                    | `deploy/k8s/` : db + PVC, config/secret, migration, api, ingress     | [3.2](chapters/3.2-k3d.md)                           |
| `3.3` | M3 — Résister et scaler                        | requests/limits, rolling update, `06-hpa.yaml`                       | [3.3](chapters/3.3-resister-scaler.md)               |
| `4.1` | M4 — Git comme source de vérité                | `.github/workflows/validate-manifests.yml` (kubeconform)             | [4.1](chapters/4.1-gitops.md)                        |
| `4.2` | M4 — Déployer avec Argo CD                     | `gitops/argocd/application.yaml` → `deploy/k8s`                      | [4.2](chapters/4.2-argocd.md)                        |
| `4.3` | M4 — Cas pratique : livrer une nouvelle version | Corrigé : route `/version`, image `4.3` dans les manifestes         | [4.3](chapters/4.3-cas-pratique.md)                  |

TP1 se fait au tag `1.3`, TP2 au tag `2.2`, TP3 au tag `3.3`, TP4 au tag `4.2`.

## Suivre un checkpoint

```sh
git clone https://github.com/rchrdkvcs/demo-fyc-api.git
cd demo-fyc-api
git switch -c atelier-1-3 1.3
```

Un tag est immuable : on travaille sur une branche créée à partir du tag.

## Stack commune

- **Application :** AdonisJS 7, TypeScript, Node.js 24.
- **Données :** PostgreSQL 16, Lucid ORM.
- **Port HTTP :** `3333`.
- **Sondes :** `/health` vérifie le processus, `/ready` vérifie PostgreSQL.
- **Secrets :** aucun secret réel n'est versionné ; les valeurs présentes sont des valeurs de TP.

## Archive V1

La première version du parcours (Swarm, Kubernetes managé, Terraform/Ansible,
Kustomize) est conservée sur la branche `archive/v1` et les tags `v1-*`.
