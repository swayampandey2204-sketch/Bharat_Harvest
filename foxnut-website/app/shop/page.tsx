'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductImage from '@/components/ProductImage';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  slug: string;
  image: string;
  category: 'raw' | 'flavored';
  sizes: { label: string; price: number }[];
}

const productsCatalog: ProductItem[] = [
  {
    id: 'raw-premium',
    name: 'Premium Raw Makhana',
    tagline: 'Unflavored & Whole Foxnuts',
    desc: 'Hand-picked, high-quality lotus seeds. 100% natural, raw & unprocessed — the healthiest snack staple.',
    slug: 'raw-premium-makhana',
    image: '/images/raw-premium.jpg',
    category: 'raw',
    sizes: [
      { label: '100g Bag', price: 229 },
      { label: '200g Bag', price: 399 },
    ],
  },
  {
    id: 'peri-peri',
    name: 'Peri Peri Makhana',
    tagline: 'Spicy & Roasted Foxnuts',
    desc: 'Fiery African bird\'s eye chili, sweet paprika & tangy lemon. Vacuum cooked, not deep fried.',
    slug: 'peri-peri',
    image: '/images/peri-peri.jpg',
    category: 'flavored',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
  },
  {
    id: 'cheese',
    name: 'Cheesy Delight Makhana',
    tagline: 'Rich & Creamy Foxnuts',
    desc: 'Gourmet cheddar cheese dust tossed lightly on crispy roasted makhana. 100% roasted, not fried.',
    slug: 'cheese',
    image: '/images/cheesy.jpg',
    category: 'flavored',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
  },
  {
    id: 'himalayan-salt',
    name: 'Himalayan Salt Makhana',
    tagline: 'Light & Clean Foxnuts',
    desc: 'Lightly roasted with a touch of cold-pressed oil and dusted with pure Himalayan pink salt.',
    slug: 'himalayan-salt',
    image: '/images/salt-pepper.png',
    category: 'flavored',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
  },
  {
    id: 'pudina',
    name: 'Pudina Magic Makhana',
    tagline: 'Minty & Roasted Foxnuts',
    desc: 'Refreshing field mint powder with zesty dry mango seasoning and classic Indian heritage spices.',
    slug: 'pudina',
    image: '/images/pudina.jpg',
    category: 'flavored',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
  },
  {
    id: 'achari',
    name: 'Achari Tadka Makhana',
    tagline: 'Pickle-Flavored Tadka Foxnuts',
    desc: 'Traditional pickle spices, raw green mango zest & mustard seed extracts over wood-fired makhana.',
    slug: 'achari',
    image: '/images/achari-brown.jpg',
    category: 'flavored',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
  },
  {
    id: 'tomato-twist',
    name: 'Tomato Twist Makhana',
    tagline: 'Tangy & Spicy Roasted Foxnuts',
    desc: 'Sun-ripened tomato seasoning blended with Indian spices for a tangy, bold crunch. Vacuum cooked.',
    slug: 'tomato-twist',
    image: '/images/tomato-twist.jpg',
    category: 'flavored',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
  },
];

const FILTERS = [
  { label: 'All Products', value: 'all' },
  { label: 'Raw Premium', value: 'raw' },
  { label: 'Flavoured Roast', value: 'flavored' },
];

export default function ShopPage() {
  const [filter, setFilter] = useState<'all' | 'raw' | 'flavored'>('all');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>(
    Object.fromEntries(productsCatalog.map((p) => [p.slug, 0]))
  );
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleSizeChange = (slug: string, index: number) =>
    setSelectedSizes((prev) => ({ ...prev, [slug]: index }));

  const addToCart = (product: ProductItem, sizeIndex: number) => {
    const selectedSize = product.sizes[sizeIndex];
    try {
      const cart = JSON.parse(localStorage.getItem('bharat-harvest-cart') || '[]');
      const existingIndex = cart.findIndex(
        (item: any) => item.id === product.id && item.packSize === selectedSize.label
      );
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: selectedSize.price,
          packSize: selectedSize.label,
          image: product.image,
          slug: product.slug,
          quantity: 1,
          category: product.category === 'raw' ? 'Raw Sourcing' : 'Flavoured Roast',
        });
      }
      localStorage.setItem('bharat-harvest-cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('bharat-harvest-cart-updated'));
      setAddedSlug(product.slug);
      setTimeout(() => setAddedSlug(null), 1400);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = productsCatalog.filter(
    (p) => filter === 'all' || p.category === filter
  );

  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">

        {/* Page Header */}
        <div className="mb-14 text-center md:text-left">
          <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 block">
            Pure Wetlands Sourced
          </span>
          <h1 className="font-headline text-[34px] md:text-[52px] leading-tight text-[#f0ead6] mb-4">
            Our Gold Grade Catalog
          </h1>
          <p className="text-[#a8c098] text-[16px] max-w-2xl leading-relaxed">
            100% roasted, not fried. No artificial preservatives. Vacuum cooked for maximum crunch and nutrition.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-1">
          {FILTERS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`px-6 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-250 ${
                filter === tab.value
                  ? 'bg-[#c89030] text-[#0c1e0e] shadow-[0_4px_16px_rgba(200,144,48,0.35)]'
                  : 'text-[#a8c098] border border-[#c89030]/20 hover:border-[#c89030]/50 hover:text-[#c89030]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const sizeIndex = selectedSizes[product.slug] ?? 0;
            const currentSize = product.sizes[sizeIndex];
            const justAdded = addedSlug === product.slug;
            const isWishlisted = isInWishlist(product.slug);

            return (
              <div
                key={product.id}
                className="bg-[#122313] rounded-2xl overflow-hidden border border-[#c89030]/10 hover:border-[#c89030]/35 transition-all duration-350 flex flex-col group shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-[#0e2010] overflow-hidden">
                  <Link href={`/shop/${product.slug}`} className="block w-full h-full">
                    <ProductImage slug={product.slug} className="group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  {product.category === 'raw' && (
                    <span className="absolute top-3 left-3 bg-[#c89030] text-[#0c1e0e] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      Raw
                    </span>
                  )}
                  {/* Wishlist Heart Overlay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    aria-label="Toggle wishlist"
                    className="absolute top-3 right-3 z-10 w-9.5 h-9.5 rounded-full bg-[#0c1e0e]/75 hover:bg-[#0c1e0e]/95 border border-[#c89030]/20 hover:border-[#c89030] flex items-center justify-center text-[#c89030] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <span
                      className="material-symbols-outlined text-[18px] transition-all duration-300 select-none text-[#c89030]"
                      style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  {/* Name + tagline */}
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="font-headline text-[16px] text-[#f0ead6] mb-0.5 hover:text-[#c89030] transition-colors leading-snug">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-[#c89030] font-semibold uppercase tracking-wide mb-2">
                    {product.tagline}
                  </p>
                  <p className="text-[12px] text-[#a8c098] mb-4 line-clamp-2 leading-relaxed">
                    {product.desc}
                  </p>

                  {/* Size Selector */}
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-[#4a704a] uppercase tracking-[0.15em] mb-1.5">Size</p>
                    <div className="flex gap-2">
                      {product.sizes.map((sz, index) => (
                        <button
                          key={sz.label}
                          onClick={() => handleSizeChange(product.slug, index)}
                          className={`flex-1 py-1.5 rounded-lg border text-[11px] font-bold text-center transition-all ${
                            sizeIndex === index
                              ? 'border-[#c89030] text-[#c89030] bg-[#c89030]/10'
                              : 'border-[#2a4a2c] text-[#a8c098] hover:border-[#c89030]/50 hover:text-[#c89030]'
                          }`}
                        >
                          {sz.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price + Cart */}
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#c89030]/10">
                    <div className="flex flex-col">
                      <span className="text-[22px] font-headline text-[#c89030] font-bold leading-none">
                        ₹{currentSize.price}
                      </span>
                      <span className="text-[10px] text-[#4a704a] mt-0.5">{currentSize.label}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product, sizeIndex)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold transition-all duration-200 ${
                        justAdded
                          ? 'bg-[#4a6b2a] text-[#f0ead6]'
                          : 'bg-[#c89030] text-[#0c1e0e] hover:bg-[#e8b848] shadow-[0_4px_12px_rgba(200,144,48,0.3)]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {justAdded ? 'check' : 'shopping_cart'}
                      </span>
                      {justAdded ? 'Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
