# Kustomize — staging et production

Le checkpoint `4.2` réutilise une base commune et deux overlays. Les overlays changent le namespace, l'image et le nombre de réplicas sans dupliquer les manifestes.

## Rendu local

```sh
kubectl kustomize overlays/staging
kubectl kustomize overlays/production
```

## Appliquer un environnement

```sh
kubectl apply -k overlays/staging
kubectl rollout status deployment/demo-fyc-api -n demo-fyc-staging

kubectl apply -k overlays/production
kubectl rollout status deployment/demo-fyc-api -n demo-fyc-production
```

Le Job de migration porte le même nom. Pour le relancer volontairement après une
modification de l'image, supprimer le Job terminé dans l'environnement concerné,
puis appliquer à nouveau l'overlay :

```sh
kubectl delete job demo-fyc-migrate -n demo-fyc-staging --ignore-not-found
kubectl apply -k overlays/staging
```

L'image des overlays pointe vers GHCR et le package peut être privé. Dans ce cas, créer un `imagePullSecret` dans chaque namespace et l'ajouter au patch du Deployment. Les secrets présents dans la base sont des valeurs de laboratoire ; ils ne doivent pas être réutilisés en production.
