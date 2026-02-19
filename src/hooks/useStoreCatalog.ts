import { catalogService } from '../services/catalogService';
import type { CartItem, StoreProduct } from '../types/domain';

const DUPLICATE_GUARD_MS = 650;
const CART_STORAGE_KEY = 'hitro_store_cart';

interface StoreCatalogModel {
  products: StoreProduct[];
  cart: CartItem[];
  isLoading: boolean;
  load(): Promise<void>;
  addToCart(product: StoreProduct): { accepted: boolean; item?: CartItem };
  removeFromCart(itemId: number): void;
  getTotal(): number;
  parsePrice(price: string): number;
  formatPrice(value: number): string;
}

class StoreCatalogState implements StoreCatalogModel {
  public products: StoreProduct[] = [];
  public cart: CartItem[] = [];
  public isLoading = true;
  private readonly busyKeys = new Set<string>();

  constructor(private readonly baseProducts: StoreProduct[]) {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) {
        this.cart = parsed;
      }
    } catch {
      this.cart = [];
    }
  }

  private persistCart(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
  }

  async load(): Promise<void> {
    this.isLoading = true;
    this.products = await catalogService.getStoreCatalog(this.baseProducts);
    this.isLoading = false;
  }

  addToCart(product: StoreProduct): { accepted: boolean; item?: CartItem } {
    const key = `${product.name}|${product.price}`;
    if (this.busyKeys.has(key)) {
      return { accepted: false };
    }

    this.busyKeys.add(key);
    window.setTimeout(() => this.busyKeys.delete(key), DUPLICATE_GUARD_MS);

    const item: CartItem = {
      id: Date.now(),
      name: product.name || 'Producto',
      price: product.price || '0.00€',
      image: product.imageUrl || '',
    };
    this.cart.push(item);
    this.persistCart();
    return { accepted: true, item };
  }

  removeFromCart(itemId: number): void {
    this.cart = this.cart.filter((item) => item.id !== itemId);
    this.persistCart();
  }

  getTotal(): number {
    return this.cart.reduce((acc, item) => acc + this.parsePrice(item.price), 0);
  }

  parsePrice(price: string): number {
    const numeric = price.replace('€', '').replace(',', '.').trim();
    return Number.parseFloat(numeric) || 0;
  }

  formatPrice(value: number): string {
    return `${value.toFixed(2)}€`;
  }
}

export function useStoreCatalog(baseProducts: StoreProduct[]): StoreCatalogModel {
  return new StoreCatalogState(baseProducts);
}
