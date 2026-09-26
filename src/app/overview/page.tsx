'use client';

import React from 'react';
import Link from 'next/link';
import { useEstate } from '@/context/EstateContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Landmark, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  HeartHandshake, 
  TrendingUp, 
  Calendar, 
  FileCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';
import { STATUTORY_PROVISIONS } from '@/lib/constants/statutoryProvisions';

export default function OverviewDashboardPage() {
  const { state, personas, loadPersona, activePersonaId } = useEstate();

  const totalAssets = state.assets.reduce((sum, a) => sum + (a.estimatedValue || 0), 0);
  const totalLiabilities = state.liabilities.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);
  const completedTasks = state.tasks.filter((t) => t.completed).length;
  const totalTasks = state.tasks.length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const availableDocs = state.documents.filter((d) => d.isAvailable).length;
  const totalDocs = state.documents.length;

  const urgentLiabilities = state.liabilities.filter((l) => l.autoDebitActive && !l.noticeSent);
  const hasEpfoAsset = state.assets.some((a) => a.category === 'epf_ppf');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Empathetic Welcome & Case Summary Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-medium mb-3 border border-teal-500/30">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Active Estate Closure Workspace</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              {state.deceased.fullName ? (
                <>Estate Settlement for <span className="text-teal-300">Late {state.deceased.fullName}</span></>
              ) : (
                'Digital Estate & Financial Closure Assistant'
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-300 mt-2">
              {state.deceased.dateOfPassing && (
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  Date of Passing: <strong className="text-white">{formatDate(state.deceased.dateOfPassing)}</strong>
                </span>
              )}
              {state.claimant.fullName && (
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  Primary Claimant: <strong className="text-white">{state.claimant.fullName}</strong> ({state.claimant.relationship})
                </span>
              )}
              {state.deceased.employerName && (
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  <Building className="w-3.5 h-3.5 text-teal-400" />
                  Last Employer: <strong className="text-white">{state.deceased.employerName}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Quick Action CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/triage"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg transition-all text-sm"
            >
              <span>{state.deceased.fullName ? 'Review Intake Details' : 'Begin Guided Intake'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/playbook"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl border border-slate-600 transition-all text-sm"
            >
              <Clock className="w-4 h-4 text-teal-400" />
              <span>30-Day Playbook</span>
            </Link>
          </div>
        </div>

        {/* Demo Switcher Quick Bar */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Evaluating this system? Switch personas to test different financial estate profiles:
          </span>
          <div className="flex items-center gap-2">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPersona(p.id)}
                className={`px-3 py-1 rounded-lg transition-all text-xs font-medium border ${
                  activePersonaId === p.id
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border-slate-700'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Critical Alert Banners (Liability & EPFO EDLI) */}
      <div className="space-y-3">
        {urgentLiabilities.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-800 flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Critical Action Needed: Active Loan Auto-Debits Detected
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  {urgentLiabilities.length} active automated repayment (NACH/ECS) mandate is scheduled. 
                  Inward ECS bounces will incur penalty charges and civil recovery notices unless formal death intimation is delivered.
                </p>
              </div>
            </div>
            <Link
              href="/liabilities"
              className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Generate Moratorium Notice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {hasEpfoAsset && (
          <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-800 flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-teal-950">
                  EPFO EDLI Statutory Benefit: Up to ₹7,00,000 Life Insurance Claim
                </h4>
                <p className="text-xs text-teal-800 mt-0.5 leading-relaxed">
                  As an active EPF member, the deceased's nominee is entitled to an automatic life insurance payout 
                  under <strong>Form 5IF (EDLI)</strong> with zero employee contribution required.
                </p>
              </div>
            </div>
            <Link
              href="/claims"
              className="flex-shrink-0 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>View EPFO Claim Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* 4 Financial Health Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Discovered Assets */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recoverable Assets
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatINR(totalAssets)}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-teal-700">{state.assets.length} holdings</span> across banks, EPF, insurance & demat
          </div>
        </div>

        {/* Known Liabilities */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Outstanding Liabilities
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatINR(totalLiabilities)}</div>
          <div className="text-xs text-slate-500 mt-1">
            {state.liabilities.length === 0 ? (
              <span className="text-emerald-700 font-medium">No debts recorded</span>
            ) : (
              <span>{state.liabilities.length} active credit lines under review</span>
            )}
          </div>
        </div>

        {/* Playbook Progress */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              30-Day Closure Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{progressPct}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1.5">
            {completedTasks} of {totalTasks} milestones completed
          </div>
        </div>

        {/* Document Readiness */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Document Readiness
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {availableDocs} / {totalDocs}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {availableDocs === totalDocs && totalDocs > 0 ? (
              <span className="text-emerald-700 font-medium">All prerequisite documents ready</span>
            ) : (
              <span>Prerequisites gathered for filing</span>
            )}
          </div>
        </div>
      </section>

      {/* Main Workflow Gateway Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Structured Closure Modules</h2>
          <span className="text-xs text-slate-500">Follow sequentially for minimal stress</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: 30-Day Playbook */}
          <Link
            href="/playbook"
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-800 transition">
                  30-Day Emergency Playbook
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                  Phase 1
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Chronologically tiered tasks categorized into Days 1–7 (Urgent debits & certificates), 
                Days 8–30 (Bank & EPFO intimation), and Days 30+ (Probate & legal heir certs).
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
              <span>Open Interactive Playbook</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 2: Indian Claim Packs */}
          <Link
            href="/claims"
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-800 transition">
                  Indian Claim Packs & Dossier
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                  Phase 2
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Pre-formatted, form-fillable claim dossiers for Indian Banks (RBI Para 19), 
                EPFO (Forms 20, 10D, 5IF), and legal indemnity bonds for un-nominated assets.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-indigo-700 group-hover:translate-x-1 transition-transform">
              <span>Generate Claim Dossier</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 3: Liability Shield */}
          <Link
            href="/liabilities"
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition">
                  Liability Shield & EMI Freeze
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                  Protection
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Generate formal notices to lenders to suspend auto-debits, activate credit life insurance policies, 
                and stop unlawful recovery calls against surviving relatives.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Draft Moratorium Notice</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>

        {/* Secondary Gateway: Unclaimed Wealth Finder (UDGAM & IEPF) */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-teal-950 text-base">
                  Unclaimed Assets Discovery: RBI UDGAM & MCA IEPF
                </h3>
                <span className="text-[11px] px-2 py-0.5 bg-teal-200/80 text-teal-900 font-semibold rounded-full">
                  Over ₹78,000 Cr Unclaimed in India
                </span>
              </div>
              <p className="text-xs text-teal-800 mt-1 max-w-2xl leading-relaxed">
                Check whether your deceased family member had forgotten bank deposits (dormant for 10+ years in RBI DEAF) 
                or physical company shares transferred to the Investor Education and Protection Fund (IEPF).
              </p>
            </div>
          </div>
          <Link
            href="/unclaimed"
            className="flex-shrink-0 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 self-start md:self-auto"
          >
            <span>Explore Discovery Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Discovered Estate Assets Table Preview */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Current Discovered Estate Assets</h3>
            <p className="text-xs text-slate-500">Holdings registered under the deceased's name</p>
          </div>
          <Link
            href="/triage"
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition flex items-center gap-1"
          >
            <span>+ Add / Modify Assets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {state.assets.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">No assets discovered yet.</p>
            <Link
              href="/triage"
              className="mt-2 inline-block text-xs font-semibold text-teal-700 hover:underline"
            >
              Run Guided Triage to catalog holdings
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Institution & Account</th>
                  <th className="py-2.5 px-3">Nominee Registered?</th>
                  <th className="py-2.5 px-3">Estimated Value</th>
                  <th className="py-2.5 px-3">Claim Forms Required</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 capitalize font-medium text-slate-700">
                      {asset.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{asset.institutionName}</div>
                      <div className="text-[11px] text-slate-500">{asset.accountOrFolioNumber || 'Account number pending'}</div>
                    </td>
                    <td className="py-3 px-3">
                      {asset.hasNomineeRegistered === 'yes' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{asset.nomineeName || 'Yes'}</span>
                        </span>
                      ) : asset.hasNomineeRegistered === 'no' ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>No Nominee (Legal Heir / Indemnity Req)</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Not verified</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {formatINR(asset.estimatedValue)}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {asset.relevantForms && asset.relevantForms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {asset.relevantForms.map((f, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">Standard claim form</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize bg-teal-50 text-teal-800 border border-teal-200">
                        {asset.claimStatus.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Statutory Rights Educational Spotlight */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-medium mb-2 border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Essential Statutory Knowledge</span>
          </div>
          <h3 className="text-xl font-bold text-white">Know Your Legal Rights in India</h3>
          <p className="text-xs text-slate-400 mt-1">
            Understanding key regulatory protections prevents banks, insurers, and recovery agents from causing undue delay or harassment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATUTORY_PROVISIONS.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 hover:border-teal-500/40 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-teal-400">{item.topic}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                  {item.badge}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">{item.headline}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.explanation}</p>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-teal-200">
                <strong>Recommended Action:</strong> {item.actionAdvice}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
