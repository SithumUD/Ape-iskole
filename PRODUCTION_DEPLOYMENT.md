# 🚀 Comprehensive Production Deployment Guide: Ape Iskole

This guide is a complete, step-by-step walkthrough for deploying your full-stack application to **DigitalOcean**. This version is tailored for using **Password Authentication**, **WinSCP** for file transfers, and storing the project at `/root/apeiskole`.

---

## 🛠️ Phase 0: Pre-requisites & WinSCP Setup

Before you start, ensure you have these ready:

1.  **DigitalOcean Account**: Sign up at [digitalocean.com](https://www.digitalocean.com/).
2.  **Domain Name**: You must own `apeiskole.lk` (or your chosen domain).
3.  **WinSCP**: Download and install it on your computer from [winscp.net](https://winscp.net/). This is how you will move your code from your PC to the server.

---

## 🏗️ Phase 1: Droplet Setup & File Transfer

The "Droplet" is your virtual private server (VPS). It will run the Backend, Database, and Keycloak.

### 1. Create the Droplet

1.  Log in to the [DigitalOcean Console](https://cloud.digitalocean.com/).
2.  Click **Create** -> **Droplets**.
3.  **Choose Region**: Select the one closest to Sri Lanka (e.g., Singapore or Bangalore).
4.  **Choose Image**: Select **Ubuntu 22.04 LTS (x64)**.
5.  **Choose Size**:
    - Select **Basic** (Shared CPU).
    - **CPU Options**: Select **Regular**.
    - **RAM**: You **MUST** select at least **2GB RAM** ($12/month). Keycloak and Postgres need this to run smoothly.
6.  **Authentication**:
    - Select **Password**.
    - Create a **strong root password**. (Keep this safe! You will need it for WinSCP and Terminal access).
7.  **Finalize**: Name the Droplet `ape-iskole-prod` and click **Create Droplet**.

### 2. Connect via WinSCP

1.  Open **WinSCP**.
2.  **Host Name**: Enter your Droplet IP Address.
3.  **User Name**: `root`
4.  **Password**: The password you just created.
5.  Click **Login**.

### 3. Upload Project Files

1.  In WinSCP, navigate to the `/root` folder on the right side.
2.  **Create a New Folder** named `apeiskole`.
3.  On the left side (your PC), find your project files.
4.  **Drag and Drop** your project folders (especially the `deployment` and `ape-iskole-backend` folders) into `/root/apeiskole`.

### 4. Install Docker (The Terminal)

In WinSCP, click the **Terminal** icon (or use PowerShell) to run these commands on the server:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get update
apt-get install -y docker-compose-plugin
```

---

## 🔐 Phase 2: Configuration & SSL (The "Nginx Dance")

### 1. DNS Setup

1.  Go to your Domain Registrar (where you bought `apeiskole.lk`).
2.  Set the **Nameservers** to DigitalOcean:
    - `ns1.digitalocean.com`, `ns2.digitalocean.com`, `ns3.digitalocean.com`
3.  In DigitalOcean Console: **Networking** -> **Domains** -> Add `apeiskole.lk`.
4.  Add **A Records** for `@` and `www` pointing to your Droplet IP.

### 2. Prepare Environment Variables

On the Droplet Terminal (through WinSCP or PowerShell):

```bash
cd /root/apeiskole/deployment
cp .env.example .env
nano .env
```

**Change these vital lines:**

- `DOMAIN=apeiskole.lk`
- `POSTGRES_PASSWORD=...` (Use a strong password)
- `KC_BOOTSTRAP_ADMIN_PASSWORD=...` (Keycloak Admin password)

### 3. Bootstrap SSL

1.  **Start Nginx**: `docker compose up -d nginx`
2.  **Request Certificates**:
    ```bash
    docker run -it --rm --name certbot \
      -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
      -v "$(pwd)/certbot/www:/var/www/certbot" \
      certbot/certbot certonly --webroot \
      -w /var/www/certbot \
      -d apeiskole.lk -d www.apeiskole.lk \
      --email sithumudayangaofficial@gmail.com --agree-tos --no-eff-email
    ```
3.  **Start Everything**: `docker compose down && docker compose up -d`

---

## 🖼️ Phase 3: App Platform (Frontend)

1.  **Create App**: Go to **App Platform** -> **Create App**.
2.  **Source**: Select **GitHub** and your repository.
3.  **Configure Environment Variables**:
    - `VITE_API_BASE_URL`: `https://apeiskole.lk/api`
    - `VITE_KEYCLOAK_URL`: `https://apeiskole.lk/auth`
    - `VITE_KEYCLOAK_REALM`: `apeiskole`
    - `VITE_KEYCLOAK_CLIENT_ID`: `apeiskole-web`
4.  **Deploy**: Copy the URL DigitalOcean gives you (e.g. `ape-iskole-frontend.ondigitalocean.app`).

### 🔗 Link to Droplet:

1.  On Droplet: `nano /root/apeiskole/deployment/.env`.
2.  Update `FRONTEND_URL` with the URL you just copied.
3.  Restart services: `docker compose restart`.

---

## 🔑 Phase 4: Keycloak Production Setup

1.  Go to `https://apeiskole.lk/auth/admin` and login.
2.  **Create Realm**: `apeiskole`.
3.  **Create Client**: `apeiskole-web`.
    - **Root URL**: `https://apeiskole.lk`
    - **Valid Redirect URIs**: `https://apeiskole.lk/*`
    - **Web Origins**: `https://apeiskole.lk`

---

## 📧 Phase 6: Email (Brevo)
Since Port 465/587 is blocked on many cloud providers, use Port **2525** which we've confirmed is open!

1.  **Host**: `smtp-relay.brevo.com`
2.  **Port**: `2525`
3.  **Authentication**: `ON` (Use your Brevo API Key as password)
4.  **SSL**: `OFF`
5.  **StartTLS**: `ON`

---

## 🛠️ Phase 5: Maintenance & Verification

### 🏥 Is it working?

- Check services: `docker compose ps` (All should be `Healthy`)
- Check logs: `docker compose logs -f backend`

### 🧹 Update your code:

1.  Use **WinSCP** to upload the new files from your PC to `/root/apeiskole`.
2.  On the terminal:
    ```bash
    cd /root/apeiskole/deployment
    docker compose down
    docker compose up -d --build
    ```

---

## ✅ Final Production Checklist:

- [ ] Droplet root password stored securely.
- [ ] Project files uploaded via WinSCP to `/root/apeiskole`.
- [ ] SSL Certificates successfully generated (Check for padlock in browser).
- [ ] Frontend environment variables point to `https://apeiskole.lk/api`.
- [ ] Keycloak client `apeiskole-web` configured correctly.
- [ ] DigitalOcean Cloud Firewall allows ports 80 and 443.
