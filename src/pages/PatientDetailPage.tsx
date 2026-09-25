import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  User, Phone, Mail, MapPin, Heart, Droplets, Globe, Building2,
  Calendar, FileText, TestTubes, Scan, Receipt, Clock,
  ArrowLeft, Edit, MoreHorizontal, Activity, CheckCircle2,
  AlertTriangle, ChevronRight, Shield, Eye, Stethoscope, Microscope,
  Home, MessageSquare, Paperclip, History, Plus, Printer, Check,
  Download, ExternalLink, ArrowDown, Sparkles
} from 'lucide-react';
import { cn } from '../lib/cn';

type TabId =
  | 'overview'
  | 'clinical_history'
  | 'appointments'
  | 'orders'
  | 'laboratory'
  | 'radiology'
  | 'pathology'
  | 'reports'
  | 'billing'
  | 'communication'
  | 'home_collection'
  | 'documents'
  | 'activity';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, openDicomViewer, openQuickView, setQuickCreateOpen, openReportModal, setReportGeneratorOpen } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const patient = data.patients.find(p => p.id === id);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-0 border border-surface-200 rounded-2xl p-8 max-w-lg mx-auto">
        <User className="w-12 h-12 text-surface-300 mb-3" />
        <h2 className="text-lg font-bold text-surface-900">Patient Record Not Located</h2>
        <p className="text-[13px] text-surface-500 mt-1 text-center">
          The requested patient MRN does not exist or was moved to archive.
        </p>
        <Link
          to="/patients"
          className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors"
        >
          ← Return to Patients Directory
        </Link>
      </div>
    );
  }

  // Filtered relations
  const patientOrders = data.orders.filter(o => o.patientId === patient.id);
  const patientAppointments = data.appointments.filter(a => a.patientId === patient.id);
  const patientResults = data.labResults.filter(r => r.patientId === patient.id);
  const patientReports = data.reports.filter(r => r.patientId === patient.id);
  const patientImaging = data.imagingStudies.filter(s => s.patientId === patient.id);
  const patientInvoices = data.invoices.filter(i => i.patientId === patient.id);
  const patientHomeVisits = data.homeCollections.filter(h => h.patientId === patient.id);

  // 13 Full Enterprise Tabs (Section 16)
  const tabs: { id: TabId; label: string; count?: number; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'clinical_history', label: 'Clinical History', icon: History },
    { id: 'appointments', label: 'Appointments', count: patientAppointments.length, icon: Calendar },
    { id: 'orders', label: 'Orders', count: patientOrders.length, icon: FileText },
    { id: 'laboratory', label: 'Laboratory', count: patientResults.length, icon: TestTubes },
    { id: 'radiology', label: 'Radiology', count: patientImaging.length, icon: Scan },
    { id: 'pathology', label: 'Pathology', count: 2, icon: Microscope },
    { id: 'reports', label: 'Reports', count: patientReports.length, icon: FileText },
    { id: 'billing', label: 'Billing', count: patientInvoices.length, icon: Receipt },
    { id: 'communication', label: 'Communication', count: 4, icon: MessageSquare },
    { id: 'home_collection', label: 'Home Visits', count: patientHomeVisits.length, icon: Home },
    { id: 'documents', label: 'Documents', count: 3, icon: Paperclip },
    { id: 'activity', label: 'Activity & Audit', icon: Clock },
  ];

  // Visual Diagnostic Pipeline Timeline (Section 16)
  const diagnosticPipelineSteps = [
    { label: 'Appointment', status: 'Completed', time: '09:00 AM', detail: 'Token #A-14 Checked In' },
    { label: 'Order Accession', status: 'Completed', time: '09:15 AM', detail: 'ORD-00045 (3 Tests)' },
    { label: 'Sample Drawn', status: 'Completed', time: '09:25 AM', detail: 'EDTA + Serum Barcoded' },
    { label: 'Processing', status: 'Completed', time: '09:50 AM', detail: 'Sysmex XN-1000 Run' },
    { label: 'Result Entry', status: 'Completed', time: '10:15 AM', detail: 'Values Delta-Checked' },
    { label: 'Verification', status: 'Completed', time: '10:45 AM', detail: 'Signed by Dr. Padma Rao' },
    { label: 'Report Generated', status: 'Completed', time: '11:00 AM', detail: 'PDF Sealed with QR' },
    { label: 'Patient Delivery', status: 'Current', time: 'Pending', detail: 'WhatsApp & Portal Sent' },
  ];

  return (
    <div className="fade-in space-y-5 select-none max-w-7xl mx-auto">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/patients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patients Master</span>
        </Link>
        <span className="text-[11px] text-surface-400">
          Last Clinical Access: Today, 11:20 AM by Dr. Arvind Swaminathan
        </span>
      </div>

      {/* ── 1. PATIENT 360 COMPREHENSIVE HEADER ── */}
      <div className="bg-surface-0 border border-surface-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
              {patient.fullName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-surface-900 tracking-tight">{patient.fullName}</h1>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-100 text-surface-700 border border-surface-200">
                  {patient.patientId}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                  Active Patient
                </span>
                {patient.bloodGroup && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-rose-500" />
                    {patient.bloodGroup}
                  </span>
                )}
              </div>

              {/* Metadata Badges */}
              <div className="flex items-center gap-4 mt-2 text-xs text-surface-600 flex-wrap">
                <span>{patient.age} yrs • {patient.gender}</span>
                <span className="flex items-center gap-1 text-surface-700">
                  <Phone className="w-3.5 h-3.5 text-brand-500" />
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1 text-surface-700">
                  <Mail className="w-3.5 h-3.5 text-brand-500" />
                  {patient.email || 'patient@rasadiagnostics.com'}
                </span>
                <span className="flex items-center gap-1 text-surface-700">
                  <Building2 className="w-3.5 h-3.5 text-brand-500" />
                  Banjara Hills Branch
                </span>
                <span className="flex items-center gap-1 text-surface-700">
                  <Stethoscope className="w-3.5 h-3.5 text-brand-500" />
                  Primary: Dr. Arvind Swaminathan
                </span>
              </div>

              {/* Allergies & Flags */}
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Allergies: {patient.allergies.join(', ')}
                  </span>
                  <span className="text-[11px] text-surface-500 font-medium">
                    Pre-Scan eGFR: <strong className="text-emerald-700">84 mL/min (Contrast Safe)</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setQuickCreateOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Scan / Test</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-surface-200 text-surface-700 rounded-lg text-xs font-semibold hover:bg-surface-50 transition-colors cursor-pointer">
              <Printer className="w-3.5 h-3.5 text-surface-500" />
              <span>Print Health ID</span>
            </button>
            <button className="p-2 border border-surface-200 text-surface-500 rounded-lg hover:bg-surface-50 transition-colors cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── VISUAL DIAGNOSTIC PIPELINE TIMELINE (Section 16) ── */}
        <div className="mt-5 pt-4 border-t border-surface-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">
              Active Diagnostic Order Lifecycle (ORD-00045)
            </span>
            <span className="text-[11px] font-semibold text-brand-600">On Track • 0 breaches</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
            {diagnosticPipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={cn(
                  'p-2 rounded-xl border transition-all',
                  step.status === 'Completed'
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-brand-50 border-brand-300 text-brand-950 font-bold shadow-2xs'
                )}
              >
                <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1">
                  {step.status === 'Completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                  )}
                  <span>{step.label}</span>
                </div>
                <div className="text-[11px] font-bold text-surface-900">{step.time}</div>
                <div className="text-[10px] text-surface-500 truncate mt-0.5">{step.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. ALL 13 ENTERPRISE TABS ── */}
      <div className="border-b border-surface-200 overflow-x-auto no-scrollbar bg-surface-0 rounded-t-xl px-2">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer',
                  isActive
                    ? 'border-brand-600 text-brand-700 bg-brand-50/40'
                    : 'border-transparent text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-brand-600' : 'text-surface-400')} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isActive ? 'bg-brand-200 text-brand-800' : 'bg-surface-100 text-surface-600'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. TAB CONTENT WORKSPACES ── */}
      <div className="bg-surface-0 border border-surface-200 border-t-0 rounded-b-xl p-5 shadow-xs min-h-[400px]">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-surface-50 rounded-xl border border-surface-100">
                <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block mb-2">
                  Permanent Demographics
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Full Name</span>
                    <span className="font-semibold text-surface-800">{patient.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Date of Birth</span>
                    <span className="font-semibold text-surface-800">{patient.dateOfBirth} ({patient.age} yrs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Gender</span>
                    <span className="font-semibold text-surface-800">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">City / State</span>
                    <span className="font-semibold text-surface-800">{patient.city}, Telangana</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Address</span>
                    <span className="font-semibold text-surface-800 truncate max-w-[180px]">{patient.address}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-50 rounded-xl border border-surface-100">
                <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block mb-2">
                  Emergency & Insurance
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Emergency Contact</span>
                    <span className="font-semibold text-surface-800">{patient.emergencyContact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Emergency Phone</span>
                    <span className="font-semibold text-surface-800">{patient.emergencyPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">TPA Insurance</span>
                    <span className="font-semibold text-surface-800">{patient.insuranceProvider || 'Star Health TPA'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Policy Number</span>
                    <span className="font-mono text-surface-800">{patient.insuranceId || 'SH-IND-2024-8841'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Corporate Cap</span>
                    <span className="font-semibold text-surface-800">{patient.corporateId ? 'TCS Corporate' : 'Direct Cash/Card'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-50 rounded-xl border border-surface-100">
                <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block mb-2">
                  Diagnostic History Highlights
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Total Visits</span>
                    <span className="font-bold text-surface-900">{patientOrders.length + 3} visits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Lifetime Billing</span>
                    <span className="font-bold text-surface-900">₹24,850</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Outstanding Balance</span>
                    <span className="font-bold text-emerald-700">₹0 (Clear)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Critical Alerts</span>
                    <span className="font-bold text-amber-700">1 past alert (Creatinine)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Home Collection</span>
                    <span className="font-semibold text-surface-800">2 home draws</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-surface-900">Recent Diagnostic Studies</h3>
                <span className="text-xs text-surface-400">Showing last 4 orders</span>
              </div>
              <div className="space-y-2">
                {patientOrders.slice(0, 4).map(o => (
                  <div
                    key={o.id}
                    onClick={() => openQuickView('order', o)}
                    className="flex items-center justify-between p-3 bg-surface-50 hover:bg-surface-100/80 rounded-xl border border-surface-200 transition-colors cursor-pointer text-xs group"
                  >
                    <div>
                      <div className="font-bold text-surface-900 font-mono text-[13px]">{o.orderId}</div>
                      <div className="text-surface-500 mt-0.5">{o.testNames.join(', ')} • {o.priority}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-surface-900">₹{o.totalAmount}</span>
                      <span className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded font-semibold text-[11px]">
                        {o.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLINICAL HISTORY */}
        {activeTab === 'clinical_history' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-surface-900">Clinical History & Pre-Scan Safety Screening</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-surface-50 rounded-xl border border-surface-100 space-y-3">
                <h4 className="font-bold text-surface-800">Comorbidities & Chronic Conditions</h4>
                <div className="space-y-1.5 text-surface-600">
                  <p>• Type 2 Diabetes Mellitus (Diagnosed 2019) — on Metformin 500mg BD</p>
                  <p>• Primary Hypertension (Diagnosed 2021) — on Telmisartan 40mg OD</p>
                  <p>• Mild Allergic Rhinitis (Seasonal)</p>
                </div>
              </div>
              <div className="p-4 bg-surface-50 rounded-xl border border-surface-100 space-y-3">
                <h4 className="font-bold text-surface-800">Radiology Contrast & Implant Safety</h4>
                <div className="space-y-1.5 text-surface-600">
                  <p>• <strong>eGFR:</strong> 84 mL/min/1.73m² (Normal renal clearance for Gadolinium/Iodine)</p>
                  <p>• <strong>Pacemaker / Metallic Implants:</strong> None reported</p>
                  <p>• <strong>Pregnancy / Lactation:</strong> Negative</p>
                  <p>• <strong>Prior Contrast Reaction:</strong> None</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-surface-900">Appointments Schedule</h3>
              <button
                onClick={() => setQuickCreateOpen(true)}
                className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700"
              >
                + Schedule Appointment
              </button>
            </div>
            {patientAppointments.map(a => (
              <div key={a.id} className="p-3 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-surface-900 text-[13px]">{a.type} • Dr. {a.doctorName || 'Assigned'}</div>
                  <div className="text-surface-500 mt-0.5">{a.date} at {a.time} • Ref: {a.appointmentId}</div>
                </div>
                <span className="px-2 py-0.5 rounded font-semibold bg-brand-50 text-brand-700">{a.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-surface-900">Accessioned Diagnostic Orders</h3>
            {patientOrders.map(o => (
              <div key={o.id} className="p-3.5 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-surface-900 font-mono text-[13px]">{o.orderId}</div>
                  <div className="text-surface-600 mt-0.5">{o.testNames.join(', ')}</div>
                  <div className="text-surface-400 mt-0.5">Priority: {o.priority} • Branch: Banjara Hills</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-surface-900 text-sm">₹{o.totalAmount}</div>
                  <span className="px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: LABORATORY */}
        {activeTab === 'laboratory' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-surface-900">Laboratory Analytes & Parameter History</h3>
            <div className="border border-surface-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-surface-50 border-b border-surface-200 text-surface-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Test Parameter</th>
                    <th className="p-3">Result Value</th>
                    <th className="p-3">Bio-Reference Range</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {patientResults.map(r => (
                    <tr key={r.id}>
                      <td className="p-3 font-semibold text-surface-800">{r.testName}</td>
                      <td className={cn('p-3 font-bold', r.isCritical ? 'text-danger-600' : 'text-surface-900')}>
                        {r.value} {r.unit}
                      </td>
                      <td className="p-3 text-surface-500">{r.referenceRange}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-success-50 text-success-700 rounded font-semibold">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {patientResults.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-surface-400">No laboratory results logged.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: RADIOLOGY */}
        {activeTab === 'radiology' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-surface-900">Radiology Studies (RIS & PACS)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientImaging.map(study => (
                <div key={study.id} className="p-4 bg-surface-50 border border-surface-200 rounded-xl space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-surface-900">{study.modality} — {study.bodyPart}</h4>
                      <p className="text-surface-500 font-mono mt-0.5">{study.studyId}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded font-semibold">
                      {study.status}
                    </span>
                  </div>

                  <p className="text-surface-600 text-[11px]">{study.impression || study.findings || 'Persistent headache and neurological evaluation'}</p>

                  <div className="pt-2 border-t border-surface-200 flex items-center justify-between">
                    <span className="text-surface-400">4 Series • 128 DICOM Images</span>
                    <button
                      onClick={() => openDicomViewer(study)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors cursor-pointer"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Launch PACS Viewer</span>
                    </button>
                  </div>
                </div>
              ))}
              {patientImaging.length === 0 && (
                <div className="col-span-2 p-8 text-center text-surface-400 bg-surface-50 rounded-xl border border-surface-200">
                  No radiology scans recorded for this patient.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: PATHOLOGY */}
        {activeTab === 'pathology' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-surface-900">Histopathology & Tissue Biopsy Reports</h3>
            <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-surface-900 text-sm">Cervical Pap Smear Cytology</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold">Verified</span>
              </div>
              <p className="text-surface-600">Microscopic description: Negative for intraepithelial lesion or malignancy (NILM). Reactive cellular changes associated with inflammation.</p>
              <div className="text-surface-400 pt-1">Reporting Pathologist: Dr. Savitri Devi, MD (Path)</div>
            </div>
          </div>
        )}

        {/* TAB 8: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-surface-900">Signed Clinical Reports & PDF Dispatch</h3>
              <button
                onClick={() => setReportGeneratorOpen(true)}
                className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Generate Report</span>
              </button>
            </div>
            {patientReports.map(rep => (
              <div key={rep.id} className="p-3.5 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-between text-xs hover:border-brand-300 transition-all">
                <div>
                  <div className="font-bold text-surface-900 text-[13px]">{rep.testNames?.join(', ') || 'Diagnostic Report'}</div>
                  <div className="text-surface-500 font-mono mt-0.5">{rep.reportId} • Signed: {rep.verifiedBy || 'Dr. Sunita Rao, MD'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold border border-emerald-200 text-[11px]">{rep.status}</span>
                  <button
                    onClick={() => openReportModal(rep, false)}
                    className="flex items-center gap-1 px-2.5 py-1.5 border border-surface-200 text-brand-700 bg-white hover:bg-brand-50 rounded-lg font-bold transition-colors cursor-pointer"
                    title="View Official Report"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => openReportModal(rep, true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-600 text-white hover:bg-brand-700 rounded-lg font-bold transition-colors cursor-pointer shadow-xs"
                    title="Print / Save PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
            {patientReports.length === 0 && (
              <div className="p-8 text-center bg-surface-50 rounded-xl border border-surface-200 space-y-2">
                <FileText className="w-8 h-8 text-surface-400 mx-auto" />
                <p className="font-bold text-surface-800 text-sm">No reports generated for this patient yet</p>
                <p className="text-xs text-surface-500">Generate a custom lab or imaging report with one click.</p>
                <button
                  onClick={() => setReportGeneratorOpen(true)}
                  className="px-3.5 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 inline-flex items-center gap-1.5 cursor-pointer mt-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Report Now</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: BILLING */}
        {activeTab === 'billing' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-surface-900">Invoices & Receipts</h3>
            {patientInvoices.map(inv => (
              <div key={inv.id} className="p-3 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-surface-900 font-mono text-[13px]">{inv.invoiceId}</div>
                  <div className="text-surface-500 mt-0.5">Mode: {inv.paymentMethod} • Date: {inv.createdAt.split('T')[0]}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-surface-900 text-sm">₹{inv.total}</div>
                  <span className="text-emerald-700 font-semibold">{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 10: COMMUNICATION */}
        {activeTab === 'communication' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-surface-900">Patient SMS / WhatsApp & Call Log</h3>
            <div className="space-y-2">
              <div className="p-3 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-surface-900">WhatsApp Report Link Dispatched</div>
                  <p className="text-surface-500 mt-0.5">Automated delivery to +91 {patient.phone} via Twilio Health API</p>
                </div>
                <span className="text-emerald-600 font-semibold">Delivered</span>
              </div>
              <div className="p-3 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-surface-900">Appointment Confirmation SMS</div>
                  <p className="text-surface-500 mt-0.5">Fasting instructions (10-12 hrs) sent for Lipid Profile</p>
                </div>
                <span className="text-emerald-600 font-semibold">Delivered</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: HOME COLLECTION */}
        {activeTab === 'home_collection' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-surface-900">Home Phlebotomy Visits</h3>
            {patientHomeVisits.map(h => (
              <div key={h.id} className="p-3 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-surface-900 text-[13px]">{h.timeSlot} • Phleb: {h.collector}</div>
                  <p className="text-surface-500 mt-0.5">{h.address}</p>
                </div>
                <span className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded font-semibold">{h.status}</span>
              </div>
            ))}
            {patientHomeVisits.length === 0 && (
              <div className="p-6 text-center text-surface-400 bg-surface-50 rounded-xl border border-surface-100">
                No home collection requests on file for this patient.
              </div>
            )}
          </div>
        )}

        {/* TAB 12: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-surface-900">Scanned Prescriptions & ID Proofs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-surface-50 border border-surface-200 rounded-xl space-y-2">
                <span className="font-bold text-surface-900 block">External Prescription (Dr. Reddy)</span>
                <span className="text-surface-400 block text-[11px]">PDF • Uploaded Today, 09:12 AM</span>
                <button className="text-brand-600 font-semibold hover:underline">View Document →</button>
              </div>
              <div className="p-3 bg-surface-50 border border-surface-200 rounded-xl space-y-2">
                <span className="font-bold text-surface-900 block">Aadhaar Card Verification</span>
                <span className="text-surface-400 block text-[11px]">Image • Verified on Registration</span>
                <button className="text-brand-600 font-semibold hover:underline">View Document →</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: ACTIVITY & AUDIT */}
        {activeTab === 'activity' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-surface-900">Audit Trail & Access Log</h3>
            <div className="space-y-2 font-mono text-[11px] text-surface-600">
              <div className="p-2.5 bg-surface-50 rounded-lg border border-surface-100 flex justify-between">
                <span>[11:20 AM] Report accessed by Dr. Arvind Swaminathan (IP: 192.168.1.14)</span>
                <span className="text-surface-400">SUCCESS</span>
              </div>
              <div className="p-2.5 bg-surface-50 rounded-lg border border-surface-100 flex justify-between">
                <span>[10:45 AM] Lab Results electronically signed by Dr. Padma Rao (MD Path)</span>
                <span className="text-emerald-600">VERIFIED</span>
              </div>
              <div className="p-2.5 bg-surface-50 rounded-lg border border-surface-100 flex justify-between">
                <span>[09:25 AM] 3 Specimens drawn and barcoded by Technician Pavan Kumar</span>
                <span className="text-surface-400">ACCESSIONED</span>
              </div>
              <div className="p-2.5 bg-surface-50 rounded-lg border border-surface-100 flex justify-between">
                <span>[09:00 AM] Patient Checked In at Reception Desk (Token #A-14)</span>
                <span className="text-surface-400">CHECKIN</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
