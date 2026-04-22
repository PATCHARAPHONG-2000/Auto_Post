export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  shopeeLink?: string;
  createdAt: string;
}

export interface ContentTask {
  id: string;
  platform: 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  productId: string;
  videoUrl?: string;
  createdAt: string;
}

export interface PlatformConfig {
  id: string;
  platform: string;
  apiKey?: string;
  token?: string;
}
