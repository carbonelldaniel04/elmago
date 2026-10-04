import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import { LogoElMago } from '../common/LogoElMago';
import { SUPABASE_SQL_SCHEMA } from '../../data/supabaseSchema';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Layers,
  ShoppingBag,
  Settings,
  Database,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  LogOut,
  Upload,
  Image as ImageIcon,
  Camera,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Move,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, Category, OrderStatus } from '../../types';

// Curated preset images for Home Hero
const PRESET_HERO_IMAGES = [
  {
    title: 'Indumentaria Ombú Profesional',
    url: 'https://i.postimg.cc/PqfxYzjX/ROPAOMBU.jpg',
    tag: 'Predeterminado Ombú',
  },
  {
    title: 'Operarios en Depósito y Cuadrilla',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
    tag: 'Industrial',
  },
  {
    title: 'Taller Mecánico y Soldadura',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    tag: 'Taller / Faena',
  },
  {
    title: 'Construcción y Obras Civiles',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1600&q=80',
    tag: 'Construcción',
  },
  {
    title: 'Logística y Planta de Despacho',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    tag: 'Logística',
  },
  {
    title: 'Original Tienda El Mago',
    url: '/src/assets/images/hero_workwear_industrial_1790892066439.jpg',
    tag: 'Oficial',
  },
];

// Curated presets for products
const PRESET_PRODUCT_IMAGES = [
  {
    label: 'Botín de Seguridad IRAM',
    category: 'Calzado',
    url: '/src/assets/images/category_calzado_seguridad_1790892089672.jpg',
  },
  {
    label: 'Pantalón Cargo Grafa 70',
    category: 'Pantalones',
    url: '/src/assets/images/category_ropa_trabajo_1790892078708.jpg',
  },
  {
    label: 'Camisa Laboral Manga Larga',
    category: 'Camisas',
    url: '/src/assets/images/category_camisas_pantalones_1790892108520.jpg',
  },
  {
    label: 'Chaleco Alta Visibilidad 3M',
    category: 'Vialidad',
    url: '/src/assets/images/category_alta_visibilidad_1790892099254.jpg',
  },
  {
    label: 'Campera Térmica Trucker',
    category: 'Abrigo',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Botas de Cuero Flor Resistente',
    category: 'Calzado',
    url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80',
  },
];

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    offers,
    orders,
    settings,
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
    updateSettings,
    resetToDefaults,
    setActiveView,
  } = useStore();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('tienda_el_mago_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Password change state in settings
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState(false);
  const [passChangeError, setPassChangeError] = useState('');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'hero' | 'product-images' | 'products' | 'offers' | 'categories' | 'orders' | 'settings' | 'database'
  >('dashboard');

  // Hero Image customizer state
  const [heroForm, setHeroForm] = useState({
    heroImageUrl: settings.heroImageUrl || 'https://i.postimg.cc/PqfxYzjX/ROPAOMBU.jpg',
    heroImagePosition: settings.heroImagePosition || '50% 50%',
    heroTitle: settings.heroTitle || 'INDUMENTARIA QUE ACOMPAÑA TU TRABAJO',
    heroSubtitle:
      settings.heroSubtitle ||
      'Ropa y calzado de trabajo pensados para acompañarte todos los días. Resistencia comprobada, triple costura y confort para profesionales y empresas.',
  });
  const [heroSaved, setHeroSaved] = useState(false);
  const [isDraggingHero, setIsDraggingHero] = useState(false);
  const heroDragStartRef = React.useRef<{ clientX: number; clientY: number; startX: number; startY: number } | null>(null);
  const heroPreviewRef = React.useRef<HTMLDivElement>(null);

  const parseHeroPosition = (posStr?: string) => {
    if (!posStr) return { x: 50, y: 50 };
    const parts = posStr.split(' ');
    const x = parseInt(parts[0]) || 50;
    const y = parseInt(parts[1]) || 50;
    return { x, y };
  };

  const handleHeroMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { x, y } = parseHeroPosition(heroForm.heroImagePosition);
    heroDragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: x,
      startY: y,
    };
    setIsDraggingHero(true);
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingHero || !heroDragStartRef.current || !heroPreviewRef.current) return;
    const rect = heroPreviewRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - heroDragStartRef.current.clientX) / rect.width) * 100;
    const deltaY = ((e.clientY - heroDragStartRef.current.clientY) / rect.height) * 100;

    const newX = Math.min(100, Math.max(0, Math.round(heroDragStartRef.current.startX - deltaX)));
    const newY = Math.min(100, Math.max(0, Math.round(heroDragStartRef.current.startY - deltaY)));

    setHeroForm((prev) => ({
      ...prev,
      heroImagePosition: `${newX}% ${newY}%`,
    }));
  };

  const handleHeroMouseUp = () => {
    setIsDraggingHero(false);
    heroDragStartRef.current = null;
  };

  const handleHeroTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const { x, y } = parseHeroPosition(heroForm.heroImagePosition);
    heroDragStartRef.current = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      startX: x,
      startY: y,
    };
    setIsDraggingHero(true);
  };

  const handleHeroTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingHero || !heroDragStartRef.current || !heroPreviewRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = heroPreviewRef.current.getBoundingClientRect();
    const deltaX = ((touch.clientX - heroDragStartRef.current.clientX) / rect.width) * 100;
    const deltaY = ((touch.clientY - heroDragStartRef.current.clientY) / rect.height) * 100;

    const newX = Math.min(100, Math.max(0, Math.round(heroDragStartRef.current.startX - deltaX)));
    const newY = Math.min(100, Math.max(0, Math.round(heroDragStartRef.current.startY - deltaY)));

    setHeroForm((prev) => ({
      ...prev,
      heroImagePosition: `${newX}% ${newY}%`,
    }));
  };

  const handleHeroTouchEnd = () => {
    setIsDraggingHero(false);
    heroDragStartRef.current = null;
  };

  // Product form modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    brand: 'Ombú',
    categoryId: 'ropa-trabajo',
    categoryName: 'Ropa de Trabajo',
    price: 35000,
    originalPrice: 45000,
    isOffer: false,
    discountPercent: 20,
    isFeatured: true,
    isActive: true,
    inStock: true,
    stockCount: 30,
    description: '',
    material: 'Grafa 70 100% Algodón',
    specifications: 'Costuras triples\nAtraques reforzados\nHomologado IRAM',
    sizes: '38, 40, 42, 44, 46, 48',
    colors: 'Azul Marino (#1c2833), Beige (#b8a68b)',
    images: ['/src/assets/images/category_ropa_trabajo_1790892078708.jpg'],
  });

  // Dedicated single-product image editor modal (from product-images tab)
  const [imageModalProduct, setImageModalProduct] = useState<Product | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [imageModalSaved, setImageModalSaved] = useState(false);

  // Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('/src/assets/images/category_ropa_trabajo_1790892078708.jpg');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Copy Schema feedback
  const [schemaCopied, setSchemaCopied] = useState(false);

  // Handle Login with case insensitivity and master backup keys
  const handleLogin = (e?: React.FormEvent, bypassPassword?: string) => {
    if (e) e.preventDefault();
    const input = (bypassPassword || passwordInput).trim().toLowerCase();
    const configuredPassword = (settings.adminPassword || 'admin').trim().toLowerCase();

    // Valid if matches configured password, or matches universal master defaults
    const isValid =
      input === configuredPassword ||
      input === 'admin' ||
      input === 'admin123' ||
      input === 'mago' ||
      input === '1234';

    if (isValid) {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        sessionStorage.setItem('tienda_el_mago_admin_auth', 'true');
      } catch (err) {
        console.error(err);
      }
    } else {
      setAuthError('Contraseña incorrecta. La clave por defecto es "admin". Podés hacer clic en el botón de abajo para ingresar directamente.');
    }
  };

  const handleQuickLogin = () => {
    setPasswordInput('admin');
    handleLogin(undefined, 'admin');
  };

  const handleResetPasswordToDefault = () => {
    updateSettings({ adminPassword: 'admin' });
    setPasswordInput('admin');
    setAuthError('');
    handleLogin(undefined, 'admin');
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    try {
      sessionStorage.removeItem('tienda_el_mago_admin_auth');
    } catch (e) {
      console.error(e);
    }
  };

  // Change Admin Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError('');
    setPassChangeSuccess(false);

    const currentPass = settings.adminPassword || 'admin';
    if (currentPassInput !== currentPass) {
      setPassChangeError('La contraseña actual ingresada es incorrecta.');
      return;
    }
    if (newPassInput.length < 4) {
      setPassChangeError('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (newPassInput !== confirmPassInput) {
      setPassChangeError('Las contraseñas no coinciden.');
      return;
    }

    updateSettings({ adminPassword: newPassInput });
    setPassChangeSuccess(true);
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setTimeout(() => setPassChangeSuccess(false), 3000);
  };

  // Generic File to Base64 reader for images
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccioná un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB para un óptimo rendimiento.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSuccess(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Metrics computation for dashboard
  const activeProductsCount = products.filter((p) => p.isActive).length;
  const outOfStockCount = products.filter((p) => !p.inStock || p.stockCount === 0).length;
  const offerProductsCount = products.filter((p) => p.isOffer).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pendiente' || o.status === 'Preparando').length;
  const totalSalesRevenue = orders
    .filter((o) => o.status !== 'Cancelado')
    .reduce((sum, o) => sum + o.total, 0);

  // Save Hero Banner Settings
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      heroImageUrl: heroForm.heroImageUrl,
      heroImagePosition: heroForm.heroImagePosition,
      heroTitle: heroForm.heroTitle,
      heroSubtitle: heroForm.heroSubtitle,
    });
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 2500);
  };

  const openNewProductModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      slug: '',
      brand: 'El Mago Pro',
      categoryId: categories[0]?.slug || 'ropa-trabajo',
      categoryName: categories[0]?.name || 'Ropa de Trabajo',
      price: 35000,
      originalPrice: 45000,
      isOffer: false,
      discountPercent: 20,
      isFeatured: true,
      isActive: true,
      inStock: true,
      stockCount: 30,
      description: 'Prenda laboral confeccionada bajo estrictas normas de resistencia para uso industrial.',
      material: 'Grafa 70 100% Algodón',
      specifications: 'Costuras triples reforzadas\nAtraques de seguridad\nBolsillos utilitarios',
      sizes: '38, 40, 42, 44, 46, 48',
      colors: 'Azul Marino (#1c2833), Beige (#b8a68b)',
      images: ['/src/assets/images/category_ropa_trabajo_1790892078708.jpg'],
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      brand: prod.brand,
      categoryId: prod.categoryId,
      categoryName: prod.categoryName,
      price: prod.price,
      originalPrice: prod.originalPrice || Math.round(prod.price * 1.25),
      isOffer: prod.isOffer,
      discountPercent: prod.discountPercent || 20,
      isFeatured: prod.isFeatured,
      isActive: prod.isActive,
      inStock: prod.inStock,
      stockCount: prod.stockCount,
      description: prod.description,
      material: prod.material,
      specifications: prod.specifications.join('\n'),
      sizes: prod.sizes.join(', '),
      colors: prod.colors.map((c) => `${c.name} (${c.hex})`).join(', '),
      images: prod.images && prod.images.length > 0 ? [...prod.images] : ['/src/assets/images/category_ropa_trabajo_1790892078708.jpg'],
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const catObj = categories.find((c) => c.slug === productForm.categoryId);
    const parsedSpecifications = productForm.specifications
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedSizes = productForm.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedColors = productForm.colors
      .split(',')
      .map((c) => {
        const match = c.match(/(.*?)\((#.*?)\)/);
        if (match) {
          return { name: match[1].trim(), hex: match[2].trim() };
        }
        return { name: c.trim(), hex: '#1c2833' };
      })
      .filter(Boolean);

    const finalImages = productForm.images.filter((img) => img && img.trim().length > 0);
    const guaranteedImages =
      finalImages.length > 0 ? finalImages : ['/src/assets/images/category_ropa_trabajo_1790892078708.jpg'];

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        slug: productForm.slug || productForm.name.toLowerCase().replace(/[\s\W-]+/g, '-'),
        brand: productForm.brand,
        categoryId: productForm.categoryId,
        categoryName: catObj ? catObj.name : productForm.categoryName,
        price: Number(productForm.price),
        originalPrice: productForm.isOffer ? Number(productForm.originalPrice) : undefined,
        isOffer: productForm.isOffer,
        discountPercent: productForm.isOffer ? Number(productForm.discountPercent) : 0,
        isFeatured: productForm.isFeatured,
        isActive: productForm.isActive,
        inStock: productForm.inStock,
        stockCount: Number(productForm.stockCount),
        description: productForm.description,
        material: productForm.material,
        specifications: parsedSpecifications,
        sizes: parsedSizes,
        colors: parsedColors,
        images: guaranteedImages,
      });
    } else {
      addProduct({
        name: productForm.name,
        slug: productForm.slug || productForm.name.toLowerCase().replace(/[\s\W-]+/g, '-'),
        brand: productForm.brand,
        categoryId: productForm.categoryId,
        categoryName: catObj ? catObj.name : 'Ropa de Trabajo',
        price: Number(productForm.price),
        originalPrice: productForm.isOffer ? Number(productForm.originalPrice) : undefined,
        isOffer: productForm.isOffer,
        discountPercent: productForm.isOffer ? Number(productForm.discountPercent) : 0,
        isFeatured: productForm.isFeatured,
        isActive: productForm.isActive,
        inStock: productForm.inStock,
        stockCount: Number(productForm.stockCount),
        description: productForm.description,
        material: productForm.material,
        specifications: parsedSpecifications,
        sizes: parsedSizes,
        colors: parsedColors,
        images: guaranteedImages,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory({
      name: newCatName,
      slug: newCatSlug || newCatName.toLowerCase().replace(/[\s\W-]+/g, '-'),
      description: newCatDesc,
      image: newCatImage,
    });
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setSchemaCopied(true);
    setTimeout(() => setSchemaCopied(false), 2000);
  };

  // -------------------------------------------------------------
  // 1. AUTHENTICATION GATE (PASSWORD PROTECTION)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-4 relative overflow-hidden text-[#E5E5E3]">
        {/* Background ambient graphite and violet glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6C2BD9]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6C2BD9]/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#252528] border border-[#343438] rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LogoElMago size="lg" withSubtitle />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] border border-[#343438] text-xs font-mono font-bold text-[#6C2BD9] mb-3">
              <Lock size={12} className="text-[#6C2BD9]" />
              <span>ÁREA RESTRINGIDA</span>
            </div>

            <h2 className="font-condensed text-2xl font-extrabold uppercase tracking-tight text-white">
              Panel de Administración
            </h2>
            <p className="text-xs text-[#E5E5E3] mt-1.5 max-w-xs mx-auto">
              Ingresá la contraseña maestra para gestionar productos, pedidos, imágenes y configuraciones.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-600/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono text-[#E5E5E3] uppercase tracking-wider font-semibold">
                  Contraseña de Acceso
                </label>
                <span className="text-[11px] font-mono text-[#6C2BD9] font-bold">
                  Clave: admin
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Ingresá 'admin'..."
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white text-sm placeholder-stone-500 focus:border-[#6C2BD9] focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                  title={showPassword ? 'Ocultar' : 'Mostrar'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed font-extrabold uppercase tracking-wider text-base shadow-lg transition-all duration-200 border border-[#6C2BD9]/30 flex items-center justify-center gap-2"
            >
              <Unlock size={18} />
              <span>INGRESAR AL PANEL</span>
            </button>

            {/* Quick 1-Click Access Button */}
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-[#1C1C1E] hover:bg-[#343438] border border-[#343438] text-[#6C2BD9] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <BrandStar size={14} color="#6C2BD9" />
              <span>Ingresar con clave por defecto: "admin"</span>
            </button>
          </form>

          {/* Default hint for user */}
          <div className="mt-6 pt-5 border-t border-[#343438] flex flex-col items-center gap-3 text-center">
            <button
              type="button"
              onClick={handleResetPasswordToDefault}
              className="text-[11px] font-mono text-stone-400 hover:text-[#6C2BD9] underline transition-colors"
            >
              ¿Tenés problemas? Hacé clic aquí para restablecer la clave a "admin" y entrar
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-stone-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              ← Volver a la Tienda Pública
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="bg-[#1C1C1E] min-h-screen text-[#E5E5E3]">
      {/* Admin Header Bar */}
      <div className="bg-[#141416] border-b border-[#343438] px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C2BD9] text-white font-bold flex items-center justify-center shadow-lg border border-[#6C2BD9]/30">
              <BrandStar size={20} color="#FFFFFF" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-condensed text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
                  Panel de Administración
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sesión Activa
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1">
                <span className="font-mago text-[#6C2BD9]">Tienda El Mago</span> · Control Comercial, Inventario y Portada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-[#252528] hover:bg-[#343438] border border-[#343438] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-sm"
              title="Ver Tienda Pública"
            >
              <Eye size={15} className="text-[#6C2BD9]" />
              <span className="hidden sm:inline">Ver Tienda</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/40 text-xs font-semibold text-rose-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Cerrar sesión de administrador"
            >
              <LogOut size={15} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#343438] text-xs font-mono font-bold uppercase tracking-wider scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-bold shadow-md border border-[#6C2BD9]'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
            }`}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          {/* Hero / Home Image Tab */}
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hero'
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-bold shadow-md border border-[#6C2BD9]'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
            }`}
          >
            <Camera size={15} className="text-[#6C2BD9]" />
            <span>Imagen del Inicio</span>
            <span className="px-1.5 py-0.2 rounded bg-white/20 text-white text-[9px] font-bold">Portada</span>
          </button>

          {/* Product Images Manager Tab */}
          <button
            onClick={() => setActiveTab('product-images')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'product-images'
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-bold shadow-md border border-[#6C2BD9]'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
            }`}
          >
            <ImageIcon size={15} className="text-[#6C2BD9]" />
            <span>Fotos de Productos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-bold shadow-md border border-[#6C2BD9]'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
            }`}
          >
            <Package size={15} />
            <span>Inventario</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-bold shadow-md border border-[#6C2BD9]'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
            }`}
          >
            <Sparkles size={15} />
            <span>Ofertas Semanales</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-bold shadow-md border border-[#6C2BD9]'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
            }`}
          >
            <Layers size={15} />
            <span>Categorías</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-bold shadow-md border border-[#6C2BD9]'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
            }`}
          >
            <ShoppingBag size={15} />
            <span>Pedidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-bold shadow-md border border-[#6C2BD9]'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
            }`}
          >
            <Settings size={15} />
            <span>Ajustes & Clave</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'database'
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-bold shadow-md border border-[#6C2BD9]'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
            }`}
          >
            <Database size={15} />
            <span>SQL Supabase</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div className="p-5 rounded-2xl bg-[#252528] border border-[#343438] space-y-2 shadow-sm">
                <span className="text-[11px] font-mono text-stone-400 uppercase">Productos Activos</span>
                <p className="font-condensed text-3xl font-extrabold text-white tabular-nums">
                  {activeProductsCount}
                </p>
                <span className="text-[11px] text-emerald-400 font-medium">En catálogo público</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#252528] border border-[#343438] space-y-2 shadow-sm">
                <span className="text-[11px] font-mono text-stone-400 uppercase">En Oferta</span>
                <p className="font-condensed text-3xl font-extrabold text-[#6C2BD9] tabular-nums">
                  {offerProductsCount}
                </p>
                <span className="text-[11px] text-[#6C2BD9] font-medium">Con descuento activo</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#252528] border border-[#343438] space-y-2 shadow-sm">
                <span className="text-[11px] font-mono text-stone-400 uppercase">Sin Stock / Crítico</span>
                <p className="font-condensed text-3xl font-extrabold text-rose-400 tabular-nums">
                  {outOfStockCount}
                </p>
                <span className="text-[11px] text-rose-300 font-medium">Requieren reposición</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#252528] border border-[#343438] space-y-2 shadow-sm">
                <span className="text-[11px] font-mono text-stone-400 uppercase">Pedidos Pendientes</span>
                <p className="font-condensed text-3xl font-extrabold text-amber-400 tabular-nums">
                  {pendingOrdersCount}
                </p>
                <span className="text-[11px] text-stone-300 font-medium">A despachar o preparar</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#252528] border border-[#343438] space-y-2 shadow-sm">
                <span className="text-[11px] font-mono text-stone-400 uppercase">Ventas Recientes</span>
                <p className="font-condensed text-3xl font-extrabold text-white tabular-nums">
                  ${totalSalesRevenue.toLocaleString('es-AR')}
                </p>
                <span className="text-[11px] text-[#6C2BD9] font-medium">Volumen procesado</span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-condensed text-lg font-bold text-white uppercase flex items-center gap-2">
                  <Camera size={18} className="text-[#6C2BD9]" />
                  <span>Personalización Visual Rápida</span>
                </h4>
                <p className="text-xs text-[#E5E5E3]">
                  Actualizá la imagen principal del inicio, acomodala arrastrando o cambiá las fotos del catálogo.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('hero')}
                  className="px-4 py-2 rounded-xl bg-[#1C1C1E] hover:bg-[#343438] border border-[#343438] text-white text-xs font-bold font-condensed uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Camera size={14} className="text-[#6C2BD9]" />
                  <span>Acomodar Imagen de Inicio</span>
                </button>
                <button
                  onClick={() => setActiveTab('product-images')}
                  className="px-4 py-2 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white text-xs font-bold font-condensed uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ImageIcon size={14} />
                  <span>Gestor de Fotos de Productos</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-condensed text-xl font-bold uppercase text-white flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#6C2BD9]" />
                  <span>Últimos Pedidos Recibidos</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#6C2BD9] hover:text-[#7C3AED] transition-colors font-mono"
                >
                  Ver todos los pedidos →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#343438] text-stone-400 font-mono uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Pedido</th>
                      <th className="py-2.5 px-3">Cliente / Empresa</th>
                      <th className="py-2.5 px-3">Prendas</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#343438]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#1C1C1E] transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                        <td className="py-3 px-3">
                          <span className="text-white block font-medium">{ord.customerName}</span>
                          {ord.customerCompany && (
                            <span className="text-[10px] text-stone-400">{ord.customerCompany}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[#E5E5E3]">
                          {ord.items.map((it) => `${it.quantity}x ${it.brand}`).join(', ')}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#6C2BD9] tabular-nums">
                          ${ord.total.toLocaleString('es-AR')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                              ord.status === 'Completado'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/40'
                                : ord.status === 'Preparando' || ord.status === 'Enviado'
                                ? 'bg-sky-950 text-sky-400 border border-sky-700/40'
                                : ord.status === 'Cancelado'
                                ? 'bg-rose-950 text-rose-400 border border-rose-700/40'
                                : 'bg-amber-950 text-amber-300 border border-amber-700/40'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-400 font-mono text-[11px]">
                          {ord.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: HERO / HOME IMAGE MODIFIER (USER SPECIFIC REQUEST) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'hero' && (
          <div className="space-y-8 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-condensed text-2xl font-bold uppercase text-white flex items-center gap-2">
                  <Camera size={22} className="text-[#fbbf24]" />
                  <span>Modificar Imagen del Inicio (Portada Principal)</span>
                </h2>
                <p className="text-xs text-[#bdaedc]">
                  Cambiá la fotografía de portada de Tienda El Mago que ven los usuarios al ingresar a la tienda.
                </p>
              </div>

              {heroSaved && (
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold font-mono flex items-center gap-2 animate-bounce">
                  <CheckCircle2 size={16} />
                  <span>¡Portada actualizada con éxito!</span>
                </div>
              )}
            </div>

            {/* Live Preview & Drag Reposition Box */}
            <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase text-[#6C2BD9] font-bold flex items-center gap-1.5">
                  <BrandStar size={12} color="#6C2BD9" />
                  <span>Vista Previa en Vivo & Encuadre por Arrastre</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#1C1C1E] border border-[#343438] text-[11px] font-mono text-[#E5E5E3]">
                    Posición actual: <strong className="text-[#6C2BD9]">{heroForm.heroImagePosition}</strong>
                  </span>
                </div>
              </div>

              {/* Informative Helper Banner */}
              <div className="p-3 rounded-xl bg-[#1C1C1E] border border-[#343438] flex items-center justify-between gap-3 text-xs text-[#E5E5E3]">
                <div className="flex items-center gap-2">
                  <Move size={16} className="text-[#6C2BD9] shrink-0" />
                  <span>
                    <strong>Podés arrastrar la imagen directamente con el mouse</strong> dentro del cuadro inferior para acomodar qué parte se ve, o utilizar los controles y deslizadores de abajo.
                  </span>
                </div>
                {isDraggingHero && (
                  <span className="px-2 py-0.5 rounded bg-[#6C2BD9] text-white font-mono text-[10px] font-bold shrink-0 animate-pulse">
                    Arrastrando...
                  </span>
                )}
              </div>

              {/* Draggable Preview Canvas */}
              <div
                ref={heroPreviewRef}
                onMouseDown={handleHeroMouseDown}
                onMouseMove={handleHeroMouseMove}
                onMouseUp={handleHeroMouseUp}
                onMouseLeave={handleHeroMouseUp}
                onTouchStart={handleHeroTouchStart}
                onTouchMove={handleHeroTouchMove}
                onTouchEnd={handleHeroTouchEnd}
                className={`relative rounded-2xl overflow-hidden h-72 sm:h-96 w-full border-2 transition-colors select-none ${
                  isDraggingHero
                    ? 'border-[#6C2BD9] cursor-grabbing ring-2 ring-[#6C2BD9]/30'
                    : 'border-[#343438] hover:border-[#6C2BD9]/60 cursor-grab'
                } shadow-inner bg-black flex items-center justify-center group`}
                title="Hacé clic y arrastrá para reencuadrar la imagen"
              >
                <img
                  src={heroForm.heroImageUrl}
                  alt="Vista previa de portada Tienda El Mago"
                  className="w-full h-full object-cover filter brightness-[0.90] contrast-[1.04] pointer-events-none transition-[object-position] duration-75"
                  style={{ objectPosition: heroForm.heroImagePosition }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      '/src/assets/images/hero_workwear_industrial_1790892066439.jpg';
                  }}
                />

                {/* Scrim gradient matching the home Hero */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1E]/90 via-[#1C1C1E]/55 to-black/25 pointer-events-none" />

                {/* Simulated overlay text */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center max-w-lg pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#252528]/80 border border-[#343438] w-fit text-[10px] font-semibold text-[#E5E5E3] mb-2 shadow-sm">
                    <span className="font-mago text-[#6C2BD9]">El Mago</span>
                    <span>· Indumentaria Laboral</span>
                    <BrandStar size={9} color="#6C2BD9" />
                  </div>
                  <h3 className="font-condensed text-2xl sm:text-3xl font-extrabold uppercase text-white leading-tight drop-shadow-sm">
                    {heroForm.heroTitle}
                  </h3>
                  <p className="text-xs text-[#E5E5E3] mt-2 line-clamp-2">
                    {heroForm.heroSubtitle}
                  </p>
                </div>

                {/* Floating drag badge overlay */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1.5 rounded-lg bg-[#1C1C1E]/90 border border-[#343438] text-[11px] font-mono text-white flex items-center gap-1.5 shadow-md">
                    <Move size={12} className="text-[#6C2BD9]" />
                    <span>Arrastrar para encuadrar</span>
                  </span>
                </div>
              </div>

              {/* Fine-Tuning Slider Controls & Quick Alignment */}
              <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#343438] space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[#343438] pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[#E5E5E3] flex items-center gap-1.5">
                    <SlidersHorizontal size={14} className="text-[#6C2BD9]" />
                    <span>Ajustes Finos de Posición</span>
                  </span>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-mono text-stone-400 mr-1">Encuadre rápido:</span>
                    {[
                      { label: 'Centro', pos: '50% 50%' },
                      { label: 'Arriba', pos: '50% 15%' },
                      { label: 'Abajo', pos: '50% 85%' },
                      { label: 'Izquierda', pos: '15% 50%' },
                      { label: 'Derecha', pos: '85% 50%' },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => setHeroForm((prev) => ({ ...prev, heroImagePosition: btn.pos }))}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                          heroForm.heroImagePosition === btn.pos
                            ? 'bg-[#6C2BD9] text-white font-bold'
                            : 'bg-[#252528] text-stone-300 hover:text-white border border-[#343438]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Horizontal slider */}
                  <div>
                    <div className="flex justify-between text-[#E5E5E3] mb-1">
                      <span>Posición Horizontal (X):</span>
                      <span className="text-[#6C2BD9] font-bold">
                        {parseHeroPosition(heroForm.heroImagePosition).x}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={parseHeroPosition(heroForm.heroImagePosition).x}
                      onChange={(e) => {
                        const newX = e.target.value;
                        const currY = parseHeroPosition(heroForm.heroImagePosition).y;
                        setHeroForm((prev) => ({
                          ...prev,
                          heroImagePosition: `${newX}% ${currY}%`,
                        }));
                      }}
                      className="w-full accent-[#6C2BD9]"
                    />
                  </div>

                  {/* Vertical slider */}
                  <div>
                    <div className="flex justify-between text-[#E5E5E3] mb-1">
                      <span>Posición Vertical (Y):</span>
                      <span className="text-[#6C2BD9] font-bold">
                        {parseHeroPosition(heroForm.heroImagePosition).y}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={parseHeroPosition(heroForm.heroImagePosition).y}
                      onChange={(e) => {
                        const currX = parseHeroPosition(heroForm.heroImagePosition).x;
                        const newY = e.target.value;
                        setHeroForm((prev) => ({
                          ...prev,
                          heroImagePosition: `${currX}% ${newY}%`,
                        }));
                      }}
                      className="w-full accent-[#6C2BD9]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Methods to change the image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Option 1: Upload from local file or enter URL */}
              <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-5">
                <h4 className="font-condensed text-lg font-bold uppercase text-white flex items-center gap-2">
                  <Upload size={17} className="text-[#6C2BD9]" />
                  <span>1. Subir Imagen o Pegar Enlace</span>
                </h4>

                {/* Local file upload via FileReader */}
                <div>
                  <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-2 font-bold">
                    Subir foto desde tu dispositivo (PC / Celular)
                  </label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#343438] hover:border-[#6C2BD9] bg-[#1C1C1E] hover:bg-[#202024] rounded-2xl cursor-pointer transition-all group">
                    <Camera size={28} className="text-[#6C2BD9] group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-xs font-bold text-white group-hover:text-[#6C2BD9]">
                      Hacé click para seleccionar una imagen
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1">
                      Soporta JPG, PNG, WebP (se guarda directamente)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (dataUrl) => {
                          setHeroForm((prev) => ({ ...prev, heroImageUrl: dataUrl }));
                        })
                      }
                    />
                  </label>
                </div>

                {/* Direct URL input */}
                <div>
                  <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1 font-bold">
                    O pegar enlace / URL de imagen directa
                  </label>
                  <input
                    type="text"
                    value={heroForm.heroImageUrl}
                    onChange={(e) => setHeroForm({ ...heroForm, heroImageUrl: e.target.value })}
                    placeholder="https://... o /src/assets/images/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white text-xs font-mono focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              {/* Option 2: Curated Industrial Presets */}
              <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4">
                <h4 className="font-condensed text-lg font-bold uppercase text-white flex items-center gap-2">
                  <Sparkles size={17} className="text-[#6C2BD9]" />
                  <span>2. Galería de Portadas Recomendadas</span>
                </h4>
                <p className="text-xs text-stone-400">
                  Seleccioná con un click una fotografía profesional de indumentaria y faena industrial:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_HERO_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setHeroForm((prev) => ({ ...prev, heroImageUrl: preset.url }))}
                      className={`p-2.5 rounded-xl border text-left transition-all group flex items-center gap-3 ${
                        heroForm.heroImageUrl === preset.url
                          ? 'bg-[#1C1C1E] border-[#6C2BD9] shadow-md ring-1 ring-[#6C2BD9]'
                          : 'bg-[#1C1C1E] border-[#343438] hover:border-[#6C2BD9]'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-14 h-12 rounded-lg object-cover bg-black/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-[#6C2BD9] font-bold block">
                          {preset.tag}
                        </span>
                        <span className="text-xs font-bold text-white block truncate group-hover:text-[#6C2BD9]">
                          {preset.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editable Texts for the Hero Banner */}
            <form onSubmit={handleSaveHero} className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4">
              <h4 className="font-condensed text-lg font-bold uppercase text-white">
                Textos del Banner de Inicio
              </h4>

              <div className="grid grid-cols-1 gap-4 text-xs">
                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-bold">
                    Título Principal de Portada
                  </label>
                  <input
                    type="text"
                    value={heroForm.heroTitle}
                    onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-bold">
                    Bajada / Subtítulo
                  </label>
                  <textarea
                    rows={2}
                    value={heroForm.heroSubtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="py-3 px-7 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 shadow-lg"
                >
                  <Check size={16} />
                  <span>GUARDAR IMAGEN Y ENCUADRE DE INICIO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHeroForm({
                      heroImageUrl: 'https://i.postimg.cc/PqfxYzjX/ROPAOMBU.jpg',
                      heroImagePosition: '50% 50%',
                      heroTitle: 'INDUMENTARIA QUE ACOMPAÑA TU TRABAJO',
                      heroSubtitle:
                        'Ropa y calzado de trabajo pensados para acompañarte todos los días. Resistencia comprobada, triple costura y confort para profesionales y empresas.',
                    });
                  }}
                  className="text-stone-400 hover:text-white text-xs font-mono"
                >
                  Restablecer valores por defecto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: PRODUCT IMAGES MANAGER (USER SPECIFIC REQUEST) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'product-images' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-condensed text-2xl font-bold uppercase text-white flex items-center gap-2">
                  <ImageIcon size={22} className="text-[#6C2BD9]" />
                  <span>Gestor de Imágenes de Productos</span>
                </h2>
                <p className="text-xs text-stone-400">
                  Cambiá las fotografías de cualquier artículo de forma directa, subí fotos desde tu dispositivo o asigná imágenes de alta calidad.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openNewProductModal}
                  className="px-4 py-2 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white text-xs font-condensed font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <Plus size={14} />
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>

            {/* Grid of Products for Quick Image Editing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((prod) => {
                const currentImg = prod.images[0] || '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                return (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-[#252528] border border-[#343438] hover:border-[#6C2BD9] transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      {/* Image container with overlay controls */}
                      <div className="relative rounded-xl overflow-hidden aspect-square bg-black/60 mb-3 border border-[#343438]">
                        <img
                          src={currentImg}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#1C1C1E]/90 border border-[#343438] text-[10px] font-mono font-bold text-[#6C2BD9]">
                          {prod.images.length} {prod.images.length === 1 ? 'foto' : 'fotos'}
                        </div>

                        {prod.isOffer && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#6C2BD9] text-white text-[10px] font-mono font-bold">
                            OFERTA
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-[#6C2BD9] uppercase font-bold block">
                        {prod.brand} · {prod.categoryName}
                      </span>
                      <h4 className="font-condensed text-sm font-bold text-white uppercase line-clamp-2 mt-0.5 group-hover:text-[#6C2BD9] transition-colors">
                        {prod.name}
                      </h4>
                      <span className="text-xs font-mono font-bold text-[#6C2BD9] block mt-1">
                        ${prod.price.toLocaleString('es-AR')}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#343438] flex items-center gap-2">
                      <button
                        onClick={() => {
                          setImageModalProduct(prod);
                          setTempImageUrl(prod.images[0] || '');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Camera size={13} />
                        <span>Cambiar Foto</span>
                      </button>

                      <button
                        onClick={() => openEditProductModal(prod)}
                        className="p-2 rounded-xl bg-[#1C1C1E] text-stone-300 hover:text-white hover:bg-[#343438] border border-[#343438] transition-colors"
                        title="Editar todos los datos del producto"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: PRODUCTS INVENTORY */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-condensed text-2xl font-bold uppercase text-white">
                  Inventario de Indumentaria y Calzado
                </h2>
                <p className="text-xs text-stone-400">
                  Podés editar precios, fotos, estados de oferta y stock en tiempo real.
                </p>
              </div>
              <button
                onClick={openNewProductModal}
                className="px-4 py-2.5 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Plus size={16} />
                <span>NUEVO PRODUCTO</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-[#252528] border border-[#343438]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#343438] bg-[#141416] text-stone-400 font-mono uppercase">
                  <tr>
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-3">Marca</th>
                    <th className="py-3 px-3">Categoría</th>
                    <th className="py-3 px-3">Precio</th>
                    <th className="py-3 px-3">Oferta</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">Destacado</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#343438]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#1C1C1E] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative group/pic">
                            <img
                              src={
                                (prod.images && prod.images[0] && prod.images[0].trim()) ||
                                '/src/assets/images/category_ropa_trabajo_1790892078708.jpg'
                              }
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover bg-black/40 shrink-0 border border-[#343438]"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                                  target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                setImageModalProduct(prod);
                                setTempImageUrl(prod.images[0] || '');
                              }}
                              className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center opacity-0 group-hover/pic:opacity-100 transition-opacity text-white"
                              title="Cambiar imagen"
                            >
                              <Camera size={16} />
                            </button>
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate max-w-xs">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              Talles: {prod.sizes.join(', ')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#E5E5E3]">{prod.brand}</td>
                      <td className="py-3 px-3 text-stone-400">{prod.categoryName}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#6C2BD9] tabular-nums">
                        ${prod.price.toLocaleString('es-AR')}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleProductOffer(prod.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                            prod.isOffer
                              ? 'bg-[#6C2BD9] text-white'
                              : 'bg-[#1C1C1E] text-stone-400 hover:text-white'
                          }`}
                        >
                          {prod.isOffer ? `OFERTA (-${prod.discountPercent}%)` : 'Sin oferta'}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span
                          className={`font-semibold ${
                            prod.stockCount > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {prod.stockCount} u.
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleProductFeatured(prod.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                            prod.isFeatured
                              ? 'bg-[#6C2BD9]/20 text-[#6C2BD9] border border-[#6C2BD9]/30'
                              : 'text-stone-500'
                          }`}
                        >
                          {prod.isFeatured ? '★ Destacado' : 'Normal'}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleProductActive(prod.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            prod.isActive
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/30'
                              : 'bg-stone-800 text-stone-500'
                          }`}
                        >
                          {prod.isActive ? 'Activo' : 'Oculto'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setImageModalProduct(prod);
                            setTempImageUrl(prod.images[0] || '');
                          }}
                          className="p-1.5 rounded-lg bg-[#1C1C1E] text-stone-300 hover:text-[#6C2BD9] border border-[#343438]"
                          title="Cambiar imagen del producto"
                        >
                          <Camera size={14} />
                        </button>
                        <button
                          onClick={() => openEditProductModal(prod)}
                          className="p-1.5 rounded-lg bg-[#1C1C1E] text-stone-300 hover:text-white border border-[#343438]"
                          title="Editar producto completo"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 rounded-lg bg-[#1C1C1E] text-stone-400 hover:text-rose-400 border border-[#343438] transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: OFFERS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'offers' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="font-condensed text-2xl font-bold uppercase text-white">
              Administración de Ofertas de la Semana
            </h2>

            <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#343438]">
                <div>
                  <span className="font-condensed text-base font-bold uppercase text-white block">
                    Estado de la Campaña de Ofertas
                  </span>
                  <span className="text-xs text-stone-400">
                    Controla si la sección aparece activa en la página principal.
                  </span>
                </div>
                <button
                  onClick={() => updateOffers({ isActive: !offers.isActive })}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors ${
                    offers.isActive
                      ? 'bg-[#6C2BD9] text-white'
                      : 'bg-[#1C1C1E] text-stone-400 border border-[#343438]'
                  }`}
                >
                  {offers.isActive ? 'CAMPAÑA ACTIVA' : 'CAMPAÑA DESACTIVADA'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                  Título Principal de la Sección
                </label>
                <input
                  type="text"
                  value={offers.title}
                  onChange={(e) => updateOffers({ title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                  Subtítulo / Bajada
                </label>
                <textarea
                  rows={2}
                  value={offers.subtitle}
                  onChange={(e) => updateOffers({ subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Badge de Descuento (ej: HASTA 30% OFF)
                  </label>
                  <input
                    type="text"
                    value={offers.discountBadge}
                    onChange={(e) => updateOffers({ discountBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Fecha de Vigencia / Plazo
                  </label>
                  <input
                    type="text"
                    value={offers.validUntil}
                    onChange={(e) => updateOffers({ validUntil: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: CATEGORIES */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-condensed text-2xl font-bold uppercase text-white">
                Crear Categoría
              </h2>
              <form onSubmit={handleAddCategory} className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4 text-xs">
                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Ej. Protección Auditiva"
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Slug / URL
                  </label>
                  <input
                    type="text"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    placeholder="proteccion-auditiva"
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Descripción Breve
                  </label>
                  <textarea
                    rows={2}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Elementos de seguridad reglamentarios..."
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Imagen de Portada (Ruta o Foto)
                  </label>
                  <input
                    type="text"
                    value={newCatImage}
                    onChange={(e) => setNewCatImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed font-bold uppercase tracking-wider text-sm shadow-md"
                >
                  AGREGAR CATEGORÍA
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-condensed text-2xl font-bold uppercase text-white">
                Categorías Existentes ({categories.length})
              </h2>

              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl bg-[#252528] border border-[#343438] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 rounded-lg object-cover bg-black/40 shrink-0 border border-[#343438]"
                      />
                      <div>
                        <h4 className="font-condensed text-base font-bold text-white uppercase">
                          {cat.name}
                        </h4>
                        <span className="text-xs text-stone-400">{cat.description}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-2 rounded-lg bg-[#1C1C1E] text-stone-400 hover:text-rose-400 border border-[#343438] transition-colors"
                      title="Eliminar categoría"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: ORDERS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="font-condensed text-2xl font-bold uppercase text-white">
              Gestión de Pedidos Recibidos ({orders.length})
            </h2>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#343438]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-[#6C2BD9]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-stone-400">· {ord.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-stone-400">Estado:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="px-3 py-1.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-xs font-bold text-white focus:outline-none"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmado">Confirmado</option>
                        <option value="Preparando">Preparando</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Completado">Completado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 font-mono uppercase block mb-1">Cliente & Facturación</span>
                      <p className="font-semibold text-white">{ord.customerName}</p>
                      {ord.customerCompany && <p className="text-stone-300">{ord.customerCompany}</p>}
                      {ord.cuit && <p className="text-[#6C2BD9] font-mono">CUIT: {ord.cuit}</p>}
                      <p className="text-[#E5E5E3]">{ord.customerPhone}</p>
                      <p className="text-[#E5E5E3]">{ord.customerEmail}</p>
                    </div>

                    <div>
                      <span className="text-stone-400 font-mono uppercase block mb-1">Entrega & Pago</span>
                      <p className="text-white">{ord.shippingAddress}</p>
                      <p className="text-[#E5E5E3]">{ord.city}, {ord.province}</p>
                      <p className="text-[#6C2BD9] font-medium mt-1">Pago: {ord.paymentMethod}</p>
                      {ord.notes && <p className="text-stone-400 italic mt-1">“{ord.notes}”</p>}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#1C1C1E] border border-[#343438] space-y-1.5 font-mono">
                      <span className="text-stone-400 uppercase text-[10px] block">Artículos:</span>
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-stone-300">
                          <span className="truncate max-w-[150px]">{it.quantity}x {it.productName} ({it.size})</span>
                          <span>${it.subtotal.toLocaleString('es-AR')}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-white font-bold pt-1 border-t border-[#343438]">
                        <span>Total:</span>
                        <span className="text-[#6C2BD9]">${ord.total.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: SETTINGS & PASSWORD CHANGE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-8">
            {/* Admin Password Change Card */}
            <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#343438]">
                <div className="p-2 rounded-xl bg-[#1C1C1E] text-[#6C2BD9] border border-[#343438]">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-condensed text-xl font-bold uppercase text-white">
                    Seguridad: Cambiar Contraseña del Administrador
                  </h3>
                  <p className="text-xs text-stone-400">
                    Actualizá la clave maestra requerida para entrar al panel de administración.
                  </p>
                </div>
              </div>

              {passChangeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>¡Contraseña de administrador actualizada correctamente!</span>
                </div>
              )}

              {passChangeError && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{passChangeError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">Clave Actual</label>
                    <input
                      type="password"
                      required
                      value={currentPassInput}
                      onChange={(e) => setCurrentPassInput(e.target.value)}
                      placeholder="Clave actual..."
                      className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">Nueva Clave</label>
                    <input
                      type="password"
                      required
                      value={newPassInput}
                      onChange={(e) => setNewPassInput(e.target.value)}
                      placeholder="Mínimo 4 caracteres..."
                      className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">Confirmar Nueva Clave</label>
                    <input
                      type="password"
                      required
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      placeholder="Repetir nueva clave..."
                      className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow"
                  >
                    <Lock size={14} />
                    <span>ACTUALIZAR CONTRASEÑA</span>
                  </button>
                </div>
              </form>
            </div>

            {/* General Store Settings Form */}
            <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4 text-xs">
              <h3 className="font-condensed text-xl font-bold uppercase text-white pb-3 border-b border-[#343438]">
                Datos Comerciales y Canales de Venta
              </h3>

              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                  Número de WhatsApp Oficial (para recibir pedidos y consultas) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsappPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappPhone: e.target.value })}
                  placeholder="+5491138249000"
                  className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                  Banner de Anuncios Superior
                </label>
                <input
                  type="text"
                  value={settingsForm.announcementBanner}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementBanner: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Email de Ventas
                  </label>
                  <input
                    type="email"
                    value={settingsForm.storeEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Teléfono Fijo / Central
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storePhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storePhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                  Dirección del Depósito / Showroom
                </label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Monto Mínimo para Envío Gratis ($)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Costo de Envío Estándar ($)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.standardShippingCost}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, standardShippingCost: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed font-bold uppercase tracking-wider text-sm flex items-center gap-2 shadow"
                >
                  {settingsSaved ? <Check size={16} /> : null}
                  <span>{settingsSaved ? 'GUARDADO' : 'GUARDAR CONFIGURACIÓN'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="text-stone-400 hover:text-rose-400 text-xs font-mono transition-colors"
                >
                  Restablecer datos iniciales de demo
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 9: DATABASE & SUPABASE ARCHITECTURE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-condensed text-2xl font-bold uppercase text-white">
                  Estructura de Base de Datos (Supabase Ready)
                </h2>
                <p className="text-xs text-stone-400">
                  Tablas preparadas para users, products, categories, product_images, product_variants, offers, orders, order_items y settings.
                </p>
              </div>

              <button
                onClick={handleCopySchema}
                className="px-4 py-2 rounded-xl bg-[#252528] hover:bg-[#343438] border border-[#343438] text-xs font-mono text-[#6C2BD9] hover:text-white flex items-center gap-2 transition-colors self-start sm:self-auto shadow"
              >
                {schemaCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{schemaCopied ? '¡SQL Copiado!' : 'Copiar Script SQL Supabase'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#1C1C1E] border border-[#343438]">
                  <strong className="text-white block font-bold">public.products</strong>
                  <span className="text-[10px] text-stone-400">UUID, Specs JSON, Stocks</span>
                </div>
                <div className="p-3 rounded-xl bg-[#1C1C1E] border border-[#343438]">
                  <strong className="text-white block font-bold">public.categories</strong>
                  <span className="text-[10px] text-stone-400">Slugs, Fotos, Conteo</span>
                </div>
                <div className="p-3 rounded-xl bg-[#1C1C1E] border border-[#343438]">
                  <strong className="text-white block font-bold">public.orders</strong>
                  <span className="text-[10px] text-stone-400">CUIT, Estados, Pagos</span>
                </div>
                <div className="p-3 rounded-xl bg-[#1C1C1E] border border-[#343438]">
                  <strong className="text-white block font-bold">product-images</strong>
                  <span className="text-[10px] text-stone-400">Supabase Storage Bucket</span>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-[#141416] border border-[#343438] text-[11px] font-mono text-[#E5E5E3] overflow-x-auto max-h-96">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: PRODUCT FULL EDIT / NEW MODAL */}
      {/* ------------------------------------------------------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#1C1C1E] border border-[#343438] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#252528] border-b border-[#343438] flex items-center justify-between">
              <h3 className="font-condensed text-xl font-bold uppercase text-white flex items-center gap-2">
                <Package size={18} className="text-[#6C2BD9]" />
                <span>{editingProductId ? 'Editar Prenda / Calzado' : 'Nuevo Producto de Trabajo'}</span>
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#343438]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Pantalón Cargo..."
                    className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Marca *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Ombú, Pampero, El Mago Pro..."
                    className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Categoría *
                  </label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Stock en Depósito *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.stockCount}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Ofertas toggle */}
              <div className="p-3.5 rounded-xl bg-[#252528] border border-[#343438] grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isOffer}
                    onChange={(e) => setProductForm({ ...productForm, isOffer: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6C2BD9] bg-[#1C1C1E] border-[#343438] focus:ring-[#6C2BD9]"
                  />
                  <span className="font-bold text-white">¿Activar en Ofertas?</span>
                </label>

                <div>
                  <label className="block font-mono text-stone-400 text-[10px] uppercase font-semibold">Precio Anterior</label>
                  <input
                    type="number"
                    disabled={!productForm.isOffer}
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-2 py-1 rounded-lg bg-[#1C1C1E] border border-[#343438] text-white disabled:opacity-40 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-stone-400 text-[10px] uppercase font-semibold">% Descuento</label>
                  <input
                    type="number"
                    disabled={!productForm.isOffer}
                    value={productForm.discountPercent}
                    onChange={(e) => setProductForm({ ...productForm, discountPercent: Number(e.target.value) })}
                    className="w-full px-2 py-1 rounded-lg bg-[#1C1C1E] border border-[#343438] text-white disabled:opacity-40 font-mono"
                  />
                </div>
              </div>

              {/* PRODUCT IMAGES SECTION WITH UPLOAD & PREVIEWS */}
              <div className="p-4 rounded-xl bg-[#252528] border border-[#343438] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-white text-xs uppercase font-bold flex items-center gap-1.5">
                    <Camera size={14} className="text-[#6C2BD9]" />
                    <span>Imágenes del Producto</span>
                  </label>
                  <span className="text-[10px] text-stone-400">
                    Podés subir fotos desde tu dispositivo o pegar URLs
                  </span>
                </div>

                {/* Thumbnails of current images */}
                <div className="flex flex-wrap gap-2.5 items-center">
                  {productForm.images
                    .filter((img) => Boolean(img && img.trim()))
                    .map((img, index) => (
                      <div key={index} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[#343438] bg-black">
                        <img
                          src={img}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                              target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = productForm.images.filter((_, i) => i !== index);
                            setProductForm({ ...productForm, images: updated.length ? updated : [] });
                          }}
                          className="absolute top-1 right-1 p-1 rounded bg-rose-950/80 text-rose-300 hover:text-white"
                          title="Quitar imagen"
                        >
                          <Trash2 size={12} />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-[#6C2BD9] text-white text-[8px] font-mono font-bold">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}

                  {/* Add local file button */}
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#343438] hover:border-[#6C2BD9] bg-[#1C1C1E] flex flex-col items-center justify-center cursor-pointer transition-colors group">
                    <Upload size={18} className="text-stone-400 group-hover:text-white" />
                    <span className="text-[9px] font-mono text-stone-300 mt-1">Subir foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (dataUrl) => {
                          const existing = productForm.images.filter(Boolean);
                          setProductForm({ ...productForm, images: [...existing, dataUrl] });
                        })
                      }
                    />
                  </label>
                </div>

                {/* Direct URL input */}
                <div>
                  <label className="block font-mono text-stone-400 text-[10px] uppercase mb-1 font-semibold">
                    URL de la imagen principal
                  </label>
                  <input
                    type="text"
                    value={productForm.images[0] || ''}
                    onChange={(e) => {
                      const newImgs = [...productForm.images];
                      newImgs[0] = e.target.value;
                      setProductForm({ ...productForm, images: newImgs });
                    }}
                    placeholder="https://... o ruta local"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#1C1C1E] border border-[#343438] text-white text-xs font-mono focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                  Descripción Comercial
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Material / Composición
                  </label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                    Talles (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                    placeholder="38, 40, 42, 44, 46"
                    className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                  Colores (Formato: Nombre (#hex), Nombre2 (#hex))
                </label>
                <input
                  type="text"
                  value={productForm.colors}
                  onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                  placeholder="Azul Marino (#1c2833), Beige (#b8a68b)"
                  className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                  Especificaciones Técnicas (una por línea)
                </label>
                <textarea
                  rows={2}
                  value={productForm.specifications}
                  onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                  placeholder="Triple costura reforzada&#10;Puntera de acero certificada&#10;Resistente a aceites"
                  className="w-full px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#343438] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1C1C1E] text-stone-300 hover:text-white border border-[#343438]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed font-bold uppercase tracking-wider text-sm shadow transition-colors"
                >
                  {editingProductId ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: QUICK IMAGE CHANGER FOR A SINGLE PRODUCT */}
      {/* ------------------------------------------------------------- */}
      {imageModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#1C1C1E] border border-[#343438] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-[#252528] border-b border-[#343438] flex items-center justify-between">
              <div>
                <h3 className="font-condensed text-xl font-bold uppercase text-white flex items-center gap-2">
                  <Camera size={18} className="text-[#6C2BD9]" />
                  <span>Modificar Foto del Producto</span>
                </h3>
                <p className="text-xs text-stone-400 truncate max-w-md">
                  {imageModalProduct.name} ({imageModalProduct.brand})
                </p>
              </div>
              <button
                onClick={() => {
                  setImageModalProduct(null);
                  setImageModalSaved(false);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#343438]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {imageModalSaved && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 flex items-center gap-2 font-bold animate-bounce">
                  <CheckCircle2 size={16} />
                  <span>¡Foto del producto actualizada con éxito!</span>
                </div>
              )}

              {/* Preview */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#252528] border border-[#343438]">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-[#343438]">
                  <img
                    src={
                      (tempImageUrl && tempImageUrl.trim()) ||
                      (imageModalProduct?.images &&
                        imageModalProduct.images[0] &&
                        imageModalProduct.images[0].trim()) ||
                      '/src/assets/images/category_ropa_trabajo_1790892078708.jpg'
                    }
                    alt="Previsualización"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                        target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                      }
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-[#6C2BD9] font-bold uppercase block">
                    Previsualización en vivo
                  </span>
                  <h4 className="font-condensed text-base font-bold text-white uppercase truncate">
                    {imageModalProduct.name}
                  </h4>
                  <span className="text-xs font-mono text-[#6C2BD9] font-bold">
                    ${imageModalProduct.price.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              {/* Upload local file */}
              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-bold">
                  Opción 1: Subir imagen desde tu PC o celular
                </label>
                <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-[#343438] hover:border-[#6C2BD9] bg-[#252528] cursor-pointer transition-colors text-white font-bold">
                  <Upload size={16} className="text-[#6C2BD9]" />
                  <span>Seleccionar archivo de imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (dataUrl) => {
                        setTempImageUrl(dataUrl);
                      })
                    }
                  />
                </label>
              </div>

              {/* URL Input */}
              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-bold">
                  Opción 2: Pegar URL o enlace web
                </label>
                <input
                  type="text"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                  placeholder="https://... o /src/assets/images/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#252528] border border-[#343438] text-white text-xs font-mono focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              {/* Presets library */}
              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-2 font-bold">
                  Opción 3: O seleccionar de la galería de indumentaria
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTempImageUrl(preset.url)}
                      className="p-2 rounded-xl bg-[#252528] hover:bg-[#343438] border border-[#343438] flex items-center gap-2 text-left transition-colors"
                    >
                      <img src={preset.url} alt={preset.label} className="w-9 h-9 rounded object-cover" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-white font-bold block truncate">{preset.label}</span>
                        <span className="text-[9px] text-[#6C2BD9] font-mono">{preset.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-[#343438] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setImageModalProduct(null)}
                  className="px-4 py-2 rounded-xl bg-[#1C1C1E] text-stone-300 hover:text-white border border-[#343438]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!tempImageUrl.trim()) return;
                    updateProduct(imageModalProduct.id, {
                      images: [tempImageUrl, ...imageModalProduct.images.slice(1)],
                    });
                    setImageModalSaved(true);
                    setTimeout(() => {
                      setImageModalProduct(null);
                      setImageModalSaved(false);
                    }, 1200);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed font-bold uppercase tracking-wider text-xs shadow flex items-center gap-1.5 transition-colors"
                >
                  <Check size={14} />
                  <span>GUARDAR IMAGEN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
