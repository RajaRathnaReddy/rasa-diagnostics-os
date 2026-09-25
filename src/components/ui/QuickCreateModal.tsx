import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, UserPlus, Calendar, TestTubes, Scan, CreditCard,
  Truck, CheckCircle2, ArrowRight, User, Phone, MapPin,
  Clock, AlertCircle, Sparkles, Building2, Stethoscope, IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/cn';
import { syncPatientToFirestore, syncAppointmentToFirestore, syncLabOrderToFirestore } from '../../lib/firestoreSync';

type QuickTab = 'patient' | 'lab_order' | 'radiology' | 'billing' | 'home_collection';

export function QuickCreateModal() {
  const { quickCreateOpen, setQuickCreateOpen, data } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<QuickTab>('patient');
  const [submittedResult, setSubmittedResult] = useState<{
    type: string;
    title: string;
    refId: string;
    detail: string;
    destination: string;
  } | null>(null);

  // Form states
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    referrer: 'Dr. Anand Krishnamurthy (Cardiology)',
    branch: 'Banjara Hills (Central)',
    urgent: false,
  });

  const [labForm, setLabForm] = useState({
    patientName: data.patients[0]?.fullName || 'Rajesh Kumar',
    tests: ['Complete Blood Count (CBC)', 'Comprehensive Metabolic Panel (CMP)'] as string[],
    fastingStatus: 'Fasting (12 Hours Verified)',
    urgent: false,
    clinicalNotes: 'Routine diabetic evaluation and electrolyte check',
  });

  const [radForm, setRadForm] = useState({
    patientName: data.patients[0]?.fullName || 'Rajesh Kumar',
    modality: 'Digital Radiography (X-Ray)',
    bodyPart: 'Chest PA Standing View',
    priority: 'Routine',
    contrastRequired: false,
    eGfrStatus: 'eGFR > 60 mL/min (Safe)',
  });

  const [billingForm, setBillingForm] = useState({
    patientName: data.patients[0]?.fullName || 'Rajesh Kumar',
    amount: '2450',
    discount: '0',
    paymentMethod: 'UPI (PhonePe / GPay)',
    insuranceClaim: false,
  });

  const [homeForm, setHomeForm] = useState({
    patientName: '',
    phone: '',
    address: 'Flat 402, Green Hills Apartments, Madhapur, Hyderabad',
    slot: 'Tomorrow 07:00 AM - 08:30 AM (Fasting)',
    phlebotomist: 'Suresh Naidu',
    tests: 'Master Diabetic Profile + Lipid Panel',
  });

  if (!quickCreateOpen) return null;

  const handleClose = () => {
    setQuickCreateOpen(false);
    setSubmittedResult(null);
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `PAT-REG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPat = {
      id: refId,
      mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName: patientForm.name || 'New Patient',
      age: Number(patientForm.age) || 30,
      gender: patientForm.gender as 'Male' | 'Female' | 'Other',
      phone: patientForm.phone || '+91 98450 00000',
      email: `${patientForm.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      bloodGroup: 'B+' as any,
      registeredAt: new Date().toISOString(),
      primaryBranchId: 'branch-1',
      totalVisits: 1,
      totalSpend: 0,
      outstandingBalance: 0,
      criticalAlerts: [],
      chronicConditions: [],
    };
    syncPatientToFirestore(newPat as any).catch(console.error);

    setSubmittedResult({
      type: 'Patient Fast Registration (Synced to Firebase)',
      title: patientForm.name || 'New Patient',
      refId,
      detail: `Assigned ID ${refId} · Referred by ${patientForm.referrer} · ${patientForm.branch}`,
      destination: '/patients',
    });
  };

  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `LAB-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    syncLabOrderToFirestore({
      id: refId,
      patientName: labForm.patientName,
      tests: labForm.tests,
      priority: labForm.urgent ? 'urgent' : 'routine',
      createdAt: new Date().toISOString(),
    }).catch(console.error);

    setSubmittedResult({
      type: 'Laboratory Requisition Created',
      title: `${labForm.patientName} · ${labForm.tests.length} Panels`,
      refId,
      detail: `Barcode generated: ${refId} · Barcode tubes printed · Synced to Cloud Firestore`,
      destination: '/samples',
    });
  };

  const handleRadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `RAD-ST-${Math.floor(10000 + Math.random() * 90000)}`;
    syncAppointmentToFirestore({
      id: refId,
      patientId: 'pat-1',
      patientName: radForm.patientName,
      patientPhone: '+91 98450 00000',
      dateTime: new Date().toISOString(),
      modality: radForm.modality,
      department: 'radiology',
      tests: [radForm.bodyPart],
      status: 'scheduled',
      branchId: 'branch-1',
      tokenNumber: Math.floor(10 + Math.random() * 90),
      estimatedDurationMinutes: 30,
    } as any).catch(console.error);

    setSubmittedResult({
      type: 'Radiology Study Booked',
      title: `${radForm.modality} · ${radForm.bodyPart}`,
      refId,
      detail: `Patient: ${radForm.patientName} · Assigned to Imaging Suite Room 02 · Status: Ready`,
      destination: '/radiology',
    });
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedResult({
      type: 'Express Bill Dispensed',
      title: `₹${Number(billingForm.amount).toLocaleString('en-IN')} Received`,
      refId,
      detail: `Patient: ${billingForm.patientName} · Paid via ${billingForm.paymentMethod} · Receipt Printed`,
      destination: '/billing',
    });
  };

  const handleHomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `HC-SLOT-${Math.floor(1000 + Math.random() * 9000)}`;
    syncAppointmentToFirestore({
      id: refId,
      patientId: 'pat-home',
      patientName: homeForm.patientName || 'Home Visit',
      patientPhone: homeForm.phone || '+91 98765 00000',
      dateTime: new Date().toISOString(),
      department: 'pathology',
      tests: ['Complete Hemogram', 'Fasting Blood Sugar'],
      status: 'scheduled',
      branchId: 'branch-1',
      tokenNumber: Math.floor(100 + Math.random() * 900),
      estimatedDurationMinutes: 45,
    } as any).catch(console.error);

    setSubmittedResult({
      type: 'Home Collection Dispatched',
      title: `${homeForm.patientName || 'Home Visit'} · ${homeForm.slot}`,
      refId,
      detail: `Phlebotomist ${homeForm.phlebotomist} assigned · Synced to Firestore · WhatsApp route confirmation sent to ${homeForm.phone || '+91 98765 00000'}`,
      destination: '/home-collection',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface-0 border border-surface-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold">
                ⚡
              </div>
              <div>
                <h3 className="text-base font-bold text-surface-900">Global Quick Action</h3>
                <p className="text-xs text-surface-500">Fast 1-click diagnostic entries and requisitions</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Result Confirmation View (If Submitted) */}
          {submittedResult ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto border border-success-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-success-700 uppercase tracking-wider bg-success-50 px-2.5 py-1 rounded-full border border-success-200">
                  {submittedResult.type}
                </span>
                <h2 className="text-xl font-bold text-surface-900 mt-2">{submittedResult.title}</h2>
                <p className="font-mono text-xs text-surface-500 mt-1">Ref ID: {submittedResult.refId}</p>
                <p className="text-xs text-surface-600 max-w-md mx-auto mt-2 bg-surface-50 p-3 rounded-xl border border-surface-200">
                  {submittedResult.detail}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-surface-200 rounded-xl text-xs font-semibold text-surface-700 hover:bg-surface-50 cursor-pointer"
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    handleClose();
                    navigate(submittedResult.destination);
                  }}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Open in {submittedResult.type.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Category Tab Bar */}
              <div className="flex border-b border-surface-200 px-3 bg-surface-0 overflow-x-auto no-scrollbar">
                {[
                  { id: 'patient' as const, label: 'Fast Patient', icon: UserPlus },
                  { id: 'lab_order' as const, label: 'Lab Requisition', icon: TestTubes },
                  { id: 'radiology' as const, label: 'Radiology Scan', icon: Scan },
                  { id: 'billing' as const, label: 'Fast Billing', icon: CreditCard },
                  { id: 'home_collection' as const, label: 'Home Visit', icon: Truck },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'px-3.5 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer',
                        activeTab === tab.id
                          ? 'border-brand-600 text-brand-600'
                          : 'border-transparent text-surface-500 hover:text-surface-800'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Content Area */}
              <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'patient' && (
                  <form onSubmit={handlePatientSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Full Patient Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Chandra Verma"
                          value={patientForm.name}
                          onChange={e => setPatientForm({ ...patientForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-surface-700 block mb-1">Age *</label>
                          <input
                            type="number"
                            required
                            placeholder="58"
                            value={patientForm.age}
                            onChange={e => setPatientForm({ ...patientForm, age: e.target.value })}
                            className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-surface-700 block mb-1">Gender</label>
                          <select
                            value={patientForm.gender}
                            onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}
                            className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 00000"
                          value={patientForm.phone}
                          onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Referring Doctor</label>
                        <input
                          type="text"
                          value={patientForm.referrer}
                          onChange={e => setPatientForm({ ...patientForm, referrer: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={patientForm.urgent}
                          onChange={e => setPatientForm({ ...patientForm, urgent: e.target.checked })}
                          className="rounded text-brand-600"
                        />
                        <span className="text-xs text-rose-600 font-semibold">Priority / STAT Draw</span>
                      </label>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                      >
                        Register & Print Card
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'lab_order' && (
                  <form onSubmit={handleLabSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-surface-700 block mb-1">Patient</label>
                      <select
                        value={labForm.patientName}
                        onChange={e => setLabForm({ ...labForm, patientName: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                      >
                        {data.patients.slice(0, 8).map(p => (
                          <option key={p.id} value={p.fullName}>
                            {p.fullName} ({p.patientId}) · {p.age}y / {p.gender}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-surface-700 block mb-1">Select Diagnostic Panels</label>
                      <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-surface-50 rounded-lg border border-surface-200">
                        {[
                          'Complete Blood Count (CBC) with ESR',
                          'Comprehensive Metabolic Panel (CMP)',
                          'Lipid Profile (Cholesterol, HDL, LDL, VLDL)',
                          'HbA1c Glycated Hemoglobin (HPLC)',
                          'Thyroid Profile (T3, T4, TSH Ultra)',
                          'Liver Function Test (LFT)',
                          'Renal Function Test (KFT with Electrolytes)',
                          'Urine Complete Examination (R/M)',
                          'Vitamin D3 & Vitamin B12 Duo',
                        ].map(test => (
                          <label key={test} className="flex items-center gap-2 p-1.5 hover:bg-surface-100 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={labForm.tests.includes(test)}
                              className="rounded text-brand-600"
                            />
                            <span className="text-[11px] text-surface-800">{test}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Fasting Status</label>
                        <select
                          value={labForm.fastingStatus}
                          onChange={e => setLabForm({ ...labForm, fastingStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        >
                          <option>Fasting (10-12 Hours Verified)</option>
                          <option>Post-Prandial (2h Post Meal)</option>
                          <option>Random / Non-Fasting</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Clinical Indication</label>
                        <input
                          type="text"
                          value={labForm.clinicalNotes}
                          onChange={e => setLabForm({ ...labForm, clinicalNotes: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                      >
                        Create Requisition & Generate Barcodes
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'radiology' && (
                  <form onSubmit={handleRadSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-surface-700 block mb-1">Patient</label>
                      <select
                        value={radForm.patientName}
                        onChange={e => setRadForm({ ...radForm, patientName: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                      >
                        {data.patients.slice(0, 8).map(p => (
                          <option key={p.id} value={p.fullName}>
                            {p.fullName} ({p.patientId})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Modality</label>
                        <select
                          value={radForm.modality}
                          onChange={e => setRadForm({ ...radForm, modality: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        >
                          <option>Digital Radiography (X-Ray)</option>
                          <option>High-Resolution CT (64-Slice)</option>
                          <option>3.0T MRI Scanner</option>
                          <option>Ultrasound & Color Doppler</option>
                          <option>2D-Echocardiography</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Anatomical Region</label>
                        <input
                          type="text"
                          value={radForm.bodyPart}
                          onChange={e => setRadForm({ ...radForm, bodyPart: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl space-y-1">
                      <p className="font-bold text-brand-900 text-xs">Pre-Scan Safety Verification</p>
                      <p className="text-[11px] text-brand-700">
                        {radForm.eGfrStatus} · Pacemaker Screening Verified Negative · Contrast Checklist Cleared.
                      </p>
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                      >
                        Schedule Scan & Allocate Room
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'billing' && (
                  <form onSubmit={handleBillingSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-surface-700 block mb-1">Patient</label>
                      <select
                        value={billingForm.patientName}
                        onChange={e => setBillingForm({ ...billingForm, patientName: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                      >
                        {data.patients.slice(0, 8).map(p => (
                          <option key={p.id} value={p.fullName}>
                            {p.fullName} ({p.patientId})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Total Bill Amount (₹)</label>
                        <input
                          type="number"
                          value={billingForm.amount}
                          onChange={e => setBillingForm({ ...billingForm, amount: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Payment Channel</label>
                        <select
                          value={billingForm.paymentMethod}
                          onChange={e => setBillingForm({ ...billingForm, paymentMethod: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        >
                          <option>UPI (PhonePe / GPay)</option>
                          <option>Cash at Counter</option>
                          <option>Credit / Debit Card</option>
                          <option>Corporate TPA / Insurance</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-success-600 hover:bg-success-700 text-white rounded-xl font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>Collect Payment & Print Receipt</span>
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'home_collection' && (
                  <form onSubmit={handleHomeSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Patient Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Smt. Lakshmi Devi"
                          value={homeForm.patientName}
                          onChange={e => setHomeForm({ ...homeForm, patientName: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Contact Phone *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={homeForm.phone}
                          onChange={e => setHomeForm({ ...homeForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-surface-700 block mb-1">Home Collection Address</label>
                      <input
                        type="text"
                        value={homeForm.address}
                        onChange={e => setHomeForm({ ...homeForm, address: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Time Slot</label>
                        <select
                          value={homeForm.slot}
                          onChange={e => setHomeForm({ ...homeForm, slot: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        >
                          <option>Tomorrow 06:30 AM - 07:30 AM (Fasting)</option>
                          <option>Tomorrow 07:30 AM - 08:30 AM (Fasting)</option>
                          <option>Tomorrow 08:30 AM - 09:30 AM (Fasting)</option>
                          <option>Tomorrow 10:30 AM - 12:00 PM (Random)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Assign Phlebotomist</label>
                        <select
                          value={homeForm.phlebotomist}
                          onChange={e => setHomeForm({ ...homeForm, phlebotomist: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                        >
                          <option>Suresh Naidu (Route A - Madhapur / Hitec)</option>
                          <option>Ramesh P. (Route B - Banjara / Jubilee)</option>
                          <option>Deepak V. (Route C - Kukatpally)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                      >
                        Confirm Home Slot & Dispatch
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
