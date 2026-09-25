import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, Clock, Bell, CheckCircle2, ArrowRight,
  Filter, Search, Stethoscope, TestTubes, Scan, AlertCircle,
  Volume2, Sparkles, Building2, Phone, CreditCard, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/cn';
import { useAppStore } from '../store/useAppStore';

interface ReceptionToken {
  id: string;
  tokenNumber: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  fastingHours: number;
  isFastingRequired: boolean;
  orderedPanels: string[];
  assignedCounter: string;
  status: 'Waiting' | 'Serving' | 'In Phlebotomy' | 'In Imaging' | 'Completed';
  registeredTime: string;
  priority: 'STAT' | 'Fasting Priority' | 'Routine';
  billingStatus: 'Paid' | 'Pending';
  amount: number;
}

const INITIAL_TOKENS: ReceptionToken[] = [
  {
    id: 'tok-101',
    tokenNumber: 'TK-101',
    patientName: 'Ramesh Chandra Verma',
    age: 61,
    gender: 'Male',
    phone: '+91 98765 01050',
    fastingHours: 12.5,
    isFastingRequired: true,
    orderedPanels: ['Fasting Blood Sugar (FBS)', 'Lipid Profile', 'HbA1c (HPLC)'],
    assignedCounter: 'Phlebotomy Counter 1',
    status: 'Serving',
    registeredTime: '07:15 AM',
    priority: 'Fasting Priority',
    billingStatus: 'Paid',
    amount: 1450,
  },
  {
    id: 'tok-102',
    tokenNumber: 'TK-102',
    patientName: 'Meenakshi Sundaram',
    age: 48,
    gender: 'Female',
    phone: '+91 98765 01051',
    fastingHours: 11.0,
    isFastingRequired: true,
    orderedPanels: ['Whole Abdomen Ultrasound', 'Liver Function Test (LFT)'],
    assignedCounter: 'Ultrasound Room 02',
    status: 'Waiting',
    registeredTime: '07:22 AM',
    priority: 'Fasting Priority',
    billingStatus: 'Paid',
    amount: 2200,
  },
  {
    id: 'tok-103',
    tokenNumber: 'TK-103',
    patientName: 'K. Narayana Swamy',
    age: 65,
    gender: 'Male',
    phone: '+91 98765 01052',
    fastingHours: 0,
    isFastingRequired: false,
    orderedPanels: ['Digital Chest PA X-Ray', '2D-Echocardiography with Doppler'],
    assignedCounter: 'X-Ray Suite 01',
    status: 'Serving',
    registeredTime: '07:30 AM',
    priority: 'Routine',
    billingStatus: 'Paid',
    amount: 2800,
  },
  {
    id: 'tok-104',
    tokenNumber: 'TK-104',
    patientName: 'Priya Ananth',
    age: 34,
    gender: 'Female',
    phone: '+91 98765 01053',
    fastingHours: 10.0,
    isFastingRequired: true,
    orderedPanels: ['Thyroid Ultra Profile', 'Complete Blood Count (CBC)', 'Serum Ferritin'],
    assignedCounter: 'Phlebotomy Counter 2',
    status: 'Waiting',
    registeredTime: '07:45 AM',
    priority: 'Routine',
    billingStatus: 'Paid',
    amount: 1950,
  },
  {
    id: 'tok-105',
    tokenNumber: 'TK-105',
    patientName: 'Dr. Srinivas Murthy',
    age: 56,
    gender: 'Male',
    phone: '+91 98765 01054',
    fastingHours: 13.0,
    isFastingRequired: true,
    orderedPanels: ['Executive Cardiac Wellness Package (Trop-I, Echo, Lipid, HbA1c)'],
    assignedCounter: 'Phlebotomy Counter 1',
    status: 'Waiting',
    registeredTime: '07:50 AM',
    priority: 'STAT',
    billingStatus: 'Paid',
    amount: 4500,
  },
];

export default function ReceptionPage() {
  const { data } = useAppStore();
  const [tokens, setTokens] = useState<ReceptionToken[]>(INITIAL_TOKENS);
  const [filterCounter, setFilterCounter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [audioAnnounced, setAudioAnnounced] = useState<string | null>(null);

  // Walk-in Registration Quick Form
  const [walkinName, setWalkinName] = useState('');
  const [walkinAge, setWalkinAge] = useState('');
  const [walkinGender, setWalkinGender] = useState('Male');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinPackage, setWalkinPackage] = useState('Master Health Checkup');
  const [walkinFasting, setWalkinFasting] = useState(12);

  const displayedTokens = useMemo(() => {
    return tokens.filter(t => {
      const matchCounter = filterCounter === 'all' || t.assignedCounter === filterCounter;
      const matchSearch =
        !searchQuery.trim() ||
        t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCounter && matchSearch;
    });
  }, [tokens, filterCounter, searchQuery]);

  const handleCallToken = (token: ReceptionToken) => {
    setAudioAnnounced(`Calling Token ${token.tokenNumber}: ${token.patientName} to ${token.assignedCounter}`);
    setTokens(prev =>
      prev.map(t => (t.id === token.id ? { ...t, status: 'Serving' } : t))
    );
    setTimeout(() => setAudioAnnounced(null), 4000);
  };

  const handleMarkComplete = (tokenId: string) => {
    setTokens(prev =>
      prev.map(t => (t.id === tokenId ? { ...t, status: 'Completed' } : t))
    );
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    const nextNum = 100 + tokens.length + 1;
    const newToken: ReceptionToken = {
      id: `tok-${nextNum}`,
      tokenNumber: `TK-${nextNum}`,
      patientName: walkinName,
      age: Number(walkinAge) || 45,
      gender: walkinGender,
      phone: walkinPhone || '+91 98765 00000',
      fastingHours: walkinFasting,
      isFastingRequired: walkinFasting > 0,
      orderedPanels: [walkinPackage],
      assignedCounter: walkinPackage.includes('Ultrasound') ? 'Ultrasound Room 02' : 'Phlebotomy Counter 1',
      status: 'Waiting',
      registeredTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: walkinFasting >= 12 ? 'Fasting Priority' : 'Routine',
      billingStatus: 'Paid',
      amount: walkinPackage.includes('Master') ? 3500 : 1500,
    };

    setTokens([newToken, ...tokens]);
    setWalkinName('');
    setWalkinAge('');
    setWalkinPhone('');
  };

  const applyPackagePreset = (pkg: string, fasting: number) => {
    setWalkinPackage(pkg);
    setWalkinFasting(fasting);
  };

  return (
    <div className="fade-in space-y-5 font-sans">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Walk-in Reception & Fast Token Desk</h1>
          <p className="text-[13px] text-surface-500">
            Morning fasting rush triage, token allocation & phlebotomy/radiology counter routing
          </p>
        </div>

        {audioAnnounced && (
          <div className="px-4 py-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse shadow-xs">
            <Volume2 className="w-4 h-4 text-brand-600" />
            <span>🔊 {audioAnnounced}</span>
          </div>
        )}
      </div>

      {/* KPI Metric Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="metric-card">
          <p className="text-2xl font-bold text-brand-600">{tokens.filter(t => t.status === 'Waiting').length}</p>
          <p className="text-[12px] text-surface-500">In Waiting Queue</p>
        </div>
        <div className="metric-card">
          <p className="text-2xl font-bold text-warning-600">{tokens.filter(t => t.status === 'Serving').length}</p>
          <p className="text-[12px] text-surface-500">Currently Serving</p>
        </div>
        <div className="metric-card">
          <p className="text-2xl font-bold text-success-600">{tokens.filter(t => t.priority === 'Fasting Priority').length}</p>
          <p className="text-[12px] text-surface-500">Fasting Surge &gt; 11h</p>
        </div>
        <div className="metric-card">
          <p className="text-2xl font-bold text-surface-900">7.8 mins</p>
          <p className="text-[12px] text-surface-500">Avg. Token Wait Time</p>
        </div>
      </div>

      {/* Main Grid: Fast Walk-In Intake Form + Active Queue Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): Fast Walk-in Intake Pad */}
        <div className="lg:col-span-5 bg-surface-0 border border-surface-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-100 pb-3">
            <UserPlus className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-surface-900">Rapid Walk-in Intake Desk</h2>
          </div>

          {/* 1-Click Diagnostic Package Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-surface-500">
              1-Click Checkup Presets
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyPackagePreset('Executive Master Health Checkup', 12)}
                className="p-2 text-left rounded-lg bg-surface-50 hover:bg-brand-50 hover:border-brand-300 border border-surface-200 transition-colors"
              >
                <p className="font-bold text-surface-800">Master Health</p>
                <p className="text-[10px] text-surface-400">Lipid, LFT, KFT, CBC, USG</p>
              </button>
              <button
                type="button"
                onClick={() => applyPackagePreset('Comprehensive Diabetic Profile', 12)}
                className="p-2 text-left rounded-lg bg-surface-50 hover:bg-brand-50 hover:border-brand-300 border border-surface-200 transition-colors"
              >
                <p className="font-bold text-surface-800">Diabetic Profile</p>
                <p className="text-[10px] text-surface-400">FBS, PPBS, HbA1c, Urine Micro</p>
              </button>
              <button
                type="button"
                onClick={() => applyPackagePreset('Cardiac Risk & Troponin Panel', 0)}
                className="p-2 text-left rounded-lg bg-surface-50 hover:bg-brand-50 hover:border-brand-300 border border-surface-200 transition-colors"
              >
                <p className="font-bold text-surface-800">Cardiac Risk STAT</p>
                <p className="text-[10px] text-surface-400">hs-Trop-I, ECG, Echo, Lipid</p>
              </button>
              <button
                type="button"
                onClick={() => applyPackagePreset('Fever & Platelet Dengue Panel', 0)}
                className="p-2 text-left rounded-lg bg-surface-50 hover:bg-brand-50 hover:border-brand-300 border border-surface-200 transition-colors"
              >
                <p className="font-bold text-surface-800">Fever / Dengue</p>
                <p className="text-[10px] text-surface-400">CBC, NS1 Ag, IgM, Smear</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleCreateWalkin} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-surface-700 block mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra Verma"
                value={walkinName}
                onChange={e => setWalkinName(e.target.value)}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-surface-700 block mb-1">Age</label>
                <input
                  type="number"
                  placeholder="58"
                  value={walkinAge}
                  onChange={e => setWalkinAge(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-surface-700 block mb-1">Gender</label>
                <select
                  value={walkinGender}
                  onChange={e => setWalkinGender(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-surface-700 block mb-1">Mobile</label>
                <input
                  type="tel"
                  placeholder="+91 98765 01050"
                  value={walkinPhone}
                  onChange={e => setWalkinPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-surface-700 block mb-1">Fasting (Hours)</label>
                <input
                  type="number"
                  placeholder="12"
                  value={walkinFasting}
                  onChange={e => setWalkinFasting(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-surface-700 block mb-1">Selected Package / Tests</label>
              <input
                type="text"
                value={walkinPackage}
                onChange={e => setWalkinPackage(e.target.value)}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs font-semibold text-brand-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Dispense Token & Route to Counter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right (7 cols): Active Token Queue Board */}
        <div className="lg:col-span-7 space-y-3">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search token number or patient name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface-0 border border-surface-200 rounded-xl text-xs"
              />
            </div>

            <select
              value={filterCounter}
              onChange={e => setFilterCounter(e.target.value)}
              className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-xl text-xs w-full sm:w-auto"
            >
              <option value="all">All Counters</option>
              <option value="Phlebotomy Counter 1">Phlebotomy Counter 1</option>
              <option value="Phlebotomy Counter 2">Phlebotomy Counter 2</option>
              <option value="Ultrasound Room 02">Ultrasound Room 02</option>
              <option value="X-Ray Suite 01">X-Ray Suite 01</option>
            </select>
          </div>

          {/* Tokens Queue Cards */}
          <div className="space-y-2.5">
            {displayedTokens.map(tok => {
              const isServing = tok.status === 'Serving';
              return (
                <div
                  key={tok.id}
                  className={cn(
                    'p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs',
                    isServing
                      ? 'bg-brand-50/50 border-brand-300 ring-1 ring-brand-400/30'
                      : tok.status === 'Completed'
                      ? 'bg-surface-0 border-surface-200 opacity-60'
                      : 'bg-surface-0 border-surface-200 hover:border-surface-300'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-sm shrink-0 border',
                        isServing
                          ? 'bg-brand-600 text-white border-brand-500 shadow-xs'
                          : 'bg-slate-900 text-brand-300 border-slate-800'
                      )}
                    >
                      <span className="text-[8px] uppercase tracking-wider opacity-70">Token</span>
                      <span>{tok.tokenNumber}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-surface-900">{tok.patientName}</h3>
                        <span className="text-[11px] text-surface-500 font-medium">
                          ({tok.age}y / {tok.gender})
                        </span>
                        {tok.priority === 'STAT' && (
                          <span className="badge bg-rose-100 text-rose-700 text-[10px] font-bold">STAT Emergency</span>
                        )}
                        {tok.priority === 'Fasting Priority' && (
                          <span className="badge bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Fasting {tok.fastingHours}h
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-brand-700 font-semibold mt-0.5">
                        {tok.assignedCounter}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-surface-500 mt-1 flex-wrap">
                        <span>Reg: {tok.registeredTime}</span>
                        <span>·</span>
                        <span className="text-surface-700">{tok.orderedPanels.join(' + ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {tok.status !== 'Completed' && (
                      <>
                        <button
                          onClick={() => handleCallToken(tok)}
                          className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-brand-50 hover:text-brand-700 text-surface-700 font-bold text-xs flex items-center gap-1 border border-surface-200 transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </button>
                        <button
                          onClick={() => handleMarkComplete(tok.id)}
                          className="px-3 py-1.5 rounded-lg bg-success-600 hover:bg-success-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      </>
                    )}
                    {tok.status === 'Completed' && (
                      <span className="text-xs font-bold text-success-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Completed & Routed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
