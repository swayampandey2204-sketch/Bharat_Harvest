'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardContextType {
  isLoggedIn: boolean;
  checkAuthAndExecute: (action: () => void) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthGuardContext = createContext<AuthGuardContextType | undefined>(undefined);

export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkLogin = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('bharat-harvest-user');
    }
    return false;
  };

  useEffect(() => {
    setIsLoggedIn(checkLogin());

    const handleAuthChange = () => {
      setIsLoggedIn(checkLogin());
    };
    window.addEventListener('bharat-harvest-auth-updated', handleAuthChange);
    return () => {
      window.removeEventListener('bharat-harvest-auth-updated', handleAuthChange);
    };
  }, []);

  const openAuthModal = () => {
    setIsModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsModalOpen(false);
  };

  const checkAuthAndExecute = (action: () => void) => {
    if (checkLogin()) {
      action();
    } else {
      openAuthModal();
    }
  };

  const handleSignInRedirect = () => {
    setIsModalOpen(false);
    // Redirect to login page and pass the current page URL as a redirect query parameter
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  };

  return (
    <AuthGuardContext.Provider value={{ isLoggedIn, checkAuthAndExecute, openAuthModal, closeAuthModal }}>
      {children}

      {/* Premium Authentication Required Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={closeAuthModal}
            className="absolute inset-0 bg-[#071308]/85 backdrop-blur-sm transition-opacity duration-300"
          />
          
          {/* Modal Content */}
          <div className="bg-[#122313] border border-[#c89030]/25 rounded-3xl p-6 md:p-8 max-w-sm w-full relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center animate-scale-up">
            {/* Elegant Icon */}
            <div className="w-16 h-16 rounded-full bg-[#c89030]/10 border border-[#c89030]/25 flex items-center justify-center mx-auto mb-6 text-[#c89030]">
              <span className="material-symbols-outlined text-[32px]">lock</span>
            </div>

            <h2 className="font-headline text-[22px] text-[#f0ead6] mb-3 leading-snug">
              Authentication Required
            </h2>
            
            <p className="text-[14px] text-[#a8c098] leading-relaxed mb-8">
              Please sign in to add products to your Wishlist or Cart.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSignInRedirect}
                className="w-full py-3 bg-[#c89030] text-[#0c1e0e] font-bold text-[13px] rounded-xl hover:bg-[#e8b848] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(200,144,48,0.25)] cursor-pointer"
              >
                Sign In
              </button>
              
              <button
                onClick={closeAuthModal}
                className="w-full py-3 bg-transparent border border-[#2a4a2c] text-[#a8c098] hover:text-[#f0ead6] hover:border-[#c89030]/30 font-bold text-[13px] rounded-xl active:scale-[0.98] transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuardContext.Provider>
  );
}

export function useAuthGuard() {
  const context = useContext(AuthGuardContext);
  if (!context) {
    throw new Error('useAuthGuard must be used within an AuthGuardProvider');
  }
  return context;
}
