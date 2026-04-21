import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Platform, TaskStatus } from '@prisma/client';

const router = Router();

// Get all tasks for current user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { platform, status } = req.query;
    
    const where: any = { userId: req.userId };
    
    if (platform) {
      where.platform = platform as Platform;
    }
    
    if (status) {
      where.status = status as TaskStatus;
    }

    const tasks = await prisma.contentTask.findMany({
      where,
      include: {
        product: {
          select: { id: true, name: true, images: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single task
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.contentTask.findFirst({
      where: { id, userId: req.userId },
      include: {
        product: true,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create TikTok task
router.post('/tiktok', authenticate, async (req: AuthRequest, res) => {
  try {
    const { productId, scheduledAt } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, userId: req.userId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const task = await prisma.contentTask.create({
      data: {
        platform: 'TIKTOK',
        status: 'PENDING',
        productId,
        userId: req.userId!,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
      include: {
        product: true,
      },
    });

    // TODO: Add to queue for processing
    // await taskQueue.add('generate-tiktok-video', { taskId: task.id });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create TikTok task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Facebook task
router.post('/facebook', authenticate, async (req: AuthRequest, res) => {
  try {
    const { productId, scheduledAt, externalLink } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, userId: req.userId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const task = await prisma.contentTask.create({
      data: {
        platform: 'FACEBOOK',
        status: 'PENDING',
        productId,
        userId: req.userId!,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        externalLink: externalLink || product.shopeeLink,
      },
      include: {
        product: true,
      },
    });

    // TODO: Add to queue for processing
    // await taskQueue.add('generate-facebook-content', { taskId: task.id });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create Facebook task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create YouTube task
router.post('/youtube', authenticate, async (req: AuthRequest, res) => {
  try {
    const { productId, scheduledAt } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, userId: req.userId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const task = await prisma.contentTask.create({
      data: {
        platform: 'YOUTUBE',
        status: 'PENDING',
        productId,
        userId: req.userId!,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
      include: {
        product: true,
      },
    });

    // TODO: Add to queue for processing
    // await taskQueue.add('generate-youtube-short', { taskId: task.id });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create YouTube task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel task
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.contentTask.findFirst({
      where: { id, userId: req.userId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status === 'COMPLETED' || task.status === 'UPLOADED') {
      return res.status(400).json({ error: 'Cannot cancel completed task' });
    }

    await prisma.contentTask.update({
      where: { id },
      data: { status: 'FAILED', errorMessage: 'Cancelled by user' },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Cancel task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
