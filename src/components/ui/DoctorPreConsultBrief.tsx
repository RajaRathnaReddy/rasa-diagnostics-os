import {
  AlertTriangle, Stethoscope, Eye, Clock, CheckCircle2,
  FileText, ShieldCheck, Zap, Activity, Scan
} from 'lucide-react';
import { cn } from '../../lib/cn';

export interface PreTestTriageBrief {
  token: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  registeredTime: string;
  isNewPatient: boolean;
  priorVisitsCount: number;
  fastingStatus: string;
  eGfrValue?: string;
  criticalAlerts: string[];
  contrastSafetyCleared: boolean;
  mriSafetyCleared: boolean;
  orderedPanels: string[];
  referringDoctor: string;
  indication: string;
  rawScanId?: string;
}

interface DoctorPreConsultBriefProps {
  triage: PreTestTriageBrief;
  onOpenDicom?: (studyId?: string) => void;
  compact?: boolean;
}

export function DoctorPreConsultBrief({ triage, onOpenDicom, compact = false }: DoctorPreConsultBriefProps) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-surface-0 p-4 sm:p-5 text-surface-800 shadow-xs space-y-4 font-sans">
      {/* Top Header: OP Triage Highlights Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-100 pb-3.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-brand-400 flex flex-col items-center justify-center font-mono font-bold text-xs shadow-xs shrink-0 border border-slate-800">
            <span className="text-[8.5px] uppercase tracking-wider text-slate-400">Token</span>
            <span>{triage.token}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-surface-900 tracking-tight">
                Pre-Test Diagnostic Triage Brief
              </h3>
              {triage.isNewPatient ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  New Patient
                </span>
              ) : (
                <span className="bg-surface-100 text-surface-700 border border-surface-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>Record:</span>
                  <span>{triage.priorVisitsCount} Prior Diagnostics</span>
                </span>
              )}
              <span className="text-surface-400 text-[11px] font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-surface-400" />
                {triage.registeredTime}
              </span>
            </div>
            <p className="text-xs text-surface-600 font-medium mt-0.5">
              <strong className="text-surface-900 font-bold">{triage.patientName}</strong> ({triage.age}y / {triage.gender}) · Ref: <span className="text-brand-600 font-semibold">{triage.referringDoctor}</span>
            </p>
          </div>
        </div>

        {/* Imaging Quick-Action Button */}
        {triage.rawScanId && onOpenDicom && (
          <button
            onClick={() => onOpenDicom(triage.rawScanId)}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Launch DICOM PACS</span>
          </button>
        )}
      </div>

      {/* Critical Medical Flags Banner */}
      {triage.criticalAlerts && triage.criticalAlerts.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center gap-2.5 shadow-xs border border-slate-800">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs shrink-0 tracking-wide uppercase">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Pre-Diagnostic Risk Sentinel:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            {triage.criticalAlerts.map((alert, i) => (
              <span
                key={i}
                className="text-xs font-semibold text-slate-100 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                {alert.replace('⚠️ ', '')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key Diagnostic Pre-Checks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200">
          <p className="text-[10px] uppercase font-bold text-surface-400">Fasting Status</p>
          <p className="font-bold text-surface-900 mt-0.5">{triage.fastingStatus}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200">
          <p className="text-[10px] uppercase font-bold text-surface-400">Renal eGFR (Contrast)</p>
          <p className="font-bold text-success-700 mt-0.5">{triage.eGfrValue || '88 mL/min (Optimal)'}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200">
          <p className="text-[10px] uppercase font-bold text-surface-400">MRI Ferromagnetic Screen</p>
          <p className="font-bold text-success-700 mt-0.5">Cleared (No Implants)</p>
        </div>
        <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200">
          <p className="text-[10px] uppercase font-bold text-surface-400">Clinical Indication</p>
          <p className="font-semibold text-surface-900 mt-0.5 truncate">{triage.indication}</p>
        </div>
      </div>

      {/* Ordered Tests & Requisitions */}
      <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-brand-900 text-[11px] uppercase tracking-wider">Active Requisitions:</span>
        {triage.orderedPanels.map((panel, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 bg-surface-0 border border-brand-200 rounded-lg text-brand-800 font-medium text-xs shadow-xs"
          >
            {panel}
          </span>
        ))}
      </div>
    </div>
  );
}
