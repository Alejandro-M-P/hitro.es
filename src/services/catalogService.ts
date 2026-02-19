import type { LessonVideo, StoreProduct } from '../types/domain';
import { simulateFetch } from './httpClient';
import { readStorage } from './storage';

export const DEV_PRODUCTS_STORAGE_KEY = 'hitro_products_dev';
export const DEV_VIDEOS_STORAGE_KEY = 'hitro_videos_dev';

export interface CatalogService {
  getStoreCatalog(baseProducts: StoreProduct[]): Promise<StoreProduct[]>;
  getLessonCatalog(baseLessons: LessonVideo[]): Promise<LessonVideo[]>;
}

function normalizeProduct(candidate: Partial<StoreProduct>): StoreProduct {
  return {
    name: candidate.name || 'Producto',
    price: candidate.price || '0.00€',
    imageUrl: candidate.imageUrl || '',
    category: candidate.category || 'General',
    description: candidate.description || '',
  };
}

function normalizeLesson(candidate: Partial<LessonVideo>): LessonVideo {
  return {
    title: candidate.title || 'Leccion',
    slug: candidate.slug || '',
    category: candidate.category || 'General',
    imageUrl: candidate.imageUrl || '',
    duration: candidate.duration || '',
    youtubeId: candidate.youtubeId || '',
    description: candidate.description || '',
    price: candidate.price || '',
  };
}

class CatalogServiceImpl implements CatalogService {
  async getStoreCatalog(baseProducts: StoreProduct[]): Promise<StoreProduct[]> {
    return simulateFetch(() => {
      const devProducts = readStorage<StoreProduct[]>(DEV_PRODUCTS_STORAGE_KEY, []).map(normalizeProduct);
      return [...baseProducts.map(normalizeProduct), ...devProducts];
    });
  }

  async getLessonCatalog(baseLessons: LessonVideo[]): Promise<LessonVideo[]> {
    return simulateFetch(() => {
      const devVideos = readStorage<LessonVideo[]>(DEV_VIDEOS_STORAGE_KEY, []).map(normalizeLesson);
      return [...baseLessons.map(normalizeLesson), ...devVideos];
    });
  }
}

export const catalogService = new CatalogServiceImpl();
