# Workflow Specifications

## 1. TikTok Shop Workflow (Auto Content & Extension Upload)

### 🎯 Goal
สร้างวิดีโอรีวิวสินค้าความยาว 10-15 วินาที พร้อมเสียงพากย์ภาษาไทย และอัปโหลดผ่าน Chrome Extension โดยไม่มีการแนบลิงก์ภายนอก

---

### 📊 Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Product   │────▶│ Image        │────▶│ Prompt          │
│   Selected  │     │ Composition  │     │ Generation      │
└─────────────┘     └──────────────┘     └─────────────────┘
                                                │
                                                ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Upload    │◀────│   Video      │◀────│ Script & Voice  │
│   via Ext   │     │   Rendering  │     │ Generation      │
└─────────────┘     └──────────────┘     └─────────────────┘
```

---

### 🔧 Step-by-Step Process

#### Step 1: Image Composition
**Input:** 
- Product default image
- Additional product images (2-5 images)

**Process:**
```typescript
// Backend sends to AI Image Service
POST /ai/compose
{
  "images": ["url1", "url2", "url3"],
  "compositionType": "collage",
  "style": "professional",
  "aspectRatio": "9:16" // TikTok format
}
```

**Output:**
- Composed image URL for video generation

**State Change:**
```
ContentJob.status: PENDING → PROCESSING
ContentJob.progress: 0 → 15
```

---

#### Step 2: Prompt Generation
**Input:**
- Composed image
- Product name, description, category
- Style preferences (review, unboxing, showcase)

**Process:**
```typescript
// Backend sends to AI Text Service (OpenAI/Claude)
POST /ai/generate-prompt
{
  "productName": "Wireless Earbuds Pro",
  "productDescription": "...",
  "composedImageUrl": "https://...",
  "videoStyle": "review",
  "tone": "enthusiastic",
  "duration": 15,
  "language": "th"
}
```

**Output:**
```json
{
  "prompt": "สร้างวิดีโอรีวิวหูฟังไร้สาย แสดงการออกแบบที่ทันสมัย คุณภาพเสียงยอดเยี่ยม และการใช้งานที่สะดวก แบ่งเป็น 3 ฉาก: 1) เปิดกล่องแสดงผลิตภัณฑ์ 2) ใส่หูฟังและแสดงสีหน้าพอใจ 3) แสดงการใช้งานจริง",
  "scenes": [
    {
      "sceneNumber": 1,
      "description": "เปิดกล่องแสดงผลิตภัณฑ์ มุมมอง 360 องศา",
      "duration": 5
    },
    {
      "sceneNumber": 2,
      "description": "คนใส่หูฟัง ยิ้มพอใจ คุณภาพเสียงดีเยี่ยม",
      "duration": 5
    },
    {
      "sceneNumber": 3,
      "description": "ใช้งานหูฟังขณะออกกำลังกาย กันน้ำกันเหงื่อ",
      "duration": 5
    }
  ]
}
```

**State Change:**
```
ContentJob.progress: 15 → 30
ContentJob.prompt: <generated_prompt>
```

---

#### Step 3: State Management
**Process:**
```typescript
// Save state to database immediately
await prisma.contentJob.update({
  where: { id: jobId },
  data: {
    status: 'PROCESSING',
    progress: 30,
    prompt: generatedPrompt
  }
});

// Emit WebSocket event
ws.emit('job:progress', {
  jobId,
  progress: 30,
  status: 'PROCESSING',
  message: 'Generating script and voice over...'
});
```

---

#### Step 4: Script & Voice Generation
**Input:**
- Generated prompt
- Product information
- Duration constraint (10-15 seconds)

**Process:**
```typescript
// Generate Thai script
POST /ai/generate-script
{
  "prompt": "...",
  "duration": 15,
  "language": "th",
  "tone": "enthusiastic"
}

// Generate voice over (Thai TTS)
POST /ai/tts
{
  "text": "สคริปต์ภาษาไทย...",
  "voice": "th-TH-Premwadee",
  "speed": 1.0
}
```

**Output:**
- Thai script (optimized for 10-15 sec reading)
- Voice over audio file URL

**Example Script:**
```
"หูฟังไร้สายรุ่นใหม่นี้ บอกเลยว่าเด็ดมาก! 
เสียงชัดเบสหนัก ใส่สบายทั้งวัน 
แบตเตอรี่อึดใช้ได้ทั้งสัปดาห์ 
พิกัดในตะกร้าเลย คุ้มมาก!"
```

**State Change:**
```
ContentJob.progress: 30 → 60
ContentJob.script: <thai_script>
ContentJob.voiceOverUrl: <audio_url>
```

---

#### Step 5: Video Rendering
**Input:**
- Generated prompt with scenes
- Composed image(s)
- Voice over audio

**Process:**
```typescript
// Send to AI Video Generator (Kling AI / Runway / Pika)
POST /ai/generate-video
{
  "prompt": "...",
  "scenes": [...],
  "imageUrl": "https://...",
  "audioUrl": "https://...",
  "duration": 15,
  "aspectRatio": "9:16",
  "fps": 30
}
```

**Polling Mechanism:**
```typescript
// Check video generation status
GET /ai/video-status/{jobId}

// Retry every 5 seconds until completed
while (status !== 'completed') {
  await sleep(5000);
  status = await checkStatus(jobId);
  
  // Update progress
  ContentJob.progress = calculateProgress(status);
}
```

**Output:**
- Generated video URL (MP4, 9:16 aspect ratio)

**State Change:**
```
ContentJob.progress: 60 → 90
ContentJob.videoUrl: <video_url>
```

---

#### Step 6: Extension Dispatch
**Input:**
- Generated video file
- TikTok session (via Extension)

**Process:**
```typescript
// Send video to Chrome Extension via WebSocket
const extensionMessage = {
  type: 'UPLOAD_VIDEO',
  payload: {
    videoUrl: videoUrl,
    caption: generatedCaption,
    hashtags: ['#tiktokshop', '#review', '#product'],
    privacy: 'public'
  }
};

// Send to extension
ws.sendToExtension(extensionClientId, extensionMessage);
```

**Extension Side:**
```javascript
// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPLOAD_VIDEO') {
    uploadToTikTok(message.payload);
  }
});

async function uploadToTikTok(payload) {
  // 1. Download video from URL
  const videoBlob = await downloadVideo(payload.videoUrl);
  
  // 2. Open TikTok upload page
  const tab = await chrome.tabs.create({
    url: 'https://www.tiktok.com/upload'
  });
  
  // 3. Inject content script to handle upload
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
  
  // 4. Send upload data to content script
  await chrome.tabs.sendMessage(tab.id, {
    type: 'PERFORM_UPLOAD',
    payload: payload
  });
}
```

**State Change:**
```
ContentJob.progress: 90 → 95
```

---

#### Step 7: Tracking & Completion
**Process:**
```typescript
// Extension confirms upload success
extension.on('upload:success', async (data) => {
  await prisma.contentJob.update({
    where: { id: jobId },
    data: {
      status: 'COMPLETED',
      progress: 100,
      completedAt: new Date(),
      platformPostId: data.postId
    }
  });
  
  ws.emit('job:completed', {
    jobId,
    videoUrl: job.videoUrl,
    platformPostId: data.postId,
    completedAt: new Date()
  });
});

// Handle upload failure
extension.on('upload:failed', async (error) => {
  await prisma.contentJob.update({
    where: { id: jobId },
    data: {
      status: 'FAILED',
      errorMessage: error.message
    }
  });
  
  ws.emit('job:failed', {
    jobId,
    errorMessage: error.message
  });
});
```

**Final State:**
```
ContentJob.status: COMPLETED
ContentJob.progress: 100
ContentJob.completedAt: <timestamp>
ContentJob.platformPostId: <tiktok_video_id>
```

---

### ⏱️ Estimated Timeline

| Step | Duration | Cumulative |
|------|----------|------------|
| Image Composition | 5-10 sec | 10 sec |
| Prompt Generation | 3-5 sec | 15 sec |
| Script & Voice | 5-8 sec | 23 sec |
| Video Rendering | 30-60 sec | 83 sec |
| Extension Upload | 10-20 sec | 103 sec |
| **Total** | **~1.5-2 minutes** | |

---

### ⚠️ Error Handling

```typescript
// Retry logic for each step
const retryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  stepName: string
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === retryConfig.maxRetries) {
        break;
      }
      
      const delay = Math.min(
        retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
        retryConfig.maxDelay
      );
      
      await sleep(delay);
    }
  }
  
  throw new Error(`${stepName} failed after ${retryConfig.maxRetries} retries: ${lastError.message}`);
}
```

---

## 2. Facebook Workflow (Lip Sync & Shopee Affiliate)

### 🎯 Goal
สร้างคอนเทนต์ภาพนิ่งหรือวิดีโอสั้นแบบ Lip Sync เพื่อโปรโมทสินค้า พร้อมแนบลิงก์ Shopee สำหรับการขาย

---

### 📊 Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Product   │────▶│   Script     │────▶│ Lip Sync        │
│   Images    │     │ Preparation  │     │ Generation      │
└─────────────┘     └──────────────┘     └─────────────────┘
                                                │
                                                ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Post to   │◀────│   Publish    │◀────│ Media           │
│   Facebook  │     │   & Route    │     │ Compositing     │
└─────────────┘     └──────────────┘     └─────────────────┘
```

---

### 🔧 Step-by-Step Process

#### Step 1: Script Preparation
**Input:**
- Multiple product images (different angles)
- Product information
- Target audience

**Process:**
```typescript
// Analyze images and generate promotional script
POST /ai/analyze-images
{
  "images": ["url1", "url2", "url3", "url4"],
  "productName": "Smart Watch X1",
  "productFeatures": ["heart rate", "GPS", "waterproof"],
  "targetAudience": "fitness enthusiasts"
}

POST /ai/generate-facebook-script
{
  "analysis": {...},
  "platform": "FACEBOOK",
  "contentType": "lip_sync",
  "tone": "friendly",
  "includeCTA": true,
  "language": "th"
}
```

**Output:**
```json
{
  "script": "นาฬิกาอัจฉริยะรุ่นนี้ มีครบทุกฟังก์ชั่นที่คนรักสุขภาพต้องการ! วัดอัตราการเต้นของหัวใจ ติดตาม GPS เวลาวิ่ง กันน้ำได้ลึก 50 เมตร พิกัดพิเศษในลิงก์ด้านล่างเลย!",
  "caption": "⌚ Smart Watch X1 - เพื่อนคู่ใจของคนรักสุขภาพ\n\n✅ วัดอัตราการเต้นของหัวใจ 24/7\n✅ GPS ในตัว ติดตามการวิ่ง\n✅ กันน้ำ 5ATM ว่ายน้ำได้\n✅ แบตเตอรี่ 14 วัน\n\n🔥 โปรโมชั่นพิเศษ ลด 30% วันนี้เท่านั้น!\n👉 สั่งซื้อ:",
  "hashtags": ["#smartwatch", "#fitness", "#healthtech"]
}
```

**State Change:**
```
ContentJob.status: PENDING → PROCESSING
ContentJob.progress: 0 → 20
ContentJob.script: <generated_script>
```

---

#### Step 2: Lip Sync Generation
**Input:**
- Generated script
- Product image or avatar image
- Language (Thai)

**Process:**
```typescript
// Choose lip sync provider (HeyGen, D-ID, SadTalker)
POST /ai/lip-sync
{
  "script": "...",
  "image": "https://...", // product or avatar
  "voice": "th-TH-Premwadee",
  "duration": "auto",
  "quality": "high"
}
```

**Polling:**
```typescript
// Similar to video generation, poll until complete
while (status !== 'completed') {
  await sleep(5000);
  status = await checkLipSyncStatus(jobId);
  ContentJob.progress = 20 + (status.progress * 0.4); // 20-60%
}
```

**Output:**
- Lip sync video URL (person/product speaking the script)

**State Change:**
```
ContentJob.progress: 20 → 60
ContentJob.videoUrl: <lip_sync_video_url>
```

---

#### Step 3: Media Compositing
**Input:**
- Lip sync video
- Product images
- Brand logo (optional)

**Process:**
```typescript
// Composite final video using FFmpeg or AI tool
POST /ai/composite
{
  "lipSyncVideo": "https://...",
  "productImages": ["url1", "url2"],
  "logo": "https://...",
  "layout": "split_screen", // or overlay, picture_in_picture
  "backgroundMusic": "upbeat_corporate",
  "transitions": "fade"
}
```

**Output:**
- Final composited video ready for posting

**State Change:**
```
ContentJob.progress: 60 → 80
ContentJob.videoUrl: <final_video_url>
```

---

#### Step 4: Publishing & Routing
**Input:**
- Final video
- Generated caption
- Target platforms (Profile, Page, Groups)

**Process:**
```typescript
// Get user's Facebook API key
const apiKey = await prisma.aPIKey.findFirst({
  where: { userId, platform: 'FACEBOOK', isActive: true }
});

// Post to selected destinations
const postPromises = targets.map(async (target) => {
  return facebookAPI.postVideo({
    accessToken: apiKey.key,
    videoUrl: finalVideoUrl,
    caption: caption,
    target: target // profile, page_id, group_id
  });
});

const results = await Promise.all(postPromises);
```

**Facebook API Call:**
```typescript
// Using Facebook Graph API
POST https://graph.facebook.com/v18.0/{page-id}/videos
{
  "access_token": "<page_access_token>",
  "file_url": "<video_url>",
  "description": "<caption>",
  "published": true
}
```

**State Change:**
```
ContentJob.progress: 80 → 95
```

---

#### Step 5: Affiliate Integration
**Input:**
- Product ID
- User's affiliate links

**Process:**
```typescript
// Get Shopee link for this product
const affiliateLink = await prisma.product.findUnique({
  where: { id: productId },
  select: { shopeeLink: true }
});

// Or get from affiliate links table
const affiliateLink = await prisma.affiliateLink.findFirst({
  where: {
    userId,
    isActive: true,
    productName: { contains: productName }
  }
});

// Append link to caption if autoAttach is enabled
if (autoAttachAffiliate && affiliateLink?.shopeeLink) {
  finalCaption = `${generatedCaption}\n\n🛒 ซื้อเลย: ${affiliateLink.shopeeLink}`;
  
  // Update scheduled post with affiliate link
  await prisma.scheduledPost.update({
    where: { id: postId },
    data: { affiliateLink: affiliateLink.shopeeLink }
  });
}
```

**Final State:**
```
ContentJob.status: COMPLETED
ContentJob.progress: 100
ContentJob.completedAt: <timestamp>
ScheduledPost.affiliateLink: <shopee_link>
ScheduledPost.platformPostId: <facebook_post_id>
```

---

### ⏱️ Estimated Timeline

| Step | Duration | Cumulative |
|------|----------|------------|
| Script Preparation | 5-8 sec | 8 sec |
| Lip Sync Generation | 30-60 sec | 68 sec |
| Media Compositing | 10-20 sec | 88 sec |
| Facebook Posting | 5-10 sec | 98 sec |
| **Total** | **~1.5-2 minutes** | |

---

## 3. Queue System Architecture

### BullMQ Queue Configuration

```typescript
// queues/tiktok.queue.ts
import { Queue, Worker, Job } from 'bullmq';

const tiktokQueue = new Queue('tiktok-content', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 100,
    removeOnFail: 1000
  }
});

const worker = new Worker('tiktok-content', async (job: Job) => {
  const { jobId, productId, options } = job.data;
  
  // Step 1: Image Composition
  await updateJobProgress(jobId, 15);
  const composedImage = await composeImages(productId);
  
  // Step 2: Prompt Generation
  await updateJobProgress(jobId, 30);
  const prompt = await generatePrompt(composedImage, options);
  
  // Step 3: Script & Voice
  await updateJobProgress(jobId, 60);
  const { script, voiceOver } = await generateScriptAndVoice(prompt);
  
  // Step 4: Video Rendering
  await updateJobProgress(jobId, 90);
  const video = await renderVideo(prompt, voiceOver, composedImage);
  
  // Step 5: Send to Extension
  await updateJobProgress(jobId, 95);
  await dispatchToExtension(video);
  
  // Complete
  await updateJobProgress(jobId, 100, 'COMPLETED');
  
}, { connection: redisConnection });
```

---

## 4. State Machine

```typescript
enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

const validTransitions = {
  [JobStatus.PENDING]: [JobStatus.PROCESSING, JobStatus.CANCELLED],
  [JobStatus.PROCESSING]: [JobStatus.COMPLETED, JobStatus.FAILED],
  [JobStatus.COMPLETED]: [],
  [JobStatus.FAILED]: [JobStatus.PENDING], // for retry
  [JobStatus.CANCELLED]: []
};

async function transitionJobStatus(jobId: string, newStatus: JobStatus) {
  const job = await prisma.contentJob.findUnique({ where: { id: jobId } });
  
  if (!validTransitions[job.status].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${job.status} to ${newStatus}`);
  }
  
  return prisma.contentJob.update({
    where: { id: jobId },
    data: { status: newStatus }
  });
}
```
