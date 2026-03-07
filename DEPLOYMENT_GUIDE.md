# Complete NestJS Deployment Guide to AWS EC2

This guide documents the exact steps required to deploy a NestJS backend application to a brand new AWS EC2 Ubuntu instance, configuring a custom domain, standardizing ports with Nginx, and securing it with an SSL certificate.

---

## Part 1: AWS Console Setup

### 1. Launch EC2 Instance

1. Go to **AWS Console** -> **EC2 Dashboard**.
2. Click **Launch Instances**.
3. **Name:** Give your server a name.
4. **OS Images (AMI):** Select **Ubuntu 24.04 LTS**.
5. **Instance Type:** Select **t3.micro** (Free tier eligible).
6. **Key Pair:** Create a new key pair (`.pem`), download it, and keep it safe.
7. **Network Settings:**
   - Allow SSH traffic (Port 22).
   - Allow HTTP traffic (Port 80).
   - Allow HTTPS traffic (Port 443).
8. **Storage:** Standard 20GB is fine.
9. Click **Launch Instance**.

### 2. Allocate an Elastic IP (Static IP)

1. In EC2 Dashboard, go to **Network & Security** -> **Elastic IPs**.
2. Click **Allocate Elastic IP address**.
3. Select the new IP, click **Actions** -> **Associate Elastic IP address**.
4. Choose the instance you just created and save.

---

## Part 2: Connect and Prepare the Server

Connect to your server using a tool like **MobaXterm**.

- **Remote host:** Your Elastic IP
- **Username:** `ubuntu`
- **Private key:** The `.pem` file you downloaded.

### 1. Update Server Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js (v20)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt install -y nodejs
```

### 3. Install Global Tools (PM2)

```bash
sudo npm install -g pm2
```

### 4. Install Redis (If required by your app)

```bash
sudo apt install redis-server -y
```

---

## Part 3: Deploy the Codebase

### 1. Clone the Private Repository

Instead of setting up SSH keys, the easiest method for private repositories is using a GitHub Personal Access Token (PAT).

```bash
git clone https://ghp_YOUR_TOKEN_HERE@github.com/YourUsername/your-repo-name.git
```

### 2. Install Dependencies

```bash
cd your-repo-name
npm install
```

### 3. Configure Environment Variables

Create the production environment file:

```bash
nano .env
```

Paste your production keys (MongoDB URI, JWT Secrets, etc.).
Save the file (`Ctrl + O`, `Enter`, `Ctrl + X`).

---

## Part 4: Build and Start (PM2)

### 1. Build the NestJS Project

```bash
npm run build
```

### 2. Start the App via PM2

```bash
pm2 start dist/main.js --name "my-backend-api"
```

### 3. Save PM2 to auto-start on server reboot

```bash
pm2 save
pm2 startup
```

_Note: PM2 will output a specific `sudo` command. Copy and run that exact command to finish the setup._

---

## Part 5: Nginx Reverse Proxy (Port 80 -> 5000)

NestJS runs on port 5000 internally. Nginx helps direct standard internet traffic (Port 80) to your app.

### 1. Install Nginx

```bash
sudo apt install nginx -y
```

### 2. Configure Nginx Server Block

```bash
sudo nano /etc/nginx/sites-available/backend-api
```

Paste this configuration (replace `api.yourdomain.com` and `5000` as needed):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable Configuration and Restart Nginx

```bash
sudo ln -s /etc/nginx/sites-available/backend-api /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## Part 6: Domain DNS and Database Security

### 1. Configure DNS in Domain Provider (GoDaddy)

1. Go to your Domain's DNS configuration.
2. Add an **A Record**.
3. **Name/Host:** `api`
4. **Value:** Your AWS Server's Elastic IP.
5. Save.

### 2. Whitelist AWS IP in MongoDB Atlas

If your app uses MongoDB Atlas, you must whitelist the server so it doesn't get blocked:

1. Go to MongoDB Atlas -> **Network Access**.
2. Click **Add IP Address**.
3. Choose **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Click **Confirm** and wait for it to become Active.
5. In MobaXterm, restart your app: `pm2 restart all`

---

## Part 7: SSL Certificate (HTTPS)

Browsers require a secure connection. We use Let's Encrypt (Certbot) to get a free SSL certificate.

### 1. Install Certbot

```bash
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 2. Generate SSL Certificate

```bash
sudo certbot --nginx -d api.yourdomain.com
```

Follow the prompts (enter your email, accept terms `Y`). Certbot will automatically rewrite your Nginx file to support HTTPS and schedule auto-renewals.

**🎉 Congratulations! Your API is now securely live on the internet!**
