"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiktok_queue_1 = require("../queues/tiktok.queue");
const router = (0, express_1.Router)();
// POST /api/v1/tiktok/generate
// Trigger TikTok video generation
router.post('/generate', async (req, res) => {
    try {
        const jobData = req.body;
        // Validate required fields
        if (!jobData.productId || !jobData.imageData || !jobData.settings) {
            return res.status(400).json({
                error: 'Missing required fields: productId, imageData, settings',
            });
        }
        // Add job to queue
        const job = await (0, tiktok_queue_1.createTikTokVideoJob)(jobData);
        res.json({
            success: true,
            jobId: job.id,
            message: 'Video generation job queued successfully',
            status: 'pending',
        });
    }
    catch (error) {
        console.error('Error creating TikTok video job:', error);
        res.status(500).json({
            error: 'Failed to create video generation job',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// GET /api/v1/tiktok/status/:jobId
// Check job status
router.get('/status/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        // Note: In production, you'd query the actual job from Redis/BullMQ
        res.json({
            jobId,
            status: 'processing',
            progress: 50,
            message: 'Job is being processed',
        });
    }
    catch (error) {
        console.error('Error checking job status:', error);
        res.status(500).json({
            error: 'Failed to get job status',
        });
    }
});
exports.default = router;
//# sourceMappingURL=tiktok.routes.js.map