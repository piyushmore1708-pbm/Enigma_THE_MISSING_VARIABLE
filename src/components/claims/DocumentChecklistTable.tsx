'use client';

import React, { useState } from 'react';
import { useEstate } from '@/context/EstateContext';
import { 
  FileCheck2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  Filter, 
  Copy, 
  FileText,
  Printer,
  Sparkles
} from 'lucide-react';
import { DocumentStatus, RequiredDocument } from '@/lib/types/estate';
import { computeDynamicChecklist } from '@/lib/engine/checklistEngine';

export function DocumentChecklistTable() {
  const { state, updateDocumentStatus, syncDynamicChecklist } = useEstate();
  const [filter, setFilter] = useState<'all' | DocumentStatus>('all');

  // Compute live dynamic documents if current documents in state need augmentation
  const dynamicDocs = computeDynamicChecklist(
    state.assets,
    state.liabilities,
    state.deceased,
    state.claimant,
    state.documents
  );

  const gatheredCount = dynamicDocs.filter(d => d.status === 'gathered' || d.isAvailable).length;
  const appliedCount = dynamicDocs.filter(d => d.status === 'applied').length;
  const missingCount = dynamicDocs.filter(d => d.status === 'missing' && !d.isAvailable).length;
  const totalCount = dynamicDocs.length;
  const gatheredPct = totalCount > 0 ? Math.round((gatheredCount / totalCount) * 100) : 0;

  const filteredDocs = dynamicDocs.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'gathered') return d.status === 'gathered' || d.isAvailable;
    return d.status === filter;
  });

  const handleStatusChange = async (docId: string, newStatus: DocumentStatus) => {
    await updateDocumentStatus(docId, newStatus);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Header & Metric Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Smart Document Procurement Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Required Document Dossier & Procurement Checklist
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Every Indian bank, EPFO regional office, and registrar has rigid physical verification standards. 
            Keep track of which legal certificates are gathered, applied for with revenue authorities, or pending.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Readiness Score</span>
            <span className="text-teal-700 font-bold text-sm">{gatheredPct}% Ready</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-2.5 transition-all duration-500"
              style={{ width: `${(gatheredCount / totalCount) * 100}%` }}
              title={`Gathered: ${gatheredCount}`}
            />
            <div
              className="bg-amber-400 h-2.5 transition-all duration-500"
              style={{ width: `${(appliedCount / totalCount) * 100}%` }}
              title={`Applied: ${appliedCount}`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
            <span className="text-emerald-700">{gatheredCount} Gathered</span>
            <span className="text-amber-700">{appliedCount} Applied</span>
            <span className="text-rose-700">{missingCount} Pending</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: `All Requirements (${totalCount})` },
            { id: 'missing', label: `Missing / Pending (${missingCount})` },
            { id: 'applied', label: `Application In Progress (${appliedCount})` },
            { id: 'gathered', label: `Ready & Verified (${gatheredCount})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                filter === t.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => syncDynamicChecklist()}
          className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
          title="Recalculate based on latest asset triage"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sync Dynamic Rules</span>
        </button>
      </div>

      {/* Document Table with Fixed Layout & Proportions */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
        <table className="w-full text-left text-xs table-fixed min-w-[760px]">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 w-[32%]">Document Name & Purpose</th>
              <th className="py-3.5 px-4 w-[24%]">Issuing Authority / Agency</th>
              <th className="py-3.5 px-4 w-[14%] text-center">Copies Recommended</th>
              <th className="py-3.5 px-4 w-[16%]">Required By</th>
              <th className="py-3.5 px-4 w-[14%] text-right">Procurement Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDocs.map((doc) => {
              const currentStatus = doc.status || (doc.isAvailable ? 'gathered' : 'missing');
              return (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                  {/* Document Name & Purpose (32%) */}
                  <td className="py-3.5 px-4 w-[32%] align-top">
                    <div className="font-bold text-slate-900 text-sm flex items-start gap-2">
                      <FileText className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                      <span className="break-words">{doc.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
                      {doc.purpose}
                    </p>
                    {doc.notes && (
                      <span className="text-[11px] text-teal-800 font-medium mt-1.5 block break-words">
                        💡 {doc.notes}
                      </span>
                    )}
                  </td>

                  {/* Issuing Authority / Agency (24%) - Wrapped with padding & no nowrap */}
                  <td className="py-3.5 px-4 w-[24%] align-top">
                    <span className="inline-flex flex-wrap items-center py-1 px-2.5 rounded-md text-xs bg-slate-100 border border-slate-200 text-slate-700 font-medium whitespace-normal break-words leading-relaxed max-w-full">
                      {doc.procurementAgency}
                    </span>
                  </td>

                  {/* Copies Recommended (14%) - Centered */}
                  <td className="py-3.5 px-4 w-[14%] text-center align-top">
                    <span className="inline-block bg-teal-50 text-teal-900 font-bold px-2.5 py-1 rounded-full border border-teal-200 text-xs whitespace-nowrap">
                      {doc.copiesNeeded} Copies
                    </span>
                  </td>

                  {/* Required By (16%) */}
                  <td className="py-3.5 px-4 w-[16%] align-top">
                    <div className="flex flex-wrap gap-1">
                      {doc.mandatoryFor.map((cat, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded capitalize whitespace-nowrap"
                        >
                          {cat.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Procurement Status (14%) - Right aligned */}
                  <td className="py-3.5 px-4 w-[14%] text-right align-top">
                    <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(doc.id, 'missing')}
                        className={`px-2 py-1 rounded-lg font-semibold text-[11px] transition ${
                          currentStatus === 'missing'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Mark as Missing"
                      >
                        Missing
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(doc.id, 'applied')}
                        className={`px-2 py-1 rounded-lg font-semibold text-[11px] transition ${
                          currentStatus === 'applied'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Mark as Application In Progress"
                      >
                        Applied
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(doc.id, 'gathered')}
                        className={`px-2 py-1 rounded-lg font-semibold text-[11px] transition ${
                          currentStatus === 'gathered'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Mark as Ready / Verified"
                      >
                        ✓ Ready
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
