'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/shop';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Resend state
  const [resendLoading, setResendLoading] = useState(false);

  const isUnverifiedError = error && error.toLowerCase().includes('verify your email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Login failed. Please check your credentials.');
      }

      // Save user details to localStorage
      localStorage.setItem('bharat-harvest-user', JSON.stringify(result.data.user));
      
      // Dispatch custom event to notify Navbar of auth state change
      window.dispatchEvent(new Event('bharat-harvest-auth-updated'));

      setSuccess('Logged in successfully! Redirecting...');
      setTimeout(() => {
        router.push(redirectPath);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/v1/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to resend verification email.');
      }
      setSuccess('Verification email sent successfully! Please check your inbox.');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-[#122313]/90 backdrop-blur-md border border-[#c89030]/15 rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      <div className="text-center mb-8">
        <h1 className="font-headline text-[32px] md:text-[36px] text-[#f0ead6] mb-2">Welcome Back</h1>
        <p className="text-[14px] text-[#a8c098]">Sign in to your Bharat Harvest account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-[13px] flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
          {isUnverifiedError && (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="self-start text-[12px] font-semibold text-[#c89030] hover:text-[#e8b848] flex items-center gap-1.5 mt-1 cursor-pointer disabled:opacity-50"
            >
              {resendLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Resend Verification Email
                  <span className="material-symbols-outlined text-[14px]">send</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[13px] flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[12px] font-bold uppercase tracking-wider text-[#a8c098]">
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4a704a] text-[20px]">
              mail
            </span>
            <input
              type="email"
              id="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0c1e0e]/80 border border-[#2a4a2c] focus:border-[#c89030] rounded-xl py-3.5 pl-12 pr-4 text-[#f0ead6] text-[14px] placeholder-[#4a704a] outline-none transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-[12px] font-bold uppercase tracking-wider text-[#a8c098]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-[#c89030] hover:text-[#e8b848] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4a704a] text-[20px]">
              lock
            </span>
            <input
              type="password"
              id="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0c1e0e]/80 border border-[#2a4a2c] focus:border-[#c89030] rounded-xl py-3.5 pl-12 pr-4 text-[#f0ead6] text-[14px] placeholder-[#4a704a] outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c89030] text-[#0c1e0e] py-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#e8b848] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_6px_20px_rgba(200,144,48,0.25)] cursor-pointer mt-8"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-[#0c1e0e] border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              Sign In
              <span className="material-symbols-outlined text-[18px]">login</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-8 pt-6 border-t border-[#c89030]/10">
        <span className="text-[13px] text-[#4a704a]">Don't have an account? </span>
        <Link
          href="/register"
          className="text-[13px] font-semibold text-[#c89030] hover:text-[#e8b848] transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-margin-mobile md:px-margin-desktop">
        <Suspense fallback={
          <div className="text-center py-16 bg-[#122313] rounded-3xl border border-[#c89030]/15 max-w-[450px] w-full">
            <p className="text-[#a8c098]">Loading form parameters...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
