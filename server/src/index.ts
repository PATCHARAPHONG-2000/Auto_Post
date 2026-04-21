import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import taskRoutes from './routes/tasks';
import platformRoutes from './routes/platforms';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/platforms', platformRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/me`);
  console.log(`   - GET  /api/products`);
  console.log(`   - POST /api/products`);
  console.log(`   - GET  /api/tasks`);
  console.log(`   - POST /api/tasks/tiktok`);
  console.log(`   - POST /api/tasks/facebook`);
  console.log(`   - POST /api/tasks/youtube`);
  console.log(`   - GET  /api/platforms`);
  console.log(`   - PUT  /api/platforms/:platform`);
});

export default app;
