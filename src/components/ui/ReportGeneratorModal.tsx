import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, X, Sparkles, User, Stethoscope, TestTubes,
  CheckCircle2, AlertTriangle, AlertOctagon, Send, ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/cn';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportGeneratorModal({ isOpen, onClose }: ReportGeneratorModalProps) {
  const { data, addReport, openReportModal } = useAppStore();

  const [selectedPatientId, setSelectedPatientId] = useState(data.patients[0]?.id || 'PT00001');
  const [customPatientName, setCustomPatientName] = useState('');
  const [customAge, setCustomAge] = useState(48);
  const [customGender, setCustomGender] = useState('Male');
  const [customPhone, setCustomPhone] = useState('+91 98765 01001');

  const [selectedProfile, setSelectedProfile] = useState<string>('Complete Blood Count (CBC)');
  const [selectedOutcome, setSelectedOutcome] = useState<'normal' | 'abnormal' | 'critical'>('normal');
  const [referringDoctor, setReferringDoctor] = useState('Dr. Srinivas Rao, MD (Internal Medicine)');
  const [deliveryMethod, setDeliveryMethod] = useState<'WhatsApp' | 'Email' | 'Portal' | 'SMS'>('WhatsApp');
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    const patient = data.patients.find(p => p.id === selectedPatientId) || {
      id: `PT-${Date.now().toString().slice(-5)}`,
      fullName: customPatientName || 'Rajesh Kumar Sharma',
      age: customAge,
      gender: customGender,
      phone: customPhone,
    };

    const newReportId = `RPT-${Math.floor(30000 + Math.random() * 9000)}`;
    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 9000)}`;

    const newReport = {
      id: `RPT${Date.now().toString().slice(-6)}`,
      reportId: newReportId,
      orderId: newOrderId,
      patientId: patient.id,
      patientName: customPatientName.trim() || patient.fullName,
      testNames: [selectedProfile],
      status: selectedOutcome === 'critical' ? 'Verified' : 'Verified',
      generatedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Dr. Sunita Rao, MD Pathologist',
      deliveryMethod,
      referringDoctor,
      isCritical: selectedOutcome === 'critical',
      notes: customNotes,
    };

    // Add report to global store
    addReport(newReport);

    // Close generator modal
    onClose();

    // Immediately open the clinical report PDF viewer for this newly generated report!
    setTimeout(() => {
      openReportModal(newReport, false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Diagnostic Report Generator</h2>
              <p className="text-xs text-slate-400">Generate realistic NABL diagnostic reports with custom clinical outcomes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Generator Form */}
        <form onSubmit={handleGenerate} className="p-6 space-y-5 text-xs text-slate-700">
          {/* 1. Patient Selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-600" />
              <span>Select Patient</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <select
                  value={selectedPatientId}
                  onChange={e => {
                    setSelectedPatientId(e.target.value);
                    const p = data.patients.find(pt => pt.id === e.target.value);
                    if (p) {
                      setCustomPatientName(p.fullName);
                      setCustomAge(p.age);
                      setCustomGender(p.gender);
                      setCustomPhone(p.phone);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-500/20"
                >
                  {data.patients.slice(0, 15).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.age}y / {p.gender}) • {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Or enter custom patient name..."
                  value={customPatientName}
                  onChange={e => setCustomPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>

          {/* 2. Investigation Test Profile */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <TestTubes className="w-3.5 h-3.5 text-brand-600" />
              <span>Diagnostic Panel / Investigation</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { name: 'Complete Blood Count (CBC)', desc: '14 Hematology indices with ESR' },
                { name: 'Diabetic Profile (HbA1c & Fasting Glucose)', desc: 'HbA1c HPLC, FBS, PPBS, Microalbumin' },
                { name: 'Lipid Profile (Cardiac Risk Assessment)', desc: 'Total Chol, Triglycerides, HDL, LDL' },
                { name: 'Liver Function Test (LFT)', desc: 'Bilirubin, SGOT, SGPT, ALP, Protein' },
                { name: 'Kidney Function Test (KFT / RFT)', desc: 'Creatinine, Urea, eGFR, Electrolytes' },
                { name: 'Cardiac Emergency Panel (Troponin-I STAT)', desc: 'hs-cTnI, CK-MB, hs-CRP, NT-proBNP' },
                { name: 'Thyroid Profile Total (T3, T4, TSH)', desc: 'CLIA Total T3, T4 & Ultrasensitive TSH' },
                { name: 'Vitamin D3 & Vitamin B12 Profile', desc: '25-OH Cholecalciferol & B12 ECLIA' },
              ].map(item => (
                <div
                  key={item.name}
                  onClick={() => setSelectedProfile(item.name)}
                  className={cn(
                    'p-2.5 rounded-xl border text-left cursor-pointer transition-all',
                    selectedProfile === item.name
                      ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-2xs font-bold'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
                  )}
                >
                  <p className="font-bold text-xs truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Clinical Outcome Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
              Test Outcome & Findings Profile
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: 'normal',
                  title: 'Normal Limits',
                  desc: 'All values within healthy reference intervals',
                  icon: CheckCircle2,
                  activeColor: 'bg-emerald-50 border-emerald-500 text-emerald-900',
                  iconColor: 'text-emerald-600',
                },
                {
                  id: 'abnormal',
                  title: 'Elevated / Abnormal',
                  desc: 'Mild-to-moderate high/low biological values',
                  icon: AlertTriangle,
                  activeColor: 'bg-amber-50 border-amber-500 text-amber-900',
                  iconColor: 'text-amber-600',
                },
                {
                  id: 'critical',
                  title: 'CRITICAL / STAT',
                  desc: 'Panic range alert triggering immediate physician call',
                  icon: AlertOctagon,
                  activeColor: 'bg-rose-50 border-rose-500 text-rose-900',
                  iconColor: 'text-rose-600',
                },
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedOutcome === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOutcome(opt.id as any)}
                    className={cn(
                      'p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between',
                      isSelected
                        ? `${opt.activeColor} shadow-2xs font-bold ring-2 ring-inset ring-current`
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className={cn('w-4 h-4', opt.iconColor)} />
                        <span className="font-bold text-xs">{opt.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Referring Doctor & Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="font-bold text-slate-800 text-[11px] block mb-1">Referring Clinician</label>
              <select
                value={referringDoctor}
                onChange={e => setReferringDoctor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Dr. Srinivas Rao, MD (Internal Medicine)">Dr. Srinivas Rao, MD (Internal Med)</option>
                <option value="Dr. Anand K., MS, M.Ch (Orthopedics)">Dr. Anand K., MS (Orthopedics)</option>
                <option value="Dr. Preeti Verma, MD, DM (Endocrinology)">Dr. Preeti Verma, DM (Endocrinology)</option>
                <option value="Dr. Lakshmi N., MS (Spine Surgery)">Dr. Lakshmi N., MS (Spine Surgery)</option>
                <option value="Self / Preventive Health Walk-in">Self / Preventive Health Walk-in</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 text-[11px] block mb-1">Preferred Delivery Channel</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['WhatsApp', 'Email', 'Portal', 'SMS'] as const).map(ch => (
                  <button
                    type="button"
                    key={ch}
                    onClick={() => setDeliveryMethod(ch)}
                    className={cn(
                      'py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-all cursor-pointer',
                      deliveryMethod === ch
                        ? 'bg-slate-900 text-white font-bold border-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Report will be authenticated by <strong>Dr. Sunita Rao, MD Pathologist</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary !text-xs !py-2 !px-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary !bg-brand-600 hover:!bg-brand-700 !text-xs !py-2 !px-4 shadow-md font-bold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate & Preview Report PDF</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
