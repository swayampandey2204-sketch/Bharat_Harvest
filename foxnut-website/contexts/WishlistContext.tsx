'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ProductItem {
  _id?: string;
  id?: string;
  name: string;
  tagline: string;
  desc?: string;
  image: string;
  category: string;
  slug: string;
  variants?: { packSize: string; price: number; stock: number }[];
  sizes?: { label: string; price: number }[];
}

interface WishlistContextType {
  wishlist: ProductItem[];
  wishlistCount: number;
  addToWishlist: (product: ProductItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: ProductItem) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info') => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<ProductItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dbProductMap, setDbProductMap] = useState<Record<string, string>>({}); // maps slug -> db _id
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' as 'success' | 'info' });

  // Custom Toast handler
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, visible: true, type });
  };

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast.visible, toast.message]);

  // Read login state
  const checkLogin = () => {
    const userStr = localStorage.getItem('bharat-harvest-user');
    return !!userStr;
  };

  // Fetch product mappings (slug -> db _id)
  const fetchDbProductMappings = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/v1/products');
      const data = await res.json();
      if (res.ok && data?.success && data?.data?.products) {
        const mapping: Record<string, string> = {};
        data.data.products.forEach((p: any) => {
          if (p.slug) mapping[p.slug] = p._id;
        });
        setDbProductMap(mapping);
      }
    } catch (e) {
      console.error('Failed to fetch product mappings:', e);
    }
  };

  // Sync wishlist from database or localStorage
  const syncWishlist = async () => {
    const logged = checkLogin();
    setIsLoggedIn(logged);

    if (logged) {
      try {
        // 1. Fetch user's wishlist from DB
        const res = await fetch('http://localhost:5001/api/v1/wishlist', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await res.json();
        
        let dbProducts: ProductItem[] = [];
        if (res.ok && data?.success && data?.data?.products) {
          dbProducts = data.data.products;
        }

        // 2. Check if there are guest items to merge
        const guestWishlistStr = localStorage.getItem('bharat-harvest-wishlist');
        if (guestWishlistStr) {
          const guestItems: ProductItem[] = JSON.parse(guestWishlistStr);
          if (guestItems.length > 0) {
            // Re-fetch mappings just to be sure we have them
            let currentMap = dbProductMap;
            if (Object.keys(currentMap).length === 0) {
              const mapRes = await fetch('http://localhost:5001/api/v1/products');
              const mapData = await mapRes.json();
              if (mapRes.ok && mapData?.success && mapData?.data?.products) {
                const mapping: Record<string, string> = {};
                mapData.data.products.forEach((p: any) => {
                  if (p.slug) mapping[p.slug] = p._id;
                });
                currentMap = mapping;
                setDbProductMap(mapping);
              }
            }

            const dbIds = new Set(dbProducts.map((p) => (p._id || p.id)?.toString()));
            
            for (const item of guestItems) {
              const dbId = currentMap[item.slug];
              if (dbId && !dbIds.has(dbId.toString())) {
                await fetch('http://localhost:5001/api/v1/wishlist/add', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ productId: dbId }),
                  credentials: 'include',
                });
              }
            }

            // Clean guest list from localStorage
            localStorage.removeItem('bharat-harvest-wishlist');

            // Re-fetch final merged database list
            const finalRes = await fetch('http://localhost:5001/api/v1/wishlist', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            });
            const finalData = await finalRes.json();
            if (finalRes.ok && finalData?.success && finalData?.data?.products) {
              dbProducts = finalData.data.products;
            }
          }
        }
        setWishlist(dbProducts);
      } catch (err) {
        console.error('Failed to sync wishlist from database:', err);
      }
    } else {
      // Guest User: Read from localStorage
      try {
        const guestWishlistStr = localStorage.getItem('bharat-harvest-wishlist') || '[]';
        setWishlist(JSON.parse(guestWishlistStr));
      } catch (e) {
        setWishlist([]);
      }
    }
  };

  const start = async () => {
    await fetchDbProductMappings();
    await syncWishlist();
  };

  useEffect(() => {
    start();

    // Listen for auth changes to trigger DB sync
    const handleAuthChange = () => {
      syncWishlist();
    };
    window.addEventListener('bharat-harvest-auth-updated', handleAuthChange);
    
    return () => {
      window.removeEventListener('bharat-harvest-auth-updated', handleAuthChange);
    };
  }, []);

  const addToWishlist = async (product: ProductItem) => {
    if (isLoggedIn) {
      // Map product slug to db ID
      const dbId = dbProductMap[product.slug];
      if (!dbId) {
        console.error('Failed to find DB mapping for slug:', product.slug);
        return;
      }
      try {
        const res = await fetch('http://localhost:5001/api/v1/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: dbId }),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data?.success && data?.data?.products) {
          setWishlist(data.data.products);
          showToast('Added to Wishlist ❤️', 'success');
        } else if (data?.message?.includes('already in wishlist')) {
          showToast('Already in Wishlist', 'info');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Guest
      const guestList = [...wishlist];
      const exists = guestList.some((item) => item.slug === product.slug);
      if (!exists) {
        // Ensure catalog properties match structure
        guestList.push(product);
        localStorage.setItem('bharat-harvest-wishlist', JSON.stringify(guestList));
        setWishlist(guestList);
        showToast('Added to Wishlist ❤️', 'success');
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    // Note: productId could be either database ObjectId OR frontend custom catalog ID (like "raw-premium")
    if (isLoggedIn) {
      // Try to find if this is a db ObjectId or a slug mapping
      let dbId = productId;
      // If not a 24-char hex id, it might be custom slug or custom ID, translate it:
      const matchedMap = Object.entries(dbProductMap).find(([slug, id]) => id === productId || slug === productId);
      if (matchedMap) {
        dbId = matchedMap[1];
      } else {
        // If not found in map, maybe check by finding product in local wishlist
        const localItem = wishlist.find((item) => item.slug === productId || (item._id || item.id) === productId);
        if (localItem) {
          const mappedId = dbProductMap[localItem.slug];
          if (mappedId) dbId = mappedId;
        }
      }

      try {
        const res = await fetch('http://localhost:5001/api/v1/wishlist/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: dbId }),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data?.success && data?.data?.products) {
          setWishlist(data.data.products);
          showToast('Removed from Wishlist', 'info');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Guest
      const guestList = wishlist.filter(
        (item) => (item._id || item.id) !== productId && item.slug !== productId
      );
      localStorage.setItem('bharat-harvest-wishlist', JSON.stringify(guestList));
      setWishlist(guestList);
      showToast('Removed from Wishlist', 'info');
    }
  };

  const isInWishlist = (productId: string) => {
    // Checks if a product is in wishlist.
    // productId can be DB ObjectId, static catalog ID, or slug.
    return wishlist.some((item) => {
      const dbId = dbProductMap[item.slug];
      return (
        (item._id || item.id) === productId ||
        item.slug === productId ||
        dbId === productId ||
        (dbId && dbId === dbProductMap[productId])
      );
    });
  };

  const toggleWishlist = async (product: ProductItem) => {
    const targetId = product.slug;
    if (!targetId) return;

    if (isInWishlist(targetId)) {
      await removeFromWishlist(targetId);
    } else {
      await addToWishlist(product);
    }
  };

  const clearWishlist = async () => {
    if (isLoggedIn) {
      try {
        const res = await fetch('http://localhost:5001/api/v1/wishlist/clear', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (res.ok) {
          setWishlist([]);
          showToast('Wishlist Cleared', 'info');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.removeItem('bharat-harvest-wishlist');
      setWishlist([]);
      showToast('Wishlist Cleared', 'info');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        showToast,
      }}
    >
      {children}

      {/* Global Slide-In Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-[#122313]/95 border border-[#c89030]/40 text-[#f0ead6] px-5 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center gap-3 transition-all duration-300 transform ${
          toast.visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-[#c89030] text-[18px]">
          {toast.type === 'success' ? 'favorite' : 'info'}
        </span>
        <span className="text-[13px] font-semibold tracking-wide">{toast.message}</span>
      </div>
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
