'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  // Resend Form State
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      handleVerify(token);
    } else {
      setStatus('error');
      setMessage('Verification token is missing. Please check the link or request a new verification email below.');
    }
  }, [token]);

  const handleVerify = async (verifyToken: string) => {
    setVerifying(true);
    setStatus('idle');
    setMessage(null);

    try {
      const response = await fetch(`http://localhost:5001/api/v1/auth/verify-email?token=${encodeURIComponent(verifyToken)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Email verification failed.');
      }

      setStatus('success');
      setMessage('Email verified successfully.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Verification link is invalid or has expired.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendError(null);
    setResendSuccess(null);
    setResendLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/v1/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resendEmail }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to resend verification email.');
      }

      setResendSuccess('Verification email sent successfully.');
      setResendEmail('');
    } catch (err: any) {
      setResendError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-[#122313]/90 backdrop-blur-md border border-[#c89030]/15 rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      {verifying && (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-[#c89030] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="font-headline text-[22px] text-[#f0ead6] mb-2">Verifying Your Email</h2>
          <p className="text-[14px] text-[#a8c098]">Please wait while we activate your account...</p>
        </div>
      )}

      {!verifying && status === 'success' && (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <span className="material-symbols-outlined text-[36px]">verified</span>
          </div>
          <h2 className="font-headline text-[24px] text-[#f0ead6] mb-3">Account Verified!</h2>
          <p className="text-[14px] text-[#a8c098] leading-relaxed mb-8">{message}</p>
          <Link
            href="/login"
            className="inline-block w-full bg-[#c89030] text-[#0c1e0e] py-3.5 rounded-xl font-bold text-[14px] hover:bg-[#e8b848] transition-all text-center shadow-[0_4px_15px_rgba(200,144,48,0.25)]"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {!verifying && status === 'error' && (
        <div>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-red-400">
              <span className="material-symbols-outlined text-[36px]">error</span>
            </div>
            <h2 className="font-headline text-[24px] text-[#f0ead6] mb-3">Verification Failed</h2>
            <p className="text-[14px] text-red-300 bg-red-950/20 border border-red-500/10 p-3 rounded-xl leading-relaxed mb-6">
              {message}
            </p>
          </div>

          {/* Resend Card Area */}
          <div className="border-t border-[#c89030]/10 pt-6 mt-6">
            <h3 className="text-[14px] font-headline text-[#f0ead6] mb-2">Request New Link</h3>
            <p className="text-[12px] text-[#a8c098] mb-4">
              Enter your registration email below to receive a new secure verification email.
            </p>

            {resendSuccess && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[12px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{resendSuccess}</span>
              </div>
            )}

            {resendError && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-[12px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{resendError}</span>
              </div>
            )}

            <form onSubmit={handleResendSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full bg-[#0c1e0e]/80 border border-[#2a4a2c] focus:border-[#c89030] rounded-xl py-3 px-4 text-[#f0ead6] text-[13px] outline-none placeholder-[#4a704a] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={resendLoading}
                className="w-full bg-[#2a4a2c] hover:bg-[#c89030] hover:text-[#0c1e0e] text-[#a8c098] py-3 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {resendLoading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Resend Verification Link
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Back link */}
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

export default function VerifyEmailPage() {
  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-margin-mobile md:px-margin-desktop">
        <Suspense fallback={
          <div className="text-center py-16 bg-[#122313] rounded-3xl border border-[#c89030]/15 max-w-[480px] w-full">
            <p className="text-[#a8c098]">Loading parameters...</p>
          </div>
        }>
          <VerifyEmailForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
