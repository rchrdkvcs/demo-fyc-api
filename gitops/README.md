# GitOps avec Argo CD

`argocd/application.yaml` déclare une Application Argo CD `demo-fyc` : elle
suit la branche `main` de ce dépôt, applique le dossier `deploy/k8s` dans le
namespace `demo-fyc`, puis corrige tout écart (`prune` + `selfHeal`).

Le dépôt doit être public. Pour modifier ce qui est déployé (cas pratique),
utiliser un fork et remplacer `repoURL` par son URL.

## 1. Installer Argo CD sur k3d

Sur le cluster créé au chapitre 3.1 :

```sh
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl wait --for=condition=available deployment --all -n argocd --timeout=300s
```

## 2. Déclarer l'Application

```sh
kubectl apply -f gitops/argocd/application.yaml
kubectl get applications -n argocd -w
```

L'Application passe à `Synced` et `Healthy`. Les ressources déjà créées à la
main au module 3 sont reprises telles quelles par Argo CD.

## 3. Ouvrir l'interface

```sh
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath='{.data.password}' | base64 -d; echo
kubectl port-forward svc/argocd-server -n argocd 8443:443
```

Ouvrir <https://localhost:8443> (certificat auto-signé), utilisateur `admin`.

## 4. Tester la dérive

Modifier le cluster sans passer par Git :

```sh
kubectl scale deployment/demo-fyc-db -n demo-fyc --replicas=0
kubectl get deployment demo-fyc-db -n demo-fyc -w
```

Argo CD détecte l'écart (`OutOfSync`) et remet `replicas: 1`, la valeur
déclarée dans Git. On fait l'essai sur la base, car le nombre de Pods de l'API
est piloté par le HPA et non par Git.

Pour changer réellement l'état, il faut un commit : modifier un manifeste de
`deploy/k8s/`, pousser sur `main`, puis observer la synchronisation
(Argo CD interroge Git toutes les 3 minutes ; bouton **Refresh** pour forcer).

## Nettoyer

```sh
kubectl delete -f gitops/argocd/application.yaml
```

L'Application ne déclare pas de finalizer : la supprimer laisse les ressources
en place. Supprimer le cluster k3d remet tout à zéro.
