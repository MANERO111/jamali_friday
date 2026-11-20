'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, Heart, ArrowRight, Tag, Percent, Check } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { useCart } from '@/contexts/CartContext';
import { getProductImageUrl } from '@/utils/imageHelper';
import ProductModal from '@/components/products/ProductModal';
import { Product as GlobalProduct } from '@/hooks/useProducts';
import { useWishlist } from '@/hooks/useWishlist';

interface Product {
  id: number;
  name: string;
  brand: string;
  slug: string;
  description: string;
  original_price: number;
  discounted_price?: number | null;
  stock_quantity: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  category_id: number;
  subcategory_id: number | null;
  sub_subcategory_id: number | null;
}

const SCROLL_AMOUNT = 300;

// Default mock products for discounts up to 50%
const MOCK_DISCOUNTED_PRODUCTS: Product[] = [
  {
    id: 901,
    name: "BELLA AURORA CC CREME TEINTE ANTI TACHES MEDIUM SPF50+ 30ML",
    brand: "BELLA AURORA",
    slug: "bella-aurora-cc-creme-teinte-anti-taches-medium-spf50",
    description: "Soin illuminateur anti-taches avec protection solaire élevée.",
    original_price: 200.00,
    discounted_price: 100.00, // 50% discount
    stock_quantity: 15,
    image_url: "img/products/8413400020424-300x297.png",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 1,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 902,
    name: "RADICO ORGANIC HAIR COLOUR 100G",
    brand: "RADICO",
    slug: "radico-organic-hair-colour",
    description: "Coloration soin 100% bio et naturelle pour des cheveux éclatants.",
    original_price: 180.00,
    discounted_price: 90.00, // 50% discount
    stock_quantity: 12,
    image_url: "img/products/8902670020734-300x323.jpg.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 3,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 903,
    name: "LILI BABY BROSSE A CHEVEUX ERGONOMIQUE",
    brand: "LILI-BABY",
    slug: "lili-baby-brosse-a-cheveux-ergonomique",
    description: "Brosse démêlante ultra-douce pour cuir chevelu sensible.",
    original_price: 450.00,
    discounted_price: 270.00, // 40% discount
    stock_quantity: 8,
    image_url: "img/products/LILI-BABY-BROSSE-A-CHEVEUX-300x358.png",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 3,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 904,
    name: "NUXE PRODIGIEUX HUILE DE DOUCHE PARFUMEE 200ML",
    brand: "NUXE",
    slug: "nuxe-prodigieux-huile-de-douche-200ml",
    description: "Nettoie en douceur, satine la peau et la parfume d'une fragrance mythique.",
    original_price: 280.00,
    discounted_price: 168.00, // 40% discount
    stock_quantity: 20,
    image_url: "img/products/3596490006464-300x323.jpg.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 2,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 905,
    name: "BABE DEPIGMENT+ CONTROL FLUID 40ML",
    brand: "BABE",
    slug: "babe-depigment-control-fluid-40ml",
    description: "Fluide quotidien unifiant et éclaircissant pour le teint.",
    original_price: 350.00,
    discounted_price: 245.00, // 30% discount
    stock_quantity: 10,
    image_url: "img/products/BABE-DEPIGMENT-CONTROL-FLUID-40ML-300x300.jpg.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 1,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 906,
    name: "ALPHANOVA SERUM BOOSTER ANTI RIDES LISSANT+ 30ML",
    brand: "ALPHANOVA",
    slug: "alpha-serum-booster-anti-rides-lissanto-30ml",
    description: "Sérum concentré raffermissant et lissant effet immédiat.",
    original_price: 260.00,
    discounted_price: 182.00, // 30% discount
    stock_quantity: 6,
    image_url: "img/products/3760075072834-300x313.png.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 1,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 907,
    name: "MKL AQUA CREME DOUCHE DERMO NOURISSANTE BIO 1L",
    brand: "MKL",
    slug: "mkl-aqua-creme-douche-dermo-nourissante-bio-1l",
    description: "Crème de douche nourrissante bio pour toute la famille.",
    original_price: 180.00,
    discounted_price: 135.00, // 25% discount
    stock_quantity: 14,
    image_url: "img/products/MKL-AQUA-CREME-DOUCHE-DERMO-NOURISSANTE-BIO-1L-300x304.jpg.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 2,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 908,
    name: "ADDAX SEPTIDOL BODY GEL NETTOYANT 250 ML",
    brand: "ADDAX",
    slug: "addax-septidol-body-gel-nettoyant-250ml",
    description: "Gel nettoyant purifiant et apaisant pour peaux délicates.",
    original_price: 175.91,
    discounted_price: 140.00, // ~20% discount
    stock_quantity: 18,
    image_url: "img/products/ADDAX-SEPTIDOL-BODY-GEL-NETTOYANT-250ML-300x300.jpeg.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 1,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 909,
    name: "ISIS PHARMA SECALIA ATO SOIN LAVANT EFFET BARRIER 400ML",
    brand: "ISIS PHARMA",
    slug: "isis-pharma-secalia-ato-soin-lavant-effet-barrier-400ml",
    description: "Soin lavant relipidant anti-irritations.",
    original_price: 210.00,
    discounted_price: 178.50, // 15% discount
    stock_quantity: 22,
    image_url: "img/products/3760269771147-300x382.jpg.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 2,
    subcategory_id: null,
    sub_subcategory_id: null,
  }
];

const DiscountShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({});
  const [selectedProduct, setSelectedProduct] = useState<GlobalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { wishlist, toggleWishlist: toggleWishlistHook } = useWishlist();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [progressPct, setProgressPct] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // Helper to calculate discount percentage
  const getDiscountPercentage = (orig: number, disc?: number | null) => {
    if (!disc || Number(disc) <= 0 || Number(orig) <= Number(disc)) return 0;
    return Math.round(((Number(orig) - Number(disc)) / Number(orig)) * 100);
  };

  /* ── Fetch products and filter for 50% or less discount ── */
  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products');
        const allData: Product[] = res.data.data || res.data;
        
        if (Array.isArray(allData) && allData.length > 0) {
          // Filter products that have a discount of 50% or less (discountPercent > 0 && discountPercent <= 50)
          const filtered = allData.filter((p) => {
            const pct = getDiscountPercentage(p.original_price, p.discounted_price);
            return pct > 0 && pct <= 50;
          });

          if (filtered.length > 0) {
            setProducts(filtered.slice(0, 12));
          } else {
            setProducts(MOCK_DISCOUNTED_PRODUCTS);
          }
        } else {
          setProducts(MOCK_DISCOUNTED_PRODUCTS);
        }
      } catch (err) {
        console.error('Error fetching discounted products, fallback to mocks:', err);
        setProducts(MOCK_DISCOUNTED_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  /* ── Scroll handling ── */
  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < max - 8);
    setProgressPct(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => el.removeEventListener('scroll', updateScroll);
  }, [updateScroll, products]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  /* ── Mouse Drag Scroll ── */
  const onMouseDown = (e: React.MouseEvent) => {
    // If clicking on an interactive element like a button or link, do not start drag
    if ((e.target as HTMLElement).closest('button, a, input, [role="button"]')) return;
    if (!scrollRef.current) return;
    setIsDragging(true);
    setDragStartX(e.pageX - scrollRef.current.offsetLeft);
    setDragScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = dragScrollLeft - (x - dragStartX);
  };
  const stopDrag = () => setIsDragging(false);

  /* ── Cart Action ── */
  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart[product.id] || (product.stock_quantity !== undefined && product.stock_quantity === 0)) return;
    
    setAddingToCart((p) => ({ ...p, [product.id]: true }));
    try {
      const res = await addToCart(product, 1);
      if (res && res.success !== false) {
        setAddedToCart((p) => ({ ...p, [product.id]: true }));
        setTimeout(() => {
          setAddedToCart((p) => ({ ...p, [product.id]: false }));
        }, 2000);
      }
    } catch (err) {
      console.error('Error adding product to cart:', err);
    } finally {
      setAddingToCart((p) => ({ ...p, [product.id]: false }));
    }
  };

  const handleProductClick = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product as unknown as GlobalProduct);
    setIsModalOpen(true);
  };

  /* ── Wishlist Action ── */
  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistHook(id);
  };

  /* ── Skeleton loader ── */
  const Skeleton = () => (
    <div className="flex gap-5 px-6 md:px-10 pb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[230px] animate-pulse">
          <div className="h-[280px] rounded-sm bg-gray-100" />
          <div className="mt-3 space-y-2 px-1">
            <div className="h-2 w-16 bg-gray-100 rounded" />
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-9 bg-gray-100 rounded-sm mt-4" />
          </div>
        </div>
      ))}
    </div>
  );

  const accent = (i: number) => (i % 2 === 0 ? '#ef4444' : '#f59e0b');
  const accentRgb = (i: number) => (i % 2 === 0 ? '239,68,68' : '245,158,11');

  return (
    <section className="relative overflow-hidden bg-[#111115] py-20 border-y border-neutral-800">

      {/* ── Background ambient glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large red radial top-left */}
        <div
          className="absolute -top-48 -left-48 w-[650px] h-[650px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)' }}
        />
        {/* Warm amber radial bottom-right */}
        <div
          className="absolute -bottom-48 -right-32 w-[550px] h-[550px] rounded-full opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />
        {/* Subtle grid accent */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #ffffff 0px, #ffffff 1px, transparent 0px, transparent 8px)',
            backgroundSize: '12px 12px',
          }}
        />
      </div>

      {/* ── Top decorative line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(220,38,38,0.7) 35%, rgba(245,158,11,0.7) 65%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1500px] mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-6 md:px-10 mb-12">

          {/* Left: Section Header Text */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-px bg-gradient-to-r from-red-500 to-transparent" />
              <span
                className="text-[11px] font-bold tracking-[0.38em] uppercase text-red-500 flex items-center gap-1.5"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                <Tag size={12} className="text-red-500" /> BLACK FRIDAY SPECIAL
              </span>
              <div className="w-9 h-px bg-gradient-to-l from-amber-500 to-transparent" />
            </div>

            <h2
              className="text-4xl md:text-[52px] font-light text-white leading-[1.06]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Offres Exclusives&nbsp;
              <em
                className="not-italic font-black text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(110deg, #ef4444 0%, #f59e0b 60%, #fbbf24 100%)',
                }}
              >
                Black Friday
              </em>
            </h2>

            <p
              className="mt-3 text-[13px] font-light tracking-[0.04em] text-neutral-400 leading-[1.8] max-w-md"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {loading
                ? 'Chargement des offres Black Friday…'
                : `${products.length} soins d'exception sélectionnés avec réductions immédiates`}
            </p>
          </div>

          {/* Right: Controls & Link */}
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-300 hover:text-amber-400 transition-colors duration-300 border-b border-transparent hover:border-amber-400 pb-px"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Toutes les offres <ArrowRight size={12} />
            </Link>

            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 flex items-center justify-center border transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed bg-neutral-900 border-neutral-750 text-white hover:border-red-500"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 flex items-center justify-center border transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed bg-neutral-900 border-neutral-750 text-white hover:border-amber-500"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Products Track ── */}
        {loading ? (
          <Skeleton />
        ) : (
          <>
            <div
              ref={scrollRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              className="flex gap-5 px-6 md:px-10 pb-6 overflow-x-auto"
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {products.map((product, index) => {
                const inWishlist = wishlist.includes(product.id);
                const outOfStock = product.stock_quantity === 0;
                const isHovered = hoveredId === product.id;
                const col = accent(index);
                const rgb = accentRgb(index);

                // Discount percentage calculation
                const discountPercent = getDiscountPercentage(product.original_price, product.discounted_price);
                const hasDiscount = discountPercent > 0;

                return (
                  <div
                    key={product.id}
                    onClick={(e) => handleProductClick(product, e)}
                    className="flex-shrink-0 w-[230px] group relative block select-none cursor-pointer"
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    draggable={false}
                  >
                    {/* Card container */}
                    <div className="relative">

                      {/* Ghost background index number */}
                      <span
                        className="absolute -top-6 -left-1 text-[88px] font-bold leading-none pointer-events-none select-none z-0 transition-opacity duration-500"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          color: `rgba(${rgb}, ${isHovered ? 0.08 : 0.04})`,
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Main card shell */}
                      <div
                        className="relative z-10 overflow-hidden transition-all duration-500 bg-[#17171c]"
                        style={{
                          border: `1px solid ${isHovered ? `rgba(${rgb}, 0.5)` : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: isHovered
                            ? `0 24px 56px rgba(${rgb}, 0.25), 0 4px 16px rgba(0,0,0,0.5)`
                            : '0 4px 12px rgba(0,0,0,0.3)',
                          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                        }}
                      >
                        {/* Accent gradient line at top of card */}
                        <div
                          className="absolute top-0 left-0 right-0 z-20 transition-opacity duration-400"
                          style={{
                            height: '2px',
                            background:
                              index % 2 === 0
                                ? 'linear-gradient(90deg, #ef4444, #f59e0b)'
                                : 'linear-gradient(90deg, #f59e0b, #ef4444)',
                            opacity: isHovered ? 1 : 0.6,
                          }}
                        />

                        {/* Image area */}
                        <div className="relative h-[280px] overflow-hidden bg-[#202026]">
                          <img
                            src={getProductImageUrl(product.image_url)}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700"
                            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
                            draggable={false}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/img/logo.png';
                            }}
                          />

                          {/* Gradient overlay on hover */}
                          <div
                            className="absolute inset-0 transition-opacity duration-400"
                            style={{
                              background:
                                'linear-gradient(to top, rgba(15,15,18,0.7) 0%, transparent 60%)',
                              opacity: isHovered ? 1 : 0,
                            }}
                          />

                          {/* Prominent Black Friday Discount Badge */}
                          {hasDiscount && (
                            <div
                              className="absolute top-3 left-3 px-2.5 py-1 z-30 text-[11px] font-black tracking-wider text-white shadow-lg flex items-center gap-1 rounded"
                              style={{
                                background: discountPercent >= 40 
                                  ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' 
                                  : 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                                fontFamily: "'Jost', sans-serif"
                              }}
                            >
                              <span>-{discountPercent}%</span>
                              <span className="text-[8.5px] uppercase tracking-widest text-yellow-300 font-bold ml-0.5">DEAL</span>
                            </div>
                          )}

                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => toggleWishlist(product.id, e)}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center z-30 transition-all duration-300 rounded-full"
                            style={{
                              background: 'rgba(20,20,25,0.85)',
                              backdropFilter: 'blur(8px)',
                              border: `1px solid ${inWishlist ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                              opacity: isHovered || inWishlist ? 1 : 0,
                              transform:
                                isHovered || inWishlist
                                  ? 'translateY(0) scale(1)'
                                  : 'translateY(-6px) scale(0.85)',
                            }}
                          >
                            <Heart
                              size={13}
                              fill={inWishlist ? '#ef4444' : 'none'}
                              stroke={inWishlist ? '#ef4444' : '#ffffff'}
                            />
                          </button>

                          {/* Out of Stock Badge */}
                          {outOfStock && (
                            <div
                              className="absolute top-3 left-3 px-2 py-1 z-30 text-[9px] font-semibold tracking-[0.15em] uppercase rounded bg-neutral-900/90 text-red-400 border border-red-500/30"
                              style={{
                                fontFamily: "'Jost', sans-serif",
                              }}
                            >
                              Rupture
                            </div>
                          )}

                          {/* Low stock tag */}
                          {!outOfStock && product.stock_quantity <= 5 && (
                            <div
                              className="absolute bottom-3 left-3 px-2 py-1 z-30 text-[9px] font-medium tracking-[0.1em] uppercase transition-opacity duration-300 rounded bg-red-950/80 border border-red-500/40 text-red-300"
                              style={{
                                fontFamily: "'Jost', sans-serif",
                                opacity: isHovered ? 1 : 0,
                              }}
                            >
                              Plus que {product.stock_quantity}
                            </div>
                          )}
                        </div>

                        {/* Product Info Section */}
                        <div className="p-4 pb-5 flex flex-col">
                          <div className="mb-2">
                            {product.brand ? (
                              <p
                                className="text-[9.5px] font-semibold tracking-[0.28em] uppercase transition-colors duration-300 h-[14px] overflow-hidden text-amber-400"
                                style={{ fontFamily: "'Jost', sans-serif" }}
                              >
                                {product.brand}
                              </p>
                            ) : (
                              <div className="h-[14px]" />
                            )}
                          </div>

                          <div className="h-[44px] mb-3 overflow-hidden">
                            <p
                              className="line-clamp-2 leading-tight transition-colors duration-300"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '16.5px',
                                fontWeight: 400,
                                color: isHovered ? '#ffffff' : '#e4e4e7',
                              }}
                            >
                              {product.name}
                            </p>
                          </div>
                          
                          {/* Price Tag with Discount details */}
                          <div className="flex items-center justify-between mb-4 mt-auto">
                            <div className="flex items-center gap-3">
                              <span
                                className="font-bold text-yellow-400"
                                style={{ fontFamily: "'Jost', sans-serif", fontSize: '16px' }}
                              >
                                {hasDiscount 
                                  ? Number(product.discounted_price).toFixed(2) 
                                  : Number(product.original_price).toFixed(2)}{' '}
                                <span className="text-[10px] font-semibold text-yellow-500/70 uppercase">
                                  د.م
                                </span>
                              </span>
                              {hasDiscount && (
                                <span className="text-[11px] text-neutral-500 line-through decoration-red-500/60">
                                  {Number(product.original_price).toFixed(2)} د.م
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Add to Cart button */}
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={outOfStock || addingToCart[product.id]}
                            className={`w-full border px-4 py-3 text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider mt-4 rounded-sm ${
                              addedToCart[product.id]
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-md shadow-red-950/50'
                            }`}
                          >
                            {addedToCart[product.id] ? (
                              <>
                                <Check className="w-4 h-4 text-white" />
                                <span>Ajouté !</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>
                                  {addingToCart[product.id] ? 'Ajout...' : 'Acheter'}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* End Link Card */}
              <Link
                href="/products"
                className="flex-shrink-0 w-[150px] flex flex-col items-center justify-center gap-4 group"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-full border border-red-500/40 bg-red-950/20 shadow-md shadow-red-900/30"
                >
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-1 text-red-500"
                  />
                </div>
                <span
                  className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-400 group-hover:text-amber-400 transition-colors duration-300 text-center leading-relaxed"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Toutes les offres<br /><span className="text-red-400 font-black">Black Friday</span>
                </span>
              </Link>
            </div>

            {/* ── Scroll Progress Line ── */}
            <div className="px-6 md:px-10 mt-2">
              <div
                className="relative h-1 overflow-hidden rounded bg-neutral-900 border border-neutral-800"
              >
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-150 ease-out"
                  style={{
                    width: `${Math.max(progressPct, 4)}%`,
                    background: 'linear-gradient(90deg, #ef4444, #f59e0b)',
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Bottom Accent Line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(245,79,154,0.25) 35%, rgba(255,118,87,0.25) 65%, transparent 100%)',
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .overflow-x-auto::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Product Quick-View Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default DiscountShowcase;
