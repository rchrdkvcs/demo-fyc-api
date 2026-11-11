# Kubernetes local avec k3d

k3d exécute k3s (Kubernetes allégé) dans des conteneurs Docker. Il fournit
d'emblée un Ingress Controller Traefik, un provisionneur de volumes
`local-path` et metrics-server.

## Créer le cluster

Prérequis : Docker, [k3d](https://k3d.io) 5.x et `kubectl`.

```sh
k3d cluster create demo-fyc --agents 2 -p "8080:80@loadbalancer"
kubectl get nodes
```

- `--agents 2` : un nœud serveur (control plane) et deux nœuds agents.
- `-p "8080:80@loadbalancer"` : le port 80 de Traefik est publié sur
  `localhost:8080` du poste.

## Fichiers

| Fichier | Contenu |
| --- | --- |
| `00-namespace.yaml` | Namespace `demo-fyc` |
| `01-db.yaml` | PostgreSQL : PVC, Service, Deployment (stratégie `Recreate`) |
| `02-config.yaml` | ConfigMap (configuration) et Secret (identifiants de TP) |
| `03-migration-job.yaml` | Job `node ace migration:run --force` |
| `04-api.yaml` | Deployment de l'API (probes `/health` et `/ready`) et Service |
| `05-ingress.yaml` | Ingress Traefik sur `api.localhost` |
| `06-hpa.yaml` | HorizontalPodAutoscaler : 2 à 5 réplicas, cible CPU 60 % |

## Appliquer les manifestes

L'image `ghcr.io/rchrdkvcs/demo-fyc-api:4.3` doit être publique sur GHCR.
Sinon, construire et importer une image locale du même nom :
`docker build -t ghcr.io/rchrdkvcs/demo-fyc-api:4.3 . && k3d image import ghcr.io/rchrdkvcs/demo-fyc-api:4.3 -c demo-fyc`.

```sh
kubectl apply -f deploy/k8s/
kubectl get all -n demo-fyc
kubectl wait --for=condition=complete job/demo-fyc-migrate -n demo-fyc --timeout=180s
kubectl rollout status deployment/demo-fyc-api -n demo-fyc
curl -i http://api.localhost:8080/ready
```

Le Job de migration redémarre tant que PostgreSQL n'est pas prêt : quelques
erreurs dans ses logs au premier démarrage sont normales.

Un Job est immuable : pour relancer la migration avec une nouvelle image,
supprimer l'ancien Job avant de réappliquer
(`kubectl delete job demo-fyc-migrate -n demo-fyc --ignore-not-found`).

## Autoscaling

Le HPA lit la consommation CPU via metrics-server, installé d'office par k3d
(`kubectl top pods -n demo-fyc` doit répondre). Sur un autre cluster, installer
metrics-server avant d'appliquer `06-hpa.yaml`.

```sh
kubectl get hpa -n demo-fyc -w
```

## Supprimer le cluster

```sh
k3d cluster delete demo-fyc
```
