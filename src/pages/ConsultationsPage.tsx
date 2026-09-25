import { useState } from 'react';
import {
  Stethoscope, Search, User, FileText, CheckCircle2,
  AlertTriangle, Scan, TestTubes, Plus, ArrowRight,
  Sparkles, Clock, HeartPulse, ShieldCheck, Printer
} from 'lucide-react';
import { cn } from '../lib/cn';
import { useAppStore } from '../store/useAppStore';
import { DoctorPreConsultBrief, type PreTestTriageBrief } from '../components/ui/DoctorPreConsultBrief';

const SAMPLE_CONSULTATION_QUEUES: PreTestTriageBrief[] = [
  {
    token: 'C-01',
    patientName: 'Rajesh Kumar Sharma',
    patientId: 'PAT-0001',
    age: 58,
    gender: 'Male',
    registeredTime: '08:45 AM',
    isNewPatient: false,
    priorVisitsCount: 4,
    fastingStatus: 'Fasting 12 Hours (Verified)',
    eGfrValue: '72 mL/min (Optimal)',
    criticalAlerts: ['⚠️ Known Iodine Contrast Mild Urticaria', 'Hypertension (Stage 1)'],
    contrastSafetyCleared: true,
    mriSafetyCleared: true,
    orderedPanels: ['Chest PA Digital X-Ray', 'Comprehensive Lipid Profile', 'HbA1c Glycated Hemoglobin'],
    referringDoctor: 'Dr. Anand Krishnamurthy (Cardiology)',
    indication: 'Annual diabetic-cardiac risk stratification and exertional dyspnea check',
    rawScanId: 'xr-chest-01',
  },
  {
    token: 'C-02',
    patientName: 'Kavitha Ramachandran',
    patientId: 'PAT-0016',
    age: 44,
    gender: 'Female',
    registeredTime: '09:10 AM',
    isNewPatient: false,
    priorVisitsCount: 2,
    fastingStatus: 'Non-Fasting (Random)',
    eGfrValue: '88 mL/min (Optimal)',
    criticalAlerts: ['⚠️ Persistent Low-Grade Fever 10 Days', 'Dry Cough'],
    contrastSafetyCleared: true,
    mriSafetyCleared: true,
    orderedPanels: ['High-Resolution Chest CT (HRCT)', 'Complete Blood Count (CBC) with ESR', 'C-Reactive Protein (CRP)'],
    referringDoctor: 'Dr. Suresh V. (Pulmonology)',
    indication: 'Evaluate ground glass opacities and post-viral inflammatory infiltrates',
    rawScanId: 'ct-chest-02',
  },
  {
    token: 'C-03',
    patientName: 'Arun Varma Naidu',
    patientId: 'PAT-0023',
    age: 62,
    gender: 'Male',
    registeredTime: '09:30 AM',
    isNewPatient: true,
    priorVisitsCount: 0,
    fastingStatus: 'Fasting 10 Hours',
    eGfrValue: '64 mL/min (Borderline Adequate)',
    criticalAlerts: ['⚠️ History of Transient Ischemic Attack (TIA) 2 Weeks Ago', 'Active Aspirin Therapy'],
    contrastSafetyCleared: true,
    mriSafetyCleared: true,
    orderedPanels: ['Brain MRI (3.0T Multi-Sequence)', 'Carotid Color Doppler Ultrasound', 'Fasting Blood Glucose'],
    referringDoctor: 'Dr. K. Murthy (Neurology)',
    indication: 'Assess microvascular ischemic load and internal carotid stenosis',
    rawScanId: 'mr-brain-03',
  },
];

export default function ConsultationsPage() {
  const { openDicomViewer } = useAppStore();
  const [selectedBrief, setSelectedBrief] = useState<PreTestTriageBrief>(SAMPLE_CONSULTATION_QUEUES[0]);
  const [activeTab, setActiveTab] = useState<'brief' | 'requisition' | 'findings'>('brief');

  // Diagnostic Requisition Form State
  const [prescribedTests, setPrescribedTests] = useState<string[]>([
    'Serum Creatinine & eGFR Calculation',
    'Lipid Profile Comprehensive',
    'High-Sensitivity Troponin-I'
  ]);
  const [customTestInput, setCustomTestInput] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient presents for routine executive diagnostic screening. Advise fasting verification prior to blood draw and hydration protocol.'
  );
  const [savedOrderSuccess, setSavedOrderSuccess] = useState(false);

  const handleAddTest = () => {
    if (!customTestInput.trim()) return;
    setPrescribedTests([...prescribedTests, customTestInput.trim()]);
    setCustomTestInput('');
  };

  const handleRemoveTest = (index: number) => {
    setPrescribedTests(prescribedTests.filter((_, i) => i !== index));
  };

  const handleSaveRequisition = () => {
    setSavedOrderSuccess(true);
    setTimeout(() => setSavedOrderSuccess(false), 3500);
  };

  return (
    <div className="fade-in space-y-5 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Clinical Consultation & Diagnostic Requisition Desk</h1>
          <p className="text-[13px] text-surface-500">
            Physician evaluation, pre-test clinical briefs, contrast safety clearance & digital requisition builder
          </p>
        </div>

        {savedOrderSuccess && (
          <div className="px-4 py-2 bg-success-50 border border-success-200 text-success-700 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-success-600" />
            <span>Diagnostic Requisition #ORD-9912 Dispatched to Lab & Imaging!</span>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (4 cols): Queue of Patients Awaiting Consultation / Pre-Scan Brief */}
        <div className="lg:col-span-4 bg-surface-0 border border-surface-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-surface-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-brand-600" />
              <h2 className="text-sm font-bold text-surface-900">Today's Clinical Queue</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold">
              {SAMPLE_CONSULTATION_QUEUES.length} Patients
            </span>
          </div>

          <div className="space-y-2">
            {SAMPLE_CONSULTATION_QUEUES.map(item => {
              const isSelected = selectedBrief.patientId === item.patientId;
              return (
                <button
                  key={item.patientId}
                  onClick={() => setSelectedBrief(item)}
                  className={cn(
                    'w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5',
                    isSelected
                      ? 'bg-brand-50/60 border-brand-300 ring-1 ring-brand-400/20 shadow-xs'
                      : 'bg-surface-0 border-surface-200 hover:border-surface-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-600 bg-brand-100/50 px-2 py-0.5 rounded">
                        {item.token}
                      </span>
                      <p className="text-xs font-bold text-surface-900 truncate">{item.patientName}</p>
                    </div>
                    <span className="text-[10px] text-surface-400 font-mono">{item.registeredTime}</span>
                  </div>

                  <p className="text-[11px] text-surface-600 truncate">{item.indication}</p>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="text-surface-500 font-medium">Ref: {item.referringDoctor.split(' ')[1]}</span>
                    {item.rawScanId && (
                      <span className="text-brand-600 font-semibold flex items-center gap-1">
                        <Scan className="w-3 h-3" /> PACS Ready
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right (8 cols): Selected Patient Clinical Station & Requisition Desk */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Patient Pre-Consult Triage Brief Component */}
          <DoctorPreConsultBrief
            triage={selectedBrief}
            onOpenDicom={studyId => openDicomViewer?.(studyId)}
          />

          {/* Interactive Requisition Workspace */}
          <div className="bg-surface-0 border border-surface-200 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-surface-200 gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('brief')}
                className={cn(
                  'pb-2.5 border-b-2 transition-colors cursor-pointer',
                  activeTab === 'brief'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-surface-500 hover:text-surface-800'
                )}
              >
                Diagnostic Order Builder
              </button>
              <button
                onClick={() => setActiveTab('requisition')}
                className={cn(
                  'pb-2.5 border-b-2 transition-colors cursor-pointer',
                  activeTab === 'requisition'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-surface-500 hover:text-surface-800'
                )}
              >
                Contrast Safety & Allergies
              </button>
            </div>

            {activeTab === 'brief' && (
              <div className="space-y-4 text-xs">
                {/* 1-Click Fast Diagnostic Packages */}
                <div>
                  <label className="font-bold text-surface-700 uppercase tracking-wider text-[10px] block mb-1.5">
                    Quick Clinical Requisition Presets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: '+ Master Health Screen', tests: ['CBC', 'Lipid Profile', 'LFT', 'KFT', 'Chest X-Ray', 'Abdomen USG'] },
                      { name: '+ Diabetic Risk Panel', tests: ['FBS', 'PPBS', 'HbA1c HPLC', 'Urine Microalbumin', 'Serum Creatinine'] },
                      { name: '+ Acute Cardiac Screen', tests: ['hs-Troponin-I', 'ECG 12-Lead', '2D-Echo Doppler', 'CPK-MB'] },
                      { name: '+ Stroke / TIA Protocol', tests: ['Brain MRI DWI/FLAIR', 'Carotid Doppler', 'Serum Homocysteine', 'Coagulation PT/INR'] },
                    ].map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          const merged = Array.from(new Set([...prescribedTests, ...preset.tests]));
                          setPrescribedTests(merged);
                        }}
                        className="px-3 py-1.5 bg-surface-50 hover:bg-brand-50 hover:text-brand-700 border border-surface-200 rounded-lg text-surface-700 font-semibold transition-colors cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Prescribed Tests List */}
                <div>
                  <label className="font-bold text-surface-700 uppercase tracking-wider text-[10px] block mb-1.5">
                    Prescribed Diagnostic Investigations ({prescribedTests.length})
                  </label>
                  <div className="p-3 bg-surface-50 border border-surface-200 rounded-xl space-y-2">
                    {prescribedTests.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-surface-0 border border-surface-200 rounded-lg text-xs"
                      >
                        <span className="font-medium text-surface-900">{t}</span>
                        <button
                          onClick={() => handleRemoveTest(idx)}
                          className="text-surface-400 hover:text-rose-600 text-[11px] font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add custom laboratory or imaging investigation..."
                        value={customTestInput}
                        onChange={e => setCustomTestInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddTest()}
                        className="flex-1 px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-xs"
                      />
                      <button
                        onClick={handleAddTest}
                        className="px-3 py-2 bg-surface-200 hover:bg-surface-300 text-surface-800 rounded-lg font-bold text-xs"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clinical Notes & Fasting Instructions */}
                <div>
                  <label className="font-semibold text-surface-700 block mb-1">Doctor's Clinical Notes & Instructions</label>
                  <textarea
                    rows={2}
                    value={clinicalNotes}
                    onChange={e => setClinicalNotes(e.target.value)}
                    className="w-full p-3 border border-surface-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-surface-200 rounded-xl text-xs font-semibold text-surface-700 hover:bg-surface-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Requisition Slip</span>
                  </button>

                  <button
                    onClick={handleSaveRequisition}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Authorize & Route to Lab/Radiology</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'requisition' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Pre-Contrast Screening Protocol</span>
                  </div>
                  <p className="leading-relaxed">
                    Patient eGFR: <strong>{selectedBrief.eGfrValue}</strong>.
                    Patient has a mild documented urticaria reaction to older ionic contrast agents.
                    Visipaque (Iodixanol non-ionic iso-osmolar) is pre-authorized.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 bg-surface-50 rounded-lg border border-surface-200 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                    <span>No cardiac pacemaker or ferromagnetic neuro-aneurysm clips</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-surface-50 rounded-lg border border-surface-200 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                    <span>Hydration protocol (500ml oral fluids 2h pre-scan) cleared</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-surface-50 rounded-lg border border-surface-200 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                    <span>Metformin withholding protocol verified if IV contrast required</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
