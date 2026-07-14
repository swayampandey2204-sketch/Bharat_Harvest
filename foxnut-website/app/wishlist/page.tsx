'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductImage from '@/components/ProductImage';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, showToast } = useWishlist();
  const router = useRouter();

  React.useEffect(() => {
    const userStr = localStorage.getItem('bharat-harvest-user');
    if (!userStr) {
      router.push(`/login?redirect=${encodeURIComponent('/wishlist')}`);
    }
  }, [router]);

  const handleAddToCart = (product: any) => {
    try {
      const cart = JSON.parse(localStorage.getItem('bharat-harvest-cart') || '[]');
      
      // Determine pack size and price
      const packSize = product.sizes 
        ? product.sizes[0].label 
        : (product.variants ? product.variants[0].packSize : '100g Bag');
        
      const price = product.sizes 
        ? product.sizes[0].price 
        : (product.variants ? product.variants[0].price : 229);
        
      const productId = product.id || product._id || product.slug;

      const existingIndex = cart.findIndex(
        (item: any) => item.id === productId && item.packSize === packSize
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: product.name,
          price: price,
          packSize: packSize,
          image: product.image,
          slug: product.slug,
          quantity: 1,
          category: product.category === 'raw' ? 'Raw Sourcing' : 'Flavoured Roast',
        });
      }

      localStorage.setItem('bharat-harvest-cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('bharat-harvest-cart-updated'));
      showToast('Added to Cart! 🛒', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to add to cart', 'info');
    }
  };

  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 border-b border-[#c89030]/10 pb-6">
          <div className="text-center md:text-left">
            <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block">
              Saved Collections
            </span>
            <h1 className="font-headline text-[32px] md:text-[44px] text-[#f0ead6]">
              Your Wishlist
            </h1>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-6 py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 text-[13px] font-bold transition-all cursor-pointer active:scale-95"
            >
              Clear All Items
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-md mx-auto">
            {/* Premium Empty State Illustration */}
            <div className="w-48 h-48 rounded-full bg-[#122313] border border-[#c89030]/10 flex items-center justify-center mb-8 shadow-inner relative group">
              <svg 
                className="w-20 h-20 text-[#c89030]/40 group-hover:text-[#c89030] transition-colors duration-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={1.2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <div className="absolute inset-0 rounded-full border border-gradient-to-tr from-[#c89030] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>
            
            <h2 className="font-headline text-[22px] text-[#f0ead6] mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-[14px] text-[#a8c098] mb-8 leading-relaxed">
              Save your favorite wood-fired, roasted makhana snacks here to enjoy mindful snacking anytime!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#c89030] text-[#0c1e0e] px-8 py-3 rounded-full font-bold text-[13px] hover:bg-[#e8b848] transition-all shadow-[0_6px_20px_rgba(200,144,48,0.3)] active:scale-98"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {wishlist.map((product) => {
              const targetId = product._id || product.id || product.slug;
              
              // Get price dynamically
              const price = product.sizes 
                ? product.sizes[0].price 
                : (product.variants ? product.variants[0].price : 229);

              // Stock Status
              const stock = product.variants ? product.variants[0].stock : 10;
              const inStock = stock > 0;

              return (
                <div
                  key={targetId}
                  className="bg-[#122313] rounded-2xl overflow-hidden border border-[#c89030]/10 hover:border-[#c89030]/35 transition-all duration-350 flex flex-col group shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] hover:-translate-y-1"
                >
                  {/* Image wrapper */}
                  <div className="relative w-full aspect-square bg-[#0e2010] overflow-hidden">
                    <Link href={`/shop/${product.slug}`} className="block w-full h-full">
                      <ProductImage slug={product.slug} className="group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    
                    {/* Remove Action Button */}
                    <button
                      onClick={() => removeFromWishlist(targetId)}
                      aria-label="Remove item"
                      className="absolute top-3 right-3 z-10 w-8.5 h-8.5 rounded-full bg-[#0c1e0e]/80 hover:bg-[#0c1e0e] border border-red-500/20 hover:border-red-500/50 flex items-center justify-center text-red-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-[17px]">close</span>
                    </button>

                    {/* Stock Status Badge */}
                    <span 
                      className={`absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${
                        inStock 
                          ? 'bg-[#122313]/90 text-[#a8c098] border-[#c89030]/20' 
                          : 'bg-red-950/90 text-red-400 border-red-500/20'
                      }`}
                    >
                      {inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="font-headline text-[16px] text-[#f0ead6] mb-0.5 hover:text-[#c89030] transition-colors leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#c89030] font-semibold uppercase tracking-wide mb-3">
                      {product.tagline}
                    </p>
                    
                    {product.desc && (
                      <p className="text-[12px] text-[#a8c098] mb-4 line-clamp-2 leading-relaxed">
                        {product.desc}
                      </p>
                    )}

                    {/* Price + Actions */}
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#c89030]/10">
                      <div className="flex flex-col">
                        <span className="text-[20px] font-headline text-[#c89030] font-bold leading-none">
                          ₹{price}
                        </span>
                        <span className="text-[10px] text-[#4a704a] mt-0.5">
                          {product.sizes ? product.sizes[0].label : (product.variants ? product.variants[0].packSize : '100g')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-200 ${
                          inStock
                            ? 'bg-[#c89030] text-[#0c1e0e] hover:bg-[#e8b848] shadow-[0_4px_12px_rgba(200,144,48,0.3)] active:scale-95'
                            : 'bg-transparent border border-red-500/20 text-red-500/50 cursor-not-allowed'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">shopping_cart</span>
                        Add to Cart
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
