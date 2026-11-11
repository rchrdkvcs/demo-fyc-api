# Déployer sur un VPS

Modèles du checkpoint `2.2` : un seul serveur Debian/Ubuntu exécute l'image
publiée sur GHCR et PostgreSQL avec Docker Compose. Nginx reçoit le trafic
public et le relaie vers l'API, qui n'écoute que sur `127.0.0.1:3333`.
Aucun domaine réel ni secret n'est versionné.

## 1. Installer Docker

Sur le VPS, avec le dépôt officiel Docker :

```sh
sudo apt update && sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
. /etc/os-release
sudo curl -fsSL "https://download.docker.com/linux/$ID/gpg" -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/$ID $VERSION_CODENAME stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo docker run --rm hello-world
```

## 2. Copier la stack

Depuis le poste de travail, à la racine du dépôt :

```sh
ssh user@vps 'sudo mkdir -p /opt/demo-fyc-api && sudo chown $USER /opt/demo-fyc-api'
scp deploy/vps/compose.yaml user@vps:/opt/demo-fyc-api/compose.yaml
scp deploy/vps/.env.example user@vps:/opt/demo-fyc-api/.env
scp deploy/vps/nginx/demo-fyc-api.conf.example user@vps:/opt/demo-fyc-api/
```

Sur le VPS, compléter `/opt/demo-fyc-api/.env` (`APP_KEY`, `DB_PASSWORD`) puis
le protéger : `chmod 600 /opt/demo-fyc-api/.env`.

## 3. Démarrer

```sh
cd /opt/demo-fyc-api
sudo docker compose up -d
sudo docker compose ps
curl -i http://127.0.0.1:3333/ready
```

`restart: unless-stopped` relance les conteneurs après un crash ou un
redémarrage du serveur. La migration s'exécute à chaque démarrage de l'API.

## 4. Nginx en reverse proxy

Le domaine doit avoir un enregistrement DNS A vers l'IP du VPS.

```sh
sudo apt install -y nginx
sudo cp demo-fyc-api.conf.example /etc/nginx/sites-available/demo-fyc-api
sudo sed -i 's/api.example.com/api.mon-domaine.fr/' /etc/nginx/sites-available/demo-fyc-api
sudo ln -s /etc/nginx/sites-available/demo-fyc-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 5. TLS avec Certbot

```sh
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.mon-domaine.fr
sudo certbot renew --dry-run
```

Certbot ajoute le bloc `listen 443 ssl` et la redirection HTTP vers HTTPS.

## 6. Vérifier

```sh
curl -i https://api.mon-domaine.fr/health
curl -i https://api.mon-domaine.fr/ready
curl -i --max-time 5 http://<ip-du-vps>:3333/health   # doit échouer : port non exposé
```

## Mettre à jour

Changer `API_TAG` dans `.env`, puis :

```sh
sudo docker compose pull api
sudo docker compose up -d
```

Pendant le remplacement du conteneur, l'API est indisponible quelques secondes :
c'est l'une des limites étudiées au chapitre 2.3.
