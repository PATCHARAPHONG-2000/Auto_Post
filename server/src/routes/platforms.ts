import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Platform } from '@prisma/client';

const router = Router();

// Get platform configs for current user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const configs = await prisma.platformConfig.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        platform: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(configs);
  } catch (error) {
    console.error('Get platform configs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get or create config for specific platform
router.get('/:platform', authenticate, async (req: AuthRequest, res) => {
  try {
    const { platform } = req.params;
    
    let config = await prisma.platformConfig.findFirst({
      where: { userId: req.userId, platform: platform as Platform },
    });

    if (!config) {
      // Create default config if not exists
      config = await prisma.platformConfig.create({
        data: {
          platform: platform as Platform,
          userId: req.userId!,
        },
      });
    }

    res.json(config);
  } catch (error) {
    console.error('Get platform config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update platform config
router.put('/:platform', authenticate, async (req: AuthRequest, res) => {
  try {
    const { platform } = req.params;
    const { apiKey, apiSecret, token, isActive } = req.body;

    const config = await prisma.platformConfig.upsert({
      where: {
        userId_platform: {
          userId: req.userId!,
          platform: platform as Platform,
        },
      },
      update: {
        apiKey,
        apiSecret,
        token,
        isActive,
      },
      create: {
        platform: platform as Platform,
        userId: req.userId!,
        apiKey,
        apiSecret,
        token,
        isActive,
      },
    });

    res.json(config);
  } catch (error) {
    console.error('Update platform config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete platform config
router.delete('/:platform', authenticate, async (req: AuthRequest, res) => {
  try {
    const { platform } = req.params;

    const config = await prisma.platformConfig.findFirst({
      where: { userId: req.userId, platform: platform as Platform },
    });

    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    await prisma.platformConfig.delete({
      where: { id: config.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete platform config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
