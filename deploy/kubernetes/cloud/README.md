# Extension cloud

Le fichier `01-loadbalancer.yaml` transforme le Service interne de l'atelier local en Service `LoadBalancer`. Le contrôleur cloud crée alors une adresse publique ou un équivalent selon le fournisseur.

## Checklist provider-neutral

1. Créer un cluster Kubernetes managé et un node pool dimensionné pour l'atelier.
2. Configurer le contexte `kubectl` fourni par le fournisseur.
3. Publier l'image `ghcr.io/rchrdkvcs/demo-fyc-api:2.2` ou créer un secret `imagePullSecret` si le package est privé.
4. Remplacer `demo-fyc-api:2.2` par la référence du registre dans `../local/03-migration-job.yaml` et `../local/04-api.yaml`, ou utiliser l'overlay Kustomize du module 4.
5. Appliquer les manifestes locaux après avoir vérifié la `StorageClass` par défaut :

```sh
kubectl get storageclass
kubectl apply -f ../local/00-namespace.yaml
kubectl apply -f ../local/01-db.yaml
kubectl apply -f ../local/02-config.yaml
kubectl apply -f ../local/03-migration-job.yaml
kubectl apply -f ../local/04-api.yaml
kubectl apply -f 01-loadbalancer.yaml
kubectl get service demo-fyc-api -n demo-fyc --watch
```

6. Récupérer l'adresse externe et tester `/health`.
7. Supprimer le cluster et les ressources cloud à la fin du TP pour éviter une facturation prolongée.

Les noms de CLI, les classes de stockage, les règles réseau et les coûts sont propres au fournisseur. Ils doivent être vérifiés dans sa documentation et ne sont pas codés en dur dans ce dépôt.
