import React from 'react';
import Link from 'next/link';
import { Shield, BookOpen, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-8 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                CS
              </div>
              <span className="font-bold text-lg text-white">Claim Sathi (क्लेम साथी)</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-4">
              A compassionate, digital guidance platform built specifically for Indian families navigating the 
              complexities of financial closure, bank settlements, EPFO EDLI claims, and liability shields after the 
              loss of a loved one.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <Shield className="w-4 h-4" />
              <span>Aligned with RBI Master Circulars, EPFO Schemes, and Indian Succession Provisions</span>
            </div>
          </div>

          {/* Quick Legal References */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              Statutory Authorities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://udgam.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1 transition"
                >
                  <span>RBI UDGAM (Unclaimed Deposits)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://unifiedportal-mem.epfindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1 transition"
                >
                  <span>EPFO Member Portal (Form 20/5IF)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.iepf.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1 transition"
                >
                  <span>IEPF Authority (Unclaimed Shares)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://crsorgi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1 transition"
                >
                  <span>Civil Registration System (Death Cert)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/overview" className="hover:text-teal-300 transition">
                  Active Case Overview Dashboard
                </Link>
              </li>
              <li>
                <Link href="/triage" className="hover:text-teal-300 transition">
                  Estate Intake & Discovery Triage
                </Link>
              </li>
              <li>
                <Link href="/playbook" className="hover:text-teal-300 transition">
                  First 30 Days Emergency Timeline
                </Link>
              </li>
              <li>
                <Link href="/claims" className="hover:text-teal-300 transition">
                  Bank & EPFO Claim Pack Dossier
                </Link>
              </li>
              <li>
                <Link href="/liabilities" className="hover:text-teal-300 transition">
                  Liability Shield & EMI Moratorium Notice
                </Link>
              </li>
              <li>
                <Link href="/unclaimed" className="hover:text-teal-300 transition">
                  Dormant Accounts & Shares Recovery Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="border-t border-slate-800 pt-6 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="leading-relaxed">
            <strong className="text-slate-300">Statutory Notice:</strong> Claim Sathi provides structured procedural guidance, 
            regulatory circular cross-references, and pre-drafted standard communication templates. It does not constitute formal legal counsel. 
            For contested estates or intestate disputes, consultation with an advocate or notary is recommended.
          </p>
          <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for families in need</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
