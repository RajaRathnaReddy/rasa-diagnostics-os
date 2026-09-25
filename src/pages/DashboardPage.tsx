import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import {
  Users, CalendarDays, TestTubes, FlaskConical, FileText, Scan,
  Home, AlertTriangle, Clock, TrendingUp, TrendingDown,
  Activity, CheckCircle2, XCircle, Timer, Truck,
  IndianRupee, ArrowUpRight, ArrowDownRight, AlertCircle, Package,
  Eye, Check, ChevronRight, ShieldAlert, Zap, Layers, RefreshCw,
  Filter, Stethoscope, Microscope, Building2, UserCheck, PhoneCall,
  Shield, Sparkles, Send, Phone, MessageSquare, AlertOctagon,
  CheckSquare, Search, PlayCircle, Radio
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '../lib/cn';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

export default function DashboardPage() {
  const {
    data, activeBranch, openQuickView, dashboardRole, setDashboardRole,
    setQuickCreateOpen, openDicomViewer
  } = useAppStore();
  const navigate = useNavigate();

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // Sub-filters
  const [imagingModalityFilter, setImagingModalityFilter] = useState<'All' | 'MRI' | 'CT' | 'USG' | 'X-Ray'>('All');
  const [deptMetric, setDeptMetric] = useState<'volume' | 'revenue' | 'tat' | 'sla'>('volume');
  const [actionCategoryFilter, setActionCategoryFilter] = useState<'all' | 'critical' | 'sla' | 'logistics'>('all');

  // Reception role local state
  const [receptionQueue, setReceptionQueue] = useState([
    { token: 'T-101', patient: 'Rajesh Kumar Sharma', phone: '+91 98765 01001', test: 'Complete Blood Count + Lipid Profile', doctor: 'Dr. Srinivas Rao', status: 'In Phlebotomy', time: '10:15 AM' },
    { token: 'T-102', patient: 'Kavitha Ramachandran', phone: '+91 98765 01002', test: 'MRI Lumbar Spine High-Res', doctor: 'Dr. Anand K.', status: 'Waiting (Counter 2)', time: '10:22 AM' },
    { token: 'T-103', patient: 'Suresh Babu Naidu', phone: '+91 98765 01003', test: 'HbA1c & Fasting Glucose', doctor: 'Self Walk-in', status: 'Waiting (Counter 1)', time: '10:30 AM' },
    { token: 'T-104', patient: 'Deepa Venkat', phone: '+91 98765 01004', test: 'USG Abdomen & Pelvis', doctor: 'Dr. Lakshmi N.', status: 'Arrived', time: '10:38 AM' },
    { token: 'T-105', patient: 'Anil Kumar Reddy', phone: '+91 98765 01005', test: 'Thyroid Profile (T3, T4, TSH)', doctor: 'Dr. Preeti Verma', status: 'Arrived', time: '10:45 AM' },
  ]);

  // Pathologist role local state
  const [pendingPathReports, setPendingPathReports] = useState([
    { id: 'rep-001', patient: 'Rajesh Kumar Sharma', age: 58, gender: 'M', test: 'Complete Blood Picture', finding: 'Hb 8.2 g/dL (Severe Microcytic Anemia), Platelets 92k', priority: 'High', status: 'Pending Verification' },
    { id: 'rep-002', patient: 'Kavitha Ramachandran', age: 44, gender: 'F', test: 'Serum Troponin-I STAT', finding: '0.48 ng/mL (CRITICAL ELEVATION — Above 0.04 cutoff)', priority: 'STAT', status: 'Awaiting Sign-off' },
    { id: 'rep-003', patient: 'Mohammed Farooq', age: 61, gender: 'M', test: 'Fine Needle Aspiration Cytology (FNAC)', finding: 'Colloid nodule with benign follicular cells; Bethesda II', priority: 'Normal', status: 'Pending Verification' },
    { id: 'rep-004', patient: 'Sunita Devi', age: 52, gender: 'F', test: 'Serum Potassium (K+)', finding: '6.4 mEq/L (CRITICAL HYPERKALEMIA — Panic range)', priority: 'STAT', status: 'Awaiting Sign-off' },
  ]);

  // Comprehensive operational statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = data.appointments.filter(a => a.date === today);
    const todayOrders = data.orders.filter(o => o.createdAt.startsWith(today));
    const todayImaging = data.imagingStudies.filter(s => s.scheduledAt.startsWith(today));
    const todayHomeCollections = data.homeCollections.filter(h => h.date === today);

    const pendingReports = data.reports.filter(r => r.status === 'Generated' || r.status === 'Pending');
    const verifiedReports = data.reports.filter(r => r.status === 'Verified' || r.status === 'Sent' || r.status === 'Delivered');
    const criticalResults = data.labResults.filter(r => r.isCritical);
    const pendingVerification = data.labResults.filter(r => r.status === 'Entered' || r.status === 'Validated');
    const rejectedSamples = data.samples.filter(s => s.status === 'Rejected');
    const lowStockItems = data.inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock');

    // Revenue Last 7 Days
    const revenueData = [
      { day: 'Mon', revenue: 145000, lab: 78000, radiology: 52000, pathology: 15000 },
      { day: 'Tue', revenue: 168000, lab: 92000, radiology: 59000, pathology: 17000 },
      { day: 'Wed', revenue: 152000, lab: 81000, radiology: 53000, pathology: 18000 },
      { day: 'Thu', revenue: 189000, lab: 104000, radiology: 64000, pathology: 21000 },
      { day: 'Fri', revenue: 174000, lab: 96000, radiology: 58000, pathology: 20000 },
      { day: 'Sat', revenue: 212000, lab: 118000, radiology: 71000, pathology: 23000 },
      { day: 'Sun', revenue: 182000, lab: 98000, radiology: 63000, pathology: 21000 },
    ];

    // Department Performance Metrics
    const departmentMetrics = [
      { name: 'Biochemistry', volume: 412, revenue: 385000, tat: 2.1, sla: 96 },
      { name: 'Hematology', volume: 345, revenue: 242000, tat: 1.8, sla: 98 },
      { name: 'Immunology', volume: 188, revenue: 295000, tat: 3.4, sla: 91 },
      { name: 'Microbiology', volume: 94, revenue: 142000, tat: 24.0, sla: 89 },
      { name: 'Radiology', volume: 168, revenue: 490000, tat: 2.6, sla: 94 },
      { name: 'Pathology', volume: 122, revenue: 210000, tat: 3.8, sla: 88 },
      { name: 'Clinical Path', volume: 156, revenue: 98000, tat: 1.5, sla: 99 },
    ];

    // Pipeline
    const pipeline = {
      ordered: { count: data.orders.filter(o => o.status === 'Booked' || o.status === 'Confirmed').length || 18, atRisk: 1 },
      collected: { count: data.orders.filter(o => o.status === 'Collected').length || 24, atRisk: 2 },
      received: { count: data.orders.filter(o => o.status === 'Received').length || 31, atRisk: 0 },
      processing: { count: data.orders.filter(o => o.status === 'Processing').length || 42, atRisk: 3 },
      completed: { count: data.orders.filter(o => o.status === 'Completed').length || 55, atRisk: 0 },
      verified: { count: data.orders.filter(o => o.status === 'Verified').length || 62, atRisk: 1 },
      reported: { count: data.orders.filter(o => o.status === 'Reported').length || 19, atRisk: 0 },
    };

    // Imaging Pipeline
    const imgPipeline = {
      scheduled: data.imagingStudies.filter(s => s.status === 'Scheduled').length || 14,
      checkedIn: data.imagingStudies.filter(s => s.status === 'Checked In').length || 8,
      scanning: data.imagingStudies.filter(s => s.status === 'In Progress').length || 4,
      completed: data.imagingStudies.filter(s => s.status === 'Completed').length || 22,
      reporting: data.imagingStudies.filter(s => s.status === 'Reporting').length || 9,
      verified: data.imagingStudies.filter(s => s.status === 'Verified').length || 18,
      published: data.imagingStudies.filter(s => s.status === 'Published').length || 12,
    };

    const totalRevenue = data.invoices.reduce((s, i) => s + i.paid, 0);
    const totalOutstanding = data.invoices.reduce((s, i) => s + i.balance, 0);

    return {
      todayAppointments: todayAppointments.length || 55,
      walkIns: 28,
      checkedIn: todayAppointments.filter(a => a.status === 'Checked In').length || 34,
      samplesCollected: data.samples.filter(s => s.status !== 'Pending').length || 407,
      verifiedReports: verifiedReports.length || 62,
      homeCollections: todayHomeCollections.length || 22,
      pendingReports: pendingReports.length || 12,
      criticalResults: criticalResults.length || 3,
      rejectedSamples: rejectedSamples.length || 5,
      lowStockItems: lowStockItems.length || 3,
      revenueData,
      departmentMetrics,
      pipeline,
      imgPipeline,
      totalRevenue: totalRevenue || 182000,
      totalOutstanding: totalOutstanding || 32000,
    };
  }, [data]);

  // Operational Action Queue Items
  const actionQueueItems = [
    {
      id: 'act-panic',
      title: '3 Critical Results Awaiting Doctor Log',
      category: 'Critical',
      urgency: 'STAT',
      department: 'Biochemistry & Critical Care',
      impact: 'Potentially life-threatening lab/imaging abnormality requires physician contact log',
      actionPath: '/laboratory',
      actionLabel: 'Call Doctor / Log',
      badge: '3 Critical',
      accentColor: 'border-t-rose-500',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertOctagon,
      iconColor: 'text-rose-600 bg-rose-50',
    },
    {
      id: 'act-recollect',
      title: '5 Specimens Require Immediate Recollection',
      category: 'Critical',
      urgency: 'Urgent',
      department: 'Central Phlebotomy Accession',
      impact: 'Hemolyzed or clotted tubes; patients awaiting follow-up call & redraw dispatch',
      actionPath: '/samples',
      actionLabel: 'Recollection Queue',
      badge: '5 Rejected',
      accentColor: 'border-t-rose-400',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: TestTubes,
      iconColor: 'text-rose-600 bg-rose-50',
    },
    {
      id: 'act-sla',
      title: '8 Reports Approaching TAT Breach (<45m)',
      category: 'SLA',
      urgency: 'Warning',
      department: 'Histopathology & MRI Section',
      impact: '<45 minutes left before SLA guaranteed turnaround is exceeded for corporate/IPD clients',
      actionPath: '/reports',
      actionLabel: 'Expedite TAT',
      badge: '< 45 min',
      accentColor: 'border-t-amber-500',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Timer,
      iconColor: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'act-logistics',
      title: '4 Home Sample Pickups Delayed in Transit',
      category: 'Logistics',
      urgency: 'Medium',
      department: 'Home Collection Dispatch',
      impact: 'Phlebotomists delayed in LB Nagar & Hitec City corridors due to monsoon rain/traffic',
      actionPath: '/home-collection',
      actionLabel: 'Reroute Fleet',
      badge: '4 Delayed',
      accentColor: 'border-t-indigo-500',
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Truck,
      iconColor: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 'act-verify',
      title: '12 Routine Reports Awaiting Batch Signoff',
      category: 'Routine',
      urgency: 'Normal',
      department: 'Central Pathology & Hematology',
      impact: 'Prevent clinical reporting TAT breach and patient discharge delays',
      actionPath: '/reports',
      actionLabel: 'Verify Batch',
      badge: '12 Pending',
      accentColor: 'border-t-blue-500',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: FileText,
      iconColor: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'act-supplies',
      title: '3 Reagents Below Emergency Minimum Stock',
      category: 'Supplies',
      urgency: 'Low',
      department: 'Central Reagent Warehouse',
      impact: 'Fluoride tubes and CBC reagent packs running low at Madhapur hub',
      actionPath: '/inventory',
      actionLabel: 'Generate PO',
      badge: '3 Low Stock',
      accentColor: 'border-t-teal-500',
      badgeStyle: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: Package,
      iconColor: 'text-teal-600 bg-teal-50',
    },
  ];

  // Filtered action queue
  const filteredActions = useMemo(() => {
    if (actionCategoryFilter === 'critical') return actionQueueItems.filter(a => a.category === 'Critical');
    if (actionCategoryFilter === 'sla') return actionQueueItems.filter(a => a.category === 'SLA');
    if (actionCategoryFilter === 'logistics') return actionQueueItems.filter(a => a.category === 'Logistics');
    return actionQueueItems;
  }, [actionCategoryFilter]);

  // Live Queues
  const liveQueues = [
    { name: 'Reception & Tokens', waiting: 4, avgWait: '14 min', status: 'optimal' },
    { name: 'Blood Phlebotomy', waiting: 7, avgWait: '8 min', status: 'optimal' },
    { name: 'MRI (Philips 3T)', waiting: 3, avgWait: '25 min', status: 'attention' },
    { name: 'CT (GE Revolution)', waiting: 2, avgWait: '12 min', status: 'optimal' },
    { name: 'Ultrasound (USG)', waiting: 5, avgWait: '18 min', status: 'attention' },
    { name: 'Digital X-Ray', waiting: 2, avgWait: '6 min', status: 'optimal' },
    { name: 'Report Verification', waiting: 8, avgWait: '20 min', status: 'optimal' },
  ];

  // Specimen & Diagnostic Lifecycle Funnel stages
  const funnelStages = [
    { label: 'Order Registered', value: 245, pct: '100%', grad: 'from-blue-500 to-sky-500' },
    { label: 'Barcoded & Collected', value: 230, pct: '94% Conv', grad: 'from-indigo-500 to-blue-600' },
    { label: 'Central Accession & Routed', value: 223, pct: '91% Routed', grad: 'from-purple-500 to-indigo-600' },
    { label: 'Analyzer Results Generated', value: 210, pct: '86% Tests', grad: 'from-teal-500 to-emerald-600' },
    { label: 'Pathologist / Rad Sign-Off', value: 192, pct: '78% Signed', grad: 'from-amber-500 to-orange-600' },
    { label: 'Dispatched (SMS/WhatsApp/PDF)', value: 176, pct: '72% Delivered', grad: 'from-emerald-500 to-teal-600' },
  ];

  // Role Perspective Tab Options
  const roleTabs = [
    { id: 'all', label: 'Executive', icon: Shield },
    { id: 'receptionist', label: 'Reception', icon: CalendarDays },
    { id: 'lab_supervisor', label: 'Lab Supervisor', icon: FlaskConical },
    { id: 'pathologist', label: 'Pathologist', icon: Microscope },
    { id: 'radiologist', label: 'Radiologist', icon: Scan },
    { id: 'home_collection', label: 'Home Fleet', icon: Truck },
    { id: 'management', label: 'Management', icon: Building2 },
  ];

  // Call Next Token handler for Receptionist
  const callNextReceptionToken = () => {
    const next = receptionQueue.find(p => p.status === 'Waiting (Counter 1)' || p.status === 'Waiting (Counter 2)' || p.status === 'Arrived');
    if (next) {
      setReceptionQueue(prev => prev.map(p => {
        if (p.token === next.token) return { ...p, status: 'In Phlebotomy' };
        if (p.status === 'In Phlebotomy') return { ...p, status: 'Completed' };
        return p;
      }));
      showToast(`🔔 Token ${next.token} (${next.patient}) called into Blood Phlebotomy Booth 1!`);
    } else {
      showToast('All queued patients have been called!');
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Floating Dynamic Feedback Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Executive Command Center Header & Segmented Role Selector ── */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1 flex-wrap">
              <h1 className="page-title text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {dashboardRole === 'all' && 'Diagnostic Center Executive Command Center'}
                {dashboardRole === 'receptionist' && 'Reception & Unified OPD Token Desk'}
                {dashboardRole === 'lab_supervisor' && 'Central Accession & Specimen Integrity Station'}
                {dashboardRole === 'pathologist' && 'Pathologist Verification & Sign-Off Cockpit'}
                {dashboardRole === 'radiologist' && 'Radiologist RIS & PACS Reporting Station'}
                {dashboardRole === 'home_collection' && 'Home Sample Collection Fleet Logistics'}
                {dashboardRole === 'management' && 'Diagnostic Financial & Growth Leadership'}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200/90 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Operations
              </span>
            </div>
            <p className="page-subtitle text-xs sm:text-sm text-slate-500">
              {dashboardRole === 'all' && `Enterprise multi-specialty overview · ${activeBranch.name} · Central accession, modality queues & revenue`}
              {dashboardRole === 'receptionist' && "Unified token queue · Walk-in fast register · Phlebotomy dispatch · Payment receipt printing"}
              {dashboardRole === 'lab_supervisor' && 'Barcode accessioning · Hemolysis recollection queue · Reagent stock tracking · Analyzer QC'}
              {dashboardRole === 'pathologist' && 'Critical Panic values awaiting doctor call · Abnormal lab findings · 1-click digital sign-offs'}
              {dashboardRole === 'radiologist' && 'Cross-modality study roster (MRI, CT, USG, X-Ray) · Zero-footprint DICOM film review · Structured reports'}
              {dashboardRole === 'home_collection' && 'GPS phlebotomist route tracking · Monsoon delay alerts · Drop-off temperature verification'}
              {dashboardRole === 'management' && 'Multi-branch profitability · Segment margins (Lab vs Radiology) · Doctor referral leaderboards'}
            </p>
          </div>

          {/* Quick Perspective Selector Tabs */}
          <div className="flex items-center p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl shadow-xs overflow-x-auto max-w-full gap-0.5 scrollbar-none">
            {roleTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = dashboardRole === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashboardRole(tab.id as any)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0',
                    isActive
                      ? 'bg-brand-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5 shrink-0', isActive ? 'text-white' : 'text-slate-500')} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════
          PERSPECTIVE 1: EXECUTIVE / SUPER ADMIN ("GOD VIEW")
         ══════════════════════════════════════════════════════════════════ */}
      {dashboardRole === 'all' && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          {/* Executive Top 8 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            {[
              {
                label: "Today's Appts",
                value: stats.todayAppointments,
                subtext: '18 In-Clinic · 12 Tele',
                icon: CalendarDays,
                color: 'text-blue-600 bg-blue-50',
                borderAccent: 'border-t-blue-500',
                trend: '+12%',
                up: true,
                path: '/appointments',
              },
              {
                label: 'Walk-ins & Tokens',
                value: stats.walkIns,
                subtext: 'Avg wait ~11 mins',
                icon: Users,
                color: 'text-cyan-600 bg-cyan-50',
                borderAccent: 'border-t-cyan-500',
                trend: 'In Counter',
                up: true,
                path: '/reception',
              },
              {
                label: 'Checked In',
                value: stats.checkedIn,
                subtext: '9 in waiting area',
                icon: UserCheck,
                color: 'text-teal-600 bg-teal-50',
                borderAccent: 'border-t-teal-500',
                trend: 'Optimal',
                up: true,
                path: '/reception',
              },
              {
                label: 'Samples In-Lab',
                value: stats.samplesCollected,
                subtext: '98% barcoded OK',
                icon: TestTubes,
                color: 'text-indigo-600 bg-indigo-50',
                borderAccent: 'border-t-indigo-500',
                trend: '+8%',
                up: true,
                path: '/samples',
              },
              {
                label: 'Reports Verified',
                value: stats.verifiedReports,
                subtext: '94% on-time signoff',
                icon: FileText,
                color: 'text-emerald-600 bg-emerald-50',
                borderAccent: 'border-t-emerald-500',
                trend: '94%',
                up: true,
                path: '/reports',
              },
              {
                label: 'Panic / Critical',
                value: stats.criticalResults,
                subtext: 'Awaiting Dr. Call',
                icon: AlertOctagon,
                color: 'text-rose-600 bg-rose-50',
                borderAccent: 'border-t-rose-500',
                trend: 'STAT',
                up: false,
                path: '/laboratory',
              },
              {
                label: 'Home Collections',
                value: stats.homeCollections,
                subtext: '4 active in transit',
                icon: Truck,
                color: 'text-amber-600 bg-amber-50',
                borderAccent: 'border-t-amber-500',
                trend: '+5%',
                up: true,
                path: '/home-collection',
              },
              {
                label: 'Daily Revenue',
                value: `₹${(stats.totalRevenue / 100000).toFixed(2)}L`,
                subtext: '88% digital UPI/TPA',
                icon: IndianRupee,
                color: 'text-emerald-600 bg-emerald-50',
                borderAccent: 'border-t-emerald-600',
                trend: '+14%',
                up: true,
                path: '/finance',
              },
            ].map((kpi) => (
              <motion.div
                key={kpi.label}
                variants={itemVariants}
                onClick={() => navigate(kpi.path)}
                className={cn(
                  'card p-3.5 border-t-2 bg-white hover:shadow-md transition-all relative group cursor-pointer',
                  kpi.borderAccent
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs', kpi.color)}>
                    <kpi.icon className="w-4 h-4" />
                  </div>
                  {kpi.trend && (
                    <span className={cn(
                      'flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      kpi.up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    )}>
                      {kpi.trend.includes('%') && (kpi.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />)}
                      {kpi.trend}
                    </span>
                  )}
                </div>
                <p className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">{kpi.value}</p>
                <p className="text-[11px] font-bold text-slate-700 mt-0.5 truncate">{kpi.label}</p>
                <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{kpi.subtext}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Operational Action Center (Refined, High-Density Clinical Center) ── */}
          <motion.div variants={itemVariants} className="card p-5 border border-surface-200 shadow-xs bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-surface-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Operational Action Center</h3>
                  <p className="text-[11px] text-slate-500">Urgent clinical exceptions, recollection queues and SLA watch</p>
                </div>
              </div>

              {/* Action Category Filter Segment */}
              <div className="flex items-center gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Tasks (6)' },
                  { id: 'critical', label: 'Critical / STAT (2)' },
                  { id: 'sla', label: 'SLA Watch (1)' },
                  { id: 'logistics', label: 'Fleet Delay (1)' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActionCategoryFilter(cat.id as any)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer',
                      actionCategoryFilter === cat.id
                        ? 'bg-slate-900 text-white font-bold shadow-2xs'
                        : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Structured Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
              {filteredActions.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => openQuickView('action_item', item)}
                    className={cn(
                      'card p-4 border border-surface-200 border-t-2 bg-white hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between',
                      item.accentColor
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-6 h-6 rounded flex items-center justify-center', item.iconColor)}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {item.department}
                          </span>
                        </div>
                        <span className={cn('badge text-[10px] font-bold px-2 py-0.5 border shadow-2xs', item.badgeStyle)}>
                          {item.badge}
                        </span>
                      </div>

                      <h4 className="font-bold text-[13px] text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.impact}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-100 text-[11px]">
                      <span className="text-slate-400 font-medium">Urgency: <strong>{item.urgency}</strong></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(item.actionPath);
                        }}
                        className="font-bold text-brand-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 cursor-pointer"
                      >
                        <span>{item.actionLabel}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Central Accession & Patient Flow Today + Lifecycle Funnel ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Hospital-Wide Accession & Patient Flow (8 cols) */}
            <motion.div variants={itemVariants} className="card lg:col-span-8 border border-surface-200 overflow-hidden shadow-xs bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-surface-100 bg-slate-50/70 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Hospital-Wide Accession & Patient Flow Today</h3>
                    <p className="text-[11px] text-slate-500">Live specimen check-ins, doctor requisitions and workflow states</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-teal-100/80 text-teal-800 text-xs font-bold border border-teal-200">
                    {data.orders.length} Active Orders
                  </span>
                  <button
                    onClick={() => navigate('/orders')}
                    className="text-xs text-teal-700 font-bold hover:text-teal-900 flex items-center gap-1 cursor-pointer ml-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-surface-100 max-h-[420px] overflow-y-auto">
                {data.orders.slice(0, 7).map((order, idx) => {
                  const initials = order.patientName.split(' ').map(n => n[0]).slice(0, 2).join('');
                  const time = `10:${(15 + idx * 8).toString().padStart(2, '0')} AM`;
                  return (
                    <div
                      key={order.id}
                      onClick={() => openQuickView('order', order)}
                      className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Time Column */}
                        <div className="text-center w-16 shrink-0 bg-slate-100/80 border border-slate-200 px-2 py-1 rounded-lg">
                          <p className="text-xs font-mono font-bold text-slate-800">{time}</p>
                        </div>

                        {/* Patient Avatar & Details */}
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
                            {order.patientName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate font-medium">
                            <span className="text-brand-700 font-semibold">{order.doctorName || 'Self Walk-in'}</span>
                            {' • '}
                            <span>{order.testNames.join(', ')}</span>
                          </p>
                        </div>
                      </div>

                      {/* Status & Action */}
                      <div className="flex items-center gap-2 shrink-0">
                        {order.priority === 'STAT' && (
                          <span className="badge bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
                            STAT
                          </span>
                        )}
                        <span className={cn(
                          'badge text-[10px] font-bold px-2 py-0.5 border shadow-2xs',
                          order.status === 'Verified' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          order.status === 'Processing' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          order.status === 'Collected' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full mr-1', order.status === 'Processing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500')} />
                          {order.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Diagnostic Specimen & Report Lifecycle Funnel (4 cols) */}
            <motion.div variants={itemVariants} className="card lg:col-span-4 p-5 border border-surface-200 shadow-xs bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-teal-600" />
                      Diagnostic Lifecycle Funnel
                    </h3>
                    <p className="text-[11px] text-slate-500">Stage conversion rate & processing velocity</p>
                  </div>
                  <span className="badge bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    ₹1.82L Pipeline
                  </span>
                </div>

                <div className="space-y-3 mt-4">
                  {funnelStages.map((f) => {
                    const widthPct = Math.min(100, Math.round((f.value / 245) * 100));
                    return (
                      <div key={f.label} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700 truncate">{f.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-slate-400 font-medium">{f.pct}</span>
                            <span className="font-bold text-slate-900 font-mono w-7 text-right">{f.value}</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500 bg-gradient-to-r', f.grad)}
                            style={{ width: `${Math.max(8, widthPct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Mean Care Cycle: <strong>2.4 Hours</strong></span>
                <span className="text-emerald-700 font-bold">Zero Critical Leakage Target Met</span>
              </div>
            </motion.div>
          </div>

          {/* ── Live Modality & Floor Queues ── */}
          <motion.div variants={itemVariants} className="card p-5 border border-surface-200 shadow-xs bg-white">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">Live Modality & Department Queues</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Real-Time Floor Monitor</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {liveQueues.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-brand-200 hover:bg-white transition-all shadow-2xs group"
                >
                  <div className="text-[11px] font-bold text-slate-700 truncate">{q.name}</div>
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-2xl font-extrabold text-slate-900">{q.waiting}</span>
                    <span className="text-[10px] text-slate-500 font-medium">in queue</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between pt-1 border-t border-slate-200/50">
                    <span>Avg: {q.avgWait}</span>
                    <span className={cn('w-2 h-2 rounded-full', q.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500')} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Operational Pipelines (Lab & Imaging RIS/PACS) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Lab Pipeline */}
            <motion.div variants={itemVariants} className="card p-5 border border-surface-200 shadow-xs bg-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-brand-600" />
                    <span>Laboratory Operations Pipeline</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Central accessioning stages and analytical routing</p>
                </div>
                <span className="badge bg-slate-100 text-slate-700 text-xs font-bold">
                  {Object.values(stats.pipeline).reduce((a, b) => a + b.count, 0)} Specimens
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 bg-slate-50/80 p-2 rounded-xl border border-slate-200/80 text-center">
                {Object.entries(stats.pipeline).map(([key, val]) => (
                  <div
                    key={key}
                    onClick={() => navigate('/samples')}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 capitalize truncate">
                      {key}
                    </div>
                    <div className="text-lg font-extrabold text-slate-900 mt-0.5 group-hover:text-brand-600 transition-colors">
                      {val.count}
                    </div>
                    {val.atRisk > 0 ? (
                      <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1 py-0.2 rounded block mt-0.5 truncate">
                        {val.atRisk} At Risk
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">SLA OK</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Imaging Pipeline */}
            <motion.div variants={itemVariants} className="card p-5 border border-surface-200 shadow-xs bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Scan className="w-4 h-4 text-brand-600" />
                    <span>Imaging Operations Pipeline (RIS / PACS)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Modality workflow status and reporting backlog</p>
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  {(['All', 'MRI', 'CT', 'USG', 'X-Ray'] as const).map(mod => (
                    <button
                      key={mod}
                      onClick={() => setImagingModalityFilter(mod)}
                      className={cn(
                        'px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer',
                        imagingModalityFilter === mod
                          ? 'bg-brand-600 text-white font-bold shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 bg-slate-50/80 p-2 rounded-xl border border-slate-200/80 text-center">
                {Object.entries(stats.imgPipeline).map(([key, count]) => (
                  <div
                    key={key}
                    onClick={() => navigate('/radiology')}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 capitalize truncate">
                      {key}
                    </div>
                    <div className="text-lg font-extrabold text-slate-900 mt-0.5 group-hover:text-brand-600 transition-colors">
                      {count}
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Studies</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── TAT Intelligence & Financial Performance ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* TAT Intelligence (5 Cols) */}
            <motion.div variants={itemVariants} className="card lg:col-span-5 p-5 border border-surface-200 shadow-xs bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-brand-600" />
                  <span>Turnaround Time (TAT) Intelligence</span>
                </h3>
                <span className="badge bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <ArrowDownRight className="w-3 h-3" /> 8% Faster
                </span>
              </div>

              <div className="flex items-baseline gap-3 pb-3 border-b border-surface-100">
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">2.4 hrs</span>
                  <span className="text-xs text-slate-500 ml-1.5 font-medium">Average Diagnostic Turnaround</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 py-3.5 text-center text-xs">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl">
                  <span className="text-[10px] text-emerald-700 font-bold block">Within SLA</span>
                  <span className="text-xl font-extrabold text-emerald-900">92%</span>
                </div>
                <div className="p-2.5 bg-amber-50/70 border border-amber-200/70 rounded-xl">
                  <span className="text-[10px] text-amber-700 font-bold block">At Risk</span>
                  <span className="text-xl font-extrabold text-amber-900">5%</span>
                </div>
                <div className="p-2.5 bg-rose-50/70 border border-rose-200/70 rounded-xl">
                  <span className="text-[10px] text-rose-700 font-bold block">Breached</span>
                  <span className="text-xl font-extrabold text-rose-900">3%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Top Departments by TAT
                </span>
                <div className="space-y-1.5 text-xs">
                  <div onClick={() => navigate('/pathology')} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <span className="font-semibold text-slate-800">1. Histopathology & Biopsy</span>
                    <span className="font-bold text-amber-700">3.8 hrs (Complex stain)</span>
                  </div>
                  <div onClick={() => navigate('/radiology')} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <span className="font-semibold text-slate-800">2. MRI Multi-Sequence Brain</span>
                    <span className="font-bold text-slate-700">2.8 hrs</span>
                  </div>
                  <div onClick={() => navigate('/laboratory')} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <span className="font-semibold text-slate-800">3. Special Immunology / Hormones</span>
                    <span className="font-bold text-slate-700">2.2 hrs</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Financial Performance (7 Cols) */}
            <motion.div variants={itemVariants} className="card lg:col-span-7 p-5 border border-surface-200 shadow-xs bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Revenue & Financial Performance</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">7-day collection run rate vs outstanding balances</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900">₹{(stats.totalRevenue / 100000).toFixed(2)}L</span>
                    <span className="badge bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> 14.2%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2.5 mb-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-slate-500 block text-[10px] font-semibold">Total Invoiced</span>
                    <span className="font-bold text-slate-900 text-sm">₹2.14L</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
                    <span className="text-emerald-700 block text-[10px] font-semibold">Collected</span>
                    <span className="font-bold text-emerald-800 text-sm">₹1.82L</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60">
                    <span className="text-amber-700 block text-[10px] font-semibold">Outstanding</span>
                    <span className="font-bold text-amber-800 text-sm">₹32K</span>
                  </div>
                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-200/60">
                    <span className="text-rose-700 block text-[10px] font-semibold">Refunds / Disc</span>
                    <span className="font-bold text-rose-800 text-sm">₹3.5K</span>
                  </div>
                </div>

                {/* Revenue Trend Chart */}
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="compactRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3381ff" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3381ff" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#3381ff" strokeWidth={2} fill="url(#compactRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Segments: Lab (52%) • Radiology (31%) • Pathology (11%) • Home Visits (6%)</span>
                <button onClick={() => navigate('/finance')} className="text-brand-600 font-bold hover:underline">
                  Detailed Ledger →
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PERSPECTIVE 2: RECEPTIONIST (Token Desk & Walk-In Arrivals)
         ══════════════════════════════════════════════════════════════════ */}
      {dashboardRole === 'receptionist' && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
          <div className="card p-5 bg-gradient-to-r from-cyan-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-extrabold text-lg shrink-0">
                RD
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Central Reception Desk & Token Calling Desk</h2>
                  <span className="badge bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30 font-bold">Counter 1 Active</span>
                </div>
                <p className="text-xs text-cyan-200">5 Walk-In Tokens Waiting · Average check-in time 2.4 minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={callNextReceptionToken}
                className="btn-primary !bg-emerald-500 hover:!bg-emerald-600 !text-white !text-xs !py-2 !px-4 shadow-md flex items-center gap-1.5 font-bold"
              >
                <span>🔔 Call Next Token</span>
              </button>
              <button onClick={() => navigate('/registration')} className="btn-secondary !bg-white/10 !text-white hover:!bg-white/20 !border-white/20 !text-xs !py-2">
                <Users className="w-3.5 h-3.5" />
                <span>Fast Patient Registration</span>
              </button>
            </div>
          </div>

          {/* Reception Queue Table */}
          <div className="card overflow-hidden border border-surface-200 shadow-xs bg-white">
            <div className="p-4 border-b border-surface-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-bold text-slate-900">Today's Token & Phlebotomy Queue</h3>
              </div>
              <span className="badge bg-cyan-50 text-cyan-700 text-xs font-bold border border-cyan-200">
                {receptionQueue.length} In Queue
              </span>
            </div>

            <div className="divide-y divide-surface-100">
              {receptionQueue.map((item) => (
                <div key={item.token} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'font-mono font-bold text-xs px-2.5 py-1 rounded-lg',
                      item.status === 'In Phlebotomy' ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-800'
                    )}>
                      {item.token}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.patient}</p>
                      <p className="text-xs text-slate-500">{item.test} • Referring: <strong className="text-slate-700">{item.doctor}</strong></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'badge text-xs font-bold px-2 py-0.5',
                      item.status === 'In Phlebotomy' ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 'bg-slate-100 text-slate-700'
                    )}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => showToast(`🖨️ Payment Receipt printed for ${item.patient} (${item.token})`)}
                      className="btn-secondary !text-xs !py-1 !px-2.5"
                    >
                      Collect / Print
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PERSPECTIVE 3: LAB SUPERVISOR (Central Accession & Integrity)
         ══════════════════════════════════════════════════════════════════ */}
      {dashboardRole === 'lab_supervisor' && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
          <div className="card p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-extrabold text-lg shrink-0">
                LS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Central Accession & Lab Quality Console</h2>
                  <span className="badge bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30 font-bold">407 Samples Active</span>
                </div>
                <p className="text-xs text-indigo-200">5 Rejected Tubes Awaiting Recollection · All 3 Analyzers Calibrated OK</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/samples')}
                className="btn-primary !bg-indigo-600 hover:!bg-indigo-700 !text-white !text-xs !py-2 !px-4 shadow-md font-bold"
              >
                Accession Worklist &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 border-2 border-rose-200 bg-rose-50/40">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-rose-900">Specimen Recollection Queue</span>
                <span className="badge bg-rose-600 text-white text-[10px] font-bold">5 Rejected</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Hemolyzed CBC tubes and clotted coagulation specimens requiring patient recall.</p>
              <button
                onClick={() => {
                  showToast('📲 Phlebotomist dispatched for recollection!');
                }}
                className="btn-secondary !text-xs !py-1 !px-2.5 mt-3 w-full !bg-white"
              >
                Dispatch Phlebotomists
              </button>
            </div>

            <div className="card p-4 border-2 border-emerald-200 bg-emerald-50/40">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-emerald-900">Analyzer QC & Calibration</span>
                <span className="badge bg-emerald-600 text-white text-[10px] font-bold">100% Passed</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Siemens Advia 2120, Roche Cobas 6000 & Sysmex XN daily control runs in 2SD limit.</p>
              <div className="mt-3 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Next run: 18:00 PM
              </div>
            </div>

            <div className="card p-4 border-2 border-amber-200 bg-amber-50/40">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-amber-900">Reagent Minimum Stock</span>
                <span className="badge bg-amber-600 text-white text-[10px] font-bold">3 Low</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Fluoride Vacutainers and Roche Diluent running low at Banjara Hills main store.</p>
              <button
                onClick={() => {
                  showToast('📦 PO-2026-991 auto-generated for Reagents!');
                }}
                className="btn-secondary !text-xs !py-1 !px-2.5 mt-3 w-full !bg-white"
              >
                1-Click Restock PO
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PERSPECTIVE 4: PATHOLOGIST (Dr. Sunita Rao Cockpit)
         ══════════════════════════════════════════════════════════════════ */}
      {dashboardRole === 'pathologist' && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
          <div className="card p-5 bg-gradient-to-r from-purple-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-extrabold text-lg shrink-0">
                SR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Dr. Sunita Rao, MD (Pathology) — Verification Cockpit</h2>
                  <span className="badge bg-purple-500/20 text-purple-300 text-[10px] border border-purple-500/30 font-bold">Signing Active</span>
                </div>
                <p className="text-xs text-purple-200">12 Reports Awaiting Verification · 2 Critical Panic Results Requiring Doctor Call</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPendingPathReports(prev => prev.map(p => ({ ...p, status: 'Verified & Signed' })));
                  showToast('✅ All 4 pending reports digitally signed and dispatched!');
                }}
                className="btn-primary !bg-emerald-500 hover:!bg-emerald-600 !text-white !text-xs !py-2 !px-4 shadow-md font-bold"
              >
                <span>Batch Sign All Normal (12)</span>
              </button>
            </div>
          </div>

          {/* Pathologist Worklist */}
          <div className="card overflow-hidden border border-surface-200 shadow-xs bg-white">
            <div className="p-4 border-b border-surface-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Microscope className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Pending Lab & Pathology Sign-Off Worklist</h3>
              </div>
              <span className="badge bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                {pendingPathReports.filter(p => !p.status.includes('Signed')).length} Awaiting Review
              </span>
            </div>

            <div className="divide-y divide-surface-100">
              {pendingPathReports.map(rep => (
                <div key={rep.id} className="p-4.5 space-y-2 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{rep.patient}</span>
                        <span className="text-xs text-slate-400">({rep.age}y / {rep.gender})</span>
                        {rep.priority === 'STAT' && (
                          <span className="badge bg-rose-500 text-white font-bold text-[9px] animate-pulse">
                            CRITICAL STAT
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-brand-700 mt-0.5">{rep.test}</p>
                    </div>

                    <span className={cn(
                      'badge text-xs font-bold px-2 py-0.5',
                      rep.status.includes('Signed') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    )}>
                      {rep.status}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block text-[11px] mb-0.5">Clinical Finding:</span>
                    <span>{rep.finding}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">Sample ID: SMP-2026-{rep.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setPendingPathReports(prev => prev.map(p => p.id === rep.id ? { ...p, status: 'Verified & Signed' } : p));
                          showToast(`✅ Report signed off for ${rep.patient}`);
                        }}
                        className="btn-primary !text-xs !py-1 !px-3 font-bold shadow-2xs"
                      >
                        Sign Off & Publish &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PERSPECTIVE 5: RADIOLOGIST (Dr. Vikram Malhotra RIS Cockpit)
         ══════════════════════════════════════════════════════════════════ */}
      {dashboardRole === 'radiologist' && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
          <div className="card p-5 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-extrabold text-lg shrink-0">
                VM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Dr. Vikram Malhotra, DMRD — RIS & PACS Reporting Cockpit</h2>
                  <span className="badge bg-blue-500/20 text-blue-300 text-[10px] border border-blue-500/30 font-bold">PACS Grounded</span>
                </div>
                <p className="text-xs text-blue-200">Philips 3T MRI & GE Revolution CT High-Resolution Workstation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openDicomViewer(data.imagingStudies[0])}
                className="btn-primary !bg-blue-600 hover:!bg-blue-700 !text-white !text-xs !py-2 !px-4 shadow-md font-bold flex items-center gap-1.5"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Launch Zero-Footprint PACS Viewer</span>
              </button>
            </div>
          </div>

          {/* Radiologist Studies Worklist */}
          <div className="card overflow-hidden border border-surface-200 shadow-xs bg-white">
            <div className="p-4 border-b border-surface-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Today's Radiology Studies Roster</h3>
              </div>
              <span className="badge bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {data.imagingStudies.length} Studies Scheduled
              </span>
            </div>

            <div className="divide-y divide-surface-100">
              {data.imagingStudies.map(study => (
                <div key={study.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs shrink-0">
                      {study.modality}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{study.patientName}</p>
                      <p className="text-xs text-slate-500">{study.modality} Study • {study.bodyPart}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDicomViewer(study)}
                      className="btn-secondary !text-xs !py-1 !px-2.5 flex items-center gap-1 text-blue-700 font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Film</span>
                    </button>
                    <button
                      onClick={() => navigate('/radiology')}
                      className="btn-primary !text-xs !py-1 !px-3 font-bold"
                    >
                      Report &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PERSPECTIVE 6: HOME COLLECTION (Fleet Logistics & Tracking)
         ══════════════════════════════════════════════════════════════════ */}
      {dashboardRole === 'home_collection' && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
          <div className="card p-5 bg-gradient-to-r from-amber-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-extrabold text-lg shrink-0">
                HC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Home Collection Fleet Dispatch & Logistics Desk</h2>
                  <span className="badge bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30 font-bold">4 Active in Transit</span>
                </div>
                <p className="text-xs text-amber-200">22 Home Collections Today · Cold-Chain Temperature Monitored</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast('🚗 Phlebotomist Rerouted to Hitec City via Inner Ring Road!');
                }}
                className="btn-primary !bg-amber-600 hover:!bg-amber-700 !text-white !text-xs !py-2 !px-4 shadow-md font-bold"
              >
                <span>Auto-Reroute Delayed Fleet</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { rider: 'Suresh Kumar', zone: 'Banjara Hills / Jubilee Hills', assigned: 6, completed: 4, status: 'On Route (Patient 5)' },
              { rider: 'Ramesh Babu', zone: 'Hitec City / Madhapur', assigned: 7, completed: 3, status: 'Delayed in Traffic (12m)' },
              { rider: 'Priya Sharma', zone: 'Gachibowli / Financial Dist', assigned: 5, completed: 5, status: 'Returning to Hub' },
              { rider: 'K. Subba Rao', zone: 'Secunderabad / Begumpet', assigned: 4, completed: 3, status: 'Collecting at Home' },
            ].map(r => (
              <div key={r.rider} className="card p-4 border border-surface-200 shadow-xs bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-900">{r.rider}</span>
                  <span className="badge bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                    {r.completed}/{r.assigned} Done
                  </span>
                </div>
                <p className="text-xs text-slate-500">{r.zone}</p>
                <div className="p-2 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PERSPECTIVE 7: MANAGEMENT (Financials & Growth Leadership)
         ══════════════════════════════════════════════════════════════════ */}
      {dashboardRole === 'management' && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
          <div className="card p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-extrabold text-lg shrink-0">
                HQ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Diagnostic Leadership & Business Performance Console</h2>
                  <span className="badge bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30 font-bold">Branch: Banjara Hills</span>
                </div>
                <p className="text-xs text-emerald-200">Monthly Run-Rate: ₹48.2 Lakhs · Gross Margin: 58.4% · 98.2% NABL Compliance</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/finance')} className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-xs !py-2 !px-4 shadow-md font-bold">
                Detailed Ledger &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 border border-surface-200 shadow-xs bg-white">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Top Referring Doctors</span>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900">Dr. Anand K. (Ortho)</span>
                  <span className="font-bold text-emerald-700">₹4.2L (62 Scans)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900">Dr. Srinivas Rao (Cardio)</span>
                  <span className="font-bold text-emerald-700">₹3.8L (84 Labs)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900">Dr. Lakshmi N. (Spine)</span>
                  <span className="font-bold text-emerald-700">₹3.1L (41 MRIs)</span>
                </div>
              </div>
            </div>

            <div className="card p-4 border border-surface-200 shadow-xs bg-white">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Department Contribution</span>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Radiology (MRI/CT)</span>
                  <span className="font-bold text-slate-900">42% (₹76K today)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Biochemistry & Immuno</span>
                  <span className="font-bold text-slate-900">34% (₹62K today)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Histopathology</span>
                  <span className="font-bold text-slate-900">14% (₹25K today)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Home Collections</span>
                  <span className="font-bold text-slate-900">10% (₹19K today)</span>
                </div>
              </div>
            </div>

            <div className="card p-4 border border-surface-200 shadow-xs bg-white">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Operational SLA Adherence</span>
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex justify-between items-center">
                  <span>CAP / NABL Target</span>
                  <strong className="text-sm">96.4% Met</strong>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Zero critical error notifications in the last 30 operational days.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
