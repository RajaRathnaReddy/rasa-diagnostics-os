import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, UserPlus, Calendar, TestTubes, Scan, CreditCard,
  Truck, CheckCircle2, ArrowRight, User, Phone, MapPin,
  Clock, AlertCircle, Sparkles, Building2, Stethoscope, IndianRupee,
  Layers, Upload, Package, Barcode, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/cn';
import { syncPatientToFirestore, syncAppointmentToFirestore, syncLabOrderToFirestore } from '../../lib/firestoreSync';

type QuickTab =
  | 'patient'
  | 'appointment'
  | 'order'
  | 'collect_sample'
  | 'home_collection'
  | 'billing'
  | 'upload_report'
  | 'register_doctor'
  | 'create_package';

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

  // Keyboard shortcut listener for tabs (1 to 9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!quickCreateOpen) return;
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const tabList: QuickTab[] = [
          'patient', 'appointment', 'order', 'collect_sample',
          'home_collection', 'billing', 'upload_report', 'register_doctor', 'create_package'
        ];
        const target = tabList[parseInt(e.key) - 1];
        if (target) setActiveTab(target);
      }
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickCreateOpen]);

  // Form states
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    referrer: 'Dr. Arvind Swaminathan (Internal Medicine)',
    branch: 'Banjara Hills (Central)',
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patientName: data.patients[0]?.fullName || 'Rajesh Kumar',
    doctorName: 'Dr. Arvind Swaminathan',
    type: 'Consultation & Diagnostics',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
  });

  const [orderForm, setOrderForm] = useState({
    patientName: data.patients[0]?.fullName || 'Rajesh Kumar',
    tests: ['Complete Blood Count (CBC)', 'HbA1c Glycated Hemoglobin'],
    priority: 'Routine' as 'Routine' | 'Urgent' | 'STAT',
    fastingVerified: true,
  });

  const [sampleForm, setSampleForm] = useState({
    orderId: data.orders[0]?.orderId || 'ORD-00045',
    patientName: data.patients[0]?.fullName || 'Rajesh Kumar',
    container: 'EDTA Purple Top',
    volume: '3.0 mL',
    barcode: `SMP-${Math.floor(100000 + Math.random() * 900000)}`,
  });

  const [homeForm, setHomeForm] = useState({
    patientName: '',
    phone: '',
    address: 'Flat 402, Green Hills Apartments, Madhapur, Hyderabad',
    slot: 'Tomorrow 07:00 AM - 08:30 AM (Fasting)',
    phlebotomist: 'Pavan Kumar',
    tests: 'Master Health Checkup + Lipid Panel',
  });

  const [billingForm, setBillingForm] = useState({
    patientName: data.patients[0]?.fullName || 'Rajesh Kumar',
    amount: '2850',
    paymentMethod: 'UPI (PhonePe / GPay)',
  });

  const [reportForm, setReportForm] = useState({
    patientName: data.patients[0]?.fullName || 'Rajesh Kumar',
    studyName: 'CT Chest HRCT Non-Contrast',
    pathologistOrRadiologist: 'Dr. Radhika Sharma (MD Radiodiagnosis)',
  });

  const [doctorForm, setDoctorForm] = useState({
    fullName: '',
    specialization: 'Cardiology',
    hospital: 'Apollo Hospitals, Jubilee Hills',
    phone: '',
    regNumber: 'TS-MC-2018-8421',
  });

  const [packageForm, setPackageForm] = useState({
    packageName: '',
    includedCount: '12',
    price: '1999',
    tatHours: '8',
  });

  if (!quickCreateOpen) return null;

  const handleClose = () => {
    setQuickCreateOpen(false);
    setSubmittedResult(null);
  };

  const tabsConfig: { id: QuickTab; label: string; shortcut: string; icon: React.ElementType }[] = [
    { id: 'patient', label: 'New Patient', shortcut: 'Alt+1', icon: UserPlus },
    { id: 'appointment', label: 'New Appointment', shortcut: 'Alt+2', icon: Calendar },
    { id: 'order', label: 'New Diagnostic Order', shortcut: 'Alt+3', icon: Layers },
    { id: 'collect_sample', label: 'Collect Sample', shortcut: 'Alt+4', icon: TestTubes },
    { id: 'home_collection', label: 'Home Collection', shortcut: 'Alt+5', icon: Truck },
    { id: 'billing', label: 'Create Invoice', shortcut: 'Alt+6', icon: CreditCard },
    { id: 'upload_report', label: 'Upload Report', shortcut: 'Alt+7', icon: Upload },
    { id: 'register_doctor', label: 'Register Doctor', shortcut: 'Alt+8', icon: Stethoscope },
    { id: 'create_package', label: 'Create Package', shortcut: 'Alt+9', icon: Package },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-surface-0 rounded-2xl shadow-modal border border-surface-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-surface-200 bg-surface-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-surface-900">Diagnostic Speed Dial</h3>
                <p className="text-[11px] text-surface-500">Quick action workflow desk • Shortcuts Alt+1 to Alt+9</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Result Confirmation View */}
          {submittedResult ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
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
                  <span>Open Target Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Category Tab Bar (9 Items) */}
              <div className="flex border-b border-surface-200 px-3 bg-surface-0 overflow-x-auto no-scrollbar">
                {tabsConfig.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer',
                        isActive
                          ? 'border-brand-600 text-brand-700 bg-brand-50/40'
                          : 'border-transparent text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                      )}
                    >
                      <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-brand-600' : 'text-surface-400')} />
                      <span>{tab.label}</span>
                      <span className="text-[9px] font-mono opacity-50 ml-0.5">{tab.shortcut}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Workspace */}
              <div className="p-5 overflow-y-auto max-h-[60vh]">
                {/* 1. NEW PATIENT */}
                {activeTab === 'patient' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const refId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
                      syncPatientToFirestore({
                        id: refId,
                        fullName: patientForm.name || 'Priya Sharma',
                        age: Number(patientForm.age) || 32,
                        gender: patientForm.gender as any,
                        phone: patientForm.phone || '+91 98450 12345',
                        registeredAt: new Date().toISOString(),
                      } as any).catch(console.error);

                      setSubmittedResult({
                        type: 'Patient Registered & Synced',
                        title: patientForm.name || 'Priya Sharma',
                        refId,
                        detail: `Successfully registered patient MRN ${refId}. Cloud Firestore synchronized.`,
                        destination: '/patients',
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Priya Sharma"
                          value={patientForm.name}
                          onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50 focus:bg-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-surface-700 block mb-1">Age *</label>
                          <input
                            type="number"
                            required
                            placeholder="32"
                            value={patientForm.age}
                            onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                            className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50 focus:bg-white focus:outline-none focus:border-brand-500"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-surface-700 block mb-1">Gender</label>
                          <select
                            value={patientForm.gender}
                            onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                            className="w-full px-2 py-2 border border-surface-200 rounded-lg bg-surface-50 focus:bg-white focus:outline-none"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
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
                          placeholder="+91 98450 12345"
                          value={patientForm.phone}
                          onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50 focus:bg-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Assigned Diagnostic Branch</label>
                        <select
                          value={patientForm.branch}
                          onChange={(e) => setPatientForm({ ...patientForm, branch: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50 focus:bg-white focus:outline-none"
                        >
                          <option value="Banjara Hills (Central)">Banjara Hills (Central)</option>
                          <option value="Madhapur Branch">Madhapur Branch</option>
                          <option value="Kukatpally Branch">Kukatpally Branch</option>
                          <option value="Jubilee Hills Hub">Jubilee Hills Hub</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-surface-200 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors cursor-pointer shadow-xs"
                      >
                        Register Patient & Open File
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. NEW APPOINTMENT */}
                {activeTab === 'appointment' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const refId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
                      setSubmittedResult({
                        type: 'Appointment Confirmed',
                        title: `${appointmentForm.patientName} with ${appointmentForm.doctorName}`,
                        refId,
                        detail: `Booked for ${appointmentForm.date} at ${appointmentForm.time}. Token generated.`,
                        destination: '/appointments',
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Patient Name</label>
                        <input
                          type="text"
                          required
                          value={appointmentForm.patientName}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Consulting Doctor</label>
                        <select
                          value={appointmentForm.doctorName}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorName: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        >
                          <option value="Dr. Arvind Swaminathan">Dr. Arvind Swaminathan (Internal Med)</option>
                          <option value="Dr. Radhika Sharma">Dr. Radhika Sharma (Radiology)</option>
                          <option value="Dr. Padma Rao">Dr. Padma Rao (Pathology)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Date</label>
                        <input
                          type="date"
                          value={appointmentForm.date}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Time Slot</label>
                        <input
                          type="text"
                          value={appointmentForm.time}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-surface-200 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 cursor-pointer shadow-xs"
                      >
                        Confirm Appointment Booking
                      </button>
                    </div>
                  </form>
                )}

                {/* 3. NEW DIAGNOSTIC ORDER */}
                {activeTab === 'order' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const refId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
                      setSubmittedResult({
                        type: 'Diagnostic Order Accessioned',
                        title: `${orderForm.patientName} — ${orderForm.tests.join(', ')}`,
                        refId,
                        detail: `Accessioned with ${orderForm.priority} priority. Barcodes generated for laboratory processing.`,
                        destination: '/orders',
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div>
                      <label className="font-semibold text-surface-700 block mb-1">Patient</label>
                      <input
                        type="text"
                        value={orderForm.patientName}
                        onChange={(e) => setOrderForm({ ...orderForm, patientName: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-surface-700 block mb-1">Select Tests / Profiles</label>
                      <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 space-y-1.5">
                        {['Complete Blood Count (CBC)', 'HbA1c Glycated Hemoglobin', 'Lipid Panel', 'Thyroid Profile (T3/T4/TSH)', 'MRI Brain with Contrast'].map(t => (
                          <label key={t} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={orderForm.tests.includes(t)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setOrderForm({ ...orderForm, tests: [...orderForm.tests, t] });
                                } else {
                                  setOrderForm({ ...orderForm, tests: orderForm.tests.filter(x => x !== t) });
                                }
                              }}
                              className="rounded text-brand-600"
                            />
                            <span>{t}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-surface-700">Order Priority:</span>
                        {(['Routine', 'Urgent', 'STAT'] as const).map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setOrderForm({ ...orderForm, priority: p })}
                            className={cn(
                              'px-2.5 py-1 rounded font-bold transition-colors cursor-pointer',
                              orderForm.priority === p ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-600'
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 cursor-pointer shadow-xs"
                      >
                        Generate Order & Barcodes
                      </button>
                    </div>
                  </form>
                )}

                {/* 4. COLLECT SAMPLE */}
                {activeTab === 'collect_sample' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmittedResult({
                        type: 'Specimen Barcoded & Collected',
                        title: `${sampleForm.container} — ${sampleForm.volume}`,
                        refId: sampleForm.barcode,
                        detail: `Sample collected for ${sampleForm.patientName}. Order ${sampleForm.orderId} dispatched to analyzer centrifuge.`,
                        destination: '/samples',
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Order Ref</label>
                        <input
                          type="text"
                          value={sampleForm.orderId}
                          onChange={(e) => setSampleForm({ ...sampleForm, orderId: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Generated Barcode</label>
                        <input
                          type="text"
                          value={sampleForm.barcode}
                          readOnly
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-100 font-mono text-brand-700 font-bold"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Vacutainer Tube</label>
                        <select
                          value={sampleForm.container}
                          onChange={(e) => setSampleForm({ ...sampleForm, container: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        >
                          <option value="EDTA Purple Top">EDTA Purple Top (Hematology/HbA1c)</option>
                          <option value="Plain Red Top">Plain Red Top (Biochemistry/Serology)</option>
                          <option value="Fluoride Grey Top">Fluoride Grey Top (Glucose/FBS/PPBS)</option>
                          <option value="Citrate Blue Top">Citrate Blue Top (PT/INR/Coagulation)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Drawn Volume</label>
                        <input
                          type="text"
                          value={sampleForm.volume}
                          onChange={(e) => setSampleForm({ ...sampleForm, volume: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-surface-200 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 cursor-pointer shadow-xs"
                      >
                        Confirm Collection & Print Label
                      </button>
                    </div>
                  </form>
                )}

                {/* 5. CREATE HOME COLLECTION */}
                {activeTab === 'home_collection' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const refId = `HC-VISIT-${Math.floor(1000 + Math.random() * 9000)}`;
                      setSubmittedResult({
                        type: 'Home Collection Dispatched',
                        title: `${homeForm.patientName || 'Home Visit Patient'}`,
                        refId,
                        detail: `Assigned phlebotomist ${homeForm.phlebotomist}. Route scheduled for ${homeForm.slot}.`,
                        destination: '/home-collection',
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Patient Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Venkat Raman"
                          value={homeForm.patientName}
                          onChange={(e) => setHomeForm({ ...homeForm, patientName: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Patient Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98490 22334"
                          value={homeForm.phone}
                          onChange={(e) => setHomeForm({ ...homeForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-surface-700 block mb-1">Home Address with Landmark</label>
                      <input
                        type="text"
                        value={homeForm.address}
                        onChange={(e) => setHomeForm({ ...homeForm, address: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                      />
                    </div>
                    <div className="pt-3 border-t border-surface-200 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 cursor-pointer shadow-xs"
                      >
                        Dispatch Phlebotomist Fleet
                      </button>
                    </div>
                  </form>
                )}

                {/* 6. CREATE INVOICE */}
                {activeTab === 'billing' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const refId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                      setSubmittedResult({
                        type: 'Invoice & Cash Receipt Dispensed',
                        title: `₹${billingForm.amount} for ${billingForm.patientName}`,
                        refId,
                        detail: `Receipt sealed. Settled via ${billingForm.paymentMethod}. PDF invoice dispatched.`,
                        destination: '/billing',
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Patient</label>
                        <input
                          type="text"
                          value={billingForm.patientName}
                          onChange={(e) => setBillingForm({ ...billingForm, patientName: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Bill Amount (₹)</label>
                        <input
                          type="number"
                          value={billingForm.amount}
                          onChange={(e) => setBillingForm({ ...billingForm, amount: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50 font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-surface-700 block mb-1">Settlement Mode</label>
                      <select
                        value={billingForm.paymentMethod}
                        onChange={(e) => setBillingForm({ ...billingForm, paymentMethod: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                      >
                        <option value="UPI (PhonePe / GPay)">UPI (PhonePe / GPay / QR)</option>
                        <option value="Credit / Debit Card">Credit / Debit Card (POS)</option>
                        <option value="Cash">Cash at Desk</option>
                        <option value="TPA Corporate Credit">TPA Corporate Credit</option>
                      </select>
                    </div>
                    <div className="pt-3 border-t border-surface-200 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 cursor-pointer shadow-xs"
                      >
                        Dispense Bill & Print Receipt
                      </button>
                    </div>
                  </form>
                )}

                {/* 7. UPLOAD REPORT */}
                {activeTab === 'upload_report' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const refId = `REP-EXT-${Math.floor(1000 + Math.random() * 9000)}`;
                      setSubmittedResult({
                        type: 'External Report Ingested',
                        title: `${reportForm.studyName} for ${reportForm.patientName}`,
                        refId,
                        detail: `Ingested to patient repository. Certified by ${reportForm.pathologistOrRadiologist}.`,
                        destination: '/reports',
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Patient</label>
                        <input
                          type="text"
                          value={reportForm.patientName}
                          onChange={(e) => setReportForm({ ...reportForm, patientName: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Study / Test Title</label>
                        <input
                          type="text"
                          value={reportForm.studyName}
                          onChange={(e) => setReportForm({ ...reportForm, studyName: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                    </div>
                    <div className="p-4 border-2 border-dashed border-surface-300 rounded-xl text-center space-y-1">
                      <Upload className="w-6 h-6 text-brand-600 mx-auto" />
                      <p className="font-semibold text-surface-700">Drag and drop scanned PDF or DICOM package</p>
                      <p className="text-[11px] text-surface-400">PDF, JPG, PNG, DCM up to 50MB</p>
                    </div>
                    <div className="pt-3 border-t border-surface-200 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 cursor-pointer shadow-xs"
                      >
                        Ingest & Link to Patient Record
                      </button>
                    </div>
                  </form>
                )}

                {/* 8. REGISTER DOCTOR */}
                {activeTab === 'register_doctor' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const refId = `DOC-${Math.floor(100 + Math.random() * 900)}`;
                      setSubmittedResult({
                        type: 'Referring Doctor Registered',
                        title: doctorForm.fullName || 'Dr. Sneha Kulkarni',
                        refId,
                        detail: `${doctorForm.specialization} at ${doctorForm.hospital}. Referral portal credentials dispatched.`,
                        destination: '/doctors',
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Doctor Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Sneha Kulkarni"
                          value={doctorForm.fullName}
                          onChange={(e) => setDoctorForm({ ...doctorForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Specialization</label>
                        <input
                          type="text"
                          value={doctorForm.specialization}
                          onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Affiliated Hospital / Clinic</label>
                        <input
                          type="text"
                          value={doctorForm.hospital}
                          onChange={(e) => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Medical Council Reg. No</label>
                        <input
                          type="text"
                          value={doctorForm.regNumber}
                          onChange={(e) => setDoctorForm({ ...doctorForm, regNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50 font-mono"
                        />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-surface-200 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 cursor-pointer shadow-xs"
                      >
                        Enroll Referring Doctor
                      </button>
                    </div>
                  </form>
                )}

                {/* 9. CREATE PACKAGE */}
                {activeTab === 'create_package' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const refId = `PKG-${Math.floor(100 + Math.random() * 900)}`;
                      setSubmittedResult({
                        type: 'Diagnostic Health Package Created',
                        title: packageForm.packageName || 'Master Executive Wellness Pack',
                        refId,
                        detail: `Priced at ₹${packageForm.price} (${packageForm.includedCount} tests included). Visible on billing and website.`,
                        destination: '/laboratory',
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Package Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Master Executive Wellness Pack"
                          value={packageForm.packageName}
                          onChange={(e) => setPackageForm({ ...packageForm, packageName: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Package Price (₹)</label>
                        <input
                          type="number"
                          value={packageForm.price}
                          onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50 font-bold"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Number of Parameters / Tests</label>
                        <input
                          type="number"
                          value={packageForm.includedCount}
                          onChange={(e) => setPackageForm({ ...packageForm, includedCount: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-surface-700 block mb-1">Guaranteed TAT (Hours)</label>
                        <input
                          type="number"
                          value={packageForm.tatHours}
                          onChange={(e) => setPackageForm({ ...packageForm, tatHours: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50"
                        />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-surface-200 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 cursor-pointer shadow-xs"
                      >
                        Publish Package to Catalog
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
