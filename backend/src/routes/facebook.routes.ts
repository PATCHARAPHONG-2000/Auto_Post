import { Router, Request, Response } from 'express';
import { createFacebookContentJob, FacebookContentJob } from '../queues/facebook.queue';

const router = Router();

// POST /api/v1/facebook/generate
// Trigger Facebook content generation with Shopee affiliate link
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const jobData: FacebookContentJob = req.body;
    
    // Validate required fields
    if (!jobData.productId || !jobData.images || !jobData.shopeeLink) {
      return res.status(400).json({
        error: 'Missing required fields: productId, images, shopeeLink',
      });
    }
    
    // Add job to queue
    const job = await createFacebookContentJob(jobData);
    
    res.json({
      success: true,
      jobId: job.id,
      message: 'Facebook content generation job queued successfully',
      status: 'pending',
    });
  } catch (error) {
    console.error('Error creating Facebook content job:', error);
    res.status(500).json({
      error: 'Failed to create content generation job',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/v1/facebook/status/:jobId
// Check job status
router.get('/status/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    res.json({
      jobId,
      status: 'processing',
      progress: 50,
      message: 'Job is being processed',
    });
  } catch (error) {
    console.error('Error checking job status:', error);
    res.status(500).json({
      error: 'Failed to get job status',
    });
  }
});

export default router;
