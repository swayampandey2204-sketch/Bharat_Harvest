'use client';

import { useState, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuthGuard } from '@/contexts/AuthGuardContext';

interface ProductDetails {
  name: string;
  tagline: string;
  description: string;
  image: string;
  category: string;
  sizes: { label: string; price: number }[];
  badges: string[];
  features: string[];
}

const productsDetailsCatalog: Record<string, ProductDetails> = {
  'raw-premium-makhana': {
    name: 'Premium Raw Makhana',
    tagline: 'Unflavored & Whole Foxnuts',
    description:
      "Pristine, unsalted organic lotus seeds hand-picked from Bihar's mineral-rich wetlands. Double-sorted by hand to select only the largest, fluffiest puffs. 100% natural, raw & unprocessed — rich in protein and fibre, with no additives or preservatives. Perfect for roasting at home with ghee, butter, or herbs.",
    image: '/images/raw-premium.jpg',
    category: 'Raw Sourcing',
    sizes: [
      { label: '100g Bag', price: 229 },
      { label: '200g Bag', price: 399 },
    ],
    badges: ['100% Organic', 'Hand-Picked', 'No Additives'],
    features: [
      'Double-sorted for uniform size & quality',
      'High protein & fibre, naturally filling',
      'No preservatives — premium quality guaranteed',
    ],
  },
  'peri-peri': {
    name: 'Peri Peri Makhana',
    tagline: 'Spicy & Roasted Foxnuts',
    description:
      "A fiery seasoning of African bird's eye chili, sweet paprika, and zesty lemon tossed over vacuum-cooked, wood-fired popped lotus seeds. 100% roasted, not deep fried. Gluten-free with no artificial preservatives.",
    image: '/images/peri-peri.jpg',
    category: 'Flavoured Roast',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
    badges: ['Spicy & Tangy', 'Gluten-Free', 'Vacuum Cooked'],
    features: [
      '100% roasted — not deep fried',
      'Real chili & citrus oil seasoning',
      'No artificial preservatives or colors',
    ],
  },
  'cheese': {
    name: 'Cheesy Delight Makhana',
    tagline: 'Rich & Creamy Foxnuts',
    description:
      'Rich and creamy gourmet cheddar cheese dust tossed lightly on our crispy vacuum-cooked makhana. A comforting, melt-in-the-mouth cheese flavour elevated into a truly premium snack. 100% roasted, not fried.',
    image: '/images/cheesy.jpg',
    category: 'Flavoured Roast',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
    badges: ['Creamy Cheddar', 'Gluten-Free', 'Vacuum Cooked'],
    features: [
      'Real cheddar cheese seasoning powder',
      'High volume, low calorie snacking',
      'No artificial preservatives or colors',
    ],
  },
  'himalayan-salt': {
    name: 'Himalayan Salt Makhana',
    tagline: 'Light & Clean Foxnuts',
    description:
      'Lightly roasted with a touch of cold-pressed oil and dusted with pure mineral-rich Himalayan pink salt. Simple, elegant, and perfectly balanced — highlighting the natural nutty flavour of the lotus seed at its finest.',
    image: '/images/himalayan-salt.jpg',
    category: 'Flavoured Roast',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
    badges: ['Himalayan Pink Salt', 'Low Sodium', '100% Vegan'],
    features: [
      'Lightly seasoned for purists',
      'Rich in magnesium and potassium',
      'No artificial preservatives or colors',
    ],
  },
  'pudina': {
    name: 'Pudina Magic Makhana',
    tagline: 'Minty & Roasted Foxnuts',
    description:
      'Refreshing field mint powder mixed with tangy dry mango seasoning and local heritage spices. A cool, savory, and tangy snack delivering a burst of classic Indian flavours in every crunchy bite.',
    image: '/images/pudina.jpg',
    category: 'Flavoured Roast',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
    badges: ['Mint Seasoned', 'Tangy & Zesty', '100% Vegan'],
    features: [
      'Real dried mint leaves powder',
      'No artificial colors or preservatives',
      'Traditional Indian spice blend',
    ],
  },
  'achari': {
    name: 'Achari Tadka Makhana',
    tagline: 'Pickle-Flavored Tadka Foxnuts',
    description:
      'An authentic blend of traditional Indian pickle spices, raw green mango zest, and mustard seed extracts. Tossed over vacuum-cooked, wood-fired popped lotus seeds for a perfect balance of tangy, spicy, and savory notes.',
    image: '/images/achari-brown.jpg',
    category: 'Flavoured Roast',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
    badges: ['Tangy & Spicy', 'Gluten-Free', '100% Vegan'],
    features: [
      'Infused with traditional pickle spices',
      'Popped without any heavy frying oils',
      'No artificial preservatives or colors',
    ],
  },
  'tomato-twist': {
    name: 'Tomato Twist Makhana',
    tagline: 'Tangy & Spicy Roasted Foxnuts',
    description:
      'Sun-ripened tomato seasoning blended with a burst of Indian spices for a bold, tangy crunch in every bite. Vacuum cooked, not deep fried — gluten-free with no artificial preservatives. A vegan snack loved by all.',
    image: '/images/tomato-twist.jpg',
    category: 'Flavoured Roast',
    sizes: [
      { label: '50g Pouch', price: 189 },
      { label: '90g Jar',   price: 249 },
    ],
    badges: ['Tangy Tomato', 'Vegan', 'Vacuum Cooked'],
    features: [
      '100% roasted — not deep fried',
      'No artificial preservatives or colors',
      'Bold Indian spice blend with real tomato seasoning',
    ],
  },
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = productsDetailsCatalog[slug] || productsDetailsCatalog['raw-premium-makhana'];

  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { checkAuthAndExecute } = useAuthGuard();
  const isWishlisted = isInWishlist(slug);

  const currentSize = product.sizes[selectedSize] || product.sizes[0];

  const idMap: Record<string, string> = {
    'raw-premium-makhana': 'raw-premium',
    'peri-peri':           'peri-peri',
    'cheese':              'cheese',
    'himalayan-salt':      'himalayan-salt',
    'pudina':              'pudina',
    'achari':              'achari',
    'tomato-twist':        'tomato-twist',
  };

  const handleAddToCart = () => {
    checkAuthAndExecute(() => {
      const productId = idMap[slug] || slug;
      try {
        const cart = JSON.parse(localStorage.getItem('bharat-harvest-cart') || '[]');
        const existingIndex = cart.findIndex(
          (item: any) => item.id === productId && item.packSize === currentSize.label
        );
        if (existingIndex > -1) {
          cart[existingIndex].quantity += quantity;
        } else {
          cart.push({
            id: productId,
            name: product.name,
            price: currentSize.price,
            packSize: currentSize.label,
            image: product.image,
            slug,
            quantity,
            category: product.category,
          });
        }
        localStorage.setItem('bharat-harvest-cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('bharat-harvest-cart-updated'));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const suggestedKeys = Object.keys(productsDetailsCatalog).filter((k) => k !== slug).slice(0, 3);

  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-20 w-full">

        {/* Breadcrumb */}
        <div className="flex gap-2 text-[12px] text-[#4a704a] mb-8 border-b border-[#c89030]/10 pb-4">
          <Link href="/shop" className="hover:text-[#c89030] transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-[#a8c098]">{product.name}</span>
        </div>

        {/* Product Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">

          {/* Image Panel */}
          <div className="lg:col-span-6">
            <div className="w-full aspect-square bg-[#0e2010] rounded-2xl overflow-hidden border border-[#c89030]/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <ProductImage slug={slug} />
            </div>
            {/* Trust bar below image */}
            <div className="flex justify-around mt-5 pt-5 border-t border-[#c89030]/10">
              {[
                { icon: 'verified', label: '100% Roasted' },
                { icon: 'no_meals', label: 'Not Fried' },
                { icon: 'eco',      label: 'No Preservatives' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                  <span className="material-symbols-outlined text-[#c89030] text-[20px]">{b.icon}</span>
                  <span className="text-[11px] text-[#4a704a] font-semibold">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-6 flex flex-col pt-2 lg:pt-4">
            <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em] mb-1 block">
              {product.category}
            </span>
            <h1 className="font-headline text-[30px] md:text-[38px] text-[#f0ead6] mb-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-[13px] text-[#c89030] font-semibold uppercase tracking-wider mb-5">
              {product.tagline}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#c89030]/10">
              <span className="text-[32px] font-headline text-[#c89030] font-bold leading-none">
                ₹{currentSize.price * quantity}
              </span>
              <span className="text-[13px] text-[#4a704a]">
                {quantity} &times; ₹{currentSize.price} / {currentSize.label}
              </span>
            </div>

            <p className="text-[15px] text-[#a8c098] mb-7 leading-relaxed">{product.description}</p>

            {/* Size Selector */}
            <div className="mb-6">
              <p className="text-[10px] font-bold text-[#4a704a] uppercase tracking-[0.15em] mb-3">Select Pack Size</p>
              <div className="flex gap-3">
                {product.sizes.map((sz, index) => (
                  <button
                    key={sz.label}
                    onClick={() => setSelectedSize(index)}
                    className={`flex-1 py-3 px-4 rounded-xl border text-[13px] font-bold text-center transition-all ${
                      selectedSize === index
                        ? 'border-[#c89030] text-[#c89030] bg-[#c89030]/10 shadow-[0_0_0_1px_rgba(200,144,48,0.3)]'
                        : 'border-[#2a4a2c] text-[#a8c098] hover:border-[#c89030]/50 hover:text-[#c89030]'
                    }`}
                  >
                    <span className="block text-[15px]">{sz.label}</span>
                    <span className="block text-[12px] mt-0.5 text-[#c89030]">₹{sz.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-7">
              {product.badges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 bg-[#c89030]/8 px-3 py-1.5 rounded-lg border border-[#c89030]/20"
                >
                  <span className="material-symbols-outlined text-[#c89030] text-[13px]">eco</span>
                  <span className="text-[11px] text-[#e8d8a0] font-semibold">{badge}</span>
                </div>
              ))}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 items-center mb-7">
              <div className="flex items-center justify-between bg-[#122313] rounded-xl p-1.5 border border-[#c89030]/15 w-32 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#a8c098] hover:text-[#c89030] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="text-[15px] font-bold text-[#f0ead6] w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#a8c098] hover:text-[#c89030] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-grow py-3.5 rounded-xl text-[14px] font-bold transition-all duration-250 flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-[#4a6b2a] text-[#f0ead6]'
                    : 'bg-[#c89030] text-[#0c1e0e] hover:bg-[#e8b848] shadow-[0_6px_20px_rgba(200,144,48,0.35)] hover:shadow-[0_8px_28px_rgba(200,144,48,0.5)] active:scale-98'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {added ? 'check_circle' : 'shopping_cart'}
                </span>
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={() => checkAuthAndExecute(() => toggleWishlist({
                  name: product.name,
                  tagline: product.tagline,
                  desc: product.description,
                  image: product.image,
                  category: product.category,
                  slug: slug,
                }))}
                aria-label="Toggle wishlist"
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#c89030]/25 text-[#c89030] hover:bg-[#c89030]/10 hover:border-[#c89030] transition-all duration-300 cursor-pointer shrink-0"
              >
                <span
                  className="material-symbols-outlined text-[20px] select-none text-[#c89030]"
                  style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Features */}
            <ul className="space-y-2.5 pt-6 border-t border-[#c89030]/10">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#a8c098]">
                  <span className="material-symbols-outlined text-[#c89030] text-[16px] mt-0.5 shrink-0">check_small</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* You May Also Like */}
        <section className="pt-12 border-t border-[#c89030]/10">
          <h2 className="font-headline text-[22px] text-[#f0ead6] mb-8 text-center md:text-left">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {suggestedKeys.map((key) => {
              const item = productsDetailsCatalog[key];
              return (
                <Link
                  key={key}
                  href={`/shop/${key}`}
                  className="group block bg-[#122313] rounded-2xl overflow-hidden border border-[#c89030]/10 hover:border-[#c89030]/35 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                  <div className="aspect-square bg-[#0e2010] overflow-hidden">
                    <ProductImage slug={key} className="group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <div>
                      <h3 className="text-[13px] font-bold text-[#f0ead6] group-hover:text-[#c89030] transition-colors">{item.name}</h3>
                      <p className="text-[10px] text-[#c89030] font-semibold uppercase tracking-wide mt-0.5">{item.tagline}</p>
                    </div>
                    <span className="text-[15px] font-bold text-[#c89030]">₹{item.sizes[0].price}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
