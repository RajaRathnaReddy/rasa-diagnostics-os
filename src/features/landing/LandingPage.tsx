import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Shield, Stethoscope, TestTubes, Sparkles, ArrowRight,
  CheckCircle2, Lock, Eye, Zap, Layers, Cpu, HeartPulse, Scan,
  Clock, Award, BarChart3, Database, FileText, ChevronRight,
  ShieldCheck, MonitorSmartphone, Brain, Building2, UserCheck
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAuthStore } from '../../stores/authStore';

interface StationPreview {
  id: string;
  name: string;
  category: string;
  icon: any;
  summary: string;
  highlights: string[];
  sampleStats: { label: string; value: string }[];
  badge: string;
}

const TOOL_STATIONS: StationPreview[] = [
  {
    id: 'lis',
    name: 'Enterprise Laboratory Information System (LIS)',
    category: 'Biochemistry & Hematology',
    icon: TestTubes,
    badge: 'ASTM / HL7 Interfaced',
    summary: 'Bi-directional auto-interfacing with Roche Cobas, Sysmex, and Abbott analyzers. Barcode-driven accessioning with automated panic delta-checks.',
    highlights: [
      'Zero-delay analyzer interfacing via ASTM E1381 & HL7 v2.5',
      'Autonomous critical panic value flags with doctor tele-alert logging',
      'Automated sample barcode generation with specimen tube color-coding',
      'NABL ISO 15189:2022 compliant multi-tier verification workflows'
    ],
    sampleStats: [
      { label: 'Analyzer Sync Latency', value: '< 150 ms' },
      { label: 'Lab Verification TAT', value: '48 mins' },
      { label: 'Panic Detection Accuracy', value: '100% Real-time' },
    ],
  },
  {
    id: 'pacs',
    name: 'Zero-Footprint Web PACS & RIS Node',
    category: 'Radiology & Imaging',
    icon: Scan,
    badge: '64-Slice CT & 3.0T MRI',
    summary: 'High-speed browser-native DICOM radiograph, CT, and MRI viewer. Allows radiologists and referring physicians to inspect diagnostic scans with zero thick-client installs.',
    highlights: [
      'Interactive Windowing (Bone Window, Soft Tissue, Lung Window, High Contrast)',
      'Linear measurement calipers, Cobb angle, and cardiothoracic ratio (CTR)',
      'Lossless DICOM export and integrated radiologist sign-off drawer',
      'AI CADx Lesion Heatmap Overlay with confidence scoring'
    ],
    sampleStats: [
      { label: 'DICOM Load Speed', value: '0.4s' },
      { label: 'Modalities Supported', value: 'XR, CT, MR, US, Echo' },
      { label: 'Diagnostic Accuracy', value: 'Lossless Grayscale' },
    ],
  },
  {
    id: 'pathology',
    name: 'Digital Histopathology & Cytology Suite',
    category: 'Anatomical Pathology',
    icon: Activity,
    badge: 'Slide Barcode Tracking',
    summary: 'Complete anatomical specimen accessioning, tissue cassette grossing, microtome slide processing, and structured cancer synoptic reporting.',
    highlights: [
      'Specimen cassette and slide laser barcode tracking',
      'Integrated gross examination templates and macroscopic image capture',
      'CAP / WHO synoptic oncology report builder',
      'Second-opinion tele-pathology review hub'
    ],
    sampleStats: [
      { label: 'Specimen Mismatch Risk', value: '0.00%' },
      { label: 'Biopsy Turnaround', value: '36 hours' },
      { label: 'CAP Checklist Ready', value: '100% Validated' },
    ],
  },
  {
    id: 'reception',
    name: 'Walk-in Reception & Fast Token Kiosk',
    category: 'Patient Queue Management',
    icon: Stethoscope,
    badge: 'Morning Surge Balancer',
    summary: 'High-volume morning rush triage with counter routing, automated fasting timer countdown, walk-in registration presets, and acoustic token bells.',
    highlights: [
      'Dynamic counter allocation (Phlebotomy, Ultrasound, ECG, X-Ray)',
      'Fasting duration tracker (10h-12h compliance verification)',
      '1-Click quick registration presets for routine checkup packages',
      'Instant UPI QR payment generation at reception desk'
    ],
    sampleStats: [
      { label: 'Queue Wait Time', value: '8.4 mins' },
      { label: 'Intake Registration Speed', value: '45 seconds' },
      { label: 'Patient Satisfaction', value: '98.6%' },
    ],
  },
  {
    id: 'ai_sentinel',
    name: 'Autonomous AI Command Center',
    category: 'Predictive Diagnostic Intelligence',
    icon: Brain,
    badge: '6 Specialized Agents',
    summary: 'Clinical AI sentinels monitoring platform operations. Features automated critical panic value escalation, hemolysis detection, and TAT bottleneck predictions.',
    highlights: [
      'Critical Panic Lab Value Sentinel (Troponin, K+, Platelets)',
      'Phlebotomy hemolysis rate auditor and root-cause classifier',
      'Multi-branch turnaround time (TAT) predictive forecaster',
      'Doctor Pre-Diagnostic Risk Brief with eGFR IV contrast screening'
    ],
    sampleStats: [
      { label: 'Active Sentinels', value: '6 Live Agents' },
      { label: 'Alert Precision', value: '99.4%' },
      { label: 'Doctor Tele-Alerts', value: '< 2 mins' },
    ],
  },
  {
    id: 'multibranch',
    name: 'Multi-Branch Hub-and-Spoke Enterprise',
    category: 'Network Operations',
    icon: Building2,
    badge: 'Centralized Reference Lab',
    summary: 'Coordinate standalone collection centers and hospital-attached diagnostic suites. Real-time specimen transport tracking and centralized billing.',
    highlights: [
      'Hub-and-spoke specimen cold-chain logistics monitoring',
      'Centralized pathologist and radiologist tele-reporting pool',
      'Consolidated P&L, collections, and GST tax reconciliations',
      'Dynamic workload balancing across regional analyzers'
    ],
    sampleStats: [
      { label: 'Central Lab Network', value: '3 Branches Active' },
      { label: 'Specimen Cold-Chain', value: '100% Monitored' },
      { label: 'Cost Savings', value: '32% Overhead Drop' },
    ],
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [selectedStation, setSelectedStation] = useState<StationPreview>(TOOL_STATIONS[0]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white font-sans overflow-x-hidden">
      {/* Background Soft Medical Ambience Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-brand-600/10 blur-[180px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] rounded-full bg-cyan-600/10 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
      </div>

      {/* ═══ TOP NAVBAR ═══ */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg text-white font-black text-xl border border-brand-400/30">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  RASA DIAGNOSTICS OS
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono font-bold">
                  ENTERPRISE v3.2
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                One Intelligent Operating System for Modern Diagnostic Centers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 transition-all cursor-pointer"
            >
              Sign In / Switch Role
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Launch Diagnostics OS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Next-Generation Healthcare Technology for High-Volume Diagnostic Hubs</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          One Intelligent Operating System for{' '}
          <span className="bg-gradient-to-r from-brand-400 via-cyan-300 to-brand-500 bg-clip-text text-transparent">
            Modern Diagnostic Centers
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Unify your Laboratory Information System (LIS), Radiology RIS & Web PACS, Digital Pathology,
          Walk-in Reception Tokens, Patient 360 CRM, and Autonomous AI Sentinels into a single, cohesive operating platform.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <span>Launch Live Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-brand-400" />
            <span>Staff Login (Raja Rathna Reddy)</span>
          </button>
        </div>

        {/* Regulatory & Enterprise Badges */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success-400" />
            <span>NABL ISO 15189:2022 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>DICOM 3.0 & Web PACS Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>HL7 FHIR & ASTM E1381 Interfaced</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>CAP Oncology Synoptic Protocol</span>
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE WORKSTATION SHOWCASE ═══ */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Integrated Diagnostic Operating Stations
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Click any station below to explore its workflows, live operational metrics, and clinical capabilities.
          </p>
        </div>

        {/* Station Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {TOOL_STATIONS.map(station => {
            const Icon = station.icon;
            const isSelected = selectedStation.id === station.id;
            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className={cn(
                  'p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3',
                  isSelected
                    ? 'bg-slate-900 border-brand-500 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
                )}
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center',
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white line-clamp-1">{station.name.split(' ')[0]} {station.name.split(' ')[1]}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{station.category}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Station Deep-Dive Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider font-mono">
                {selectedStation.badge}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{selectedStation.category}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {selectedStation.name}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedStation.summary}
            </p>

            {/* Highlights */}
            <div className="space-y-2 pt-2">
              {selectedStation.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => {
                  if (selectedStation.id === 'pacs') navigate('/radiology');
                  else if (selectedStation.id === 'reception') navigate('/reception');
                  else if (selectedStation.id === 'lis') navigate('/laboratory');
                  else if (selectedStation.id === 'pathology') navigate('/pathology');
                  else if (selectedStation.id === 'ai_sentinel') navigate('/ai-assistant');
                  else navigate('/');
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Launch {selectedStation.name.split(' ')[0]} Station</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metric Stats Column */}
          <div className="lg:col-span-5 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Station Performance Benchmarks</p>
            <div className="space-y-3">
              {selectedStation.sampleStats.map((stat, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">{stat.label}</span>
                  <span className="text-sm font-bold font-mono text-brand-400">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-[11px] text-brand-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Calibrated for high-throughput diagnostic networks processing 500+ patients daily.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-3">
        <p className="text-slate-400 font-medium">
          RASA DIAGNOSTICS OS · Engineered for Enterprise Diagnostic Centers & Hospital Labs
        </p>
        <p className="text-[11px]">
          Designed and configured by Master Administrator <strong className="text-slate-300">Raja Rathna Reddy</strong>. All rights reserved © 2026.
        </p>
      </footer>
    </div>
  );
}
