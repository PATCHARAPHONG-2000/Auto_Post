import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const redisConnection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// Queue สำหรับสร้างวิดีโอ
export const videoGenerationQueue = new Queue('video-generation', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 10,
    removeOnFail: 100,
  },
});

// Queue สำหรับทำ Lip Sync (Facebook)
export const lipSyncQueue = new Queue('lip-sync', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

console.log('✅ Queues initialized successfully');
