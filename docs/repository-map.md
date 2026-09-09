# Parcours du dépôt — `demo-fyc-api`

Ce dépôt est le fil rouge du cours **Déployer une API à différentes échelles**. Chaque état important est matérialisé par un tag Git annoté.

## Convention de versionnement pédagogique

Un tag suit la forme `module.chapitre` : `2.1` signifie **module 2, chapitre 1**. Le tag `0.1` désigne le socle fourni avant le parcours.

Les titres de chapitres présents dans Notion utilisent parfois une numérotation globale (`2.1` à `5.3`). La table ci-dessous fait foi pour le dépôt : elle distingue le numéro du module pédagogique et le numéro du chapitre dans ce module.

| Tag | Module / chapitre | État attendu dans le dépôt |
| --- | --- | --- |
| `0.1` | Socle initial | API AdonisJS + PostgreSQL, sans packaging d'infrastructure |
| `1.1` | Hébergement et socle local | Contrat de l'API, prérequis et vérifications locales |
| `1.2` | VM et conteneurs | Repères d'architecture et limites d'isolation |
| `1.3` | Dockerfile | Image de production multi-stage, non-root et healthcheck |
| `1.4` | Docker Compose | API + PostgreSQL, réseau de service et volume persistant |
| `1.5` | Registre d'images | Publication et récupération d'une image taguée |
| `1.6` | VPS manuel | Nginx, systemd et TLS documentés sans secret versionné |
| `2.1` | Haute disponibilité | Exemple Docker Swarm et comparaison avec un service unique |
| `2.2` | Kubernetes local | Deployments, Services, Secret, PVC, probes et Ingress |
| `3.1` | Cloud public | Checklist provider-neutral pour un cluster managé |
| `3.2` | Stockage et autoscaling | PVC, StorageClass et HPA avec prérequis explicites |
| `3.3` | PostgreSQL opéré | Exemple CloudNativePG et sauvegarde planifiée |
| `4.1` | IaC | Squelettes Terraform/OpenTofu et Ansible, sans credentials |
| `4.2` | Kustomize | Base commune et overlays `staging` / `production` |
| `4.3` | GitOps | Applications Argo CD et procédure de réconciliation |

## Démarrer un checkpoint

```sh
git clone https://github.com/rchrdkvcs/demo-fyc-api.git
cd demo-fyc-api
git checkout 1.3       # remplacer par le tag du chapitre à suivre
```

Un tag est immuable : pour continuer le cours, on crée une branche locale à partir de celui-ci ou on revient sur `main`.

```sh
git switch -c atelier-1-3-essai 1.3
```

## Stack commune

- **Application :** AdonisJS 7, TypeScript, Node.js 24+.
- **Données :** PostgreSQL 16+ avec Lucid ORM.
- **Port HTTP :** `3333` ; le conteneur écoute sur `0.0.0.0`.
- **Sondes :** `/health` vérifie le processus, `/ready` vérifie la connexion PostgreSQL.
- **Secrets :** aucun secret réel n'est versionné. Les fichiers d'exemple utilisent uniquement des valeurs de TP.

## Règle de lecture

Le code applicatif reste le même autant que possible. Chaque chapitre ajoute une couche d'exécution ou d'automatisation et conserve une commande de vérification. Si une ressource cloud ou un contrôleur Kubernetes est optionnel, le dépôt fournit un exemple déclaratif et documente explicitement les prérequis au lieu de simuler une réussite.
