'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEstate } from '@/context/EstateContext';
import { 
  ShieldCheck, 
  FileText, 
  Clock, 
  AlertOctagon, 
  Compass, 
  LayoutDashboard, 
  Download, 
  UserCheck, 
  RotateCcw,
  Sparkles,
  Home,
  LogIn
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { state, personas, loadPersona, resetState, activePersonaId, isSaving, user, logoutUser } = useEstate();
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState<boolean>(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const totalAssets = state.assets.reduce((sum, a) => sum + (a.estimatedValue || 0), 0);
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const totalTasks = state.tasks.length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Streamlined and concise navigation links to prevent any collision
  const navLinks = [
    { href: '/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/playbook', label: 'Playbook', icon: Clock, badge: `${completedTasks}/${totalTasks}` },
    { href: '/claims', label: 'Claim Packs', icon: FileText, badge: `${state.assets.length}` },
    { href: '/liabilities', label: 'Liabilities', icon: AlertOctagon, highlight: state.liabilities.length > 0 },
    { href: '/unclaimed', label: 'UDGAM Guide', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      {/* Top Banner: Empathetic Notification, Demo Persona Switcher & Case Status */}
      <div className="bg-slate-900 text-slate-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            Indian Legal & Banking Framework
          </span>
          <span className="text-slate-300 text-[11px] hidden md:inline">
            Active Case: <strong className="text-white">{state.deceased.fullName || 'Unspecified Case'}</strong>
            {state.claimant.fullName && (
              <span className="text-slate-400"> (Claimant: {state.claimant.fullName})</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-teal-400 animate-pulse text-[10px]">Saving...</span>
          )}

          {/* Quick Persona Seeder for Reviewers */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] px-1 hidden lg:inline">Demos:</span>
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPersona(p.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  activePersonaId === p.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title={p.description}
              >
                {p.id.includes('salaried') ? '👔 Salaried' : '👵 Senior Citizen'}
              </button>
            ))}
            <button
              onClick={() => {
                if (confirm('Reset to a fresh blank case?')) resetState();
              }}
              className="text-slate-400 hover:text-rose-300 px-1 py-0.5 text-[10px] transition-colors"
              title="Reset to blank case"
            >
              <RotateCcw className="w-2.5 h-2.5 inline mr-0.5" />
              Reset
            </button>
          </div>

          <a
            href="/api/export"
            download
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2 py-0.5 rounded text-[10px] border border-slate-700 transition"
            title="Download full case data as JSON"
          >
            <Download className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Export</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full gap-2 xl:gap-4">
          {/* Left: Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group py-1">
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-teal-100 flex items-center justify-center shadow-sm group-hover:bg-teal-700 transition-colors flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-teal-800 transition-colors leading-tight">
                Claim Sathi
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block leading-tight mt-0.5 whitespace-nowrap">
                Estate & Financial Closure Assistant
              </p>
            </div>
          </Link>

          {/* Center: Main Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 flex-shrink-0">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Quick Status & Utility Action Gateway */}
          <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {/* Claims Value on XL */}
            <div className="hidden xl:flex flex-col items-end pl-2">
              <span className="text-[9px] text-slate-400 uppercase font-semibold leading-none mb-0.5">Claims Value</span>
              <span className="text-xs font-bold text-teal-800 leading-none">{formatINR(totalAssets)}</span>
            </div>

            {/* Mini Progress on 2XL */}
            <div className="hidden 2xl:flex flex-col items-end pl-2 border-l border-slate-200">
              <span className="text-[9px] text-slate-400 uppercase font-semibold leading-none mb-0.5">Playbook</span>
              <div className="flex items-center gap-1">
                <div className="w-12 bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-700 leading-none">{progressPct}%</span>
              </div>
            </div>

            {/* Home Link */}
            <Link
              href="/"
              className={`p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                pathname === '/'
                  ? 'bg-slate-100 text-slate-900 border-slate-300'
                  : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="Home / Landing"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Home</span>
            </Link>

            {/* User Profile / Login Link */}
            {user ? (
              <div ref={profileMenuRef} className="relative group">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(prev => !prev)}
                  aria-expanded={isProfileMenuOpen}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    isProfileMenuOpen
                      ? 'bg-teal-50 border-teal-400 text-teal-900 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                  title="Claimant Profile Options"
                >
                  <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span className="hidden md:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {/* Dropdown Container with invisible hover bridge and click toggle */}
                <div
                  className={`absolute right-0 top-full pt-1.5 z-50 before:absolute before:-top-2 before:left-0 before:w-full before:h-3 before:content-[''] ${
                    isProfileMenuOpen ? 'block' : 'hidden group-hover:block'
                  }`}
                >
                  <div className="w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-3.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="border-b border-slate-100 pb-2 mb-2">
                      <div className="font-bold text-slate-900 truncate">{user.name}</div>
                      <div className="inline-block mt-0.5 text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200 truncate">
                        {user.role || 'Claimant Representative'}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Link
                        href="/overview"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 p-1.5 rounded-lg text-slate-700 hover:text-teal-900 hover:bg-teal-50 font-medium transition"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                        <span>Case Workspace</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logoutUser();
                        }}
                        className="flex items-center gap-2 w-full text-left p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out / Switch User</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className={`p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                  pathname === '/login'
                    ? 'bg-teal-50 text-teal-900 border-teal-200'
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Claimant Sign In"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline text-xs">Login</span>
              </Link>
            )}

            {/* Primary Action: Start Triage */}
            <Link
              href="/triage"
              className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 flex-shrink-0"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Triage</span>
              <span className="sm:hidden">Triage</span>
            </Link>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 border-t border-slate-100 gap-1.5 scrollbar-none">
          <Link
            href="/"
            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              pathname === '/' ? 'bg-teal-100 text-teal-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home className="w-3 h-3" />
            <span>Home</span>
          </Link>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-100 text-teal-900 font-bold border border-teal-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3 h-3 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/login"
            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              pathname === '/login' ? 'bg-teal-100 text-teal-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LogIn className="w-3 h-3" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
