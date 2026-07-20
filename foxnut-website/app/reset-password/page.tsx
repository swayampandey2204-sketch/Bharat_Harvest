'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { API_BASE_URL } from '@/utils/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset token or link has expired.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Enforce frontend checks
    if (!token) {
      setError('Reset token is missing from the URL.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Password reset failed.');
      }

      setSuccess('Password updated successfully. Redirecting to Sign In...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-[#122313]/90 backdrop-blur-md border border-[#c89030]/15 rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      <div className="text-center mb-8">
        <h1 className="font-headline text-[32px] md:text-[36px] text-[#f0ead6] mb-2 leading-tight">
          Reset Password
        </h1>
        <p className="text-[14px] text-[#a8c098] leading-relaxed">
          Please enter and confirm your new secure password.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-[13px] flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[13px] flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-[12px] font-bold uppercase tracking-wider text-[#a8c098]">
            New Password
          </label>
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-[12px] font-bold uppercase tracking-wider text-[#a8c098]">
            Confirm New Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4a704a] text-[20px]">
              lock
            </span>
            <input
              type="password"
              id="confirmPassword"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0c1e0e]/80 border border-[#2a4a2c] focus:border-[#c89030] rounded-xl py-3.5 pl-12 pr-4 text-[#f0ead6] text-[14px] placeholder-[#4a704a] outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-[#c89030] text-[#0c1e0e] py-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#e8b848] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_6px_20px_rgba(200,144,48,0.25)] cursor-pointer mt-8"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-[#0c1e0e] border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              Reset Password
              <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            </>
          )}
        </button>
      </form>

      {/* Return to Sign In */}
      <div className="text-center mt-8 pt-6 border-t border-[#c89030]/10">
        <Link
          href="/login"
          className="text-[13px] font-semibold text-[#c89030] hover:text-[#e8b848] transition-colors"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-margin-mobile md:px-margin-desktop">
        <Suspense fallback={
          <div className="text-center py-16 bg-[#122313] rounded-3xl border border-[#c89030]/15 max-w-[450px] w-full">
            <p className="text-[#a8c098]">Loading parameters...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
