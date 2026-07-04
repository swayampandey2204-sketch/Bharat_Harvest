'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  packSize: string;
  image: string;
  slug?: string;
  quantity: number;
  category: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('bharat-harvest-cart') || '[]');
      setCartItems(cart);
    } catch (e) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = (id: string, packSize: string, delta: number) => {
    const targetItem = cartItems.find((item) => item.id === id && item.packSize === packSize);
    if (targetItem && targetItem.quantity === 1 && delta === -1) {
      removeItem(id, packSize);
      return;
    }

    const updated = cartItems.map((item) =>
      item.id === id && item.packSize === packSize
        ? { ...item, quantity: item.quantity + delta }
        : item
    );
    setCartItems(updated);
    try {
      localStorage.setItem('bharat-harvest-cart', JSON.stringify(updated));
      window.dispatchEvent(new Event('bharat-harvest-cart-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = (id: string, packSize: string) => {
    const updated = cartItems.filter((item) => !(item.id === id && item.packSize === packSize));
    setCartItems(updated);
    try {
      localStorage.setItem('bharat-harvest-cart', JSON.stringify(updated));
      window.dispatchEvent(new Event('bharat-harvest-cart-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 min-h-[80vh] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <div className="flex items-end justify-between border-b border-[#c89030]/15 pb-5">
              <h1 className="font-headline text-[34px] md:text-[40px] text-[#f0ead6]">Your Cart</h1>
              <span className="text-[14px] text-[#a8c098]">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-16 bg-[#122313] rounded-2xl border border-[#c89030]/10">
                <p className="text-[#a8c098]">Loading your cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-20 bg-[#122313] rounded-2xl border border-[#c89030]/10 flex flex-col items-center">
                <span className="material-symbols-outlined text-[56px] text-[#2a4a2c] mb-4">shopping_cart</span>
                <p className="text-[18px] text-[#a8c098] mb-2">Your cart is empty</p>
                <p className="text-[14px] text-[#4a704a] mb-8">Looks like you haven't added anything yet.</p>
                <Link
                  href="/shop"
                  className="bg-[#c89030] text-[#0c1e0e] px-8 py-3 rounded-full font-semibold text-[14px] hover:bg-[#e8b848] transition-all shadow-[0_4px_16px_rgba(200,144,48,0.3)]"
                >
                  Shop Our Collection
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.packSize}`}
                    className="flex gap-4 md:gap-5 p-4 bg-[#122313] rounded-2xl border border-[#c89030]/10 hover:border-[#c89030]/25 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-[#0e2010] shrink-0 border border-[#c89030]/10">
                      <ProductImage slug={item.slug || 'raw-premium-makhana'} />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between flex-grow py-0.5 min-w-0">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <h3 className="font-headline text-[16px] text-[#f0ead6] truncate">{item.name}</h3>
                          <p className="text-[12px] text-[#4a704a] mt-0.5">
                            {item.category} &bull; {item.packSize}
                          </p>
                        </div>
                        <span className="text-[16px] font-bold text-[#c89030] shrink-0">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        {/* Qty controls */}
                        <div className="flex items-center gap-1.5 border border-[#2a4a2c] rounded-lg p-1 bg-[#0e2010]">
                          <button
                            onClick={() => updateQuantity(item.id, item.packSize, -1)}
                            aria-label="Decrease"
                            className="w-7 h-7 flex items-center justify-center text-[#a8c098] hover:text-[#c89030] transition-colors rounded-md"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="text-[13px] font-bold w-6 text-center text-[#f0ead6]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.packSize, 1)}
                            aria-label="Increase"
                            className="w-7 h-7 flex items-center justify-center text-[#a8c098] hover:text-[#c89030] transition-colors rounded-md"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id, item.packSize)}
                          className="text-[12px] font-semibold text-[#4a704a] hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-5 xl:col-span-4 mt-6 lg:mt-0">
              <div className="bg-[#122313] rounded-2xl p-6 md:p-8 border border-[#c89030]/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sticky top-24">
                <h2 className="font-headline text-[22px] text-[#f0ead6] mb-6">Order Summary</h2>

                {/* Line items */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[14px] text-[#a8c098]">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[14px] text-[#a8c098]">
                    <span>Shipping</span>
                    <span className="text-[#c89030] font-semibold">Free</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-[#c89030]/20 to-transparent my-2"></div>
                  <div className="flex justify-between items-end pt-1">
                    <span className="text-[16px] font-semibold text-[#f0ead6]">Total</span>
                    <span className="text-[26px] font-headline text-[#c89030] font-bold">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-[#c89030] text-[#0c1e0e] py-4 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 mb-6 hover:bg-[#e8b848] active:scale-98 transition-all shadow-[0_6px_20px_rgba(200,144,48,0.35)] cursor-pointer">
                  Proceed to Checkout
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#c89030]/10">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#c89030]/10 flex items-center justify-center text-[#c89030]">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <span className="text-[11px] text-[#4a704a]">Secure Checkout</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#c89030]/10 flex items-center justify-center text-[#c89030]">
                      <span className="material-symbols-outlined text-[18px]">eco</span>
                    </div>
                    <span className="text-[11px] text-[#4a704a]">100% Natural</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
