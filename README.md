# Objection — Anonymous Source Verification System

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Add your OPENAI_API_KEY
uvicorn main:app --reload --port 8000
```

API running at: http://localhost:8000
Swagger docs:   http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

App running at: http://localhost:3000

---

## Environment Variables (backend/.env)

```
OPENAI_API_KEY=sk-your-key-here
MONGO_URL=mongodb://localhost:27017
DB_NAME=objection
```

---

## VPS Deployment

```bash
# Backend — run with PM2
cd backend
pip install -r requirements.txt --break-system-packages
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name objection-api

# Frontend — build and serve static files
cd frontend
REACT_APP_API_URL=https://api.yourdomain.com npm run build
# Deploy the /build folder to Netlify / Nginx / Vercel
```

## Nginx config for backend
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## How provenance works

1. File arrives → immediately SHA-256 hashed with UTC timestamp
2. Text extracted from hash → sent to GPT-4o for analysis
3. Raw file content discarded — never stored
4. Certificate (ID + hash + score) saved to MongoDB
5. Journalist publishes Certificate ID in their article
