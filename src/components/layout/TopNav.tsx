import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore, INITIAL_MANAGED_USERS } from '../../stores/authStore';
import {
  Search, Command, Bell, ListTodo, Plus, Building2, User, ChevronDown,
  Sparkles, ExternalLink, ShieldCheck, LogOut, Crown, Stethoscope
} from 'lucide-react';
import { cn } from '../../lib/cn';

export default function TopNav() {
  const navigate = useNavigate();
  const {
    sidebarCollapsed, commandPaletteOpen, setCommandPaletteOpen,
    activeBranch, setActiveBranch, data, toggleNotificationsPanel,
    unreadNotificationCount, setQuickCreateOpen
  } = useAppStore();

  const { user, loginAsUser, logout } = useAuthStore();

  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const branchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) setBranchDropdownOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const isMasterRaja =
    user?.email?.toLowerCase() === 'a.rajarathnareddychenni@gmail.com' ||
    user?.id === 'user-raja-007' ||
    user?.name?.toLowerCase().trim() === 'raja rathna reddy';

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-14 bg-surface-0 border-b border-surface-200 flex items-center justify-between px-4 gap-4 transition-[left] duration-200 ${
        sidebarCollapsed ? 'left-[60px]' : 'left-[240px]'
      }`}
    >
      {/* Search & Command Bar */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-surface-400 hover:border-surface-300 hover:text-surface-500 transition-colors cursor-pointer min-w-[240px]"
      >
        <Search className="w-4 h-4" />
        <span className="text-[13px]">Search patients, lab tests, scans...</span>
        <div className="ml-auto flex items-center gap-0.5 text-[11px] text-surface-400 bg-surface-100 px-1.5 py-0.5 rounded">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Global Quick Action Trigger */}
        <button
          onClick={() => setQuickCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-[13px] font-bold hover:bg-brand-700 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>

        {/* Notifications Slide-over Button */}
        <button
          onClick={toggleNotificationsPanel}
          className="relative p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-50 rounded-lg transition-colors cursor-pointer"
          title="Notifications & Panic Alerts"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-danger-500 text-white text-[10px] font-bold rounded-full px-1">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* Branch Selector */}
        <div ref={branchRef} className="relative">
          <button
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 border border-surface-200 rounded-lg text-[13px] text-surface-700 hover:border-surface-300 transition-colors cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-surface-400" />
            <span className="hidden md:inline max-w-[120px] truncate">{activeBranch.code}</span>
            <ChevronDown className="w-3 h-3 text-surface-400" />
          </button>
          {branchDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-surface-0 border border-surface-200 rounded-xl shadow-elevated py-1 z-50 fade-in">
              <div className="px-3 py-2 text-[11px] font-bold text-surface-400 uppercase tracking-wider">
                Select Diagnostic Branch
              </div>
              {data.branches.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => {
                    setActiveBranch(branch);
                    setBranchDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] hover:bg-surface-50 transition-colors flex items-center gap-2 cursor-pointer ${
                    activeBranch.id === branch.id ? 'bg-brand-50 text-brand-700' : 'text-surface-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${branch.isActive ? 'bg-success-500' : 'bg-surface-300'}`} />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{branch.name}</div>
                    <div className="text-[11px] text-surface-500">{branch.code}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile & Persona Switcher */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs">
              {user?.name ? user.name.charAt(0) : 'R'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[13px] font-bold text-surface-900 truncate max-w-[140px] flex items-center gap-1">
                <span>{user?.name || 'Raja Rathna Reddy'}</span>
                {isMasterRaja && <Crown className="w-3 h-3 text-amber-500 shrink-0" />}
              </div>
              <div className="text-[10.5px] text-surface-500 capitalize">
                {user?.role ? user.role.replace('_', ' ') : 'Master Admin'}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-surface-400" />
          </button>

          {/* User Persona Switcher Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-surface-0 border border-surface-200 rounded-2xl shadow-elevated py-2 z-50 fade-in text-xs font-sans">
              <div className="px-4 py-2 border-b border-surface-100">
                <p className="font-bold text-surface-900 text-[13px]">{user?.name || 'Raja Rathna Reddy'}</p>
                <p className="text-[11px] text-surface-500 truncate">{user?.email || 'a.rajarathnareddychenni@gmail.com'}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 capitalize">
                  {user?.role ? user.role.replace('_', ' ') : 'Master Admin'}
                </span>
              </div>

              {/* Navigation Options */}
              <div className="py-1 border-b border-surface-100">
                <button
                  onClick={() => {
                    navigate('/landing');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-surface-50 flex items-center justify-between text-surface-700 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
                    <span>Product Landing Page</span>
                  </span>
                  <span className="text-[10px] text-surface-400">/landing</span>
                </button>

                {(isMasterRaja || user?.role === 'super_admin') && (
                  <button
                    onClick={() => {
                      navigate('/admin/users');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50 flex items-center justify-between text-indigo-700 font-bold cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Security & User Console {isMasterRaja ? '(Master)' : '(Demo Admin)'}</span>
                    </span>
                    <span className="text-[10px] text-indigo-400">/admin/users</span>
                  </button>
                )}
              </div>

              {/* Quick Persona Switcher */}
              <div className="px-4 py-2">
                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1.5">
                  Switch Active Role Persona
                </p>
                <div className="space-y-1">
                  {INITIAL_MANAGED_USERS.slice(0, 5).map(persona => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        loginAsUser(persona);
                        setUserDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full text-left p-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer',
                        user?.id === persona.id ? 'bg-brand-50 text-brand-700 font-bold' : 'hover:bg-surface-50 text-surface-700'
                      )}
                    >
                      <span className="truncate">{persona.name}</span>
                      <span className="text-[10px] text-surface-400 capitalize">{persona.role.split('_')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Out */}
              <div className="pt-1 border-t border-surface-100">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
