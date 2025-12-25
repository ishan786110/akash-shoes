import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Product {
  id: string; // Firebase key
  name: string;
  brand?: string | null;
  category: string;
  originalPrice: number;
  discountPrice?: number | null;
  rating: number;
  stock: number;
  isOnSale: boolean;
  isNew: boolean;
  imageUrl: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
