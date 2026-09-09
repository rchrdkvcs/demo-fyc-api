# GitOps avec Argo CD

Le checkpoint `4.3` déclare deux Applications Argo CD dans `argocd/applications.yaml`. Elles pointent vers le même dépôt et deux overlays Kustomize différents.

## Préparer Argo CD

Installer une version vérifiée d'Argo CD dans le cluster cible en suivant sa documentation officielle, puis vérifier que le namespace `argocd` et le contrôleur sont prêts :

```sh
kubectl get pods -n argocd
```

Le fichier suppose que le dépôt est public. Pour un dépôt privé, configurer les credentials du dépôt dans Argo CD plutôt que de les écrire dans ce fichier.

## Déclarer les applications

```sh
kubectl apply -f gitops/argocd/applications.yaml
kubectl get applications -n argocd
```

Chaque Application suit `main`, rend son overlay Kustomize et active `prune` et `selfHeal`. Pour une production stricte, remplacer `main` par une référence contrôlée (tag ou commit) et définir une procédure de promotion.

## Observer la réconciliation

1. Modifier dans Git le tag d'image ou le nombre de réplicas de l'overlay staging.
2. Pousser le commit et observer l'état de l'Application.
3. Provoquer une dérive hors Git :

```sh
kubectl scale deployment/demo-fyc-api -n demo-fyc-staging --replicas=4
kubectl get application demo-fyc-staging -n argocd --watch
```

Argo CD doit ramener l'état vers la valeur déclarée dans Git. Cet exemple ne doit pas être activé sur un cluster contenant des workloads réels sans revue des règles `prune`, des namespaces et des secrets.
