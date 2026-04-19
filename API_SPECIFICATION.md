# API Endpoints Specification

## Base URL
```
/api/v1
```

---

## Authentication

### POST /auth/register
**Register new user**
```json
// Request
{
  "email": "user@example.com",
  "password": "securepassword123"
}

// Response (201)
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### POST /auth/login
**Login user**
```json
// Request
{
  "email": "user@example.com",
  "password": "securepassword123"
}

// Response (200)
{
  "accessToken": "jwt_token",
  "refreshToken": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### POST /auth/refresh
**Refresh access token**
```json
// Request (Header: Authorization: Bearer <refreshToken>)
{}

// Response (200)
{
  "accessToken": "new_jwt_token"
}
```

---

## Products

### GET /products
**List all products (with pagination & filters)**
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- category: string (optional)
- search: string (optional)
```

```json
// Response (200)
{
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Description",
      "defaultImage": "https://...",
      "images": ["url1", "url2"],
      "shopeeLink": "https://shopee.co.th/...",
      "category": "Electronics",
      "tags": ["tag1", "tag2"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### GET /products/:id
**Get product by ID**
```json
// Response (200)
{
  "id": "uuid",
  "name": "Product Name",
  "description": "Description",
  "defaultImage": "https://...",
  "images": ["url1", "url2"],
  "shopeeLink": "https://shopee.co.th/...",
  "category": "Electronics",
  "tags": ["tag1", "tag2"],
  "contentJobs": [...],
  "scheduledPosts": [...],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### POST /products
**Create new product**
```json
// Request
{
  "name": "Product Name",
  "description": "Description",
  "defaultImage": "https://...",
  "images": ["url1", "url2"],
  "shopeeLink": "https://shopee.co.th/...",
  "category": "Electronics",
  "tags": ["tag1", "tag2"]
}

// Response (201)
{
  "id": "uuid",
  "name": "Product Name",
  ...
}
```

### PUT /products/:id
**Update product**
```json
// Request (same as POST, all fields optional)
{
  "name": "Updated Name",
  "shopeeLink": "https://shopee.co.th/new-link"
}

// Response (200)
{
  "id": "uuid",
  "name": "Updated Name",
  ...
}
```

### DELETE /products/:id
**Delete product**
```json
// Response (204) - No content
```

### POST /products/:id/images
**Upload product images**
```
Content-Type: multipart/form-data

FormData:
- images: File[] (multiple files)
```

```json
// Response (201)
{
  "uploadedImages": [
    "https://storage.example.com/image1.jpg",
    "https://storage.example.com/image2.jpg"
  ]
}
```

---

## API Keys

### GET /api-keys
**List all API keys for current user**
```json
// Response (200)
{
  "apiKeys": [
    {
      "id": "uuid",
      "platform": "TIKTOK",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "platform": "FACEBOOK",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api-keys
**Add or update API key**
```json
// Request
{
  "platform": "TIKTOK",
  "key": "api_key_value",
  "secret": "api_secret_value" // optional, สำหรับ OAuth
}

// Response (201)
{
  "id": "uuid",
  "platform": "TIKTOK",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### DELETE /api-keys/:id
**Delete API key**
```json
// Response (204) - No content
```

### PATCH /api-keys/:id/toggle
**Toggle API key active status**
```json
// Response (200)
{
  "id": "uuid",
  "platform": "TIKTOK",
  "isActive": false,
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## Content Jobs

### GET /jobs
**List all content jobs**
```
Query Parameters:
- platform: TIKTOK | FACEBOOK | YOUTUBE (optional)
- status: PENDING | PROCESSING | COMPLETED | FAILED (optional)
- contentType: VIDEO | IMAGE | LIP_SYNC (optional)
- page: number (default: 1)
- limit: number (default: 20)
```

```json
// Response (200)
{
  "data": [
    {
      "id": "uuid",
      "platform": "TIKTOK",
      "contentType": "VIDEO",
      "status": "PROCESSING",
      "progress": 45,
      "productId": "uuid",
      "product": {
        "name": "Product Name",
        "defaultImage": "https://..."
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### GET /jobs/:id
**Get job details**
```json
// Response (200)
{
  "id": "uuid",
  "platform": "TIKTOK",
  "contentType": "VIDEO",
  "status": "COMPLETED",
  "progress": 100,
  "prompt": "AI generated prompt...",
  "script": "Thai script for review...",
  "voiceOverUrl": "https://...",
  "videoUrl": "https://...",
  "thumbnailUrl": "https://...",
  "productId": "uuid",
  "product": {...},
  "createdAt": "2024-01-01T00:00:00Z",
  "completedAt": "2024-01-01T00:05:00Z"
}
```

### POST /jobs
**Create new content generation job**
```json
// Request
{
  "productId": "uuid",
  "platform": "TIKTOK",
  "contentType": "VIDEO",
  "options": {
    "duration": 15, // seconds (สำหรับ TikTok: 10-15)
    "style": "review", // review, unboxing, showcase
    "tone": "enthusiastic", // enthusiastic, professional, casual
    "language": "th" // th, en
  }
}

// Response (202)
{
  "id": "uuid",
  "status": "PENDING",
  "queueJobId": "bullmq_job_id",
  "message": "Job queued successfully"
}
```

### POST /jobs/:id/cancel
**Cancel a running job**
```json
// Response (200)
{
  "id": "uuid",
  "status": "CANCELLED",
  "message": "Job cancelled successfully"
}
```

### POST /jobs/:id/retry
**Retry a failed job**
```json
// Response (202)
{
  "id": "uuid",
  "status": "PENDING",
  "queueJobId": "new_bullmq_job_id",
  "message": "Job retry queued successfully"
}
```

---

## Scheduled Posts

### GET /scheduled-posts
**List scheduled posts**
```
Query Parameters:
- platform: TIKTOK | FACEBOOK | YOUTUBE (optional)
- status: PENDING | POSTED | FAILED (optional)
- from: date (optional)
- to: date (optional)
```

```json
// Response (200)
{
  "data": [
    {
      "id": "uuid",
      "platform": "FACEBOOK",
      "scheduledAt": "2024-01-15T10:00:00Z",
      "timezone": "Asia/Bangkok",
      "status": "PENDING",
      "productId": "uuid",
      "product": {
        "name": "Product Name",
        "defaultImage": "https://..."
      },
      "caption": "Amazing product! Check it out...",
      "affiliateLink": "https://shopee.co.th/...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /scheduled-posts/:id
**Get scheduled post details**
```json
// Response (200)
{
  "id": "uuid",
  "platform": "FACEBOOK",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "timezone": "Asia/Bangkok",
  "status": "PENDING",
  "contentJobId": "uuid",
  "contentJob": {...},
  "productId": "uuid",
  "product": {...},
  "caption": "Amazing product! Check it out...",
  "affiliateLink": "https://shopee.co.th/...",
  "postedAt": null,
  "platformPostId": null,
  "errorMessage": null
}
```

### POST /scheduled-posts
**Create scheduled post**
```json
// Request
{
  "contentJobId": "uuid", // หรือใช้ productId + ให้ระบบสร้าง content อัตโนมัติ
  "productId": "uuid", // ถ้าไม่มี contentJobId
  "platform": "FACEBOOK",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "timezone": "Asia/Bangkok",
  "caption": "Amazing product! Check it out...",
  "autoAttachAffiliate": true // แนบลิงก์ Shopee อัตโนมัติ
}

// Response (201)
{
  "id": "uuid",
  "status": "PENDING",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "message": "Post scheduled successfully"
}
```

### PUT /scheduled-posts/:id
**Update scheduled post**
```json
// Request (all fields optional)
{
  "scheduledAt": "2024-01-16T14:00:00Z",
  "caption": "Updated caption..."
}

// Response (200)
{
  "id": "uuid",
  "scheduledAt": "2024-01-16T14:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### DELETE /scheduled-posts/:id
**Delete scheduled post**
```json
// Response (204) - No content
```

### POST /scheduled-posts/:id/cancel
**Cancel scheduled post**
```json
// Response (200)
{
  "id": "uuid",
  "status": "CANCELLED",
  "message": "Scheduled post cancelled successfully"
}
```

---

## Affiliate Links

### GET /affiliate-links
**List all affiliate links**
```
Query Parameters:
- isActive: boolean (optional)
- search: string (optional)
```

```json
// Response (200)
{
  "data": [
    {
      "id": "uuid",
      "productName": "Product Name",
      "shopeeLink": "https://shopee.co.th/...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /affiliate-links
**Create affiliate link**
```json
// Request
{
  "productName": "Product Name",
  "shopeeLink": "https://shopee.co.th/..."
}

// Response (201)
{
  "id": "uuid",
  "productName": "Product Name",
  "shopeeLink": "https://shopee.co.th/...",
  "isActive": true
}
```

### PUT /affiliate-links/:id
**Update affiliate link**
```json
// Request
{
  "shopeeLink": "https://shopee.co.th/new-link",
  "isActive": false
}

// Response (200)
{
  "id": "uuid",
  "shopeeLink": "https://shopee.co.th/new-link",
  "isActive": false
}
```

### DELETE /affiliate-links/:id
**Delete affiliate link**
```json
// Response (204) - No content
```

---

## WebSocket Events

### Connection
```
ws://localhost:3000/ws?token=<jwt_token>
```

### Client -> Server Events

#### subscribe:job
```json
{
  "event": "subscribe:job",
  "data": {
    "jobId": "uuid"
  }
}
```

#### unsubscribe:job
```json
{
  "event": "unsubscribe:job",
  "data": {
    "jobId": "uuid"
  }
}
```

### Server -> Client Events

#### job:progress
```json
{
  "event": "job:progress",
  "data": {
    "jobId": "uuid",
    "progress": 45,
    "status": "PROCESSING",
    "message": "Generating voice over..."
  }
}
```

#### job:completed
```json
{
  "event": "job:completed",
  "data": {
    "jobId": "uuid",
    "status": "COMPLETED",
    "videoUrl": "https://...",
    "completedAt": "2024-01-01T00:05:00Z"
  }
}
```

#### job:failed
```json
{
  "event": "job:failed",
  "data": {
    "jobId": "uuid",
    "status": "FAILED",
    "errorMessage": "AI API timeout",
    "failedAt": "2024-01-01T00:03:00Z"
  }
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Status Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (business logic error)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Rate Limiting

```
Default: 100 requests per minute per IP
Authenticated: 500 requests per minute per user
File Upload: 10 requests per minute per user
```

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```
