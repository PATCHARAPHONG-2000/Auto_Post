import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tiktokRoutes from './routes/tiktok.routes';
import facebookRoutes from './routes/facebook.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({ 
    message: 'Auto Content System API',
    version: '1.0.0',
    endpoints: {
      tiktok: '/api/v1/tiktok',
      facebook: '/api/v1/facebook',
      health: '/health'
    }
  });
});

// Platform routes
app.use('/api/v1/tiktok', tiktokRoutes);
app.use('/api/v1/facebook', facebookRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📱 TikTok API: http://localhost:${PORT}/api/v1/tiktok`);
  console.log(`📘 Facebook API: http://localhost:${PORT}/api/v1/facebook`);
});

export default app;
