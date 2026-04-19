# Getting Started Guide

คู่มือเริ่มต้นใช้งานระบบ Auto Content Generation & Multi-Platform Posting

---

## 📋 สิ่งที่ต้องเตรียม

### 1. Software Requirements
- **Node.js** version 20.x ขึ้นไป
- **Docker** และ **Docker Compose**
- **Git** สำหรับจัดการ source code
- **Code Editor** (แนะนำ VS Code)

### 2. API Keys ที่ต้องมี
- **OpenAI API Key** - สำหรับ Generate Script และ Prompt
- **Kling AI / Runway API Key** - สำหรับ Generate Video (เลือกหนึ่ง)
- **Thai TTS Service** - สำหรับสร้างเสียงพากย์ภาษาไทย
- **Facebook App ID & Secret** - สำหรับ Facebook Graph API
- **Shopee Affiliate Account** - สำหรับสร้างลิงก์สินค้า (ถ้าต้องการ)

---

## 🚀 ขั้นตอนการติดตั้ง

### Step 1: Clone Repository

```bash
cd /workspace
git status  # ตรวจสอบว่าอยู่ใน repository
```

### Step 2: ตรวจสอบโครงสร้างโปรเจกต์

ปัจจุบันโปรเจกต์มีโครงสร้างดังนี้:

```
/workspace
├── README.md                      # เอกสารหลัก
├── IMPLEMENTATION_PLAN.md         # แผนการพัฒนา 6 Phases
├── DATABASE_SCHEMA.md             # Database Schema Design
├── API_SPECIFICATION.md           # API Endpoints Specification
├── WORKFLOW_SPECIFICATION.md      # Workflow รายละเอียด
├── GETTING_STARTED.md            # คู่มือนี้
│
├── backend/                       # Node.js Backend
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/           # Express middleware
│   │   ├── queues/               # BullMQ queues
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   ├── types/                # TypeScript types
│   │   ├── utils/                # Helper functions
│   │   └── workers/              # Queue workers
│   └── prisma/
│       ├── schema/               # Prisma schema files
│       ├── migrations/           # Database migrations
│       └── seed/                 # Seed data
│
├── frontend/                      # React Frontend
│   └── src/
│       ├── components/           # UI components
│       ├── hooks/                # Custom hooks
│       ├── pages/                # Page components
│       ├── services/             # API services
│       └── types/                # TypeScript types
│
└── infra/
    └── docker/                   # Docker configuration
```

### Step 3: ตั้งค่า Backend

#### 3.1 สร้างไฟล์ .env

```bash
cd /workspace/backend
cat > .env << EOF
# Server
NODE_ENV=development
PORT=8080
API_VERSION=v1

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auto_content?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
KLING_AI_API_KEY="your-kling-ai-api-key"
TTS_SERVICE_PROVIDER="azure"
AZURE_TTS_KEY="your-azure-tts-key"
AZURE_TTS_REGION="southeastasia"

# Facebook
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"

# File Storage (Local or S3)
STORAGE_PROVIDER="local"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=104857600

# CORS
FRONTEND_URL="http://localhost:3000"

# Logging
LOG_LEVEL="debug"
EOF
```

#### 3.2 ติดตั้ง Dependencies

```bash
cd /workspace/backend
npm install
```

**Dependencies ที่จะติดตั้ง:**
```json
{
  "express": "^4.18.2",
  "typescript": "^5.3.0",
  "prisma": "^5.7.0",
  "@prisma/client": "^5.7.0",
  "bullmq": "^5.1.0",
  "ioredis": "^5.3.0",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "axios": "^1.6.0",
  "winston": "^3.11.0",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.0",
  "multer": "^1.4.5-lts.1",
  "uuid": "^9.0.0",
  "dotenv": "^16.3.0"
}
```

#### 3.3 สร้าง Prisma Schema

```bash
cd /workspace/backend/prisma/schema
# ไฟล์ schema.prisma จะถูกสร้างตาม DATABASE_SCHEMA.md
```

### Step 4: ตั้งค่า Frontend

#### 4.1 สร้างไฟล์ .env

```bash
cd /workspace/frontend
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_URL=ws://localhost:8080/ws
VITE_APP_NAME="Auto Content System"
EOF
```

#### 4.2 ติดตั้ง Dependencies

```bash
cd /workspace/frontend
npm install
```

**Dependencies ที่จะติดตั้ง:**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "axios": "^1.6.0",
  "zustand": "^4.4.0",
  "antd": "^5.12.0",
  "@ant-design/icons": "^5.2.6",
  "dayjs": "^1.11.10"
}
```

### Step 5: ตั้งค่า Docker Infrastructure

#### 5.1 สร้าง docker-compose.yml

```bash
cd /workspace/infra/docker
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: auto-content-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: auto_content
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: auto-content-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ../../backend
      dockerfile: ../infra/docker/Dockerfile.backend
    container_name: auto-content-backend
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/auto_content?schema=public
      - REDIS_URL=redis://redis:6379
    env_file:
      - ../../backend/.env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ../../backend:/app
      - /app/node_modules
      - uploads:/app/uploads

  frontend:
    build:
      context: ../../frontend
      dockerfile: ../infra/docker/Dockerfile.frontend
    container_name: auto-content-front end
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api/v1
    depends_on:
      - backend
    volumes:
      - ../../frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
  uploads:
EOF
```

### Step 6: รันระบบด้วย Docker Compose

```bash
cd /workspace/infra/docker
docker-compose up -d
```

ตรวจสอบสถานะ:
```bash
docker-compose ps
docker-compose logs -f
```

### Step 7: Initialize Database

```bash
# เข้า backend container
docker-compose exec backend sh

# หรือรันจาก host ถ้าไม่ได้ใช้ Docker
cd /workspace/backend

# Generate Prisma Client
npx prisma generate

# Run Migrations
npx prisma migrate dev --name init

# Seed Database (ถ้ามี)
npx prisma db seed
```

---

## ✅ ตรวจสอบการทำงาน

### 1. ตรวจสอบ Services

```bash
# PostgreSQL
docker-compose exec postgres psql -U postgres -c "\l"

# Redis
docker-compose exec redis redis-cli ping
# ควรตอบ: PONG

# Backend Health Check
curl http://localhost:8080/health

# Frontend
curl http://localhost:3000
```

### 2. เข้าถึง Web Interface

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **API Docs** (ถ้ามี): http://localhost:8080/api-docs

---

## 🧪 ทดสอบระบบ

### สร้าง User แรก

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

### เพิ่ม Product แรก

```bash
# ใช้ token จาก login
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Wireless Earbuds Pro",
    "description": "หูฟังไร้สายคุณภาพสูง",
    "defaultImage": "https://example.com/image.jpg",
    "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
    "category": "Electronics",
    "tags": ["audio", "wireless", "bluetooth"],
    "shopeeLink": "https://shopee.co.th/product/xxx"
  }'
```

---

## 🔧 Development Commands

### Backend

```bash
cd /workspace/backend

# Development mode
npm run dev

# Build
npm run build

# Lint
npm run lint

# Test
npm test

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Create and apply migration
npx prisma migrate reset   # Reset database
npx prisma db seed         # Seed database
```

### Frontend

```bash
cd /workspace/frontend

# Development mode
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## ⚠️ Troubleshooting

### ปัญหาที่พบบ่อย

#### 1. Database Connection Failed
```bash
# ตรวจสอบว่า PostgreSQL รันอยู่หรือไม่
docker-compose ps postgres

# ดู logs
docker-compose logs postgres

# Restart service
docker-compose restart postgres
```

#### 2. Redis Connection Failed
```bash
# ตรวจสอบ Redis
docker-compose exec redis redis-cli ping

# ถ้าไม่ทำงาน
docker-compose restart redis
```

#### 3. Port Already in Use
```bash
# หา process ที่ใช้ port
lsof -i :8080
lsof -i :3000
lsof -i :5432
lsof -i :6379

# Kill process
kill -9 <PID>

# หรือเปลี่ยน port ใน docker-compose.yml
```

#### 4. Prisma Migration Error
```bash
# Reset database (ข้อมูลจะหาย!)
npx prisma migrate reset

# หรือลบ migration folder แล้วเริ่มใหม่
rm -rf prisma/migrations/*
npx prisma migrate dev --name init
```

---

## 📝 Next Steps

หลังจากติดตั้งเสร็จแล้ว แนะนำให้ทำตามลำดับ:

1. **อ่าน [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - ทำความเข้าใจแผนการพัฒนา
2. **ศึกษา [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - เข้าใจโครงสร้างข้อมูล
3. **อ่าน [API_SPECIFICATION.md](./API_SPECIFICATION.md)** - รู้วิธีใช้งาน API
4. **อ่าน [WORKFLOW_SPECIFICATION.md](./WORKFLOW_SPECIFICATION.md)** - เข้าใจการทำงานของระบบ

### เริ่มพัฒนา Phase 1

1. สร้าง Prisma Schema ตาม DATABASE_SCHEMA.md
2. Implement Authentication APIs
3. สร้าง Product Management APIs
4. ตั้งค่า Queue System
5. สร้าง Frontend พื้นฐาน

---

## 📞 ต้องการความช่วยเหลือ?

- 📖 อ่านเอกสารในโฟลเดอร์ `/workspace`
- 🐛 แจ้งปัญหาผ่าน GitHub Issues
- 💬 สนทนาในชุมชน Developer

**Happy Coding! 🎉**
