"use strict";
// Generator: TikTok Shop Auto Content
// Workflow: Image Composition → Prompt Generation → Script & Voice → Video Rendering → Extension Upload
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiktokWorker = exports.tiktokQueue = void 0;
exports.createTikTokVideoJob = createTikTokVideoJob;
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const redisConnection = new ioredis_1.Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
});
// Queue for TikTok video generation
exports.tiktokQueue = new bullmq_1.Queue('tiktok-video-generation', {
    connection: redisConnection,
});
// Worker to process TikTok video generation jobs
exports.tiktokWorker = new bullmq_1.Worker('tiktok-video-generation', async (job) => {
    const { productId, imageData, settings } = job.data;
    console.log(`🎬 Processing TikTok video for product: ${productId}`);
    // Step 1: Image Composition
    console.log('📸 Step 1: Composing images...');
    await job.updateProgress(10);
    // Step 2: Generate Prompt for Video
    console.log('✍️ Step 2: Generating video prompt...');
    await job.updateProgress(30);
    // Step 3: Generate Script & Voice (Thai language)
    console.log('🎙️ Step 3: Generating Thai script and voiceover...');
    await job.updateProgress(50);
    // Step 4: Render Video (10-15 seconds)
    console.log('🎥 Step 4: Rendering video...');
    await job.updateProgress(70);
    // Step 5: Send to Chrome Extension for upload
    console.log('📤 Step 5: Dispatching to extension...');
    await job.updateProgress(90);
    // Complete
    console.log('✅ Video generation complete!');
    await job.updateProgress(100);
    return {
        status: 'completed',
        videoUrl: `https://storage.example.com/videos/${productId}.mp4`,
        timestamp: new Date().toISOString(),
    };
}, { connection: redisConnection });
// Function to add job to queue
async function createTikTokVideoJob(jobData) {
    const job = await exports.tiktokQueue.add('generate-tiktok-video', jobData, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
    });
    console.log(`Job added: ${job.id}`);
    return job;
}
//# sourceMappingURL=tiktok.queue.js.map