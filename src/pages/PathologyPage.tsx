import { useAppStore } from '../store/useAppStore';
import { Microscope, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function PathologyPage() {
  const stats = { specimens: 24, grossing: 5, processing: 8, reporting: 6, verified: 5 };
  return (
    <div className="fade-in space-y-5">
      <div><h1 className="text-xl font-bold text-surface-900">Pathology</h1><p className="text-[13px] text-surface-500">Histopathology, Cytology, Biopsy & FNAC</p></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="metric-card"><p className="text-2xl font-bold">{stats.specimens}</p><p className="text-[12px] text-surface-500">Total Specimens</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-brand-600">{stats.grossing}</p><p className="text-[12px] text-surface-500">Grossing</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-warning-600">{stats.processing}</p><p className="text-[12px] text-surface-500">Processing</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-info-600">{stats.reporting}</p><p className="text-[12px] text-surface-500">Reporting</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-success-600">{stats.verified}</p><p className="text-[12px] text-surface-500">Verified</p></div>
      </div>
      {/* Pathology Pipeline */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
        <h3 className="text-[13px] font-semibold text-surface-500 uppercase tracking-wider mb-4">Pathology Workflow</h3>
        <div className="flex items-center justify-between">
          {['Specimen Received', 'Grossing', 'Processing', 'Slide Prep', 'Microscopy', 'Reporting', 'Verification'].map((stage, i, arr) => (
            <div key={stage} className="flex items-center">
              <div className="pipeline-stage">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  i <= 1 ? 'bg-brand-500' : i <= 3 ? 'bg-warning-500' : i <= 5 ? 'bg-info-500' : 'bg-success-500'
                }`}>{[5, 3, 4, 3, 3, 4, 2][i]}</div>
                <span className="text-[10px] text-surface-600 font-medium mt-1 max-w-[70px] text-center">{stage}</span>
              </div>
              {i < arr.length - 1 && <div className="pipeline-connector" />}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-8 text-center">
        <Microscope className="w-12 h-12 text-surface-300 mx-auto mb-3" />
        <p className="text-[14px] font-medium text-surface-700">Pathology Worklist</p>
        <p className="text-[13px] text-surface-500 mt-1">Specimen tracking and case management for histopathology, cytology, biopsy, and FNAC workflows.</p>
      </div>
    </div>
  );
}
