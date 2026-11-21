"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const [bgIndex, setBgIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const HERO_IMAGES = isMobile
  ? [
    { src: '/img/mobilejamalihero.png', url: '/products?search=pack' },
        { src: '/img/mobileherojamali2.png', url: '/products?search=pack' },
      ]
      : [
        { src: '/img/jamalihero.png', url: '/products?search=pack' },
        { src: '/img/jamalihero2.png', url: '/products?search=pack' },
      ];

  useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth <= 640);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);// Image Slider Effect (Every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[700px] sm:h-[400px] md:h-[600px] lg:h-[800px] mt-24 md:mt-10 overflow-hidden bg-gray-50">
      {HERO_IMAGES.map((item, idx) => (
        <Link 
          key={item.src}
          href={item.url}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: idx === bgIndex ? 1 : 0,
            zIndex: idx === bgIndex ? 10 : 0,
            pointerEvents: idx === bgIndex ? 'auto' : 'none',
          }}
        >
          <Image 
            src={item.src} 
            alt="Hero Banner" 
            fill 
            className="object-cover sm:object-contain"
            priority={idx === 0}
          />
        </Link>
      ))}
    </section>
  );
}