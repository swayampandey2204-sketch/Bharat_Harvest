'use client';

interface ProductImageProps {
  slug: string;
  className?: string;
}

// Maps each product slug to its image file in /public/images/
const individualImages: Record<string, string> = {
  'raw-premium-makhana': '/images/raw-premium.jpg',   // new official photo
  'peri-peri':           '/images/peri-peri.jpg',     // new official photo
  'cheese':              '/images/cheesy.jpg',         // new official photo
  'himalayan-salt':      '/images/salt-pepper.png',   // existing (no new photo provided)
  'pudina':              '/images/pudina.jpg',          // new official photo — Pudina Magic Makhana
  'achari':              '/images/achari-brown.jpg',  // new official photo
  'tomato-twist':        '/images/tomato-twist.jpg',  // new official photo
};

export default function ProductImage({ slug, className = '' }: ProductImageProps) {
  const src = individualImages[slug] || '/images/raw-premium.jpg';

  return (
    <div className={`w-full h-full flex items-center justify-center bg-[#0e2010] p-3 ${className}`}>
      <img
        src={src}
        alt={`Bharat Harvest ${slug} product package`}
        className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
  );
}
