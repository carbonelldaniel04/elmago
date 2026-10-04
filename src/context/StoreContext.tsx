import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Offer,
  StoreSettings,
  Order,
  CartItem,
  ActiveView,
  OrderStatus,
  B2BQuoteRequest,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_OFFERS,
  INITIAL_SETTINGS,
  INITIAL_ORDERS,
} from '../data/initialData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  offers: Offer;
  orders: Order[];
  settings: StoreSettings;
  cart: CartItem[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (catId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isB2BModalOpen: boolean;
  setIsB2BModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Cart operations
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;

  // WhatsApp helpers
  getWhatsAppProductUrl: (product: Product, size?: string, color?: string) => string;
  getWhatsAppCartUrl: () => string;
  getWhatsAppB2BUrl: (quote: B2BQuoteRequest) => string;
  getGeneralWhatsAppUrl: (customMessage?: string) => string;

  // Admin Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  toggleProductOffer: (id: string, discountPercent?: number) => void;
  toggleProductFeatured: (id: string) => void;

  // Offers Actions
  updateOffers: (updates: Partial<Offer>) => void;

  // Categories Actions
  addCategory: (category: Omit<Category, 'id' | 'itemCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Orders Actions
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;

  // Settings Actions
  updateSettings: (updates: Partial<StoreSettings>) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const STORAGE_KEYS = {
    PRODUCTS: 'tienda_el_mago_products_v1',
    CATEGORIES: 'tienda_el_mago_categories_v1',
    OFFERS: 'tienda_el_mago_offers_v1',
    ORDERS: 'tienda_el_mago_orders_v1',
    SETTINGS: 'tienda_el_mago_settings_v1',
    CART: 'tienda_el_mago_cart_v1',
  };

  const DEFAULT_FALLBACK_IMG = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';

  const sanitizeProduct = (prod: Product): Product => {
    const validImages = Array.isArray(prod.images)
      ? prod.images.filter((img) => typeof img === 'string' && img.trim() !== '')
      : [];
    return {
      ...prod,
      images: validImages.length > 0 ? validImages : [DEFAULT_FALLBACK_IMG],
    };
  };

  const sanitizeCategory = (cat: Category): Category => ({
    ...cat,
    image:
      cat.image && typeof cat.image === 'string' && cat.image.trim() !== ''
        ? cat.image.trim()
        : DEFAULT_FALLBACK_IMG,
  });

  // State initialization with localStorage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const parsed: Product[] = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
      return parsed.map(sanitizeProduct);
    } catch {
      return INITIAL_PRODUCTS.map(sanitizeProduct);
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const parsed: Category[] = saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
      return parsed.map(sanitizeCategory);
    } catch {
      return INITIAL_CATEGORIES.map(sanitizeCategory);
    }
  });

  const [offers, setOffers] = useState<Offer>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const parsed: StoreSettings = saved ? JSON.parse(saved) : INITIAL_SETTINGS;
      if (
        !parsed.heroImageUrl ||
        !parsed.heroImageUrl.trim() ||
        parsed.heroImageUrl.includes('hero_workwear_industrial')
      ) {
        parsed.heroImageUrl = 'https://i.postimg.cc/PqfxYzjX/ROPAOMBU.jpg';
      }
      return parsed;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation and UI state
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    } catch (e) {
      console.error('Error saving offers:', e);
    }
  }, [offers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // Cart operations
  const addToCart = (product: Product, size: string, color: string, quantity: number = 1) => {
    const itemId = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          size,
          color,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const cartShippingCost =
    cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0
      ? 0
      : settings.standardShippingCost;

  const cartTotal = cartSubtotal + cartShippingCost;

  // WhatsApp Helpers
  const cleanPhone = (phone: string) => phone.replace(/[^\d]/g, '');

  const getGeneralWhatsAppUrl = (customMessage?: string) => {
    const phone = cleanPhone(settings.whatsappPhone);
    const msg = customMessage || 'Hola Tienda El Mago, quisiera realizar una consulta sobre indumentaria de trabajo.';
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppProductUrl = (product: Product, size?: string, color?: string) => {
    const phone = cleanPhone(settings.whatsappPhone);
    const sizeInfo = size ? `, talle: ${size}` : '';
    const colorInfo = color ? `, color: ${color}` : '';
    const msg = `Hola Tienda El Mago, quiero consultar por el producto: ${product.name} (${product.brand})${sizeInfo}${colorInfo}. ¿Tienen stock disponible?`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppCartUrl = () => {
    const phone = cleanPhone(settings.whatsappPhone);
    if (cart.length === 0) {
      return getGeneralWhatsAppUrl();
    }

    const itemsText = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.product.name} (${item.product.brand}) | Talle: ${item.size} | Color: ${item.color} | Cant: ${item.quantity} | $${(item.product.price * item.quantity).toLocaleString('es-AR')}`
      )
      .join('\n');

    const totalText = `$${cartTotal.toLocaleString('es-AR')}`;
    const shippingText =
      cartShippingCost === 0 ? 'Bonificado / Gratis' : `$${cartShippingCost.toLocaleString('es-AR')}`;

    const message = `*CONSULTA DE PEDIDO - TIENDA EL MAGO*\n\nHola, armé mi pedido en la tienda online y quiero coordinar la compra:\n\n${itemsText}\n\n*Subtotal:* $${cartSubtotal.toLocaleString('es-AR')}\n*Envío:* ${shippingText}\n*Total Estimado:* ${totalText}\n\n¿Cómo coordinamos el pago y despacho? Muchas gracias.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const getWhatsAppB2BUrl = (quote: B2BQuoteRequest) => {
    const phone = cleanPhone(settings.whatsappPhone);
    const categoriesList = quote.selectedCategories.join(', ') || 'Varios';
    const embroidery = quote.needsEmbroidery ? 'SÍ (Bordado / Estampado con logo)' : 'No requerido';

    const message = `*SOLICITUD DE COTIZACIÓN PARA EMPRESA - TIENDA EL MAGO*\n\n*Empresa:* ${quote.companyName}\n*CUIT:* ${quote.cuit || 'A informar'}\n*Contacto:* ${quote.contactName}\n*Teléfono:* ${quote.phone}\n*Email:* ${quote.email}\n*Cantidad de operarios/trabajadores:* ${quote.workersCount}\n*Rubros requeridos:* ${categoriesList}\n*Personalización:* ${embroidery}\n\n*Detalle del requerimiento:*\n${quote.requirements}\n\nSolicitamos lista de precios mayorista y condiciones de facturación A. Gracias.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Product Admin Actions
  const addProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating' | 'reviewsCount'>
  ) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, isActive: !prod.isActive } : prod))
    );
  };

  const toggleProductOffer = (id: string, discountPercent: number = 20) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const willBeOffer = !prod.isOffer;
          const origPrice = prod.originalPrice || Math.round(prod.price * 1.25);
          const newPrice = willBeOffer
            ? Math.round(origPrice * (1 - discountPercent / 100))
            : origPrice;
          return {
            ...prod,
            isOffer: willBeOffer,
            originalPrice: willBeOffer ? origPrice : undefined,
            price: newPrice,
            discountPercent: willBeOffer ? discountPercent : 0,
          };
        }
        return prod;
      })
    );
  };

  const toggleProductFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, isFeatured: !prod.isFeatured } : prod))
    );
  };

  // Offers Admin
  const updateOffers = (updates: Partial<Offer>) => {
    setOffers((prev) => ({ ...prev, ...updates }));
  };

  // Categories Admin
  const addCategory = (catData: Omit<Category, 'id' | 'itemCount'>) => {
    const newCat: Category = {
      ...catData,
      id: catData.slug || `cat-${Date.now()}`,
      itemCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // Orders Admin
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `TEM-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Settings Admin
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOffers(INITIAL_OFFERS);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        offers,
        orders,
        settings,
        cart,
        activeView,
        setActiveView,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isB2BModalOpen,
        setIsB2BModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        getWhatsAppProductUrl,
        getWhatsAppCartUrl,
        getWhatsAppB2BUrl,
        getGeneralWhatsAppUrl,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        toggleProductOffer,
        toggleProductFeatured,
        updateOffers,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        createOrder,
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
