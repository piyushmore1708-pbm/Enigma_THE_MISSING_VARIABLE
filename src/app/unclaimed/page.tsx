'use client';

import React, { useState } from 'react';
import { useEstate } from '@/context/EstateContext';
import { 
  Sparkles, 
  ExternalLink, 
  Search, 
  Copy, 
  Check, 
  Landmark, 
  Coins, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function UnclaimedPage() {
  const { state } = useEstate();
  const [activeTab, setActiveTab] = useState<'udgam' | 'iepf' | 'epfo_inactive'>('udgam');
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);

  // Pre-calculated search parameters for the deceased
  const searchQuery = {
    name: state.deceased.fullName || '',
    pan: state.deceased.panNumber || '',
    dob: state.deceased.dateOfPassing ? 'Approx. 1960-1985' : '',
    pincode: 'Any Indian Pincode',
  };

  const formattedSearchText = `Name: ${searchQuery.name}\nPAN: ${searchQuery.pan || 'N/A'}\nStatus: Search Unclaimed / Dormant Deposits`;

  const handleCopySearch = () => {
    navigator.clipboard.writeText(formattedSearchText);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-teal-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Over ₹78,000 Crores Unclaimed in India</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Unclaimed Assets Discovery Guide (UDGAM & IEPF)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When family members pass away, savings accounts opened decades ago, fixed deposits, or physical stock certificates 
              often go unnoticed. By law, banks and corporations transfer these funds to statutory government pools. 
              Legal heirs can recover 100% of these assets with full interest.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 min-w-[220px]">
            <span className="text-[11px] text-teal-400 font-semibold uppercase tracking-wider block mb-1">
              Active Case Search Target
            </span>
            <div className="text-base font-bold text-white truncate">
              {state.deceased.fullName || 'Deceased Family Member'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              PAN: <span className="font-mono text-teal-300">{state.deceased.panNumber || 'Not entered'}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-700/60 text-xs">
          {[
            { id: 'udgam', label: '1. RBI UDGAM (Dormant Bank Accounts >10 Yrs)', icon: Landmark },
            { id: 'iepf', label: '2. MCA IEPF (Unclaimed Shares & Dividends >7 Yrs)', icon: Coins },
            { id: 'epfo_inactive', label: '3. EPFO Inoperative PF Balances', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: RBI UDGAM Portal Guide */}
      {activeTab === 'udgam' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      How RBI UDGAM Portal Works
                    </h2>
                    <p className="text-xs text-slate-500">
                      Unclaimed Deposits – Gateway to Access inforMation (RBI Centralized Directory)
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    30+ Banks Integrated
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
                  <p>
                    Under Section 26A of the Banking Regulation Act, 1949, all bank deposits (savings, current, fixed deposits) 
                    that have not been operated for <strong>10 or more years</strong> are transferred to the RBI's 
                    <strong> Depositor Education and Awareness Fund (DEAF)</strong>.
                  </p>
                  <p>
                    The UDGAM portal allows surviving heirs to perform a unified query across 30+ major banks simultaneously 
                    (including SBI, PNB, Bank of Baroda, ICICI, HDFC, Axis, Canara) using simple identifiers.
                  </p>
                </div>

                {/* 4 Step Walkthrough */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    {
                      step: 'Step 1',
                      title: 'Register on UDGAM',
                      desc: 'Visit udgam.rbi.org.in and register using any Indian mobile number.',
                    },
                    {
                      step: 'Step 2',
                      title: 'Enter Deceased Identifiers',
                      desc: 'Enter the deceased’s full name and input PAN or Date of Birth.',
                    },
                    {
                      step: 'Step 3',
                      title: 'Fetch UDRN',
                      desc: 'The portal lists matched accounts and provides an Unclaimed Deposit Reference Number (UDRN).',
                    },
                    {
                      step: 'Step 4',
                      title: 'Claim at Branch',
                      desc: 'Present the UDRN with the Death Certificate and KYC at the nearest branch for payout with interest.',
                    },
                  ].map((s, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">{s.step}</span>
                      <h4 className="font-bold text-slate-900 mt-0.5 mb-1">{s.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-snug">{s.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Official RBI Portal: <strong>udgam.rbi.org.in</strong></span>
                  <a
                    href="https://udgam.rbi.org.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition"
                  >
                    <span>Open RBI UDGAM Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Pre-filled Search Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Pre-Filled Search Parameters</h3>
                  <button
                    onClick={handleCopySearch}
                    className="text-teal-700 hover:text-teal-900 text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuery ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Keep these details handy when filling out the search form on UDGAM:
                </p>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Deceased Name:</span>
                    <strong className="text-slate-900">{state.deceased.fullName || 'Not specified'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PAN:</span>
                    <strong className="text-slate-900 font-mono">{state.deceased.panNumber || 'Not available'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Recommended Filter:</span>
                    <span className="text-slate-700">Select "All Participating Banks"</span>
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl text-[11px] text-teal-900 leading-relaxed">
                  💡 <strong>Pro-Tip:</strong> Try variations of the deceased’s name (e.g., with and without middle names or initials) 
                  as older bank ledgers often abbreviated names.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MCA IEPF Portal Guide */}
      {activeTab === 'iepf' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Retrieving Unclaimed Shares & Dividends from IEPF Authority
                </h2>
                <p className="text-xs text-slate-500">
                  Investor Education and Protection Fund (Ministry of Corporate Affairs, Govt of India)
                </p>
              </div>
              <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                Form IEPF-5 Required
              </span>
            </div>

            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <p>
                Under Section 124(6) of the Companies Act, 2013, if dividends on physical share certificates or Demat holdings 
                remain unclaimed for <strong>7 consecutive years</strong>, both the accumulated dividend amount and the 
                underlying company shares are transferred to the IEPF Authority Demat account.
              </p>
              <p>
                Companies like Reliance, TCS, ITC, L&T, Tata Motors, and SBI have millions of shares sitting in the IEPF fund. 
                Legal heirs have the full statutory right to claim both the shares (transferred into the heir's Demat account) 
                and all unpaid dividends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-indigo-700 block mb-1">1. IEPF-5 e-Form</span>
                <p className="text-slate-600 leading-snug">
                  File online Form IEPF-5 on the MCA portal (mca.gov.in) with Claimant Demat Client Master List (CML).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-indigo-700 block mb-1">2. Physical Dossier to RTA</span>
                <p className="text-slate-600 leading-snug">
                  Send original physical share certificates, Non-Judicial Indemnity Bond, Advance Stamp Receipt, and Death Cert to the Registrar (e.g. KFintech/CAMS).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-indigo-700 block mb-1">3. Direct Demat Credit</span>
                <p className="text-slate-600 leading-snug">
                  Upon verification, the IEPF Authority credits the shares directly into your Demat account and transfers dividends via NEFT.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Official Portal: <strong>iepf.gov.in</strong></span>
              <a
                href="https://www.iepf.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition"
              >
                <span>Visit IEPF Authority Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EPFO Inoperative Accounts */}
      {activeTab === 'epfo_inactive' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Recovering Inoperative EPFO Balances
            </h2>
            <p className="text-xs text-slate-500">
              Accounts inactive for more than 36 months after retirement or job transition
            </p>
          </div>

          <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
            <p>
              Under EPFO norms, an account where no contributions have been received for 36 months becomes "inoperative". 
              However, <strong>inoperative accounts continue to accrue statutory interest</strong> up to age 58.
            </p>
            <p>
              Nominees can trace older PF accounts even if the UAN is unknown using the employer's Establishment Code 
              and the member's legacy Member ID through the EPFO Inoperative Account Helpdesk.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900">Information Needed to Trace Inactive PF:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div>• Name of Past Employer & City</div>
              <div>• Approximate Years of Employment</div>
              <div>• Deceased Date of Birth & Father's Name</div>
              <div>• Past Salary Slip or Form 16 (if available)</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">EPFO Member Portal: <strong>epfindia.gov.in</strong></span>
            <a
              href="https://unifiedportal-mem.epfindia.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition"
            >
              <span>EPFO Trace Helpdesk</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
