# Déploiement manuel sur VPS

Ces fichiers sont des modèles pour le checkpoint `1.6`. Ils ne contiennent ni domaine réel, ni mot de passe, ni clé privée.

## Préparer le serveur

Sur une machine Ubuntu ou Debian fraîche :

```sh
sudo apt update && sudo apt upgrade
sudo apt install -y nginx git ca-certificates
```

Installer ensuite Node.js 24 et pnpm 11 selon la méthode validée par l'environnement de cours. Créer un utilisateur de service non privilégié :

```sh
sudo adduser --system --group --home /opt/demo-fyc-api demo-fyc
sudo mkdir -p /opt/demo-fyc-api /etc/demo-fyc-api
sudo chown -R demo-fyc:demo-fyc /opt/demo-fyc-api
```

## Construire et installer l'API

```sh
sudo -u demo-fyc git clone https://github.com/rchrdkvcs/demo-fyc-api.git /opt/demo-fyc-api/source
cd /opt/demo-fyc-api/source
sudo -u demo-fyc git checkout 1.6
sudo -u demo-fyc pnpm install --frozen-lockfile
sudo -u demo-fyc cp .env.example /etc/demo-fyc-api/demo-fyc-api.env
sudo -u demo-fyc node ace generate:key
sudo -u demo-fyc pnpm build
sudo -u demo-fyc pnpm --dir build install --prod --frozen-lockfile
```

Renseigner `HOST=127.0.0.1`, `PORT=3333` et les variables `DB_*` dans le fichier hors dépôt `/etc/demo-fyc-api/demo-fyc-api.env`. PostgreSQL doit être installé ou fourni par un service séparé ; exécuter la migration avec une clé configurée :

```sh
sudo -u demo-fyc sh -c 'cd /opt/demo-fyc-api/source/build && node ace migration:run --force'
```

Copier `systemd/demo-fyc-api.service.example` vers `/etc/systemd/system/demo-fyc-api.service`, adapter le chemin de Node.js si nécessaire, puis :

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now demo-fyc-api
sudo systemctl status demo-fyc-api
```

## Nginx et TLS

Copier `nginx/demo-fyc-api.conf.example` vers `/etc/nginx/sites-available/demo-fyc-api`, remplacer `api.example.com` par un domaine dont l'enregistrement DNS A pointe vers le VPS, puis activer le site :

```sh
sudo ln -s /etc/nginx/sites-available/demo-fyc-api /etc/nginx/sites-enabled/demo-fyc-api
sudo nginx -t
sudo systemctl reload nginx
```

Quand le DNS répond, demander le certificat Let's Encrypt :

```sh
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.example.com
```

## Expérience de limite

Arrêter le processus API, redémarrer la machine ou lancer une mise à jour système. Observer ce que `systemd` et Nginx prennent en charge, puis ce qu'ils ne peuvent pas résoudre : la capacité reste attachée à un seul VPS, sans bascule vers un autre nœud.
