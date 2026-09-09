# Ansible

`site.yml` configure un hôte déjà provisionné : paquets système, utilisateur de service, unité systemd et reverse proxy Nginx. Il ne déploie pas la clé `APP_KEY`, le mot de passe PostgreSQL ni le code de l'application.

```sh
cp inventory.example.ini inventory.ini
# remplacer l'adresse de documentation 203.0.113.10 et vérifier le domaine
ansible-playbook -i inventory.ini site.yml --check --diff
ansible-playbook -i inventory.ini site.yml
```

Le mode `--check --diff` est une étape obligatoire dans l'atelier avant l'application. Utiliser Ansible Vault ou un gestionnaire de secrets pour le fichier d'environnement hors dépôt.
