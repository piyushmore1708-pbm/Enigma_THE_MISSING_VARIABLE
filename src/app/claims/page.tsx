'use client';

import React, { useState } from 'react';
import { useEstate } from '@/context/EstateContext';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Building, 
  Download, 
  ExternalLink,
  Info,
  BadgeCheck,
  Landmark,
  Calculator,
  Coins,
  AlertTriangle,
  FileCheck,
  Briefcase,
  Scale,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { generateBankNomineeClaimLetter } from '@/lib/templates/bankNomineeClaimLetter';
import { generateIndemnityBondText } from '@/lib/templates/indemnityBondTemplate';
import { INDIAN_INSTITUTIONS } from '@/lib/constants/indianInstitutions';
import { formatINR } from '@/lib/utils';

export default function ClaimsPage() {
  const { state } = useEstate();
  const [activeTab, setActiveTab] = useState<'bank_nominee' | 'epfo_edli' | 'gratuity_calc' | 'indemnity_bond' | 'institutions'>('bank_nominee');
  const [bankClaimMode, setBankClaimMode] = useState<'nominee' | 'simplified' | 'succession'>('nominee');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    state.assets.find((a) => a.category === 'bank_account' || a.category === 'fixed_deposit')?.id || state.assets[0]?.id || ''
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Gratuity Estimator State
  const [monthlyBasic, setMonthlyBasic] = useState<number>(65000);
  const [serviceYears, setServiceYears] = useState<number>(14);

  // Gratuity Calculation: (15 * (Basic + DA) * Years) / 26
  const rawGratuity = Math.floor((15 * monthlyBasic * serviceYears) / 26);
  const gratuityCeiling = 2000000; // ₹20 Lakhs statutory ceiling under Payment of Gratuity Act
  const finalGratuity = Math.min(rawGratuity, gratuityCeiling);
  const isGratuityCapped = rawGratuity > gratuityCeiling;

  // Selected asset
  const currentAsset = state.assets.find((a) => a.id === selectedAssetId) || state.assets[0];

  // Bank claim letter data
  const letterData = {
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    bankName: currentAsset?.institutionName || 'The Branch Manager',
    branchName: 'Main Retail Branch',
    accountNumber: currentAsset?.accountOrFolioNumber || 'Account No. On Record',
    accountType: currentAsset?.category === 'fixed_deposit' ? 'Term / Fixed Deposit' : 'Savings Bank Account',
    deceasedName: state.deceased.fullName || 'Late Accountholder',
    dateOfPassing: state.deceased.dateOfPassing || 'Recent',
    claimantName: state.claimant.fullName || 'Claimant Name',
    claimantRelationship: state.claimant.relationship || 'Legal Nominee',
    claimantPan: state.claimant.panNumber || 'ABCDE1234F',
    claimantBankName: 'State Bank of India',
    claimantAccountNo: '98765432101',
    claimantIfsc: 'SBIN0001234',
  };

  const generatedBankLetter = generateBankNomineeClaimLetter(letterData);

  const indemnityData = {
    claimantName: state.claimant.fullName || 'Claimant Name',
    claimantAge: '38',
    claimantAddress: 'Resident of New Delhi, India',
    deceasedName: state.deceased.fullName || 'Late Family Member',
    dateOfPassing: state.deceased.dateOfPassing || 'Recent',
    institutionName: currentAsset?.institutionName || 'Bank / Organization',
    accountNumber: currentAsset?.accountOrFolioNumber || 'Account Number On Record',
    claimAmount: currentAsset?.estimatedValue ? currentAsset.estimatedValue.toString() : '5,00,000',
    suretyName: 'Surety Guarantor Name',
    suretyAddress: 'Resident of New Delhi, India',
  };

  const generatedIndemnity = generateIndemnityBondText(indemnityData);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Statutory Claim Packet & Calculation Suite</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Indian Claim Process, Statutory Forms & Calculators
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Generate form-fillable, legally verified claim submissions adhering to RBI Master Directions Para 19, 
              Payment of Gratuity Act 1972, EPFO Form 20/10D/5IF (EDLI ₹7L), and bank survivor settlement thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Claim Dossier</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100 text-xs">
          {[
            { id: 'bank_nominee', label: '1. Bank Survivor Settlement (RBI)', icon: Landmark },
            { id: 'epfo_edli', label: '2. EPFO & EDLI (₹7L Life Cover)', icon: ShieldCheck },
            { id: 'gratuity_calc', label: '3. Statutory Gratuity Estimator', icon: Calculator },
            { id: 'indemnity_bond', label: '4. Legal Indemnity Bond (No Nominee)', icon: Scale },
            { id: 'institutions', label: '5. Institutional Claim Directory', icon: Building },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Bank Survivor Settlement (RBI Para 19 vs Simplified vs Succession) */}
      {activeTab === 'bank_nominee' && (
        <div className="space-y-6">
          {/* Mode Switcher Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
            <div
              onClick={() => setBankClaimMode('nominee')}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                bankClaimMode === 'nominee'
                  ? 'bg-teal-50 border-teal-500 shadow-xs ring-1 ring-teal-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                  Track A: Nominee on Record
                </span>
                <span className="text-xs font-bold text-teal-700">15-Day Release</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">RBI Master Circular Para 19</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Mandatory release within 15 calendar days. Bank <strong className="text-slate-900">cannot</strong> ask for Succession Certificate, Probate, or indemnity bond.
              </p>
            </div>

            <div
              onClick={() => setBankClaimMode('simplified')}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                bankClaimMode === 'simplified'
                  ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  Track B: No Nominee (&lt; ₹15 Lakhs)
                </span>
                <span className="text-xs font-bold text-blue-700">Simplified Process</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Bank Board Threshold</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                PSBs (SBI, PNB, Canara) settle claims up to ₹5L–₹15L on indemnity bond + legal heirs disclaimer, without court intervention.
              </p>
            </div>

            <div
              onClick={() => setBankClaimMode('succession')}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                bankClaimMode === 'succession'
                  ? 'bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Track C: High Value / Disputed (&gt; ₹15L)
                </span>
                <span className="text-xs font-bold text-amber-700">Court Order</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Succession Certificate</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Where balance exceeds board ceiling or heirs dispute claim, banks require Succession Certificate from District Civil Court.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls & Asset Picker */}
            <div className="space-y-4 no-print">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Select Account to Claim</h3>
                <p className="text-xs text-slate-500">
                  Choose from discovered bank deposits or holdings:
                </p>

                <div className="space-y-2">
                  {state.assets
                    .filter((a) => a.category === 'bank_account' || a.category === 'fixed_deposit' || a.category === 'post_office')
                    .map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                          currentAsset?.id === asset.id
                            ? 'bg-teal-50 border-teal-500 font-semibold text-teal-950 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{asset.institutionName}</span>
                          <span>{formatINR(asset.estimatedValue)}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {asset.accountOrFolioNumber || 'Account pending'} • Nominee: {asset.hasNomineeRegistered}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Statutory Tip Card */}
              {bankClaimMode === 'nominee' ? (
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl text-xs text-teal-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>RBI Master Directions (Para 19 Protection):</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Banks are instructed to settle survivor claims strictly within <strong>15 days</strong> of receiving the death certificate and KYC. No surety or court succession order can be demanded.
                  </p>
                </div>
              ) : bankClaimMode === 'simplified' ? (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs text-blue-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="w-4 h-4 text-blue-700" />
                    <span>Simplified Settlement Guidelines:</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Enclose: 1) Form of Disclaimer from other legal heirs, 2) Indemnity Deed with 1 or 2 sureties of known financial standing, 3) Legal Heir Certificate from Tehsildar/Revenue Dept.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Succession Certificate Requirement:</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    File petition under Section 372 of the Indian Succession Act 1925 before the Senior Civil Judge / District Court. Typically takes 4–6 months with newspaper public notice publication.
                  </p>
                </div>
              )}
            </div>

            {/* Letter Preview & Formatter */}
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm print-page">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 no-print">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-teal-600" />
                    <span className="font-bold text-slate-900 text-sm">
                      {bankClaimMode === 'nominee'
                        ? 'Print-Ready Bank Nominee Claim Letter (RBI Para 19)'
                        : bankClaimMode === 'simplified'
                        ? 'Bank Simplified Deceased Claim Application (< ₹15L)'
                        : 'Court Succession Claim Letter to Bank'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(generatedBankLetter)}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Form Letter Content */}
                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-white print:border-none print:p-0">
                  {generatedBankLetter}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EPFO & EDLI Life Insurance Guide */}
      {activeTab === 'epfo_edli' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-teal-800 shadow-md">
            <div className="max-w-2xl">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
                Employees' Provident Fund Organisation (EPFO)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-2 mb-2">
                Statutory EPFO Settlement & EDLI Life Insurance (Up to ₹7,00,000)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                When an employee passes away while in active service, their nominees or legal heirs are entitled to 3 distinct statutory payouts: 
                PF balance (Form 20), Monthly Widow/Children Pension (Form 10D), and Free Group Life Insurance payout up to ₹7,00,000 under EDLI (Form 5IF).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Form 5IF (EDLI) */}
            <div className="bg-white rounded-2xl p-6 border-2 border-teal-500 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                    Form 5IF
                  </span>
                  <span className="text-xs font-bold text-emerald-700">Up to ₹7,00,000</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  EDLI Life Insurance Assurance
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Payable to the nominee without requiring any insurance premium from the employee. 
                  Calculated based on 35x average monthly wages + 50% average balance bonus (capped at ₹7 Lakhs).
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700 mb-4">
                  <div className="font-semibold text-slate-900">Claimant & Deceased Dossier:</div>
                  <div>• Deceased: <span className="font-medium text-slate-900">{state.deceased.fullName || 'Ramesh Sharma'}</span></div>
                  <div>• Employer: <span className="font-medium text-slate-900">{state.deceased.employerName || 'Tech Solutions Pvt Ltd'}</span></div>
                  <div>• Nominee: <span className="font-medium text-slate-900">{state.claimant.fullName || 'Pooja Sharma'}</span></div>
                  <div>• Attestation by employer HR required</div>
                </div>
              </div>

              <a
                href="https://www.epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/Form5IF.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition"
              >
                <span>Download Form 5IF PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: Form 20 (PF Balance Settlement) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Form 20
                  </span>
                  <span className="text-xs font-semibold text-slate-600">Full PF Balance</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  PF Accumulation & Interest Withdrawal
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Releases the full employee and employer share of EPF accumulations along with statutory interest 
                  credited up to the settlement month.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700 mb-4">
                  <div className="font-semibold text-slate-900">Required Enclosures:</div>
                  <div>• Claimant Aadhaar & PAN Card</div>
                  <div>• Original Death Certificate</div>
                  <div>• Bank Passbook copy with IFSC</div>
                </div>
              </div>

              <a
                href="https://unifiedportal-mem.epfindia.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition"
              >
                <span>EPFO Member Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 3: Form 10D (Monthly Pension) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    Form 10D
                  </span>
                  <span className="text-xs font-semibold text-purple-700">Monthly Pension</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  EPS Widow & Children Pension
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Provides a lifetime monthly pension to the surviving spouse and children (up to 25 years of age) 
                  under the Employees' Pension Scheme, 1995.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700 mb-4">
                  <div className="font-semibold text-slate-900">Required Enclosures:</div>
                  <div>• Photograph of widow/widower & children</div>
                  <div>• Children birth certificates</div>
                  <div>• Joint bank account details</div>
                </div>
              </div>

              <a
                href="https://www.epfindia.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-xl text-xs transition border border-slate-300"
              >
                <span>View Guidelines</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Statutory Gratuity Estimator */}
      {activeTab === 'gratuity_calc' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-teal-800 shadow-md">
            <div className="max-w-3xl">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
                Payment of Gratuity Act, 1972 (Section 4)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-2 mb-2">
                Statutory Gratuity Settlement Calculator
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Under Indian labour law, gratuity is a statutory entitlement for surviving legal heirs. 
                Crucially, under the proviso to Section 4(1), the mandatory 5-year continuous service condition is 
                <strong className="text-teal-200"> completely waived</strong> in the event of death during service.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-700" />
                <span>Employment & Salary Parameters</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Drawn Monthly Basic + Dearness Allowance (DA)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={monthlyBasic}
                    onChange={(e) => setMonthlyBasic(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="e.g. 65000"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Excludes HRA, special allowance, and performance bonuses.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Completed Years of Service (Round &gt;6 months up)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={serviceYears}
                    onChange={(e) => setServiceYears(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="e.g. 14"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  e.g., 13 years 7 months counts as 14 years.
                </span>
              </div>

              {/* Legal Notes */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  Statutory Formula
                </div>
                <div className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-teal-800 text-[11px]">
                  Gratuity = (15 × Last Basic × Years) ÷ 26
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Calculated based on 26 working days in a month. Disbursed directly by employer trust/insurer (e.g. LIC Group Gratuity).
                </p>
              </div>
            </div>

            {/* Live Calculation Result Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-teal-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-800/80 pb-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold">
                      Estimated Statutory Gratuity Entitlement
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                      {formatINR(finalGratuity)}
                    </div>
                  </div>

                  <div className="bg-teal-800/60 px-4 py-2 rounded-xl border border-teal-700/60 text-right">
                    <span className="text-[10px] uppercase text-teal-300 block">Tax Exemption</span>
                    <strong className="text-emerald-300 text-xs">100% Tax-Exempt (Sec 10(10))</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs">
                  <div className="bg-teal-950/60 p-3 rounded-xl border border-teal-800/40">
                    <span className="text-slate-400 block text-[11px]">Raw Computed Sum</span>
                    <strong className="text-white text-sm">{formatINR(rawGratuity)}</strong>
                  </div>
                  <div className="bg-teal-950/60 p-3 rounded-xl border border-teal-800/40">
                    <span className="text-slate-400 block text-[11px]">Statutory Ceiling (Cap)</span>
                    <strong className="text-white text-sm">₹20,00,000</strong>
                  </div>
                  <div className="bg-teal-950/60 p-3 rounded-xl border border-teal-800/40">
                    <span className="text-slate-400 block text-[11px]">5-Yr Rule Status</span>
                    <strong className="text-emerald-300 text-sm">Waived on Demise ✓</strong>
                  </div>
                </div>

                {isGratuityCapped && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 text-amber-300" />
                    <span>Calculated sum exceeds the statutory cap. Capped at ₹20,00,000 unless company policy permits ex-gratia.</span>
                  </div>
                )}
              </div>

              {/* Legal Heir Claim Steps & Rights */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-teal-700" />
                  <span>How to Claim Gratuity from Employer</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">1. Submit Form 'K'</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Legal heirs or registered nominees must submit statutory Form K (Application for Gratuity by Nominee/Legal Heir) to the employer HR.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">2. 30-Day Mandatory Disbursal</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Under Section 7(3), the employer must pay gratuity within 30 days. Delay attracts compound statutory interest payable to the family.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Indemnity Bond Generator */}
      {activeTab === 'indemnity_bond' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm print-page">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 no-print">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Standard Bank & Authority Indemnity Bond Format
                </h3>
                <p className="text-xs text-slate-500">
                  Required when claiming balances without registered nomination (under bank board threshold, typically ₹5L–₹15L). 
                  Execute on non-judicial stamp paper as prescribed by State Stamp Act.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(generatedIndemnity)}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Format'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Deed</span>
                </button>
              </div>
            </div>

            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-white print:border-none print:p-0">
              {generatedIndemnity}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: Institutional Directory */}
      {activeTab === 'institutions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INDIAN_INSTITUTIONS.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {inst.category.replace('_', ' ')}
                  </span>
                  {inst.tollFreeNumber && (
                    <span className="text-[11px] text-slate-500">Helpline: {inst.tollFreeNumber}</span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1">{inst.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {inst.keyGuidelines}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs mb-4">
                  <div className="font-semibold text-slate-800 mb-1">Standard Claim Packets:</div>
                  <div className="flex flex-wrap gap-1">
                    {inst.commonDeceasedForms.map((f, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded text-[11px] border border-slate-200 text-slate-700">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={inst.claimPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 p-2.5 rounded-xl border border-teal-200 transition"
              >
                <span>Visit Official Claim Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
