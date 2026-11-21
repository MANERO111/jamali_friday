"use client";
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, User, Menu, X, ChevronDown, Settings, LogOut, Search, ShoppingBag, Heart, Package, Flame, Sparkles, Tag, ArrowRight } from 'lucide-react';
import LoginModal from './login';
import ProductModal from './products/ProductModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { navigationItems, NavItem } from '@/constants/navigationData';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts, Product } from '@/hooks/useProducts';
import { getProductImageUrl } from '@/utils/imageHelper';

const BfNavbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Search State
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const loadWishlistCount = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          const wishlistItems = JSON.parse(savedWishlist);
          setWishlistCount(wishlistItems.length);
        }
      } catch (error) {
        console.error('Error loading wishlist count:', error);
      }
    };
    loadWishlistCount();
    const handleStorageChange = (e: StorageEvent) => { if (e.key === 'wishlist') loadWishlistCount(); };
    const handleWishlistUpdate = () => loadWishlistCount();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024 && isMenuOpen) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setIsProfileDropdownOpen(false);
    try {
      await logout();
    } catch (error: unknown) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
    setActiveSubcategory(null);
  };

  const toggleSubcategory = (subcategoryName: string) => {
    setActiveSubcategory(activeSubcategory === subcategoryName ? null : subcategoryName);
  };
  
  const handleLoginSuccess = async (userData: { name: string; [key: string]: unknown }) => {
    await login(userData);
    setIsLoginModalOpen(false);
  };

  const navigateToProfile = () => { setIsProfileDropdownOpen(false); window.location.href = '/profile'; };
  const navigateToOrders = () => { setIsProfileDropdownOpen(false); window.location.href = '/orders'; };
  const navigateToDashboard = () => { setIsProfileDropdownOpen(false); window.location.href = '/admin'; };

  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.slug && p.slug.toLowerCase().includes(query))
    ).slice(0, 4);
  };

  const searchResults = getSearchResults();

  return (
    <>
      <div className="w-full relative navbar-font">
        {/* Fixed Header Container wrapping Announcement bar + Main Navbar so nothing ever overlaps */}
        <header className="fixed top-0 left-0 right-0 w-full z-[100]">
          
          {/* Black Friday Announcement Bar */}
          <div className="w-full bg-[#0a0a0d] text-white border-b border-red-600/30 py-2 px-4 relative z-20">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold tracking-widest text-[10px] uppercase shadow-md shadow-red-950/60 animate-pulse">
                  <Flame size={12} className="text-yellow-300" />
                  BLACK FRIDAY
                </span>
                <span className="text-neutral-300 hidden sm:inline text-xs font-light tracking-wide">
                  Remises exceptionnelles jusqu&apos;à <span className="text-amber-400 font-bold">-70%</span> sur les soins d&apos;exception
                </span>
              </div>
              
              <Link 
                href="/products?search=pack" 
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors group"
              >
                <span>Voir les offres</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Main Dark Navbar */}
          <nav 
            className={`w-full transition-all duration-300 ${
              isScrolled 
                ? 'bg-[#111116]/95 backdrop-blur-md shadow-2xl shadow-black/70 border-b border-neutral-800' 
                : 'bg-[#141419] border-b border-neutral-800/80 shadow-md shadow-black/30'
            }`}
          >
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-3.5 lg:py-4">

                {/* Search - Left */}
                <div className="hidden lg:flex items-center flex-1">
                  <div className="relative w-full max-w-[280px]" ref={searchWrapperRef}>
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      className="w-full bg-[#1e1e26] text-white placeholder-neutral-400 text-xs tracking-wide py-2.5 pl-3.5 pr-9 rounded-md border border-neutral-700/80 focus:border-amber-400 focus:bg-[#23232d] focus:outline-none transition-all shadow-inner"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                          setIsSearchFocused(false);
                        }
                      }}
                    />
                    <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    
                    {/* Live Search Dropdown */}
                    {isSearchFocused && searchQuery.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-[#1a1a22] border border-neutral-700 shadow-2xl z-50 rounded-md overflow-hidden">
                        {searchResults.length > 0 ? (
                          <div className="max-h-80 overflow-y-auto">
                            {searchResults.map((product) => (
                              <button 
                                key={product.id}
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsProductModalOpen(true);
                                  setIsSearchFocused(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-[#252532] border-b border-neutral-800 last:border-0 transition-colors text-left"
                              >
                                <div className="w-10 h-10 flex-shrink-0 bg-white rounded overflow-hidden p-0.5">
                                  <img 
                                    src={getProductImageUrl(product.image_url)} 
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/img/logo.png'; }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] uppercase font-bold text-amber-400 truncate" style={{ fontFamily: "'Jost', sans-serif" }}>
                                    {product.brand || "Produit"}
                                  </p>
                                  <p className="text-xs text-neutral-100 truncate" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                                    {product.name}
                                  </p>
                                </div>
                              </button>
                            ))}
                            
                            <div className="p-2 border-t border-neutral-800 bg-[#141419]">
                              <Link 
                                href={`/products?search=${encodeURIComponent(searchQuery)}`}
                                className="block w-full text-center text-xs py-1.5 text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                                style={{ fontFamily: "'Jost', sans-serif" }}
                              >
                                Voir tous les résultats
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-sm text-neutral-400" style={{ fontFamily: "'Jost', sans-serif" }}>
                            Aucun produit trouvé.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo - Center (clean breathing room, no touching boundaries) */}
                <div className="flex-shrink-0 flex items-center justify-center flex-1 lg:flex-initial my-0.5">
                  <Link href="/" className="inline-flex items-center" style={{ textDecoration: 'none' }}>
                    <Image 
                      src="/img/jamali_logo.gif" 
                      alt="Logo" 
                      width={180} 
                      height={100} 
                      className="h-auto max-h-[80px] w-auto object-contain"
                      priority 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/img/jamali_logo.webp';
                      }}
                    />
                  </Link>
                </div>

                {/* Actions - Right */}
                <div className="flex items-center gap-5 lg:gap-7 flex-1 justify-end text-neutral-200">

                  {/* Login / Profile */}
                  {isLoading ? (
                    <div className="w-16 h-4 bg-neutral-800 animate-pulse rounded hidden sm:block" />
                  ) : isAuthenticated && user ? (
                    <div className="relative hidden sm:block z-[100]" ref={profileDropdownRef}>
                      <button 
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} 
                        className="flex items-center gap-1.5 text-xs text-neutral-200 hover:text-amber-400 font-medium tracking-wide transition-colors"
                      >
                        <User size={18} />
                        <span className="truncate max-w-[100px]">{user.name}</span>
                        <ChevronDown size={12} style={{ transition: 'transform 0.3s', transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                      </button>
                      {isProfileDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-[#1c1c24] border border-neutral-700 rounded-md shadow-2xl py-2 z-50">
                          <div className="px-4 py-2 border-b border-neutral-800">
                            <div className="font-semibold text-white text-xs">{user.name}</div>
                            <div className="text-[11px] text-neutral-400 truncate">{user.email}</div>
                          </div>
                          <button onClick={navigateToProfile} className="w-full text-left px-4 py-2 text-xs text-neutral-200 hover:bg-[#262632] flex items-center gap-2">
                            <Settings size={14} /> Profil
                          </button>
                          <button onClick={navigateToOrders} className="w-full text-left px-4 py-2 text-xs text-neutral-200 hover:bg-[#262632] flex items-center gap-2">
                            <Package size={14} /> Commandes
                          </button>
                          {user.role === 'admin' && (
                            <button onClick={navigateToDashboard} className="w-full text-left px-4 py-2 text-xs text-neutral-200 hover:bg-[#262632] flex items-center gap-2">
                              <LayoutDashboard size={14} /> Dashboard
                            </button>
                          )}
                          <button onClick={handleLogout} disabled={isLoggingOut} className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 border-t border-neutral-800 mt-1">
                            <LogOut size={14} /> Déconnexion
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button onClick={() => setIsLoginModalOpen(true)} className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-200 hover:text-amber-400 font-medium tracking-wide transition-colors">
                      <User size={18} />
                      <span>Se connecter</span>
                    </button>
                  )}

                  {/* Wishlist */}
                  <a href="/wishlist" className="hidden sm:flex items-center relative text-neutral-200 hover:text-rose-400 transition-colors">
                    <Heart size={19} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </a>

                  {/* Cart */}
                  <a href="/cart" className="hidden sm:flex items-center gap-2 text-neutral-200 hover:text-amber-400 transition-colors">
                    <div className="relative">
                      <ShoppingBag size={19} />
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                          {cartCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold tracking-wider text-amber-300">
                      {cartCount > 0 ? `${cartCount} art.` : 'Panier'}
                    </span>
                  </a>

                  {/* Mobile hamburger */}
                  <button 
                    className="lg:hidden text-neutral-200 hover:text-amber-400 p-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Menu"
                  >
                    {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Bar / Categories */}
            <div className={`border-t border-neutral-800/90 bg-[#0e0e12] ${isMenuOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="max-w-screen-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center">
                  
                  {/* Special Black Friday Direct Nav Highlight */}
                  <div className="relative group">
                    <a
                      href="/products?search=pack"
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-wider uppercase font-extrabold text-red-500 hover:text-red-400 transition-colors"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      <Flame size={13} className="text-red-500 fill-red-500" />
                      <span>OFFRES BLACK FRIDAY</span>
                      <span className="px-1.5 py-0.2 text-[8px] bg-red-600 text-white rounded font-black tracking-widest ml-1 animate-pulse">
                        HOT
                      </span>
                    </a>
                  </div>

                  {navigationItems.map((category) => (
                    <div key={category.name} className="relative group">
                      <div className="flex items-center justify-between lg:block">
                        <a
                          href={`/products?category=${encodeURIComponent(category.name)}`}
                          className="flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-wider uppercase font-medium text-neutral-300 hover:text-amber-400 transition-colors group-hover:text-amber-400"
                          style={{ fontFamily: "'Jost', sans-serif" }}
                        >
                          {category.name}
                          {category.subcategories && category.subcategories.length > 0 && (
                            <ChevronDown size={11} className="hidden lg:inline-block opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                          )}
                        </a>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <button
                            onClick={(e) => { e.preventDefault(); toggleCategory(category.name); }}
                            className="lg:hidden px-3 py-2 text-neutral-400"
                          >
                            <ChevronDown size={14} style={{ transform: activeCategory === category.name ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                          </button>
                        )}
                      </div>

                      {/* Level 2 Dropdown */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className={`lg:absolute lg:top-full lg:left-0 lg:min-w-[230px] bg-[#1a1a22] border border-neutral-800 rounded-b shadow-2xl z-50 ${
                          isMenuOpen 
                            ? (activeCategory === category.name ? 'block' : 'hidden') 
                            : 'hidden lg:group-hover:block'
                        }`}>
                          {category.subcategories.map((sub: NavItem) => (
                            <div key={sub.name} className="relative group/sub border-b border-neutral-800/60 last:border-0">
                              <div className="flex items-center justify-between">
                                <a
                                  href={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                                  className="block px-4 py-2.5 text-xs text-neutral-300 hover:text-amber-400 hover:bg-[#242430] transition-colors w-full"
                                  style={{ fontFamily: "'Jost', sans-serif" }}
                                >
                                  {sub.name}
                                </a>
                                {sub.subcategories && sub.subcategories.length > 0 && (
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSubcategory(sub.name); }}
                                    className="px-3 text-neutral-400 hover:text-amber-400 lg:cursor-default"
                                  >
                                    <ChevronDown size={11} className="hidden lg:block -rotate-90" />
                                    <ChevronDown size={11} className="lg:hidden" style={{ transform: activeSubcategory === sub.name ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                                  </button>
                                )}
                              </div>

                              {/* Level 3 Dropdown */}
                              {sub.subcategories && sub.subcategories.length > 0 && (
                                <div className={`lg:absolute lg:left-full lg:top-0 lg:min-w-[220px] bg-[#1d1d26] border border-neutral-800 rounded shadow-2xl z-50 ${
                                  isMenuOpen
                                    ? (activeSubcategory === sub.name ? 'block pl-4' : 'hidden')
                                    : 'hidden lg:group-hover/sub:block'
                                }`}>
                                  {sub.subcategories.map((subSub: NavItem) => (
                                    <a
                                      key={subSub.name}
                                      href={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub.name)}&subsubcategory=${encodeURIComponent(subSub.name)}`}
                                      className="block px-4 py-2 text-xs text-neutral-400 hover:text-amber-400 hover:bg-[#262634] transition-colors border-b border-neutral-800/40 last:border-0"
                                      style={{ fontFamily: "'Jost', sans-serif" }}
                                    >
                                      {subSub.name}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Spacer so the page content doesn't get hidden behind the fixed header */}
        <div className="h-[125px] sm:h-[135px] lg:h-[145px]" />
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
    </>
  );
};

export default BfNavbar;
