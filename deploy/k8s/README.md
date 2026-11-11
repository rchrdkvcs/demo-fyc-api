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

## Appliquer les manifestes

```sh
kubectl apply -f deploy/k8s/
kubectl get all -n demo-fyc
```

## Supprimer le cluster

```sh
k3d cluster delete demo-fyc
```
