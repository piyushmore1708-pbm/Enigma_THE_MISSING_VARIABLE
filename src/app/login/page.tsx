'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEstate } from '@/context/EstateContext';
import { 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { personas, loadPersona, loginUser } = useEstate();
  const [authMethod, setAuthMethod] = useState<'otp' | 'google'>('otp');
  const [identifier, setIdentifier] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      loginUser({
        name: 'Claimant Representative',
        emailOrPhone: identifier,
        role: 'Verified Family Claimant (OTP)',
      });
      router.push('/overview');
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      loginUser({
        name: 'Pooja Sharma',
        emailOrPhone: 'pooja.sharma@gmail.com',
        role: 'Google Authenticated Claimant',
      });
      router.push('/overview');
    }, 600);
  };

  const handleQuickDemoAccess = async () => {
    setIsSubmitting(true);
    if (personas.length > 0) {
      await loadPersona(personas[0].id);
    }
    loginUser({
      name: 'Pooja Sharma',
      emailOrPhone: 'pooja.sharma@example.com',
      role: 'Primary Claimant (Spouse of Late Ramesh)',
    });
    router.push('/overview');
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6 animate-fadeIn">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-800 text-teal-200 flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-7 h-7 text-teal-300" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Claim Sathi</h1>
        <p className="text-xs text-slate-500">
          Secure, compassionate access to your family's estate settlement records
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Method Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              setOtpSent(false);
            }}
            className={`py-2 rounded-lg transition-all ${
              authMethod === 'otp'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claimant Mobile / OTP
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('google')}
            className={`py-2 rounded-lg transition-all ${
              authMethod === 'google'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In with Google
          </button>
        </div>

        {/* Tab 1: OTP / Mobile */}
        {authMethod === 'otp' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Claimant Mobile Number or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. +91 98765 43210 or name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 pl-9"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    We will send a 4-digit verification code. No password needed.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl text-xs shadow transition flex items-center justify-center gap-1.5"
                >
                  <span>{isSubmitting ? 'Sending Code...' : 'Send Verification OTP'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl text-xs text-teal-900 flex items-center justify-between">
                  <span>Code sent to <strong>{identifier}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-teal-700 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter 4-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block text-center">
                    (For demo testing, enter any 4 digits)
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl text-xs shadow transition flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying...' : 'Verify & Access Estate Workspace'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Google Sign In */}
        {authMethod === 'google' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3 px-4 rounded-xl border border-slate-300 shadow-sm transition text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isSubmitting ? 'Signing in...' : 'Sign in with Google Account'}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Authenticate securely with your Google email to synchronize saved estate documents.
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="relative border-t border-slate-200">
          <div className="absolute inset-0 flex items-center justify-center -top-2.5">
            <span className="bg-white px-3 text-[11px] text-slate-400 font-medium">
              Hackathon Reviewer Quick Access
            </span>
          </div>
        </div>

        {/* 1-Click Demo Access Button */}
        <button
          type="button"
          onClick={handleQuickDemoAccess}
          className="w-full bg-slate-900 hover:bg-slate-800 text-teal-300 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-slate-700 shadow-sm transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Quick Demo Access (Skip Login & View Persona A)</span>
        </button>
      </div>

      {/* Trust & Privacy Notice */}
      <div className="text-center text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-slate-600 font-medium">
          <Lock className="w-3.5 h-3.5 text-teal-700" />
          <span>Zero Commercial Advertising or Third-Party Data Sharing</span>
        </div>
        <p>Your bereavement files remain strictly confidential and encrypted.</p>
      </div>
    </div>
  );
}
