'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { wishlistCount } = useWishlist();

  const updateUser = () => {
    try {
      const storedUser = localStorage.getItem('bharat-harvest-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5001/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      // Always clear local state even if backend request fails
      localStorage.removeItem('bharat-harvest-user');
      setUser(null);
      window.dispatchEvent(new Event('bharat-harvest-auth-updated'));
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    onScroll();

    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('bharat-harvest-cart') || '[]');
        const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(total);
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCartCount();
    updateUser();

    window.addEventListener('bharat-harvest-cart-updated', updateCartCount);
    window.addEventListener('bharat-harvest-auth-updated', updateUser);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('bharat-harvest-cart-updated', updateCartCount);
      window.removeEventListener('bharat-harvest-auth-updated', updateUser);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0c1e0e]/96 backdrop-blur-md border-b border-[#c89030]/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-[#0c1e0e]/85 backdrop-blur-sm'
      }`}
    >
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        {/* Brand Logo — always gold */}
        <Link
          href="/"
          className="font-headline text-[22px] md:text-[28px] text-[#c89030] tracking-tight hover:text-[#e8b848] transition-colors duration-200"
        >
          Bharat Harvest
        </Link>

        {/* Navigation Links — Desktop */}
        <nav className="hidden md:flex gap-8 items-center">
          {[
            { label: 'Products', href: '/shop' },
            { label: 'About', href: '/about' },
            { label: 'Benefits', href: '/#benefits' },
            { label: 'Contact', href: '#footer' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-semibold uppercase tracking-widest text-[#a8c098] hover:text-[#c89030] transition-colors duration-200 py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label="View wishlist"
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#c89030]/10 text-[#c89030] hover:text-[#e8b848] transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c89030] text-[#0c1e0e] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            aria-label="View cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#c89030]/10 text-[#c89030] hover:text-[#e8b848] transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c89030] text-[#0c1e0e] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Sign In / Profile Action */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-[13px] text-[#a8c098] font-medium">
                Hello, <span className="text-[#f0ead6] font-bold">{user.name.split(' ')[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-[12px] font-bold uppercase tracking-wider bg-transparent border border-[#c89030]/30 hover:border-[#c89030] text-[#c89030] px-4 py-2 rounded-full transition-all cursor-pointer hover:bg-[#c89030]/10"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-block text-[12px] font-bold uppercase tracking-wider bg-[#c89030] hover:bg-[#e8b848] text-[#0c1e0e] px-5 py-2 rounded-full transition-all"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#c89030]/10 text-[#c89030] transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e2010] border-t border-[#c89030]/15 px-6 py-5 flex flex-col gap-4">
          {[
            { label: 'Products', href: '/shop' },
            { label: 'Wishlist', href: '/wishlist' },
            { label: 'About', href: '/about' },
            { label: 'Benefits', href: '/#benefits' },
            { label: 'Contact', href: '#footer' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[13px] font-semibold uppercase tracking-widest text-[#f0ead6] hover:text-[#c89030] py-2 border-b border-[#c89030]/10 transition-colors last:border-b-0"
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Auth Actions */}
          {user ? (
            <div className="flex flex-col gap-3 pt-3 border-t border-[#c89030]/15">
              <span className="text-[13px] text-[#a8c098]">
                Signed in as <span className="text-[#f0ead6] font-bold">{user.name}</span>
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center py-2.5 rounded-lg border border-[#c89030]/30 text-[#c89030] font-bold text-[13px] uppercase tracking-wider"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-[#c89030] text-[#0c1e0e] font-bold text-[13px] uppercase tracking-wider block"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

