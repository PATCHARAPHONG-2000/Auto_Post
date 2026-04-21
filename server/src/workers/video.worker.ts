import { Worker, Job } from 'bullmq';
import { prisma } from '../lib/prisma';
import {
  generateScript,
  generateVoice,
  generateVideo,
  lipSync,
} from '../services/aiService';

interface VideoJobData {
  taskId: number;
  productId: number;
  platform: 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE';
  options?: {
    style?: string;
    voiceId?: string;
  };
}

/**
 * Worker สำหรับสร้างวิดีโอ TikTok/YouTube
 */
const videoWorker = new Worker<VideoJobData, any>(
  'video-generation',
  async (job: Job<VideoJobData>) => {
    const { taskId, productId, platform, options } = job.data;
    
    console.log(`\n🚀 Processing job ${job.id} for Task #${taskId}`);
    
    try {
      // อัปเดตสถานะเป็น PROCESSING
      await prisma.contentTask.update({
        where: { id: taskId },
        data: { status: 'PROCESSING' },
      });

      // ดึงข้อมูลสินค้า
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      console.log(`📦 Product: ${product.name}`);

      // 1. Generate Script
      console.log('📝 Step 1: Generating script...');
      const script = await generateScript(
        product.name,
        product.description || '',
        platform.toLowerCase() as 'tiktok' | 'facebook'
      );

      // 2. Generate Voice
      console.log('🎤 Step 2: Generating voice...');
      const voice = await generateVoice(
        script.script,
        options?.voiceId
      );

      // 3. Generate Video
      console.log('🎬 Step 3: Rendering video...');
      const images = product.images || [];
      const video = await generateVideo(
        images,
        script,
        options?.style || 'modern'
      );

      // 4. อัปเดตฐานข้อมูลด้วยผลลัพธ์
      console.log('💾 Step 4: Saving results...');
      await prisma.contentTask.update({
        where: { id: taskId },
        data: {
          status: 'COMPLETED',
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          metadata: {
            script: script.script,
            scenes: script.scenes,
            audioUrl: voice.audioUrl,
            duration: script.duration,
          },
        },
      });

      console.log(`✅ Job ${job.id} completed successfully!`);
      return { success: true, videoUrl: video.videoUrl };

    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      
      await prisma.contentTask.update({
        where: { id: taskId },
        data: {
          status: 'FAILED',
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      });

      throw error;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    },
    concurrency: 2, // ประมวลผลพร้อมกัน 2 งาน
  }
);

/**
 * Worker สำหรับทำ Lip Sync (Facebook)
 */
const lipSyncWorker = new Worker<VideoJobData, any>(
  'lip-sync',
  async (job: Job<VideoJobData>) => {
    const { taskId, productId } = job.data;
    
    console.log(`\n👄 Processing lip-sync job ${job.id} for Task #${taskId}`);
    
    try {
      await prisma.contentTask.update({
        where: { id: taskId },
        data: { status: 'PROCESSING' },
      });

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // 1. Generate Script
      const script = await generateScript(
        product.name,
        product.description || '',
        'facebook'
      );

      // 2. Generate Voice
      const voice = await generateVoice(script.script);

      // 3. Lip Sync (ใช้รูปภาพแรกเป็นภาพหลัก)
      const mainImage = product.images?.[0];
      if (!mainImage) {
        throw new Error('No product image available for lip sync');
      }

      const result = await lipSync(mainImage, voice.audioUrl);

      // 4. Save results
      await prisma.contentTask.update({
        where: { id: taskId },
        data: {
          status: 'COMPLETED',
          videoUrl: result.videoUrl,
          metadata: {
            script: script.script,
            audioUrl: voice.audioUrl,
            lipSyncConfidence: result.confidence,
          },
        },
      });

      console.log(`✅ Lip-sync job ${job.id} completed!`);
      return { success: true, videoUrl: result.videoUrl };

    } catch (error) {
      console.error(`❌ Lip-sync job ${job.id} failed:`, error);
      
      await prisma.contentTask.update({
        where: { id: taskId },
        data: {
          status: 'FAILED',
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      });

      throw error;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    },
    concurrency: 1,
  }
);

// Handle worker events
videoWorker.on('ready', () => {
  console.log('🎬 Video Worker is ready!');
});

videoWorker.on('error', (error) => {
  console.error('Video Worker error:', error);
});

lipSyncWorker.on('ready', () => {
  console.log('👄 Lip-Sync Worker is ready!');
});

lipSyncWorker.on('error', (error) => {
  console.error('Lip-Sync Worker error:', error);
});

export { videoWorker, lipSyncWorker };
