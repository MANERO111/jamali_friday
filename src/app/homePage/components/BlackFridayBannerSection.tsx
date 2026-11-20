'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Percent, ArrowRight, ShieldCheck, BadgeCheck, Zap, TrendingDown, Sparkles } from 'lucide-react';

export default function BlackFridayBannerSection() {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('BFJAMALI');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <section className="relative overflow-hidden bg-[#141418] text-white py-14 sm:py-20 my-6 sm:my-8 border-y border-amber-500/20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: 'radial-gradient(circle, #e11d48 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Big Black Friday Spotlight */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700/80 shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-[11px] font-black tracking-widest uppercase text-amber-300 flex items-center gap-1.5">
                <TrendingDown size={13} className="text-amber-400" /> MEILLEURS PRIX GARANTIS DE L&apos;ANNÉE
              </span>
            </div>

            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.08]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Les Plus Fortes Réductions&nbsp;
              <span
                className="font-black not-italic block mt-1 text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(110deg, #f43f5e 0%, #f59e0b 55%, #fbbf24 100%)',
                }}
              >
                Jusqu&apos;à -70% Immédiats
              </span>
            </h2>

            <p
              className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl font-light tracking-wide"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Profitez des prix les plus bas du marché sur des centaines de références parapharmacie (Bioderma, La Roche-Posay, CeraVe, Nuxe, SVR, Vichy). Des remises directes sans conditions sur vos soins préférés !
            </p>

            {/* Quick Promo / CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-[#1c1c22] border border-amber-500/30 rounded-lg p-2 px-3 sm:px-4 shadow-sm">
                <Tag size={16} className="text-amber-400" />
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Code Promo :</span>
                <span className="font-mono font-black text-amber-300 text-sm sm:text-base tracking-widest">BFJAMALI</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="ml-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                >
                  {copiedCode ? 'Copié !' : 'Copier'}
                </button>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-900/40 transition-all duration-300 group"
              >
                <span>Voir Tous Les Produits En Promo</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Price & Value Focus Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            
            {/* Card 1: Prix Cassés / Meilleurs Prix */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1c1c22]/90 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <Percent size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Prix Cassés Sur Tout Le Catalogue
                  <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-black">-70% MAX</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Des réductions directes appliquées sur les soins du visage, corps, capillaires et hygiène dès le premier article.
                </p>
              </div>
            </div>

            {/* Card 2: Packs Économiques */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1c1c22]/90 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <BadgeCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Packs & Duos Économiques
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Profitez de nos offres combinées pour payer vos routines complètes encore moins cher que les achats à l&apos;unité.
                </p>
              </div>
            </div>

            {/* Card 3: 100% Authenticité */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1c1c22]/90 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 group sm:col-span-2 lg:col-span-1">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Jost', sans-serif" }}>
                  100% Produits Authentiques
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Petits prix avec la garantie des laboratoires officiels : aucune contrefaçon, traçabilité et fraîcheur garanties.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
