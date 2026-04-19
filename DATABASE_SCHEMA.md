# Database Schema Design

## Overview
Prisma Schema สำหรับระบบ Auto Content Generation และ Multi-platform Posting

---

## Enums

```prisma
enum Platform {
  TIKTOK
  FACEBOOK
  YOUTUBE
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}

enum ContentType {
  VIDEO
  IMAGE
  LIP_SYNC
}

enum UserRole {
  ADMIN
  USER
}
```

---

## Models

### User
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  apiKeys       APIKey[]
  products      Product[]
  contentJobs   ContentJob[]
  scheduledPosts ScheduledPost[]
  
  @@map("users")
}
```

### APIKey
```prisma
model APIKey {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  platform      Platform
  key           String    // Encrypted
  secret        String?   // Encrypted (สำหรับ OAuth)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@unique([userId, platform])
  @@map("api_keys")
}
```

### Product
```prisma
model Product {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  description   String?
  defaultImage  String    // URL หรือ path
  images        String[]  // Array of image URLs
  category      String?
  tags          String[]
  
  // Shopee Affiliate Link (สำหรับ Facebook)
  shopeeLink    String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  contentJobs   ContentJob[]
  scheduledPosts ScheduledPost[]
  
  @@map("products")
}
```

### ContentJob
```prisma
model ContentJob {
  id            String      @id @default(uuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId     String?
  product       Product?    @relation(fields: [productId], references: [id], onDelete: SetNull)
  
  platform      Platform
  contentType   ContentType
  status        JobStatus   @default(PENDING)
  
  // AI Processing Data
  prompt        String?
  script        String?
  voiceOverUrl  String?
  videoUrl      String?
  thumbnailUrl  String?
  
  // Processing Metadata
  progress      Int         @default(0) // 0-100
  errorMessage  String?
  retryCount    Int         @default(0)
  
  // Queue Job ID
  queueJobId    String?
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  completedAt   DateTime?
  
  @@map("content_jobs")
}
```

### ScheduledPost
```prisma
model ScheduledPost {
  id            String      @id @default(uuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId     String?
  product       Product?    @relation(fields: [productId], references: [id], onDelete: SetNull)
  
  platform      Platform
  scheduledAt   DateTime
  timezone      String      @default("Asia/Bangkok")
  
  // Content References
  contentJobId  String?
  contentJob    ContentJob? @relation(fields: [contentJobId], references: [id])
  
  // Post Content
  caption       String?
  affiliateLink String?     // Shopee link สำหรับ Facebook
  
  // Posting Result
  status        JobStatus   @default(PENDING)
  postedAt      DateTime?
  platformPostId String?    // ID จาก platform หลังโพสต์
  errorMessage  String?
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@map("scheduled_posts")
}
```

### AffiliateLink
```prisma
model AffiliateLink {
  id            String    @id @default(uuid())
  userId        String
  // สามารถเพิ่ม relation กับ User ได้หากต้องการ
  
  productName   String    // สำหรับอ้างอิง
  shopeeLink    String
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@map("affiliate_links")
}
```

---

## Indexes

```prisma
// เพิ่ม indexes สำหรับ query ที่พบบ่อย
@@index([userId, platform]) on ContentJob
@@index([status]) on ContentJob
@@index([userId, scheduledAt]) on ScheduledPost
@@index([status, scheduledAt]) on ScheduledPost
@@index([userId, isActive]) on AffiliateLink
```

---

## Relationships Diagram

```
User (1) ----< (N) APIKey
User (1) ----< (N) Product
User (1) ----< (N) ContentJob
User (1) ----< (N) ScheduledPost

Product (1) ----< (N) ContentJob
Product (1) ----< (N) ScheduledPost

ContentJob (1) ---- (1) ScheduledPost (optional)
```

---

## Usage Examples

### Query Products with Jobs
```typescript
const products = await prisma.product.findMany({
  where: { userId: 'user-id' },
  include: {
    contentJobs: {
      orderBy: { createdAt: 'desc' },
      take: 5
    }
  }
})
```

### Get Active Jobs
```typescript
const activeJobs = await prisma.contentJob.findMany({
  where: {
    userId: 'user-id',
    status: { in: ['PENDING', 'PROCESSING'] }
  },
  orderBy: { createdAt: 'desc' }
})
```

### Get Upcoming Scheduled Posts
```typescript
const upcomingPosts = await prisma.scheduledPost.findMany({
  where: {
    userId: 'user-id',
    scheduledAt: { gte: new Date() },
    status: 'PENDING'
  },
  include: {
    product: true,
    contentJob: true
  },
  orderBy: { scheduledAt: 'asc' }
})
```
