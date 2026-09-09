# Terraform / OpenTofu

Le checkpoint `4.1` sépare le **provisioning** d'un fournisseur cloud de la **configuration** de l'OS. Le répertoire principal valide un contrat commun sans choisir un fournisseur ni créer une ressource payante automatiquement.

## Vérifier le contrat

Avec Terraform ou OpenTofu :

```sh
terraform init
terraform fmt -check
terraform validate
terraform plan -var-file=terraform.tfvars.example
```

Le plan affiche les valeurs d'environnement et de région. Pour créer un cluster réel, ajouter un provider explicitement sous `provider/`, stocker l'état dans un backend partagé et injecter les credentials via l'environnement du CI. Ne jamais ajouter `terraform.tfstate`, un fichier `*.tfvars` personnel ou une clé cloud au dépôt.

## Question pédagogique

Terraform/OpenTofu décrit les ressources externes (réseau, instances, cluster, load balancer). Ansible intervient ensuite à l'intérieur d'un hôte existant pour installer et configurer des logiciels. Le prochain checkpoint montre les deux environnements Kubernetes sans copier tous les manifestes.
