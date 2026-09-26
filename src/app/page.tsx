'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEstate } from '@/context/EstateContext';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Building, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  Coins, 
  Compass,
  UserCheck
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const { personas, loadPersona } = useEstate();

  const handleQuickLoadPersona = async (personaId: string) => {
    await loadPersona(personaId);
    router.push('/overview');
  };

  return (
    <div className="space-y-16 animate-fadeIn py-4">
      {/* Empathetic Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-8 sm:p-14 shadow-2xl overflow-hidden border border-slate-700/60">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <HeartHandshake className="w-4 h-4" />
            <span>Dedicated to Supporting Families in Bereavement</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Empathetic, Structured Financial Closure for Indian Families.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            When a loved one passes away, grief should not be compounded by bureaucratic chaos, 
            unexpected bank bounce fees, or lost inheritances. Claim Sathi provides a calm, guided roadmap 
            to protect your family, freeze loans, claim EPFO benefits, and settle estate accounts under Indian law.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/triage"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all text-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Start Guided Estate Intake</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/overview"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3.5 rounded-xl border border-slate-600 transition-all text-sm"
            >
              <span>Explore Active Case Workspace</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-teal-300 hover:text-white px-4 py-3.5 text-sm font-semibold transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Claimant Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Hackathon Judge / Reviewer Interactive Quick-Test Showcase */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Interactive Judging Showcase</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              One-Click Demo Personas (Pre-Seeded Real-World Cases)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select either scenario below to immediately load a fully populated case into the workspace:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personas.map((persona) => {
            const isTechie = persona.id.includes('salaried');
            return (
              <div
                key={persona.id}
                className="group relative rounded-2xl p-6 border-2 transition-all flex flex-col justify-between hover:shadow-lg border-slate-200 hover:border-teal-400 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-2xl">{isTechie ? '👔' : '👵'}</span>
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                      {persona.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition">
                    {persona.name}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    {persona.tagline}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {persona.description}
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1.5 text-slate-700 mb-6">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>Discovered Value:</span>
                      <strong className="text-teal-700">
                        {formatINR(persona.state.assets.reduce((sum, a) => sum + (a.estimatedValue || 0), 0))}
                      </strong>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {isTechie
                        ? 'Includes HDFC Home Loan moratorium, EPFO ₹7L EDLI assurance, and term life claim'
                        : 'Includes PNB dormant deposit for UDGAM search and physical Reliance shares for IEPF recovery'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickLoadPersona(persona.id)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition group-hover:shadow-md"
                >
                  <span>Load {persona.name.split(' ')[1]} Case & Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 Core Pillars of Financial Closure */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for the Indian Financial Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Navigating statutory guidelines under RBI, EPFO, SEBI, IRDAI, and the Ministry of Corporate Affairs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Emergency 30-Day Playbook
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Prioritized milestones: Days 1–7 (Freeze auto-debits, procure municipal death certificates), 
                Days 8–30 (Notify employer & banks), Days 30+ (Legal heir certificates & probate).
              </p>
            </div>
            <Link
              href="/playbook"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>Explore Playbook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Statutory Claim Packs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Form-fillable RBI bank survivor claims (Para 19 15-day settlement mandate), 
                EPFO Forms 20, 10D, and Form 5IF (EDLI ₹7L life insurance cover for active members).
              </p>
            </div>
            <Link
              href="/claims"
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <span>View Claim Packets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Liability Shield
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Instant formal moratorium and death intimation letters to banks to freeze NACH auto-debits, 
                stop unlawful debt recovery calls, and trigger credit protection insurance.
              </p>
            </div>
            <Link
              href="/liabilities"
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <span>Generate Moratorium</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Unclaimed Wealth Radar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Guided search directives and recovery walkthroughs for dormant bank deposits (&gt;10 yrs) on 
                <strong> RBI UDGAM</strong> and forgotten physical shares (&gt;7 yrs) on <strong>MCA IEPF</strong>.
              </p>
            </div>
            <Link
              href="/unclaimed"
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>Search Portals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Statutory Reassurance */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Knowledge & Privacy-First Architecture</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Your Family’s Privacy is Sacred</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Claim Sathi does not store sensitive credentials or bank passwords. All calculations, letters, 
            and checklists are generated locally for your immediate physical filing with official branches 
            and government portals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span>Aligned with RBI Master Circular on Deceased Depositors (Para 19)</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span>EPFO EDLI Scheme (Section 6C) Life Cover up to ₹7,00,000</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span>Companies Act Section 124(6) IEPF Share Transmission Rules</span>
          </div>
        </div>
      </section>
    </div>
  );
}
