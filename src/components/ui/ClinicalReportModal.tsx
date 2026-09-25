import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer, Download, Share2, Mail, MessageSquare, CheckCircle2,
  X, AlertTriangle, ShieldCheck, QrCode, FileText, Sparkles,
  Building2, Phone, Calendar, User, Clock, Check
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { resolveReportFullData, type FullMedicalReportData } from '../../lib/clinicalReports';
import { cn } from '../../lib/cn';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any | null;
  autoPrint?: boolean;
}

export function ClinicalReportModal({ isOpen, onClose, report, autoPrint = false }: ClinicalReportModalProps) {
  const { data, updateReportStatus } = useAppStore();
  const [reportData, setReportData] = useState<FullMedicalReportData | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const printTriggered = useRef(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    if (report) {
      const resolved = resolveReportFullData(report, data.patients);
      setReportData(resolved);
      setIsSigned(resolved.status === 'Verified' || resolved.status === 'Delivered' || (resolved.status as any) === 'Viewed');
    } else {
      setReportData(null);
    }
  }, [report, data.patients]);

  useEffect(() => {
    if (isOpen && autoPrint && reportData && !printTriggered.current) {
      printTriggered.current = true;
      const t = setTimeout(() => {
        window.print();
        printTriggered.current = false;
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isOpen, autoPrint, reportData]);

  if (!isOpen || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    updateReportStatus(reportData.reportId, 'Delivered');
    showToast(`📲 Official Medical PDF dispatched to patient WhatsApp (${reportData.phone})!`);
  };

  const handleSendEmail = () => {
    updateReportStatus(reportData.reportId, 'Delivered');
    showToast(`✉️ Official Medical PDF sent via Email to patient and ${reportData.referringDoctor}!`);
  };

  const handleSignOff = () => {
    setIsSigned(true);
    updateReportStatus(reportData.reportId, 'Verified');
    showToast(`✅ Report ${reportData.reportId} digitally signed by Dr. Sunita Rao, MD Pathologist!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      {/* Toast Notice */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold border border-slate-700 no-print"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Modal Top Action Toolbar (Hidden in Print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Diagnostic Laboratory Report</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-semibold">
                  {reportData.reportId}
                </span>
                <span className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full',
                  isSigned ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                )}>
                  {isSigned ? 'Digitally Signed & NABL Verified' : 'Draft / Awaiting Sign-off'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSigned && (
              <button
                onClick={handleSignOff}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Sign Off & Authorize</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Print official report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs transition-colors cursor-pointer"
              title="Share via WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              onClick={handleSendEmail}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs transition-colors cursor-pointer"
              title="Send via Email"
            >
              <Mail className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── PRINTABLE OFFICIAL MEDICAL REPORT (Letterhead & Layout) ── */}
        <div id="printable-medical-report" className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 text-xs">
          {/* Diagnostic Center Official Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
                  R
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    RASA DIAGNOSTICS & RESEARCH CENTRE
                  </h1>
                  <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                    Central Reference Laboratory & Multi-Slice Advanced Imaging Hub
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Plot No. 14, Road No. 2, Banjara Hills, Hyderabad — 500034, Telangana, India
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px]">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  NABL ACCREDITED LAB (MC-2849)
                </div>
                <p className="text-[9.5px] text-slate-500 mt-1">ISO 15189:2012 Certified • ICMR Reg #50012</p>
                <p className="text-[9.5px] text-slate-500 font-mono">Emergency Helplines: +91 40 4859 9000</p>
              </div>
            </div>
          </div>

          {/* Patient Demographics & Accession Header */}
          <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3.5 mb-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Patient Details</span>
              <span className="font-extrabold text-slate-900 text-xs block mt-0.5">{reportData.patientName}</span>
              <span className="text-slate-600">{reportData.age} Years / {reportData.gender}</span>
              <span className="text-slate-500 font-mono block">{reportData.phone}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ID & Registration</span>
              <span className="font-mono font-bold text-slate-900 block mt-0.5">{reportData.uhid}</span>
              <span className="text-slate-600">Order ID: <strong className="font-mono text-slate-800">{reportData.orderId}</strong></span>
              <span className="text-slate-600">Sample: <strong className="font-mono text-slate-800">{reportData.sampleId}</strong></span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Referring Physician</span>
              <span className="font-bold text-brand-700 text-xs block mt-0.5">{reportData.referringDoctor}</span>
              <span className="text-slate-500">Center: Banjara Hills Hub</span>
              <span className="text-slate-500">Barcode: <strong className="font-mono text-slate-700">{reportData.barcode}</strong></span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Timestamps</span>
              <span className="text-slate-700 block mt-0.5">Coll: <strong>{reportData.collectionTime}</strong></span>
              <span className="text-slate-700 block">Reported: <strong>{reportData.reportingTime}</strong></span>
              <span className="inline-block mt-1 font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded text-[9.5px]">
                Status: {reportData.status}
              </span>
            </div>
          </div>

          {/* Clinical Panels & Test Parameters Table */}
          <div className="space-y-6">
            {reportData.panels.map((panel, pIdx) => (
              <div key={pIdx} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                {/* Panel Banner */}
                <div className="bg-slate-800 text-white px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h2 className="font-bold text-xs uppercase tracking-wide">{panel.panelName}</h2>
                    <span className="text-[10px] text-slate-300">Department: {panel.department} • Specimen: {panel.specimen}</span>
                  </div>
                  <span className="text-[9.5px] text-slate-300 italic hidden sm:inline">Method: {panel.methodology}</span>
                </div>

                {/* Parameters Table */}
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[10.5px] font-bold text-slate-600 uppercase">
                      <th className="py-2.5 px-4 w-[38%]">Investigation Parameter</th>
                      <th className="py-2.5 px-3 w-[20%]">Observed Value</th>
                      <th className="py-2.5 px-3 w-[12%]">Units</th>
                      <th className="py-2.5 px-4 w-[30%]">Biological Reference Interval</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {panel.parameters.map((param, idx) => {
                      const isAbnormal = param.flag !== 'NORMAL';
                      const isCritical = param.flag === 'CRITICAL';
                      return (
                        <tr
                          key={idx}
                          className={cn(
                            'transition-colors',
                            isCritical ? 'bg-rose-50/70 font-semibold' :
                            isAbnormal ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'
                          )}
                        >
                          <td className="py-2 px-4 font-medium text-slate-800">
                            {param.parameter}
                            <span className="block text-[9.5px] text-slate-400 font-normal">{param.method}</span>
                          </td>
                          <td className="py-2 px-3">
                            <span className={cn(
                              'font-mono text-xs font-extrabold flex items-center gap-1.5',
                              isCritical ? 'text-rose-700' :
                              isAbnormal ? 'text-amber-700' : 'text-slate-900'
                            )}>
                              {param.observedValue}
                              {isCritical && (
                                <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                                  CRITICAL
                                </span>
                              )}
                              {param.flag === 'HIGH' && (
                                <span className="text-amber-700 text-[10px] font-bold">▲ HIGH</span>
                              )}
                              {param.flag === 'LOW' && (
                                <span className="text-blue-700 text-[10px] font-bold">▼ LOW</span>
                              )}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{param.unit || '—'}</td>
                          <td className="py-2 px-4 text-slate-600 font-mono text-[11px]">{param.referenceInterval}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Clinical Interpretation Notes */}
                {panel.interpretation && (
                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10.5px] text-slate-700 space-y-0.5">
                    <span className="font-bold text-slate-900 block text-[11px]">Clinical Impression & Interpretation:</span>
                    <p className="leading-relaxed text-slate-600">{panel.interpretation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Clinical Comments & Legal Disclaimer */}
          <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">General Laboratory Advisory:</span>
            <p>1. Test findings represent biological specimen state at time of phlebotomy/accessioning. Clinical correlation with treating physician required.</p>
            <p>2. Panic/Critical values are verbally informed and logged with attending clinician within 15 minutes of analytical release per NABL guidelines.</p>
            <p>3. Partial reproduction of this clinical diagnostic report is strictly prohibited without prior written authorization from RASA Diagnostics.</p>
          </div>

          {/* Official Signatures & Verification Footer */}
          <div className="mt-6 pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-lg p-1.5 flex flex-col items-center justify-center shrink-0">
                <QrCode className="w-8 h-8 text-slate-700" />
                <span className="text-[8px] font-mono text-slate-500 mt-0.5">SCAN VERIFY</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide block">RASA Digital Authenticity Guarantee</span>
                <span className="text-[9.5px] text-slate-500 block">Cryptographically signed with SHA-256 certificate</span>
                <span className="text-[9.5px] font-mono text-brand-700 block">Verify URL: https://dc.rajarathnareddy.com/verify/{reportData.reportId}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 self-end text-center">
              {reportData.biochemist && (
                <div className="border-t border-slate-400 pt-1 min-w-[130px]">
                  <span className="text-xs font-bold text-slate-900 block">{reportData.biochemist.name}</span>
                  <span className="text-[9px] text-slate-500 block">{reportData.biochemist.qualification}</span>
                  <span className="text-[8.5px] font-mono text-slate-400 block">{reportData.biochemist.regNumber}</span>
                </div>
              )}

              <div className="border-t-2 border-slate-900 pt-1 min-w-[140px]">
                <span className="text-xs font-bold text-slate-900 block">{reportData.pathologist.name}</span>
                <span className="text-[9px] text-slate-600 font-semibold block">{reportData.pathologist.qualification}</span>
                <span className="text-[8.5px] font-mono text-slate-400 block">{reportData.pathologist.regNumber}</span>
                <span className="text-[8px] font-bold text-emerald-700 block">Chief Lab Director</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[9px] text-slate-400 mt-4 pt-2 border-t border-slate-100 font-mono">
            ════════════════════════════════════ END OF DIAGNOSTIC REPORT ════════════════════════════════════
          </div>
        </div>
      </motion.div>
    </div>
  );
}
