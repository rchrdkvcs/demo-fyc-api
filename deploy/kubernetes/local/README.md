# Kubernetes local

Ces manifestes correspondent au tag `2.2`. Ils sont séparés pour rendre visible l'ordre de construction de la stack : namespace, PostgreSQL, configuration, migration, API, puis Ingress.

## Kind

```sh
kind create cluster --name demo-fyc
docker build -t demo-fyc-api:2.2 .
kind load docker-image demo-fyc-api:2.2 --name demo-fyc

kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-db.yaml
kubectl wait --for=condition=available deployment/demo-fyc-db -n demo-fyc --timeout=180s
kubectl apply -f 02-config.yaml
kubectl apply -f 03-migration-job.yaml
kubectl wait --for=condition=complete job/demo-fyc-migrate -n demo-fyc --timeout=180s
kubectl apply -f 04-api.yaml
kubectl rollout status deployment/demo-fyc-api -n demo-fyc
```

Vérifier l'API sans Ingress :

```sh
kubectl port-forward service/demo-fyc-api 3333:3333 -n demo-fyc
curl -i http://localhost:3333/health
curl -i http://localhost:3333/ready
```

L'Ingress suppose qu'un contrôleur Nginx est installé dans le cluster :

```sh
kubectl apply -f 05-ingress.yaml
curl -i http://api.localtest.me/health
```

## Démonstration de la réconciliation

```sh
kubectl get pods -n demo-fyc
kubectl delete pod -n demo-fyc -l app=demo-fyc-api --wait=false
kubectl get pods -n demo-fyc -w
```

Un nouveau Pod doit être créé par le Deployment. Pour un rolling update, construire une nouvelle image et modifier le tag `image` du Deployment, puis observer `kubectl rollout status`.
