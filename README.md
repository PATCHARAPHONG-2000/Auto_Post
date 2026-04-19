# README - Auto Content Generation & Multi-Platform Posting System

## 📋 Project Overview

ระบบอัตโนมัติสำหรับสร้างคอนเทนต์และโพสต์ลง TikTok Shop และ Facebook พร้อมรองรับการขยายไปยัง YouTube ในอนาคต

### ✨ Key Features

- **TikTok Shop Automation**: สร้างวิดีโอรีวิว 10-15 วินาที พร้อมเสียงพากย์ไทย อัปโหลดผ่าน Chrome Extension
- **Facebook Marketing**: สร้างคอนเทนต์ Lip Sync พร้อมแนบลิงก์ Shopee Affiliate อัตโนมัติ
- **Smart Scheduling**: ตั้งเวลาโพสต์ล่วงหน้า รองรับหลาย Timezone
- **AI-Powered**: ใช้ AI สำหรับ Generate Script, Voice Over, Video, และ Lip Sync
- **Queue-Based Architecture**: จัดการงานจำนวนมากได้อย่างมีประสิทธิภาพ ไม่เกิด Timeout

---

## 🏗️ System Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   React     │────▶│   Node.js    │────▶│   PostgreSQL    │
│  Frontend   │     │   Backend    │     │   Database      │
└─────────────┘     └──────────────┘     └─────────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │    Redis     │
                   │   BullMQ     │
                   └──────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │   AI     │ │   AI     │ │ Chrome   │
       │ Services │ │ Services │ │ Extension│
       │ (Video)  │ │  (TTS)   │ │(TikTok)  │
       └──────────┘ └──────────┘ └──────────┘
```

---

## 📚 Documentation

เอกสารหลักของโปรเจกต์แบ่งออกเป็น 4 ส่วน:

### 1. [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
แผนการพัฒนาแบบ Phase-based 6 ขั้นตอน (12 สัปดาห์)
- Phase 1-2: Foundation & Core Services
- Phase 3-4: TikTok & Facebook Workflows
- Phase 5-6: Advanced Features & Deployment

### 2. [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
ออกแบบฐานข้อมูลด้วย Prisma ORM
- User Management & Authentication
- Product Catalog
- Content Jobs & Scheduled Posts
- API Keys & Affiliate Links

### 3. [API_SPECIFICATION.md](./API_SPECIFICATION.md)
RESTful API Endpoints ทั้งหมด
- Authentication (JWT)
- Products CRUD
- Content Jobs Management
- Scheduled Posts
- WebSocket Events (Real-time Updates)

### 4. [WORKFLOW_SPECIFICATION.md](./WORKFLOW_SPECIFICATION.md)
รายละเอียด Workflow การทำงาน
- TikTok Shop: Image → Prompt → Script → Video → Upload
- Facebook: Script → Lip Sync → Composite → Post with Affiliate Link
- Queue System & State Machine

---

## 🔧 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18, TypeScript, Vite | UI Development |
| **Backend** | Node.js 20, TypeScript, Express | API & Business Logic |
| **Database** | PostgreSQL 15, Prisma ORM | Data Persistence |
| **Queue** | Redis 7, BullMQ | Async Job Processing |
| **AI Services** | OpenAI, Kling AI, TTS Providers | Content Generation |
| **Infrastructure** | Docker, Docker Compose | Containerization |

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd auto-content-system
```

### 2. Setup Environment Variables
```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env with your credentials
# - DATABASE_URL
# - REDIS_URL
# - JWT_SECRET
# - AI_API_KEYS
```

### 3. Start with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 4. Initialize Database
```bash
# Run migrations
cd backend
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed
```

### 5. Access Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api-docs
- **Redis Commander**: http://localhost:8081

---

## 📁 Project Structure

```
/workspace
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client services
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── queues/           # BullMQ queue definitions
│   │   ├── workers/          # Queue processors
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── config/           # Configuration files
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/       # Database migrations
│   │   └── seed/             # Seed data
│   ├── package.json
│   └── tsconfig.json
│
├── infra/
│   └── docker/
│       ├── docker-compose.yml
│       ├── Dockerfile.backend
│       ├── Dockerfile.frontend
│       └── nginx.conf
│
├── chrome-extension/         # TikTok Upload Extension
│   ├── manifest.json
│   ├── background.js
│   └── content.js
│
└── docs/                     # Documentation
    ├── api.md
    ├── deployment.md
    └── user-guide.md
```

---

## 🎯 Development Roadmap

### Phase 1-2: MVP Foundation (Weeks 1-4)
- ✅ Database Schema & Migrations
- ✅ Authentication System
- ✅ Product Management APIs
- ✅ Queue System Setup
- ⬜ Basic Frontend UI

### Phase 3-4: Core Workflows (Weeks 5-8)
- ⬜ TikTok Video Generation Pipeline
- ⬜ Chrome Extension Integration
- ⬜ Facebook Lip Sync Generation
- ⬜ Affiliate Link System

### Phase 5-6: Production Ready (Weeks 9-12)
- ⬜ Scheduling System
- ⬜ Analytics Dashboard
- ⬜ Testing & Security Hardening
- ⬜ Documentation & Deployment

---

## 🔐 Security Considerations

- **JWT Authentication**: Token-based auth with refresh tokens
- **API Key Encryption**: Store sensitive keys encrypted in database
- **Rate Limiting**: Prevent abuse with request throttling
- **Input Validation**: Validate all user inputs
- **CORS Configuration**: Restrict cross-origin requests
- **HTTPS Only**: Enforce secure connections in production

---

## 📊 Monitoring & Logging

- **Winston**: Structured logging
- **Sentry**: Error tracking
- **Prometheus + Grafana**: Metrics & dashboards (optional)
- **Health Checks**: `/health` endpoint for monitoring

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

---

## 📦 Deployment

### Production Requirements
- PostgreSQL 15+ (managed service recommended)
- Redis 7+ (managed service recommended)
- Node.js 20+ runtime
- SSL Certificate
- Domain name

### Deployment Options
1. **Docker Swarm / Kubernetes**: Container orchestration
2. **VPS (DigitalOcean, Linode)**: Manual deployment
3. **Cloud Platform (AWS, GCP, Azure)**: Managed services
4. **PaaS (Railway, Render, Fly.io)**: Simplified deployment

See [DEPLOYMENT.md](./docs/deployment.md) for detailed instructions.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: support@example.com
- Documentation: https://docs.example.com

---

## 🙏 Acknowledgments

- TikTok for their platform
- Facebook/Meta for Graph API
- AI Service Providers (OpenAI, Kling AI, etc.)
- Open Source Community

---

**Built with ❤️ using React, Node.js, and AI**
