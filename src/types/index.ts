export type OrderStatus =
  | 'Pendiente'
  | 'Confirmado'
  | 'Preparando'
  | 'Enviado'
  | 'Completado'
  | 'Cancelado';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  isOffer: boolean;
  discountPercent?: number;
  isFeatured: boolean;
  isActive: boolean;
  inStock: boolean;
  stockCount: number;
  description: string;
  material: string;
  specifications: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  rating: number;
  reviewsCount: number;
  salesCount: number;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  validUntil: string;
  isActive: boolean;
  featuredProductIds: string[];
  bannerHighlight: string;
}

export interface CartItem {
  id: string; // unique item id: productId-size-color
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  cuit?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'Transferencia bancaria' | 'Tarjeta de crédito / débito' | 'Efectivo contra entrega' | 'Cuenta Corriente Empresa';
  shippingAddress: string;
  city: string;
  province: string;
  notes?: string;
  createdAt: string;
}

export interface StoreSettings {
  whatsappPhone: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  address: string;
  city: string;
  freeShippingThreshold: number;
  standardShippingCost: number;
  announcementBanner: string;
  announcementActive: boolean;
  instagramUrl: string;
  facebookUrl: string;
  openingHours: string;
  heroImageUrl: string;
  heroImagePosition?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  adminPassword?: string;
}

export interface B2BQuoteRequest {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  cuit: string;
  workersCount: string;
  requirements: string;
  needsEmbroidery: boolean;
  selectedCategories: string[];
}

export type ActiveView = 'home' | 'catalog' | 'offers' | 'corporate' | 'contact' | 'admin';
