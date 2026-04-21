import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all products for current user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { userId: req.userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: { id, userId: req.userId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, description, images, shopeeLink } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        images: images || [],
        shopeeLink,
        userId: req.userId!,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, description, images, shopeeLink } = req.body;

    const existingProduct = await prisma.product.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        images,
        shopeeLink,
      },
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
