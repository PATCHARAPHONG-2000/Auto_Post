# System Architecture & Implementation Plan

## 📋 Project Overview
ระบบอัตโนมัติสำหรับสร้างคอนเทนต์และโพสต์ลง TikTok Shop และ Facebook พร้อมรองรับการขยายไปยัง YouTube ในอนาคต

---

## 🗓️ Implementation Phases

### **Phase 1: Foundation & Infrastructure (สัปดาห์ 1-2)**
**เป้าหมาย:** ตั้งค่าโครงสร้างโปรเจกต์และพื้นฐานระบบ

#### 1.1 Database Design
- [ ] ออกแบบ Prisma Schema
  - `User` - ผู้ใช้งานระบบ
  - `Product` - ข้อมูลสินค้า
  - `Platform` - Enum (TIKTOK, FACEBOOK, YOUTUBE)
  - `ContentJob` - จ๊อบสร้างคอนเทนต์
  - `ScheduledPost` - การตั้งเวลาโพสต์
  - `APIKey` - เก็บ API Keys อย่างปลอดภัย
  - `AffiliateLink` - ลิงก์ Shopee สำหรับ Facebook

#### 1.2 Backend Setup
- [ ] Initialize Node.js + TypeScript project
- [ ] ติดตั้ง Dependencies พื้นฐาน
  - Express.js / Fastify
  - Prisma ORM
  - BullMQ + Redis
  - JWT Authentication
  - Winston/Pino Logging

#### 1.3 Frontend Setup
- [ ] Initialize React + TypeScript + Vite
- [ ] ติดตั้ง UI Library (Ant Design / MUI)
- [ ] ตั้งค่า React Router
- [ ] ตั้งค่า State Management (Zustand / Redux Toolkit)
- [ ] ตั้งค่า Axios Interceptors

#### 1.4 Docker Infrastructure
- [ ] สร้าง `docker-compose.yml`
  - PostgreSQL Service
  - Redis Service
  - Backend Service
  - Frontend Service
- [ ] สร้าง Dockerfile สำหรับแต่ละ service
- [ ] เขียน `.env.example` template

**Deliverables:**
- ✅ โครงสร้างโฟลเดอร์ครบถ้วน
- ✅ Database Schema เสร็จ
- ✅ รันระบบด้วย `docker-compose up` ได้
- ✅ หน้า Login/Signup พื้นฐาน

---

### **Phase 2: Core Backend Services (สัปดาห์ 3-4)**
**เป้าหมาย:** พัฒนาบริการหลักและระบบ Queue

#### 2.1 Authentication & Authorization
- [ ] JWT Token System
- [ ] Role-Based Access Control (Admin, User)
- [ ] API Key Management (Encrypt/Decrypt)

#### 2.2 Product Management APIs
- [ ] CRUD Products
- [ ] Upload Product Images
- [ ] Categorization & Tagging

#### 2.3 Queue System Implementation
- [ ] ตั้งค่า Redis Connection
- [ ] สร้าง BullMQ Queues:
  - `tiktok-content-queue`
  - `facebook-content-queue`
  - `video-generation-queue`
- [ ] เขียน Job Processors พื้นฐาน

#### 2.4 AI Integration Layer
- [ ] สร้าง Abstract Service สำหรับ AI Providers
- [ ] Implement Image Composition Service
- [ ] Implement Prompt Generation Service
- [ ] Implement Script & Voice Generation Service

**Deliverables:**
- ✅ REST APIs ครบตาม Product Management
- ✅ ระบบ Queue ทำงานได้
- ✅ Mock AI Services สำหรับทดสอบ

---

### **Phase 3: TikTok Workflow Implementation (สัปดาห์ 5-6)**
**เป้าหมาย:** ทำให้_workflow_ TikTok ทำงานได้จริง

#### 3.1 Video Generation Pipeline
- [ ] Image Composition with AI
- [ ] Prompt Engineering for Video Scenes
- [ ] Script Generation (Thai Language, 10-15 sec)
- [ ] Voice Over Generation (Thai TTS)
- [ ] Video Rendering Integration (Kling AI / alternatives)

#### 3.2 Chrome Extension Communication
- [ ] สร้าง WebSocket Server สำหรับคุยกับ Extension
- [ ] Define Protocol สำหรับส่งวิดีโอไฟล์
- [ ] Implement Upload Dispatch Mechanism

#### 3.3 Status Tracking
- [ ] Real-time Progress Updates
- [ ] Job Status Webhooks
- [ ] Error Handling & Retry Logic

#### 3.4 TikTok Frontend UI
- [ ] Product Selection Page
- [ ] Content Preview Component
- [ ] Job Status Dashboard
- [ ] Settings Page (API Keys, Extension Config)

**Deliverables:**
- ✅ สร้างวิดีโอรีวิวสินค้าได้อัตโนมัติ
- ✅ ส่งวิดีโอไป Extension ได้
- ✅ ติดตามสถานะการทำงานแบบ Real-time

---

### **Phase 4: Facebook Workflow Implementation (สัปดาห์ 7-8)**
**เป้าหมาย:** ทำให้_workflow_ Facebook พร้อม Lip Sync และ Affiliate

#### 4.1 Lip Sync Generation
- [ ] Script Preparation from Multi-angle Images
- [ ] AI Lip Sync Processing
- [ ] Media Compositing (Lip Sync + Product Images)

#### 4.2 Facebook Publishing
- [ ] Facebook Graph API Integration
- [ ] Support: Profile, Page, Group Posting
- [ ] Auto-caption Generation

#### 4.3 Affiliate Link System
- [ ] Shopee Link Mapping per Product
- [ ] Auto-insert Link in Caption
- [ ] Link Tracking & Analytics

#### 4.4 Facebook Frontend UI
- [ ] Multi-image Upload Component
- [ ] Lip Sync Preview
- [ ] Platform Selection (Profile/Page/Group)
- [ ] Affiliate Link Manager

**Deliverables:**
- ✅ สร้างคอนเทนต์ Lip Sync ได้
- ✅ โพสต์ลง Facebook พร้อมลิงก์ Shopee
- ✅ จัดการลิงก์ Affiliate ได้

---

### **Phase 5: Advanced Features & Scalability (สัปดาห์ 9-10)**
**เป้าหมาย:** เพิ่มฟีเจอร์ขั้นสูงและเตรียมพร้อมสำหรับการขยายตัว

#### 5.1 YouTube Preparation
- [ ] Update Database Schema สำหรับ YouTube
- [ ] สร้าง YouTube Service Stub
- [ ] เตรียม UI สำหรับ YouTube Shorts

#### 5.2 Scheduling System
- [ ] Cron Job Implementation
- [ ] Scheduled Post Management UI
- [ ] Timezone Handling

#### 5.3 Analytics & Reporting
- [ ] Post Performance Tracking
- [ ] Content Generation Statistics
- [ ] Cost Tracking (API Usage)

#### 5.4 Optimization
- [ ] Caching Strategy (Redis)
- [ ] Database Indexing
- [ ] Load Testing
- [ ] Error Monitoring (Sentry)

**Deliverables:**
- ✅ ระบบตั้งเวลาโพสต์ทำงานได้
- ✅ Dashboard แสดงสถิติ
- ✅ พร้อมรองรับ YouTube

---

### **Phase 6: Testing & Deployment (สัปดาห์ 11-12)**
**เป้าหมาย:** ทดสอบระบบและเตรียม Deploy

#### 6.1 Testing
- [ ] Unit Tests (Jest)
- [ ] Integration Tests
- [ ] E2E Tests (Playwright/Cypress)
- [ ] Load Testing (k6)

#### 6.2 Security Hardening
- [ ] Input Validation
- [ ] Rate Limiting
- [ ] CORS Configuration
- [ ] Secret Management

#### 6.3 Documentation
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] User Manual
- [ ] Deployment Guide
- [ ] Chrome Extension Installation Guide

#### 6.4 Deployment
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Production Docker Configuration
- [ ] Database Migration Scripts
- [ ] Backup Strategy

**Deliverables:**
- ✅ ระบบผ่านการทดสอบทั้งหมด
- ✅ เอกสารครบถ้วน
- ✅ พร้อม Deploy ขึ้น Production

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

## 🔧 Technology Stack Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18, TypeScript, Vite | UI Development |
| **Backend** | Node.js 20, TypeScript, Express/Fastify | API & Business Logic |
| **Database** | PostgreSQL 15, Prisma ORM | Data Persistence |
| **Queue** | Redis 7, BullMQ | Async Job Processing |
| **Cache** | Redis | Session & Data Caching |
| **AI Services** | OpenAI, Kling AI, TTS Providers | Content Generation |
| **Infrastructure** | Docker, Docker Compose | Containerization |
| **Testing** | Jest, Playwright | Testing Framework |
| **Monitoring** | Winston, Sentry | Logging & Error Tracking |

---

## 🎯 Success Criteria

### Phase 1-2 (MVP Foundation)
- [ ] สามารถเพิ่ม/แก้ไข/ลบ สินค้าได้
- [ ] ระบบ Queue รับงานและประมวลผลพื้นฐานได้
- [ ] ผู้ใช้สามารถล็อกอินและจัดการ API Keys ได้

### Phase 3-4 (Core Workflows)
- [ ] สร้างวิดีโอ TikTok ความยาว 10-15 วินาที พร้อมเสียงพากย์ไทยได้
- [ ] ส่งวิดีโอไป Chrome Extension เพื่ออัปโหลดได้
- [ ] สร้างคอนเทนต์ Facebook แบบ Lip Sync ได้
- [ ] แนบลิงก์ Shopee อัตโนมัติได้

### Phase 5-6 (Production Ready)
- [ ] ตั้งเวลาโพสต์ล่วงหน้าได้
- [ ] มี Dashboard แสดงสถิติการใช้งาน
- [ ] ผ่านการทดสอบความปลอดภัยและประสิทธิภาพ
- [ ] มีเอกสารครบถ้วนสำหรับผู้ใช้และผู้พัฒนา

---

## ⚠️ Risk Mitigation

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| AI API Downtime | High | Implement retry logic, fallback providers |
| Video Generation Timeout | High | Use async queue with status polling |
| Chrome Extension Compatibility | Medium | Version testing, auto-update mechanism |
| Database Performance | Medium | Proper indexing, connection pooling |
| Security Vulnerabilities | High | Regular audits, input validation, rate limiting |

---

## 📝 Next Steps

1. **เริ่มที่ Phase 1:** ตั้งค่าโครงสร้างโปรเจกต์และ Database Schema
2. **สัปดาห์ละ 1-2 งานใหญ่:** แบ่งงานตามลำดับความสำคัญ
3. **Review ทุกสิ้นสัปดาห์:** ตรวจสอบความคืบหน้าและปรับแผนหากจำเป็น
4. **Documentation ตลอดกระบวนการ:** อัปเดตเอกสารไปพร้อมกับการพัฒนา
