import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Eye, EyeOff, Lock, ArrowRight, ShieldCheck,
  AlertCircle, User, Activity, ExternalLink, Sparkles,
  Mail, X, CheckCircle2, KeyRound
} from 'lucide-react';
import { useAuthStore, INITIAL_MANAGED_USERS, type ManagedUser } from '../../stores/authStore';
import { cn } from '../../lib/cn';

export function LoginPage() {
  const navigate = useNavigate();
  const { validateAndLogin, loginAsUser, isAuthenticated, sendPasswordReset } = useAuthStore();

  const [username, setUsername] = useState('a.rajarathnareddychenni@gmail.com');
  const [password, setPassword] = useState('Raja@970450');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both Diagnostic User ID / Email and Security Passcode.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await validateAndLogin(username, password);
      if (result.success) {
        navigate('/');
      } else {
        setErrorMessage(result.message || 'Access Denied: Invalid credentials.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error.');
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (u: ManagedUser) => {
    setUsername(u.email);
    setPassword(u.passcode);
    loginAsUser(u);
    navigate('/');
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setIsResetting(true);
    setResetStatus(null);
    const res = await sendPasswordReset(resetEmail);
    setResetStatus(res);
    setIsResetting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white flex flex-col justify-between font-sans relative overflow-x-hidden">
      {/* Background Soft Medical Ambience Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[20%] w-[700px] h-[700px] rounded-full bg-brand-600/10 blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[15%] w-[700px] h-[700px] rounded-full bg-cyan-600/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg text-white font-black text-lg border border-brand-400/30">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  RASA DIAGNOSTICS OS
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono font-bold">
                  v3.2 ENTERPRISE
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 font-semibold tracking-wider uppercase">
                One Intelligent Operating System for Modern Diagnostic Centers
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/landing')}
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
            <span>Product Landing Page</span>
          </button>
        </div>
      </header>

      {/* ═══ CENTERED ELEGANT CLINICAL LOGIN WORKSPACE ═══ */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6"
        >
          {/* Logo & Welcome */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-400/30 text-brand-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Staff Authentication</h2>
            <p className="text-xs text-slate-400">
              Sign in with your diagnostic center credentials or select a role persona below
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1.5">Staff Email / Mobile</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="name@rasadiagnostics.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-300">Security Passcode</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(username.includes('@') ? username : '');
                    setResetStatus(null);
                    setIsForgotModalOpen(true);
                  }}
                  className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold transition-colors cursor-pointer"
                >
                  Forgot Passcode?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 transition-all cursor-pointer"
            >
              <span>Authenticate Staff Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Persona Switcher */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <p className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400 text-center">
              Instant 1-Click Role Switcher
            </p>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_MANAGED_USERS.slice(0, 6).map(u => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <p className="text-[11px] font-bold text-white truncate">{u.name}</p>
                  <p className="text-[9.5px] text-brand-400 capitalize truncate mt-0.5">{u.role.replace('_', ' ')}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 text-center text-[11px] text-slate-500 border-t border-slate-800/80">
        RASA DIAGNOSTICS OS · Secured Healthcare Infrastructure · NABL ISO 15189 Ready
      </footer>

      {/* ═══ FORGOT PASSCODE / PASSWORD RESET MODAL ═══ */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Reset Staff Passcode</h3>
                  <p className="text-[11px] text-slate-400">Firebase Cloud Authentication Services</p>
                </div>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetStatus ? (
              <div className="space-y-4 py-2">
                <div className={cn(
                  'p-3.5 rounded-xl border text-xs flex items-start gap-2.5',
                  resetStatus.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                )}>
                  {resetStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{resetStatus.message}</span>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      setIsForgotModalOpen(false);
                      setResetStatus(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  Enter your registered staff email address. We will dispatch an official Firebase password reset link directly to your inbox.
                </p>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1.5">Registered Staff Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="doctor@rasadiagnostics.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5"
                  >
                    {isResetting ? (
                      <span>Dispatching Link...</span>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
