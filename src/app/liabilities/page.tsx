'use client';

import React, { useState } from 'react';
import { useEstate } from '@/context/EstateContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Landmark, 
  Calendar, 
  Clock, 
  FileText,
  BadgeAlert
} from 'lucide-react';
import { generateEmiFreezeLetter } from '@/lib/templates/bankEmiFreezeLetter';
import { formatINR } from '@/lib/utils';
import { EstateLiability } from '@/lib/types/estate';

export default function LiabilitiesPage() {
  const { state, updateLiability } = useEstate();
  const [selectedLiabilityId, setSelectedLiabilityId] = useState<string>(
    state.liabilities[0]?.id || ''
  );
  const [copied, setCopied] = useState<boolean>(false);

  const selectedLiability: EstateLiability | undefined =
    state.liabilities.find((l) => l.id === selectedLiabilityId) || state.liabilities[0];

  const letterData = {
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    lenderName: selectedLiability?.lenderName || 'Lending Institution',
    branchAddress: 'Retail Loan Servicing & Collections Division',
    loanAccountNumber: selectedLiability?.accountNumber || 'Loan Account On Record',
    loanType: selectedLiability?.type ? selectedLiability.type.replace('_', ' ').toUpperCase() : 'RETAIL LOAN',
    deceasedName: state.deceased.fullName || 'Late Borrower',
    deceasedPan: state.deceased.panNumber,
    dateOfPassing: state.deceased.dateOfPassing || 'Recent',
    claimantName: state.claimant.fullName || 'Claimant / Legal Representative',
    claimantRelationship: state.claimant.relationship || 'Legal Heir',
    claimantContact: state.claimant.contactNumber || 'Contact Number',
    claimantEmail: state.claimant.email || 'Email Address',
    claimantAddress: 'Resident of New Delhi, India',
    hasInsuranceShield: selectedLiability?.hasLoanInsurancePolicy || 'unknown',
  };

  const generatedNotice = generateEmiFreezeLetter(letterData);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedNotice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleNoticeSent = (id: string, current: boolean) => {
    updateLiability(id, { noticeSent: !current });
  };

  const handleToggleMoratorium = (id: string, current: boolean) => {
    updateLiability(id, { moratoriumRequested: !current });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Financial Risk & Liability Shield</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Loan Protection, Auto-Debit Freeze & Moratorium Notices
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Prevent illegal recovery harassment and automatic bank bounce fees. Grieving families do not bear personal 
              liability for deceased debts beyond inherited assets. Lenders must freeze NACH mandates upon formal notice.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Letter</span>
            </button>
          </div>
        </div>
      </div>

      {state.liabilities.length === 0 ? (
        <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-emerald-950 text-base">No Outstanding Liabilities Recorded</h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            The deceased profile has no active loans, EMIs, or credit card debts listed. If there are unrecorded debts, 
            you can add them via the Guided Triage page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Liability Selector & Controls */}
          <div className="space-y-4 no-print">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Active Credit Lines & Debts</h3>
              <p className="text-xs text-slate-500">
                Select a debt to generate a personalized moratorium notice:
              </p>

              <div className="space-y-2">
                {state.liabilities.map((liab) => {
                  const isSelected = selectedLiability?.id === liab.id;
                  return (
                    <div
                      key={liab.id}
                      onClick={() => setSelectedLiabilityId(liab.id)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                        isSelected
                          ? 'bg-amber-50/70 border-amber-400 font-semibold text-amber-950 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{liab.lenderName}</span>
                        <span className="font-semibold text-slate-900">
                          {formatINR(liab.outstandingBalance)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="capitalize">{liab.type.replace('_', ' ')}</span>
                        <span>EMI: {formatINR(liab.monthlyEmiAmount)}</span>
                      </div>

                      {liab.autoDebitActive && (
                        <div className="mt-2 text-[10px] text-rose-700 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Active NACH auto-debit (Due on {liab.emiDueDate || 5}th)</span>
                        </div>
                      )}

                      {/* Action status tags */}
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleNoticeSent(liab.id, liab.noticeSent);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            liab.noticeSent
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {liab.noticeSent ? '✓ Notice Delivered' : 'Mark Notice Sent'}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleMoratorium(liab.id, liab.moratoriumRequested);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            liab.moratoriumRequested
                              ? 'bg-teal-100 text-teal-800 border-teal-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {liab.moratoriumRequested ? '✓ Freeze Active' : 'Mark Freeze Active'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insurance Shield Tip Card */}
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl text-xs text-teal-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Did the loan have Credit Life Insurance?</span>
              </div>
              <p className="leading-relaxed text-[11px] text-teal-800">
                Most home and car loans sanctioned by Indian banks (HDFC, SBI, ICICI, Axis) bundle a group life insurance policy 
                (e.g., Sarv Suraksha, SBI Rinn Raksha). If present, the insurance company pays off the entire remaining loan balance directly!
              </p>
            </div>
          </div>

          {/* Right Column: Pre-drafted Formal Letter */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm print-page">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 no-print">
                <div className="flex items-center gap-2">
                  <BadgeAlert className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-slate-900 text-sm">
                    Printable RBI-Compliant Death Notification & Auto-Debit Freeze Notice
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Letter'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Letter Preview */}
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-white print:border-none print:p-0">
                {generatedNotice}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
