# Muhammad Farhan — Portfolio Site

Personal portfolio website built with **FastAPI** + **Jinja2**, featuring an AI-powered chatbot (Google Gemini), a Flask sidecar microservice for analytics, and Docker-based deployment.

Live at: [muhammadfarhan.work](https://muhammadfarhan.work)

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Backend     | FastAPI (async, Python 3.11)      |
| Templating  | Jinja2                            |
| Frontend    | TailwindCSS                       |
| AI Chatbot  | Google Gemini API                 |
| Microservice| Flask (analytics & logging)       |
| DevOps      | Docker, Docker Compose            |
| CI/CD       | GitHub Actions                    |
| Deployment  | AWS EC2 / Contabo VPS             |

---

## Project Structure

```
portfolio-site/
├── app/
│   ├── main.py                  # FastAPI entry point
│   ├── routers/
│   │   ├── site.py              # HTML page routes
│   │   └── chatbot.py           # Gemini AI chatbot endpoints
│   ├── templates/
│   │   ├── base.html            # Base layout (all pages extend this)
│   │   ├── index.html           # Main portfolio page
│   │   ├── components/          # header.html, footer.html
│   │   ├── sections/            # hero, about, projects, tech-stack, contact
│   │   └── pages/               # Standalone page templates
│   └── static/                  # CSS, JS, images, CV PDF
│       └── cv/
│           └── Muhammad_Farhan_CV.pdf   # Place CV here for /download-cv
├── flask_service/
│   ├── app.py                   # Flask app (analytics & logging sidecar)
│   ├── message_logger.py        # POST /log-message endpoint
│   ├── analytics.py             # Analytics blueprint
│   ├── healthcheck.py           # GET /health endpoint
│   ├── Dockerfile
│   └── requirements.txt
├── Dockerfile                   # FastAPI image
├── docker-compose.yml           # Orchestrates both services
├── requirements.txt             # FastAPI dependencies
├── .env.example                 # Environment variable template
└── .github/workflows/deploy.yml # CI/CD pipeline
```

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed
- A Google Gemini API key (free) — get one at https://aistudio.google.com/app/apikey

---

## Local Setup (Docker — Recommended)

### 1. Clone the repository

```bash
git clone https://github.com/farhanalii/portfolio-site.git
cd portfolio-site
```

### 2. Create the environment file

```bash
cp .env.example .env
```

Open `.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

> The site still works without a valid API key — the chatbot will show an error message instead of crashing.

### 3. Start the services

```bash
docker compose up -d --build
```

### 4. Open in browser

- **Portfolio site:** http://localhost:8000
- **AI Chatbot:** http://localhost:8000/chatbot
- **Flask service:** http://localhost:5001

### Useful commands

```bash
# View logs from all containers
docker compose logs -f

# View logs from a specific service
docker compose logs -f fastapi
docker compose logs -f flask

# Stop all services
docker compose down

# Rebuild and restart a single service
docker compose up -d --build fastapi

# Check running containers
docker compose ps
```

---

## Local Setup (Without Docker)

If you prefer to run without Docker:

### FastAPI service

```bash
# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure .env
cp .env.example .env
# Edit .env to add your GEMINI_API_KEY

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Flask service (optional — needed for analytics/logging)

```bash
cd flask_service
pip install -r requirements.txt
python app.py
```

---

## Environment Variables

| Variable        | Required | Description                                              |
|-----------------|----------|----------------------------------------------------------|
| `GEMINI_API_KEY`| Yes      | Google Gemini API key. Get free key at https://aistudio.google.com/app/apikey |

---

## Routes

| URL                         | Description                          |
|-----------------------------|--------------------------------------|
| `GET /`                     | Main portfolio page                  |
| `GET /about`                | About page                           |
| `GET /projects`             | Projects page                        |
| `GET /tech-stack`           | Tech stack page                      |
| `GET /contact`              | Contact page                         |
| `GET /chatbot`              | AI chatbot interface                 |
| `GET /download-cv`          | Download CV PDF                      |
| `POST /api/chatbot/chat`    | Chat API (`{message, session_id}`)   |
| `POST /api/chatbot/analyze-job` | Job match analysis API           |
| `GET /health` (port 5001)   | Flask healthcheck                    |
| `POST /log-message` (5001)  | Flask message logger                 |

---

## CV Download

Place your CV PDF at:

```
app/static/cv/Muhammad_Farhan_CV.pdf
```

The `/download-cv` route serves this file. If it does not exist, the route returns a JSON error.

---

## Deployment (Contabo / Any VPS)

### 1. Server setup

SSH into your server and install Docker:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y
```

### 2. Clone and configure

```bash
git clone https://github.com/farhanalii/portfolio-site.git
cd portfolio-site
cp .env.example .env
nano .env   # add your GEMINI_API_KEY
```

### 3. Start services

```bash
docker compose up -d --build
```

### 4. Nginx reverse proxy (optional — for port 80/443)

Install Nginx and configure it to proxy port 80 to `localhost:8000`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. Update GitHub Actions (CI/CD)

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and set:

| Secret            | Value                                  |
|-------------------|----------------------------------------|
| `SSH_PRIVATE_KEY` | Private key for SSH access to server  |
| `EC2_HOST`        | Server IP address or hostname          |
| `EC2_USER`        | SSH username (e.g., `root` or `ubuntu`)|

After setup, every push to `main` will automatically deploy to your server.

---

## Troubleshooting

### "network my-project not found"

This was a bug in the original `docker-compose.yml` that required a pre-created external network. It has been fixed — the network is now created automatically by Docker Compose.

If you still see this on an older version, run:

```bash
docker network create my-project
docker compose up -d --build
```

### "no .env file or directory"

The `docker-compose.yml` expects a `.env` file in the project root. Create it:

```bash
cp .env.example .env
# Then edit .env and fill in your GEMINI_API_KEY
```

### Chatbot returns "not properly configured"

The `GEMINI_API_KEY` in `.env` is missing or invalid. The rest of the site works normally. Get a free key at https://aistudio.google.com/app/apikey and update `.env`, then restart: `docker compose restart fastapi`.

### Port already in use

If port 8000 or 5001 is occupied:

```bash
# Find what's using the port
lsof -i :8000

# Or change the port in docker-compose.yml
# e.g., "8080:8000" to use port 8080 externally
```

---

## Adding New Content

### Add a new section to the portfolio

1. Create `app/templates/sections/new-section.html`
2. Include it in `app/templates/index.html` with `{% include 'sections/new-section.html' %}`

### Add a new standalone page

1. Create `app/templates/pages/new-page.html` (extend `base.html`)
2. Add a route in `app/routers/site.py`

---

## License

Personal portfolio — not licensed for redistribution.
