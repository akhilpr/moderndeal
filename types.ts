
import React from 'react';

export type ProductCategory = 'Living Room' | 'Dining Room' | 'Bedroom' | 'Home Office' | 'Outdoor';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  tag?: string;
  category: ProductCategory;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  linkText: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  imageUrl?: string;
}

// Simplified Part type for frontend-to-backend communication
export interface Part {
    text?: string;
    inlineData?: {
        mimeType: string;
        data: string;
    };
}
