'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEstate } from '@/context/EstateContext';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  ExternalLink, 
  ArrowRight,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { PlaybookTask } from '@/lib/types/estate';

export default function PlaybookPage() {
  const { state, toggleTask, toggleDocument } = useEstate();
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'day_1_7' | 'day_8_30' | 'day_30_plus'>('all');

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = state.tasks.filter((task) => {
    if (phaseFilter === 'all') return true;
    return task.phase === phaseFilter;
  });

  const urgentTasksPending = state.tasks.filter((t) => t.urgency === 'high' && !t.completed);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <Clock className="w-3.5 h-3.5" />
              <span>Prioritized Financial Closure Timeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              The First 30 Days Emergency Playbook
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When dealing with grief, it is easy to feel overwhelmed by deadlines. Follow this chronological roadmap 
              designed to protect your family from bank penalties, secure statutory insurance claims, and systematically 
              settle all assets.
            </p>
          </div>

          {/* Progress Widget */}
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
              <span>Timeline Completion</span>
              <strong className="text-teal-300 font-bold">{progressPct}%</strong>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">
              {completedTasks} of {totalTasks} milestones achieved
            </span>
          </div>
        </div>
      </div>

      {/* Urgent Warning if any High-Priority task is pending */}
      {urgentTasksPending.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-amber-950">Immediate Attention Required:</h4>
            <p className="text-amber-800 mt-0.5 leading-relaxed">
              You have {urgentTasksPending.length} critical high-urgency action items remaining (e.g. death certificate copies, 
              auto-debit halt notices, or EPFO employer intimation). Resolving these early prevents irreversible fees or lapses.
            </p>
          </div>
        </div>
      )}

      {/* Main Playbook Tasks & Interactive Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Phase Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {[
                { key: 'all', label: 'All Milestones' },
                { key: 'day_1_7', label: 'Day 1–7 (Urgent Halts)' },
                { key: 'day_8_30', label: 'Day 8–30 (Institutional Claims)' },
                { key: 'day_30_plus', label: 'Day 30+ (Statutory & Dormant)' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPhaseFilter(tab.key as any)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    phaseFilter === tab.key
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredTasks.length} tasks
            </span>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-5 border transition-all ${
                  task.completed
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : task.urgency === 'high'
                    ? 'border-amber-300 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Interactive Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-1 text-slate-400 hover:text-teal-600 transition flex-shrink-0"
                    title={task.completed ? 'Mark as pending' : 'Mark as done'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-teal-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          task.phase === 'day_1_7'
                            ? 'bg-rose-100 text-rose-800'
                            : task.phase === 'day_8_30'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {task.phase === 'day_1_7'
                          ? 'Day 1–7'
                          : task.phase === 'day_8_30'
                          ? 'Day 8–30'
                          : 'Day 30+'}
                      </span>

                      {task.urgency === 'high' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          High Urgency
                        </span>
                      )}

                      {task.completed && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm font-bold transition ${
                        task.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {task.description}
                    </p>

                    {/* Statutory cross-reference & Action trigger */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {task.statutoryReference ? (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>Statutory: <strong>{task.statutoryReference}</strong></span>
                        </div>
                      ) : <span />}

                      {task.actionLink && (
                        <Link
                          href={task.actionLink}
                          className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900 transition"
                        >
                          <span>Open Tool / Format</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Dynamic Document Procurement Checklist */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Required Document Pack
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {state.documents.filter((d) => d.isAvailable).length} / {state.documents.length} Ready
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Check off documents as you obtain physical or certified digital copies. Banks and insurers 
              will scrutinize these before processing payouts.
            </p>

            <div className="space-y-3">
              {state.documents.map((doc) => {
                const status = doc.status || (doc.isAvailable ? 'gathered' : 'missing');
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocument(doc.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition text-xs flex items-start gap-3 ${
                      status === 'gathered'
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : status === 'applied'
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button className="mt-0.5 text-slate-400">
                      {status === 'gathered' ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 flex items-center justify-between">
                        <span className={status === 'gathered' ? 'line-through text-slate-600' : ''}>
                          {doc.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                            status === 'gathered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'applied'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {doc.purpose}
                      </p>
                      <div className="text-[10px] text-teal-700 mt-1 flex items-center justify-between">
                        <span>{doc.procurementAgency}</span>
                        <span className="font-semibold text-slate-600">{doc.copiesNeeded} copies</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                href="/claims"
                className="w-full inline-flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-900 font-semibold px-4 py-2.5 rounded-xl text-xs transition border border-teal-200"
              >
                <span>View Complete Claim Packet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
