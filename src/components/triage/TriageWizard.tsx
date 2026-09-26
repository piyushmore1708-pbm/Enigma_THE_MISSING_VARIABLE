'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEstate } from '@/context/EstateContext';
import { 
  User, 
  HeartHandshake, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Building, 
  Landmark, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Sparkles,
  AlertTriangle,
  Coins,
  ShieldCheck,
  FileText,
  Clock
} from 'lucide-react';
import { 
  AssetCategory, 
  EmploymentType, 
  RelationshipToDeceased, 
  EstateAsset, 
  EstateLiability 
} from '@/lib/types/estate';
import { formatINR } from '@/lib/utils';
import { computeRiskFlags, computeDynamicChecklist } from '@/lib/engine/checklistEngine';
import { StatementAnalyzerModal } from './StatementAnalyzerModal';

// Zod validation schemas
const deceasedSchema = z.object({
  fullName: z.string().min(2, 'Please enter the full legal name of the deceased'),
  dateOfPassing: z.string().min(4, 'Please select the date of demise'),
  panNumber: z.string().optional().refine(val => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), {
    message: 'Invalid Indian PAN format (e.g. ABCDE1234F)',
  }),
  hasAadhaar: z.boolean(),
  employmentType: z.enum([
    'salaried_private',
    'salaried_govt',
    'self_employed',
    'retired_pensioner',
    'homemaker',
    'unemployed',
  ]),
  employerName: z.string().optional(),
  hasWill: z.boolean(),
  willProbated: z.boolean().optional(),
});

const claimantSchema = z.object({
  fullName: z.string().min(2, 'Please enter claimant full name'),
  relationship: z.enum([
    'spouse',
    'son',
    'daughter',
    'father',
    'mother',
    'sibling',
    'legal_heir',
    'other',
  ]),
  contactNumber: z.string().min(10, 'Please enter a valid 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address'),
  panNumber: z.string().optional(),
  isSoleLegalHeir: z.boolean(),
  hasOtherHeirsConsent: z.boolean(),
});

// Common Indian Institutions for Rapid Selection
const POPULAR_BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank', 'Bank of Baroda', 'Axis Bank'];
const RETIREMENT_OPTIONS = ['EPFO (Provident Fund & Pension)', 'National Pension System (NPS)', 'Corporate Gratuity'];
const INSURANCE_OPTIONS = ['Term Life Insurance', 'Endowment / LIC Policy', 'Health Insurance / Mediclaim'];
const INVESTMENT_OPTIONS = ['Demat Shares (CDSL/NSDL)', 'Mutual Funds (CAMS/KFintech)', 'Post Office National Savings'];
const LIABILITY_OPTIONS = ['Home Loan', 'Personal Loan', 'Auto / Car Loan', 'Credit Card Balances'];

export function TriageWizard() {
  const router = useRouter();
  const { state, saveState, personas, loadPersona, activePersonaId } = useEstate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Local draft lists for assets & liabilities
  const [assetList, setAssetList] = useState<EstateAsset[]>(state.assets);
  const [liabilityList, setLiabilityList] = useState<EstateLiability[]>(state.liabilities);

  // New Asset Quick Add Form State
  const [newAssetCategory, setNewAssetCategory] = useState<AssetCategory>('bank_account');
  const [newAssetInstitution, setNewAssetInstitution] = useState('');
  const [newAssetValue, setNewAssetValue] = useState<string>('');
  const [newAssetNominee, setNewAssetNominee] = useState<'yes' | 'no' | 'unknown'>('yes');

  // New Liability Quick Add Form State
  const [newLiabType, setNewLiabType] = useState<'home_loan' | 'personal_loan' | 'car_loan' | 'credit_card'>('home_loan');
  const [newLiabLender, setNewLiabLender] = useState('');
  const [newLiabBalance, setNewLiabBalance] = useState<string>('');
  const [newLiabEmi, setNewLiabEmi] = useState<string>('');
  const [newLiabAutoDebit, setNewLiabAutoDebit] = useState<boolean>(true);

  // Statement Analyzer Modal State
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState<boolean>(false);

  const handleMergeFromStatement = (newAssets: EstateAsset[], newLiabilities: EstateLiability[]) => {
    setAssetList(prev => {
      const existingNames = new Set(prev.map(a => a.institutionName.toLowerCase()));
      const toAdd = newAssets.filter(a => !existingNames.has(a.institutionName.toLowerCase()));
      return [...prev, ...toAdd];
    });
    setLiabilityList(prev => {
      const existingLenders = new Set(prev.map(l => l.lenderName.toLowerCase()));
      const toAdd = newLiabilities.filter(l => !existingLenders.has(l.lenderName.toLowerCase()));
      return [...prev, ...toAdd];
    });
  };

  // React Hook Form for Step 1 & Step 2
  const {
    register: regDeceased,
    handleSubmit: handleDeceasedSubmit,
    watch: watchDeceased,
    formState: { errors: errorsDeceased },
  } = useForm({
    resolver: zodResolver(deceasedSchema),
    defaultValues: state.deceased,
  });

  const {
    register: regClaimant,
    handleSubmit: handleClaimantSubmit,
    watch: watchClaimant,
    formState: { errors: errorsClaimant },
  } = useForm({
    resolver: zodResolver(claimantSchema),
    defaultValues: state.claimant,
  });

  const watchedEmployment = watchDeceased('employmentType');
  const deceasedData = watchDeceased();
  const claimantData = watchClaimant();

  // Intelligent Calculations
  const totalAssets = assetList.reduce((sum, a) => sum + (a.estimatedValue || 0), 0);
  const totalLiabilities = liabilityList.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);
  const riskFlags = computeRiskFlags(assetList, liabilityList, deceasedData as any, claimantData as any);

  // Quick Toggle for Multi-Select Banks & Tied Entities
  const handleToggleBank = (bankName: string) => {
    const existingIndex = assetList.findIndex(a => a.institutionName.toLowerCase() === bankName.toLowerCase());
    if (existingIndex >= 0) {
      setAssetList(assetList.filter((_, i) => i !== existingIndex));
    } else {
      const newAsset: EstateAsset = {
        id: `ast_quick_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        category: 'bank_account',
        institutionName: bankName,
        estimatedValue: 200000,
        hasNomineeRegistered: 'yes',
        claimStatus: 'not_started',
        relevantForms: ['Nominee Claim Form Annexure-A'],
      };
      setAssetList([...assetList, newAsset]);
    }
  };

  const handleToggleOption = (category: AssetCategory, name: string) => {
    const existing = assetList.find(a => a.institutionName === name);
    if (existing) {
      setAssetList(assetList.filter(a => a.institutionName !== name));
    } else {
      let forms = ['Claim Form'];
      if (category === 'epf_ppf') forms = ['EPFO Form 20', 'Form 10D', 'Form 5IF (EDLI ₹7L)'];
      if (category === 'life_insurance') forms = ['Death Claim Intimation', 'Treating Physician Form'];
      if (category === 'demat_stocks') forms = ['Form ISR-5 (Transmission Request)'];

      const newAsset: EstateAsset = {
        id: `ast_opt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        category,
        institutionName: name,
        estimatedValue: category === 'epf_ppf' ? 1200000 : category === 'life_insurance' ? 5000000 : 500000,
        hasNomineeRegistered: 'yes',
        claimStatus: 'not_started',
        relevantForms: forms,
      };
      setAssetList([...assetList, newAsset]);
    }
  };

  const handleToggleLiability = (type: 'home_loan' | 'personal_loan' | 'car_loan' | 'credit_card', name: string) => {
    const existing = liabilityList.find(l => l.lenderName === name);
    if (existing) {
      setLiabilityList(liabilityList.filter(l => l.lenderName !== name));
    } else {
      const newLiab: EstateLiability = {
        id: `liab_quick_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type,
        lenderName: name,
        outstandingBalance: type === 'home_loan' ? 3500000 : 300000,
        monthlyEmiAmount: type === 'home_loan' ? 38000 : 15000,
        emiDueDate: 5,
        autoDebitActive: true,
        noticeSent: false,
        moratoriumRequested: false,
        hasLoanInsurancePolicy: type === 'home_loan' ? 'yes' : 'unknown',
      };
      setLiabilityList([...liabilityList, newLiab]);
    }
  };

  const handleAddCustomAsset = () => {
    if (!newAssetInstitution.trim()) return;
    const valueNum = parseFloat(newAssetValue) || 0;
    let forms = ['Standard Claim Form'];
    if (newAssetCategory === 'epf_ppf') forms = ['EPFO Form 20', 'Form 10D', 'Form 5IF'];
    if (newAssetCategory === 'bank_account' || newAssetCategory === 'fixed_deposit') {
      forms = newAssetNominee === 'yes' ? ['Nominee Claim Form Annexure-A'] : ['Legal Heir Claim Form Annexure-B', 'Indemnity Bond'];
    }

    const newItem: EstateAsset = {
      id: `asset_${Date.now()}`,
      category: newAssetCategory,
      institutionName: newAssetInstitution.trim(),
      estimatedValue: valueNum,
      hasNomineeRegistered: newAssetNominee,
      claimStatus: 'not_started',
      relevantForms: forms,
    };

    setAssetList([...assetList, newItem]);
    setNewAssetInstitution('');
    setNewAssetValue('');
  };

  const handleAddCustomLiability = () => {
    if (!newLiabLender.trim()) return;
    const newItem: EstateLiability = {
      id: `liab_${Date.now()}`,
      type: newLiabType,
      lenderName: newLiabLender.trim(),
      outstandingBalance: parseFloat(newLiabBalance) || 0,
      monthlyEmiAmount: parseFloat(newLiabEmi) || 0,
      emiDueDate: 5,
      autoDebitActive: newLiabAutoDebit,
      noticeSent: false,
      moratoriumRequested: false,
      hasLoanInsurancePolicy: 'unknown',
    };

    setLiabilityList([...liabilityList, newItem]);
    setNewLiabLender('');
    setNewLiabBalance('');
    setNewLiabEmi('');
  };

  // Save full estate dossier to store
  const handleSaveAndGenerateDossier = async () => {
    const updatedState = {
      ...state,
      deceased: deceasedData as any,
      claimant: claimantData as any,
      assets: assetList,
      liabilities: liabilityList,
      documents: computeDynamicChecklist(
        assetList,
        liabilityList,
        deceasedData as any,
        claimantData as any,
        state.documents
      ),
    };

    await saveState(updatedState);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      router.push('/overview');
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner with Demo Persona Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5 text-teal-700" />
            <span>Low-Stress Guided Triage</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Guided Intake & Estate Discovery Wizard
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Answer basic questions to catalog the deceased's financial ties. We automatically compute 
            the required document pack, detect auto-debit risks, and highlight statutory benefits.
          </p>
        </div>

        {/* Demo Switcher Quick Pill */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-600">Quick Test Persona:</span>
          <div className="flex items-center gap-1.5">
            {personas.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={async () => {
                  await loadPersona(p.id);
                  setAssetList(p.state.assets);
                  setLiabilityList(p.state.liabilities);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                  activePersonaId === p.id
                    ? 'bg-teal-700 text-white border-teal-800'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {p.id.includes('salaried') ? '👔 Ramesh (Techie)' : '👵 Sunita (Senior)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { num: 1, title: 'Deceased Details', desc: 'Identity, PAN & Employment', icon: User },
          { num: 2, title: 'Claimant Profile', desc: 'Relationship & Legal Heir Status', icon: HeartHandshake },
          { num: 3, title: 'Financial Footprint', desc: 'Banks, EPFO, Insurance & Debts', icon: Landmark },
        ].map((step) => {
          const Icon = step.icon;
          const isCurrent = currentStep === step.num;
          const isDone = currentStep > step.num;
          return (
            <button
              key={step.num}
              type="button"
              onClick={() => setCurrentStep(step.num)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isCurrent
                  ? 'bg-teal-50 border-teal-300 shadow-sm'
                  : isDone
                  ? 'bg-white border-slate-200 hover:bg-slate-50'
                  : 'bg-white/60 border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-teal-700 text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{step.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">{step.desc}</p>
            </button>
          );
        })}
      </div>

      {/* STEP 1: Deceased Details */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 1: Information Regarding the Deceased</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details are required for querying bank registries, RBI UDGAM, and EPFO portals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Full Legal Name of Deceased *
              </label>
              <input
                {...regDeceased('fullName')}
                placeholder="e.g. Late Ramesh Chandra Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-medium"
              />
              {errorsDeceased.fullName && (
                <span className="text-rose-600 text-[11px] mt-1 block">
                  {errorsDeceased.fullName.message as string}
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Date of Demise *
              </label>
              <input
                type="date"
                {...regDeceased('dateOfPassing')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-medium"
              />
              {errorsDeceased.dateOfPassing && (
                <span className="text-rose-600 text-[11px] mt-1 block">
                  {errorsDeceased.dateOfPassing.message as string}
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                PAN of Deceased (Permanent Account Number)
              </label>
              <input
                {...regDeceased('panNumber')}
                placeholder="e.g. ABCPS1234F"
                maxLength={10}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-mono uppercase"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Crucial for finding dormant deposits on RBI UDGAM and Demat folios.
              </span>
              {errorsDeceased.panNumber && (
                <span className="text-rose-600 text-[11px] mt-1 block">
                  {errorsDeceased.panNumber.message as string}
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Employment Status at Demise
              </label>
              <select
                {...regDeceased('employmentType')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-medium bg-white"
              >
                <option value="salaried_private">Salaried Private Employee (EPFO & EDLI Eligible)</option>
                <option value="salaried_govt">Central / State Govt / PSU (GPF / DCRG)</option>
                <option value="retired_pensioner">Retired Pensioner / Senior Citizen</option>
                <option value="self_employed">Self Employed / Business / Trader</option>
                <option value="homemaker">Homemaker</option>
                <option value="unemployed">Other</option>
              </select>
            </div>

            {(watchedEmployment === 'salaried_private' || watchedEmployment === 'salaried_govt') && (
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Employer / Company Name
                </label>
                <input
                  {...regDeceased('employerName')}
                  placeholder="e.g. Infosys Technologies Ltd / State Bank of India"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-medium"
                />
                <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl mt-2 flex items-center gap-2 text-[11px] text-teal-900">
                  <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>
                    <strong>Statutory Benefit Unlocked:</strong> Active private employees are covered under 
                    EPFO EDLI Scheme with free life insurance up to ₹7,00,000 for nominees.
                  </span>
                </div>
              </div>
            )}

            <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">Registered Will Presence</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Did the deceased leave a registered will? If not, Hindu/Indian Succession rules govern asset distribution.
                </p>
              </div>
              <input
                type="checkbox"
                {...regDeceased('hasWill')}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDeceasedSubmit(() => setCurrentStep(2))}
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow transition"
            >
              <span>Continue to Claimant Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Claimant / Legal Heir Profile */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 2: Claimant & Legal Heir Capacity</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The primary family member authorized to submit bank claims and receive disbursements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Claimant Full Name *
              </label>
              <input
                {...regClaimant('fullName')}
                placeholder="e.g. Pooja Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-medium"
              />
              {errorsClaimant.fullName && (
                <span className="text-rose-600 text-[11px] mt-1 block">
                  {errorsClaimant.fullName.message as string}
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Relationship to Deceased *
              </label>
              <select
                {...regClaimant('relationship')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-medium bg-white capitalize"
              >
                <option value="spouse">Spouse (Widow / Widower)</option>
                <option value="son">Son (Class-I Heir)</option>
                <option value="daughter">Daughter (Class-I Heir)</option>
                <option value="mother">Mother (Class-I Heir)</option>
                <option value="father">Father</option>
                <option value="sibling">Brother / Sister</option>
                <option value="legal_heir">Legal Representative / Administrator</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Mobile Number (for Bank SMS & Portal OTPs) *
              </label>
              <input
                type="tel"
                {...regClaimant('contactNumber')}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-medium"
              />
              {errorsClaimant.contactNumber && (
                <span className="text-rose-600 text-[11px] mt-1 block">
                  {errorsClaimant.contactNumber.message as string}
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Email Address (for Formal Moratorium Letters) *
              </label>
              <input
                type="email"
                {...regClaimant('email')}
                placeholder="e.g. pooja.sharma@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-medium"
              />
              {errorsClaimant.email && (
                <span className="text-rose-600 text-[11px] mt-1 block">
                  {errorsClaimant.email.message as string}
                </span>
              )}
            </div>

            <div className="sm:col-span-2 space-y-3 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs">Sole Legal Heir Verification</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Check if you are the only surviving legal heir under succession law.
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...regClaimant('isSoleLegalHeir')}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs">Unanimous Legal Heirs Consent</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Do all other surviving family members consent to you acting as primary claimant?
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...regClaimant('hasOtherHeirsConsent')}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleClaimantSubmit(() => setCurrentStep(3))}
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow transition"
            >
              <span>Continue to Financial Footprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Financial Footprint Discovery & Risk Flags */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Intelligent Risk & Statutory Alerts Bar */}
          {riskFlags.length > 0 && (
            <div className="space-y-3">
              {riskFlags.map((rf) => (
                <div
                  key={rf.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                    rf.type === 'danger'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : rf.type === 'statutory_benefit'
                      ? 'bg-teal-50 border-teal-300 text-teal-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {rf.type === 'danger' ? (
                      <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    ) : rf.type === 'statutory_benefit' ? (
                      <ShieldCheck className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold">{rf.title}</h4>
                      <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">{rf.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick-Select Financial Footprint Ties */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 3: Multi-Select Financial Footprint</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click common Indian institutions to quickly map holdings, or auto-scan statements.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnalyzerOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-200 animate-pulse" />
                <span>Auto-Discover from Bank Statement</span>
              </button>
            </div>

            {/* 1. Banking Ties */}
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-2">1. Major Indian Banks:</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_BANKS.map((b) => {
                  const isSelected = assetList.some(a => a.institutionName.toLowerCase() === b.toLowerCase());
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleToggleBank(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Statutory & Retirement */}
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-2">2. Retirement & Statutory:</span>
              <div className="flex flex-wrap gap-2">
                {RETIREMENT_OPTIONS.map((opt) => {
                  const isSelected = assetList.some(a => a.institutionName === opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleToggleOption('epf_ppf', opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        isSelected
                          ? 'bg-blue-700 text-white border-blue-800 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Insurance & Investments */}
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-2">3. Life Insurance & Investments:</span>
              <div className="flex flex-wrap gap-2">
                {[...INSURANCE_OPTIONS, ...INVESTMENT_OPTIONS].map((opt) => {
                  const isSelected = assetList.some(a => a.institutionName === opt);
                  const cat: AssetCategory = opt.includes('Insurance') || opt.includes('LIC') ? 'life_insurance' : 'demat_stocks';
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleToggleOption(cat, opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        isSelected
                          ? 'bg-indigo-700 text-white border-indigo-800 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Active Liabilities */}
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-2">4. Liabilities & Debts to Freeze:</span>
              <div className="flex flex-wrap gap-2">
                {LIABILITY_OPTIONS.map((liab) => {
                  const isSelected = liabilityList.some(l => l.lenderName.includes(liab));
                  const type = liab.includes('Home') ? 'home_loan' : liab.includes('Car') ? 'car_loan' : liab.includes('Card') ? 'credit_card' : 'personal_loan';
                  return (
                    <button
                      key={liab}
                      type="button"
                      onClick={() => handleToggleLiability(type, `${liab} (Bank)`)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {liab}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Asset Inventory Matrix with Live Values */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Discovered Asset Inventory</h3>
                <p className="text-xs text-slate-500">Edit estimated values or remove items</p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
                Total Claims: {formatINR(totalAssets)}
              </span>
            </div>

            {/* Custom Asset Adder */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={newAssetCategory}
                  onChange={(e) => setNewAssetCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="bank_account">Bank Account</option>
                  <option value="fixed_deposit">Fixed Deposit</option>
                  <option value="epf_ppf">EPFO / PPF</option>
                  <option value="life_insurance">Life Insurance</option>
                  <option value="demat_stocks">Demat Shares</option>
                  <option value="mutual_funds">Mutual Funds</option>
                  <option value="post_office">India Post</option>
                  <option value="real_estate">Real Estate</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Institution Name</label>
                <input
                  type="text"
                  value={newAssetInstitution}
                  onChange={(e) => setNewAssetInstitution(e.target.value)}
                  placeholder="e.g. Canara Bank"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Value (₹)</label>
                <input
                  type="number"
                  value={newAssetValue}
                  onChange={(e) => setNewAssetValue(e.target.value)}
                  placeholder="e.g. 350000"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block font-medium text-slate-700 mb-1">Nominee?</label>
                  <select
                    value={newAssetNominee}
                    onChange={(e) => setNewAssetNominee(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomAsset}
                  className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 h-[38px] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2">
              {assetList.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-[10px] capitalize">
                      {a.category.substring(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{a.institutionName}</div>
                      <div className="text-[11px] text-slate-500 capitalize">
                        {a.category.replace('_', ' ')} • Nominee: {a.hasNomineeRegistered}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{formatINR(a.estimatedValue)}</span>
                    <button
                      type="button"
                      onClick={() => setAssetList(assetList.filter(item => item.id !== a.id))}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Liabilities Matrix */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recorded Liabilities & Auto-Debits</h3>
                <p className="text-xs text-slate-500">Track loans to stop penalty charges</p>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                Total Debt: {formatINR(totalLiabilities)}
              </span>
            </div>

            {/* List */}
            <div className="space-y-2">
              {liabilityList.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-[10px] capitalize">
                      {l.type.substring(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{l.lenderName}</div>
                      <div className="text-[11px] text-slate-500">
                        EMI: {formatINR(l.monthlyEmiAmount)} • {l.autoDebitActive ? 'Auto-debit active' : 'Manual'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{formatINR(l.outstandingBalance)}</span>
                    <button
                      type="button"
                      onClick={() => setLiabilityList(liabilityList.filter(item => item.id !== l.id))}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Claimant Profile</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndGenerateDossier}
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition w-full sm:w-auto justify-center"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Dossier Generated! Redirecting...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Generate Estate Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Multimodal Statement & Passbook Analyzer Modal */}
      <StatementAnalyzerModal
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
        onMerge={handleMergeFromStatement}
      />
    </div>
  );
}
