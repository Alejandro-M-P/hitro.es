export type SumUpPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Alumno {
  id: string;
  nombreCompleto: string;
  email: string;
  activo: boolean;
  cursosActivos: string[];
  ultimoPagoId?: string;
  creadoEn: string;
}

export interface Curso {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  duracion: string;
  precio: string;
  imagenUrl: string;
  youtubeId: string;
}

export interface PagoConciliacionSumUp {
  id: string;
  alumnoId: string;
  cursoSlug: string;
  proveedor: 'SUMUP';
  referenciaProveedor: string;
  estado: SumUpPaymentStatus;
  moneda: 'EUR';
  importeCentimos: number;
  pagadoEn?: string;
  creadoEn: string;
}

export interface StoreProduct {
  name: string;
  price: string;
  imageUrl: string;
  category: string;
  description: string;
}

export interface LessonVideo {
  title: string;
  slug: string;
  category: string;
  imageUrl: string;
  duration: string;
  youtubeId: string;
  description: string;
  price?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
}
