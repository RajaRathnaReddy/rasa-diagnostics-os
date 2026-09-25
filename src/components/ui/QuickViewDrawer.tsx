import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  X, User, Hash, TestTubes, FileText, CalendarDays, Receipt,
  AlertTriangle, ArrowRight, ExternalLink, Phone, Mail, Clock,
  CheckCircle2, Printer, ShieldAlert, Sparkles, Building2, Eye,
  Edit, Activity, Tag, Droplets, MapPin, Scan, Check
} from 'lucide-react';
import { cn } from '../../lib/cn';

export function QuickViewDrawer() {
  const { quickViewDrawer, closeQuickView, openDicomViewer } = useAppStore();
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && quickViewDrawer.open) {
        closeQuickView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewDrawer.open, closeQuickView]);

  if (!quickViewDrawer.open || !quickViewDrawer.data) return null;

  const { type, data } = quickViewDrawer;

  const navigateTo = (path: string) => {
    closeQuickView();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-950/40 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={closeQuickView}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-0 border-l border-surface-200 shadow-2xl flex flex-col slide-left">
          {/* Header */}
          <div className="px-5 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50/50">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-md">
                Quick Inspector
              </span>
              <span className="text-xs text-surface-400 capitalize">• {type ? type.replace('_', ' ') : ''}</span>
            </div>
            <button
              onClick={closeQuickView}
              className="p-1.5 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer"
              title="Close drawer (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
            {/* 1. PATIENT QUICK VIEW */}
            {type === 'patient' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-surface-100">
                  <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
                    {data.fullName?.charAt(0) || 'P'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-surface-900 truncate">{data.fullName}</h3>
                    <p className="text-xs font-mono text-surface-500">{data.patientId}</p>
                    <div className="flex items-center gap-2 text-xs text-surface-600 mt-1">
                      <span>{data.age} yrs • {data.gender}</span>
                      {data.bloodGroup && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-semibold text-[10px]">
                          {data.bloodGroup}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-surface-50 rounded-lg border border-surface-100">
                    <span className="text-surface-400 block mb-1">Phone Number</span>
                    <span className="font-semibold text-surface-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-500" />
                      {data.phone || 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-lg border border-surface-100">
                    <span className="text-surface-400 block mb-1">Email</span>
                    <span className="font-semibold text-surface-800 truncate block">
                      {data.email || 'N/A'}
                    </span>
                  </div>
                </div>

                {data.allergies && data.allergies.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                    <span className="font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Known Allergies
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.allergies.map((a: string, i: number) => (
                        <span key={i} className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded text-[11px] font-medium">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-surface-100">
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-surface-500">Address</span>
                    <span className="font-medium text-surface-800 text-right max-w-[200px] truncate">{data.address || 'Hyderabad, Telangana'}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-surface-500">Emergency Contact</span>
                    <span className="font-medium text-surface-800">{data.emergencyContact || 'Family'} ({data.emergencyPhone || 'N/A'})</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-surface-500">Preferred Language</span>
                    <span className="font-medium text-surface-800">{data.preferredLanguage || 'English / Telugu'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ORDER QUICK VIEW */}
            {type === 'order' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                  <div>
                    <h3 className="font-bold text-base text-surface-900 font-mono">{data.orderId}</h3>
                    <p className="text-xs text-surface-500">{data.patientName}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-bold uppercase',
                    data.priority === 'STAT' ? 'bg-danger-500 text-white' :
                    data.priority === 'Urgent' ? 'bg-warning-100 text-warning-800' : 'bg-surface-100 text-surface-700'
                  )}>
                    {data.priority || 'Routine'}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-wider block">Tests Ordered</span>
                  <div className="bg-surface-50 p-3 rounded-lg border border-surface-100 space-y-1.5">
                    {data.testNames && data.testNames.map((t: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-surface-800">
                        <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-surface-50 rounded-lg border border-surface-100">
                    <span className="text-surface-400 block mb-0.5">Referring Doctor</span>
                    <span className="font-semibold text-surface-800">{data.doctorName || 'Self Referral'}</span>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-lg border border-surface-100">
                    <span className="text-surface-400 block mb-0.5">Status</span>
                    <span className="font-semibold text-brand-700">{data.status}</span>
                  </div>
                </div>

                <div className="p-3 bg-brand-50 border border-brand-100 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="text-brand-700 block text-[11px]">Total Billing</span>
                    <span className="text-base font-bold text-brand-900">₹{(data.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <span className="px-2 py-1 bg-white text-brand-700 rounded border border-brand-200 text-[11px] font-semibold">
                    Paid: ₹{(data.paidAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            {/* 3. SAMPLE QUICK VIEW */}
            {type === 'sample' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                  <div>
                    <h3 className="font-bold text-base text-surface-900 font-mono">{data.sampleBarcode || data.barcode || 'SMPL-001'}</h3>
                    <p className="text-xs text-surface-500">Order: {data.orderId || 'N/A'}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-bold',
                    data.status === 'Rejected' ? 'bg-danger-100 text-danger-800' :
                    data.status === 'Completed' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                  )}>
                    {data.status}
                  </span>
                </div>

                <div className="p-3 bg-surface-50 rounded-lg border border-surface-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Container / Tube</span>
                    <span className="font-semibold text-surface-800">{data.container || 'EDTA Purple Top'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Sample Type</span>
                    <span className="font-semibold text-surface-800">{data.sampleType || 'Whole Blood'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Collector</span>
                    <span className="font-semibold text-surface-800">{data.collectorName || 'Pavan Kumar (Phleb)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Assigned Analyzer</span>
                    <span className="font-semibold text-surface-800">{data.analyzer || 'Sysmex XN-1000'}</span>
                  </div>
                </div>

                {data.status === 'Rejected' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Rejection Rationale
                    </span>
                    <p className="text-rose-700">{data.rejectionReason || 'Hemolyzed specimen during collection. Clot detected in micro-tube.'}</p>
                    <p className="text-[11px] text-rose-500 font-semibold pt-1">Action: Free recollection dispatch required</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. REPORT QUICK VIEW */}
            {type === 'report' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                  <div>
                    <h3 className="font-bold text-base text-surface-900 font-mono">{data.reportNumber || 'REP-001'}</h3>
                    <p className="text-xs text-surface-500">{data.patientName || 'Patient Report'}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-success-50 text-success-700 border border-success-200">
                    {data.status || 'Verified'}
                  </span>
                </div>

                <div className="p-3 bg-surface-50 rounded-lg border border-surface-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Study / Panel</span>
                    <span className="font-semibold text-surface-800">{data.title || data.testName || 'Comprehensive Health Panel'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Department</span>
                    <span className="font-semibold text-surface-800">{data.department || 'Biochemistry / Hematology'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Verified By</span>
                    <span className="font-semibold text-surface-800">{data.verifiedBy || 'Dr. Padma Rao, MD Path'}</span>
                  </div>
                </div>

                {data.isCritical && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-red-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Critical Biological Value
                    </span>
                    <p className="text-red-700">Immediate telephone notification logged with physician.</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. APPOINTMENT QUICK VIEW */}
            {type === 'appointment' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                  <div>
                    <h3 className="font-bold text-base text-surface-900">{data.patientName}</h3>
                    <p className="text-xs font-mono text-surface-500">Token: #{data.token || 'A-14'}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-50 text-brand-700">
                    {data.status || 'Scheduled'}
                  </span>
                </div>

                <div className="p-3 bg-surface-50 rounded-lg border border-surface-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Scheduled Time</span>
                    <span className="font-semibold text-surface-800">{data.time || '10:30 AM'} • {data.date || 'Today'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Assigned Doctor</span>
                    <span className="font-semibold text-surface-800">{data.doctorName || 'Dr. Arvind Swaminathan'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Modality / Service</span>
                    <span className="font-semibold text-surface-800">{data.service || data.type || 'Consultation & Diagnostics'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. ACTION ITEM QUICK VIEW */}
            {type === 'action_item' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-brand-50 border border-brand-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-brand-600" />
                    <h3 className="font-bold text-sm text-brand-900">{data.title}</h3>
                  </div>
                  <p className="text-xs text-brand-700">{data.description || 'Priority clinical item requiring operator intervention.'}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-wider block">Action Rationale</span>
                  <div className="p-3 bg-surface-50 rounded-lg border border-surface-100 text-xs text-surface-700 space-y-2">
                    <p><strong>Impact:</strong> {data.impact || 'Prevent TAT breach, protect diagnostic quality compliance, and alert treating clinicians.'}</p>
                    <p><strong>Department:</strong> {data.department || 'Central Laboratory / RIS'}</p>
                    <p><strong>Urgency:</strong> <span className="font-bold text-danger-600">{data.urgency || 'Immediate'}</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-surface-200 bg-surface-50/70 flex items-center justify-between gap-3">
            <button
              onClick={closeQuickView}
              className="px-3.5 py-2 border border-surface-200 text-surface-600 hover:bg-surface-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {type === 'patient' && (
                <button
                  onClick={() => navigateTo(`/patients/${data.id}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 cursor-pointer shadow-xs"
                >
                  <span>Open Patient 360</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {type === 'order' && (
                <button
                  onClick={() => navigateTo('/samples')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 cursor-pointer shadow-xs"
                >
                  <span>View in Lab Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {type === 'sample' && (
                <button
                  onClick={() => navigateTo('/samples')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 cursor-pointer shadow-xs"
                >
                  <span>Process Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {type === 'report' && (
                <button
                  onClick={() => navigateTo('/reports')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 cursor-pointer shadow-xs"
                >
                  <span>Verify Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {type === 'appointment' && (
                <button
                  onClick={() => navigateTo('/reception')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 cursor-pointer shadow-xs"
                >
                  <span>Reception Token Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {type === 'action_item' && (
                <button
                  onClick={() => {
                    closeQuickView();
                    if (data.actionPath) navigate(data.actionPath);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 cursor-pointer shadow-xs"
                >
                  <span>Resolve in Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
