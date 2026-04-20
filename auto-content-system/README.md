# Auto Content Creation System

ระบบสร้างคอนเทนต์อัตโนมัติสำหรับ TikTok และ Facebook พร้อมรองรับการขยายไปยัง YouTube ในอนาคต

## 🏗️ System Architecture

| ส่วนประกอบ | เทคโนโลยี | หน้าที่ |
|-----------|----------|--------|
| Frontend | React, TypeScript | UI จัดการสินค้า, ลิงก์, ตั้งเวลาโพสต์ |
| Backend | Node.js, TypeScript | Logic, AI API, Extension Communication |
| Database | PostgreSQL, Prisma ORM | เก็บข้อมูลสินค้า, สถานะงาน, ตั้งเวลา |
| Queue | Redis, BullMQ | จัดการคิวงาน Generate ภาพ/วิดีโอ |
| Infrastructure | Docker Compose | Deploy บน Server |

## 🎯 Workflows

### 1. TikTok Shop (Auto Content & Extension Upload)
- สร้างวิดีโอรีวิวสินค้า 10-15 วินาที
- เสียงพากย์ภาษาไทย
- อัปโหลดผ่าน Chrome Extension (ไม่มีลิงก์ภายนอก)

**ขั้นตอน:**
1. Image Composition - รวมรูปสินค้ากับ Production Image
2. Prompt Generation - AI สร้าง Prompt แบ่งเป็น Scene
3. State Management - บันทึกสถานะลง Database
4. Script & Voice - สคริปต์ไทย + TTS (10-15 วิ)
5. Video Rendering - ส่งไป AI Video Generator
6. Extension Dispatch - ส่งไฟล์ให้ Chrome Extension อัปโหลด
7. Tracking - บันทึกผลลัพธ์

### 2. Facebook (Lip Sync & Shopee Affiliate)
- คอนเทนต์ภาพนิ่ง/วิดีโอสั้น Lip Sync
- แนบลิงก์ Shopee อัตโนมัติ

**ขั้นตอน:**
1. Script Preparation - วิเคราะห์รูปสินค้าหลายมุม
2. Lip Sync Generation - ทำให้ปากขยับตามเสียง
3. Media Compositing - รวมภาพ + ตัดต่ออัตโนมัติ
4. Publishing - โพสต์ลง Facebook (Profile/Page/Group)
5. Affiliate Integration - แนบ Shopee Link จาก Database

### 3. Future: YouTube Integration
- Database Schema รองรับ Enum: `TIKTOK`, `FACEBOOK`, `YOUTUBE`
- แยกการเก็บลิงก์ชัดเจน (Shopee สำหรับ Facebook, อื่นๆ ตามแพลตฟอร์ม)

## 📁 Project Structure

```
auto-content-system/
├── client/          # React Frontend
├── server/          # Node.js Backend
├── infra/           # Docker & Deployment
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL
- Redis

### Installation

```bash
# Clone repository
cd auto-content-system

# Install backend dependencies
cd server
npm install

# Setup environment variables
cp .env.example .env

# Start services with Docker
cd ../infra
docker-compose up -d

# Run migrations
cd ../server
npx prisma migrate dev

# Start development server
npm run dev
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/autocontent"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key

# AI APIs
OPENAI_API_KEY=xxx
KLING_AI_API_KEY=xxx
TTS_API_KEY=xxx

# Facebook
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
FACEBOOK_PAGE_TOKEN=xxx

# Extension
EXTENSION_SECRET=xxx
```

## 📋 Implementation Plan

### Phase 1: Core Setup
- [x] Project structure
- [ ] Prisma schema (User, Product, ContentTask, PlatformConfig)
- [ ] Database migration
- [ ] Basic Express server

### Phase 2: Backend APIs
- [ ] Product CRUD endpoints
- [ ] Task creation (TikTok/Facebook)
- [ ] Task status tracking
- [ ] Authentication (JWT)

### Phase 3: Queue System
- [ ] BullMQ setup
- [ ] Video generation worker
- [ ] Voice synthesis worker
- [ ] Upload worker

### Phase 4: AI Integration
- [ ] Image composition API
- [ ] Prompt generation
- [ ] Script generation (Thai)
- [ ] Video generation (Kling AI or similar)
- [ ] TTS (Thai language)
- [ ] Lip Sync processing

### Phase 5: Frontend
- [ ] React app setup (Vite)
- [ ] Product management UI
- [ ] Task dashboard
- [ ] Platform configuration
- [ ] Scheduling interface

### Phase 6: Extension & Deployment
- [ ] Chrome Extension for TikTok upload
- [ ] WebSocket communication
- [ ] Docker Compose production config
- [ ] CI/CD pipeline

## 🔐 Security Considerations

- API Keys stored in environment variables only
- JWT authentication for all endpoints
- Role-Based Access Control (Admin/User)
- Secure communication with Extension (WebSocket + Secret)

## 📈 Scalability Features

- Async queue processing prevents timeouts
- Horizontal scaling ready (Redis shared state)
- Modular platform design (easy to add new platforms)
- Database indexing for performance

## 📝 License

MIT
