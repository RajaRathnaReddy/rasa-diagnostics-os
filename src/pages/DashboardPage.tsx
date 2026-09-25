import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  Users, CalendarDays, TestTubes, FlaskConical, FileText, Scan,
  Home, AlertTriangle, Clock, TrendingUp, TrendingDown,
  Activity, CheckCircle2, XCircle, Timer, Truck,
  IndianRupee, ArrowUpRight, ArrowDownRight, AlertCircle, Package,
  Eye, Check, ChevronRight, ShieldAlert, Zap, Layers, RefreshCw,
  Filter, Stethoscope, Microscope, Building2, UserCheck, PhoneCall
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { cn } from '../lib/cn';

export default function DashboardPage() {
  const { data, activeBranch, openQuickView, dashboardRole, setDashboardRole, setQuickCreateOpen } = useAppStore();
  const navigate = useNavigate();

  // Sub-filters
  const [imagingModalityFilter, setImagingModalityFilter] = useState<'All' | 'MRI' | 'CT' | 'USG' | 'X-Ray'>('All');
  const [deptMetric, setDeptMetric] = useState<'volume' | 'revenue' | 'tat' | 'sla'>('volume');

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

    // Department breakdown
    const deptRevenueBreakdown = [
      { name: 'Radiology', value: 490000, color: '#3381ff' },
      { name: 'Biochemistry', value: 385000, color: '#10b981' },
      { name: 'Immunology', value: 295000, color: '#f59e0b' },
      { name: 'Hematology', value: 242000, color: '#8b5cf6' },
      { name: 'Pathology', value: 210000, color: '#ec4899' },
      { name: 'Home Packages', value: 140000, color: '#06b6d4' },
    ];

    // Pipeline
    const pipeline = {
      ordered: { count: data.orders.filter(o => o.status === 'Booked' || o.status === 'Confirmed').length, atRisk: 1 },
      collected: { count: data.orders.filter(o => o.status === 'Collected').length, atRisk: 2 },
      received: { count: data.orders.filter(o => o.status === 'Received').length, atRisk: 0 },
      processing: { count: data.orders.filter(o => o.status === 'Processing').length, atRisk: 3 },
      completed: { count: data.orders.filter(o => o.status === 'Completed').length, atRisk: 0 },
      verified: { count: data.orders.filter(o => o.status === 'Verified').length, atRisk: 1 },
      reported: { count: data.orders.filter(o => o.status === 'Reported').length, atRisk: 0 },
    };

    // Imaging Pipeline
    const imgPipeline = {
      scheduled: data.imagingStudies.filter(s => s.status === 'Scheduled').length,
      checkedIn: data.imagingStudies.filter(s => s.status === 'Checked In').length,
      scanning: data.imagingStudies.filter(s => s.status === 'In Progress').length,
      completed: data.imagingStudies.filter(s => s.status === 'Completed').length,
      reporting: data.imagingStudies.filter(s => s.status === 'Reporting').length,
      verified: data.imagingStudies.filter(s => s.status === 'Verified').length,
      published: data.imagingStudies.filter(s => s.status === 'Published').length,
    };

    const totalRevenue = data.invoices.reduce((s, i) => s + i.paid, 0);
    const totalOutstanding = data.invoices.reduce((s, i) => s + i.balance, 0);

    return {
      todayAppointments: todayAppointments.length || 57,
      walkIns: 28,
      checkedIn: todayAppointments.filter(a => a.status === 'Checked In').length || 34,
      samplesCollected: data.samples.filter(s => s.status !== 'Pending').length || 89,
      verifiedReports: verifiedReports.length || 64,
      homeCollections: todayHomeCollections.length || 16,
      pendingReports: pendingReports.length || 12,
      criticalResults: criticalResults.length || 3,
      rejectedSamples: rejectedSamples.length || 5,
      lowStockItems: lowStockItems.length || 3,
      revenueData,
      departmentMetrics,
      deptRevenueBreakdown,
      pipeline,
      imgPipeline,
      totalRevenue: totalRevenue || 182000,
      totalOutstanding: totalOutstanding || 32000,
    };
  }, [data]);

  // Action Queue Items (Section 4)
  const actionQueueItems = [
    {
      id: 'act-1',
      title: '12 reports need verification',
      category: 'Verification',
      urgency: 'High',
      department: 'Central Pathology & Lab',
      impact: 'Prevent clinical reporting TAT breach and patient discharge delays',
      actionPath: '/reports',
      actionLabel: 'Verify Batch',
      badge: '12 Pending',
      color: 'border-l-brand-600 bg-brand-50/40 text-brand-900',
    },
    {
      id: 'act-2',
      title: '5 samples require recollection',
      category: 'Specimens',
      urgency: 'Critical',
      department: 'Phlebotomy / Central Accession',
      impact: 'Hemolyzed or clotted tubes; patients awaiting follow-up call',
      actionPath: '/samples',
      actionLabel: 'Recollection Queue',
      badge: '5 Rejected',
      color: 'border-l-rose-500 bg-rose-50/40 text-rose-900',
    },
    {
      id: 'act-3',
      title: '3 critical results awaiting acknowledgement',
      category: 'Panic Alerts',
      urgency: 'STAT',
      department: 'Critical Care / Biochemistry',
      impact: 'Potentially life-threatening lab/imaging abnormality requires physician contact log',
      actionPath: '/laboratory',
      actionLabel: 'Call Doctor / Log',
      badge: '3 Critical',
      color: 'border-l-danger-600 bg-danger-50/50 text-danger-950',
    },
    {
      id: 'act-4',
      title: '4 home collections delayed',
      category: 'Logistics',
      urgency: 'Medium',
      department: 'Home Collection Dispatch',
      impact: 'Phlebotomists delayed in LB Nagar & Hitec City routes due to traffic',
      actionPath: '/home-collection',
      actionLabel: 'Reroute Fleet',
      badge: '4 Delayed',
      color: 'border-l-amber-500 bg-amber-50/40 text-amber-900',
    },
    {
      id: 'act-5',
      title: '8 reports approaching TAT breach',
      category: 'SLA Watch',
      urgency: 'Medium',
      department: 'Histopathology & MRI',
      impact: '<45 minutes left before SLA guaranteed turnaround is exceeded',
      actionPath: '/reports',
      actionLabel: 'Expedite',
      badge: '< 45 min',
      color: 'border-l-warning-500 bg-warning-50/40 text-warning-900',
    },
    {
      id: 'act-6',
      title: '3 inventory items below minimum stock',
      category: 'Supplies',
      urgency: 'Low',
      department: 'Central Store',
      impact: 'Fluoride tubes and CBC reagent packs running low at Madhapur',
      actionPath: '/inventory',
      actionLabel: 'Generate PO',
      badge: '3 Items Low',
      color: 'border-l-cyan-600 bg-cyan-50/40 text-cyan-900',
    },
    {
      id: 'act-7',
      title: '2 equipment maintenance tasks due',
      category: 'Biomedical',
      urgency: 'Medium',
      department: 'Siemens Advia & Fujifilm X-Ray',
      impact: 'Quarterly calibration cycle verification needed',
      actionPath: '/quality',
      actionLabel: 'Schedule Tech',
      badge: 'Due Today',
      color: 'border-l-indigo-500 bg-indigo-50/40 text-indigo-900',
    },
  ];

  // Live Queues (Section 7)
  const liveQueues = [
    { name: 'Reception', waiting: 4, avgWait: '14 min', status: 'optimal' },
    { name: 'Blood Collection', waiting: 7, avgWait: '8 min', status: 'optimal' },
    { name: 'MRI (Philips 3T)', waiting: 3, avgWait: '25 min', status: 'attention' },
    { name: 'CT (GE Revolution)', waiting: 2, avgWait: '12 min', status: 'optimal' },
    { name: 'Ultrasound (USG)', waiting: 5, avgWait: '18 min', status: 'attention' },
    { name: 'Digital X-Ray', waiting: 2, avgWait: '6 min', status: 'optimal' },
    { name: 'Report Verification', waiting: 8, avgWait: '20 min', status: 'optimal' },
  ];

  // Role Tab Filter options
  const roleFilters = [
    { id: 'all', label: 'All Operations (Executive)' },
    { id: 'receptionist', label: 'Receptionist' },
    { id: 'lab_supervisor', label: 'Lab Supervisor' },
    { id: 'pathologist', label: 'Pathologist' },
    { id: 'radiologist', label: 'Radiologist' },
    { id: 'home_collection', label: 'Home Collection' },
    { id: 'management', label: 'Management' },
  ];

  return (
    <div className="fade-in space-y-6 select-none max-w-7xl mx-auto">
      {/* ── Command Center Header & Role Switcher ── */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-surface-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-surface-900 tracking-tight">Command Center</h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Ops
              </span>
            </div>
            <p className="text-[12px] text-surface-500 mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              {' • '}<span className="font-semibold text-surface-700">{activeBranch.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setQuickCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Speed Dial / Quick Action</span>
            </button>
            <button
              onClick={() => navigate('/reception')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-50 text-surface-700 border border-surface-200 rounded-lg text-xs font-semibold hover:bg-surface-100 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>Token Desk</span>
            </button>
          </div>
        </div>

        {/* Role-Based Dashboard View Tabs (Section 17) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mr-1 shrink-0">
            View Role:
          </span>
          {roleFilters.map((rf) => (
            <button
              key={rf.id}
              onClick={() => setDashboardRole(rf.id as any)}
              className={cn(
                'px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer',
                dashboardRole === rf.id
                  ? 'bg-brand-600 text-white font-bold shadow-xs'
                  : 'bg-surface-50 text-surface-600 hover:bg-surface-100 hover:text-surface-900 border border-surface-200/60'
              )}
            >
              {rf.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. PRIMARY ACTION QUEUE (Section 4) ── */}
      <section className="bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-danger-50 text-danger-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-surface-900">Immediate Action Queue</h2>
              <p className="text-[11px] text-surface-500">Items requiring staff attention to prevent delays or breaches</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full">
            {actionQueueItems.length} Open Actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {actionQueueItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openQuickView('action_item', item)}
              className={cn(
                'p-3 rounded-lg border border-surface-200 border-l-4 transition-all hover:shadow-xs cursor-pointer group flex flex-col justify-between',
                item.color
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/80 border border-surface-200/50">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/90 shadow-2xs">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bold text-[13px] leading-snug group-hover:text-brand-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] opacity-80 mt-1 line-clamp-1">{item.impact}</p>
              </div>

              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-surface-200/50 text-[11px]">
                <span className="text-surface-600 font-medium">{item.department}</span>
                <span className="font-bold text-brand-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <span>{item.actionLabel}</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. TODAY'S OPERATIONS KPI ROW (Section 5) ── */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider">
            Today's Operational Pulse
          </h2>
          <span className="text-[11px] text-surface-500 font-medium">Auto-synced with branch floor</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Appointments */}
          <div
            onClick={() => navigate('/appointments')}
            className="p-3 bg-surface-0 border border-surface-200 rounded-xl hover:border-brand-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between text-surface-500 text-xs mb-1">
              <span>Appointments</span>
              <CalendarDays className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-2xl font-bold text-surface-900 tracking-tight">{stats.todayAppointments}</div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 12%
              </span>
              <span className="text-surface-400 text-[10px]">vs yesterday</span>
            </div>
          </div>

          {/* 2. Walk-ins */}
          <div
            onClick={() => navigate('/reception')}
            className="p-3 bg-surface-0 border border-surface-200 rounded-xl hover:border-brand-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between text-surface-500 text-xs mb-1">
              <span>Walk-ins</span>
              <Users className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-bold text-surface-900 tracking-tight">{stats.walkIns}</div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 5%
              </span>
              <span className="text-surface-400 text-[10px]">active tokens</span>
            </div>
          </div>

          {/* 3. Checked In */}
          <div
            onClick={() => navigate('/reception')}
            className="p-3 bg-surface-0 border border-surface-200 rounded-xl hover:border-brand-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between text-surface-500 text-xs mb-1">
              <span>Checked In</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-surface-900 tracking-tight">{stats.checkedIn}</div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-surface-600 font-medium">In waiting</span>
              <span className="text-surface-400 text-[10px]">avg 14m</span>
            </div>
          </div>

          {/* 4. Samples Collected */}
          <div
            onClick={() => navigate('/samples')}
            className="p-3 bg-surface-0 border border-surface-200 rounded-xl hover:border-brand-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between text-surface-500 text-xs mb-1">
              <span>Samples Collected</span>
              <TestTubes className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-surface-900 tracking-tight">{stats.samplesCollected}</div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 8%
              </span>
              <span className="text-surface-400 text-[10px]">barcoded</span>
            </div>
          </div>

          {/* 5. Reports Verified */}
          <div
            onClick={() => navigate('/reports')}
            className="p-3 bg-surface-0 border border-surface-200 rounded-xl hover:border-brand-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between text-surface-500 text-xs mb-1">
              <span>Reports Verified</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-surface-900 tracking-tight">{stats.verifiedReports}</div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-emerald-600 font-semibold">94% on-time</span>
              <span className="text-surface-400 text-[10px]">path sign-off</span>
            </div>
          </div>

          {/* 6. Home Collections */}
          <div
            onClick={() => navigate('/home-collection')}
            className="p-3 bg-surface-0 border border-surface-200 rounded-xl hover:border-brand-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between text-surface-500 text-xs mb-1">
              <span>Home Collections</span>
              <Truck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-surface-900 tracking-tight">{stats.homeCollections}</div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-brand-600 font-medium">4 in transit</span>
              <span className="text-surface-400 text-[10px]">fleet active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CRITICAL ATTENTION & 7. LIVE OPERATIONS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Critical Attention (5 Cols) */}
        <section className="lg:col-span-5 bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-surface-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-danger-500" />
                <span>Critical Clinical Attention</span>
              </h2>
              <span className="text-[11px] font-bold text-danger-600 bg-danger-50 px-2 py-0.5 rounded-full">
                Requires Sign-off
              </span>
            </div>

            <div className="space-y-3">
              {/* Critical Alert 1: Critical Results */}
              <div className="p-3 bg-danger-50/60 border border-danger-200 rounded-lg text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-danger-950 text-[13px]">10 Critical Biological Results</h3>
                    <p className="text-danger-800 text-[11px] mt-0.5">
                      3 Awaiting Acknowledgement • 4 Doctor Notification Pending • 3 Resolved
                    </p>
                  </div>
                  <span className="px-1.5 py-0.5 bg-danger-600 text-white rounded font-bold text-[10px]">
                    STAT
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-danger-700 font-medium">Suresh K. (Creatinine 6.8 mg/dL)</span>
                  <button
                    onClick={() => navigate('/laboratory')}
                    className="px-2.5 py-1 bg-white text-danger-700 border border-danger-300 rounded font-bold hover:bg-danger-100 transition-colors cursor-pointer"
                  >
                    View Critical Results
                  </button>
                </div>
              </div>

              {/* Critical Alert 2: Rejected Samples */}
              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-rose-950 text-[13px]">25 Rejected Blood / Specimen Samples</h3>
                    <p className="text-rose-800 text-[11px] mt-0.5">
                      18 Awaiting Recollection • 7 Processing / Hemolysis Issues
                    </p>
                  </div>
                  <span className="px-1.5 py-0.5 bg-rose-600 text-white rounded font-bold text-[10px]">
                    Action
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-rose-700 font-medium">Dispatch phlebotomists for recollect</span>
                  <button
                    onClick={() => navigate('/samples')}
                    className="px-2.5 py-1 bg-white text-rose-700 border border-rose-300 rounded font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    View Recollection Queue
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-surface-100 flex items-center justify-between text-[11px] text-surface-500">
            <span>Mandatory CAP / NABL notification compliance</span>
            <span className="text-brand-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/quality')}>
              Audit Log →
            </span>
          </div>
        </section>

        {/* 7. Live Operations Real-Time Queues (7 Cols) */}
        <section className="lg:col-span-7 bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold text-surface-900">Live Modality & Department Queues</h2>
            </div>
            <span className="text-[11px] text-surface-500 font-medium">Live Floor Monitor</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {liveQueues.map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-surface-50 rounded-lg border border-surface-200/80 hover:border-brand-200 transition-colors"
              >
                <div className="text-[11px] font-semibold text-surface-600 truncate">{q.name}</div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-bold text-surface-900">{q.waiting}</span>
                  <span className="text-[10px] text-surface-500">waiting</span>
                </div>
                <div className="text-[10px] text-surface-400 mt-1 flex items-center justify-between">
                  <span>Avg: {q.avgWait}</span>
                  <span className={cn('w-1.5 h-1.5 rounded-full', q.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500')} />
                </div>
              </div>
            ))}

            {/* Quick Floor Dispatch Button */}
            <div
              onClick={() => navigate('/reception')}
              className="p-3 bg-brand-50/50 rounded-lg border border-brand-200/60 hover:bg-brand-50 flex flex-col justify-center items-center text-center cursor-pointer transition-colors"
            >
              <Users className="w-4 h-4 text-brand-600 mb-1" />
              <span className="text-xs font-bold text-brand-700">Open Token Desk</span>
              <span className="text-[10px] text-brand-500">Call Next Patient</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── 8. LAB PIPELINE & 9. IMAGING PIPELINE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 8. Lab Pipeline */}
        <section className="bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-surface-900 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-brand-600" />
                <span>Laboratory Operations Pipeline</span>
              </h2>
              <p className="text-[11px] text-surface-500">Click any stage to filter central accession queue</p>
            </div>
            <span className="text-xs font-semibold text-surface-500">
              {Object.values(stats.pipeline).reduce((a, b) => a + b.count, 0)} total specimens
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 bg-surface-50 p-2 rounded-xl border border-surface-100 text-center">
            {Object.entries(stats.pipeline).map(([key, val]) => (
              <div
                key={key}
                onClick={() => navigate('/samples')}
                className="p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-surface-500 capitalize">
                  {key}
                </div>
                <div className="text-lg font-bold text-surface-900 mt-0.5 group-hover:text-brand-600 transition-colors">
                  {val.count}
                </div>
                {val.atRisk > 0 ? (
                  <span className="text-[9px] font-bold text-danger-600 bg-danger-50 px-1 rounded block mt-0.5">
                    {val.atRisk} At Risk
                  </span>
                ) : (
                  <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">SLA OK</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 9. Imaging Pipeline */}
        <section className="bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-sm font-bold text-surface-900 flex items-center gap-1.5">
                <Scan className="w-4 h-4 text-brand-600" />
                <span>Imaging Operations Pipeline (RIS / PACS)</span>
              </h2>
              <p className="text-[11px] text-surface-500">Cross-modality workflow status and reporting backlog</p>
            </div>

            {/* Modality Filter */}
            <div className="flex items-center gap-1 text-[11px]">
              {(['All', 'MRI', 'CT', 'USG', 'X-Ray'] as const).map(mod => (
                <button
                  key={mod}
                  onClick={() => setImagingModalityFilter(mod)}
                  className={cn(
                    'px-2 py-0.5 rounded font-medium transition-colors cursor-pointer',
                    imagingModalityFilter === mod
                      ? 'bg-brand-600 text-white font-bold'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  )}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 bg-surface-50 p-2 rounded-xl border border-surface-100 text-center">
            {Object.entries(stats.imgPipeline).map(([key, count]) => (
              <div
                key={key}
                onClick={() => navigate('/radiology')}
                className="p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-surface-500 capitalize">
                  {key}
                </div>
                <div className="text-lg font-bold text-surface-900 mt-0.5 group-hover:text-brand-600 transition-colors">
                  {count}
                </div>
                <span className="text-[9px] text-surface-400 block mt-0.5">Studies</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── 10. TAT INTELLIGENCE & 11. REVENUE COMPACT SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 10. TAT Intelligence (5 Cols) */}
        <section className="lg:col-span-5 bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-surface-900 flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-brand-600" />
              <span>Turnaround Time (TAT) Intelligence</span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" /> 8% Faster
            </span>
          </div>

          {/* Average TAT Big Number */}
          <div className="flex items-baseline gap-3 pb-3 border-b border-surface-100">
            <div>
              <span className="text-3xl font-extrabold text-surface-900 tracking-tight">2.4 hrs</span>
              <span className="text-xs text-surface-500 ml-1.5">Average Diagnostic TAT</span>
            </div>
          </div>

          {/* SLA Distribution */}
          <div className="grid grid-cols-3 gap-2 py-3 text-center text-xs">
            <div className="p-2 bg-emerald-50/60 border border-emerald-200/60 rounded-lg">
              <span className="text-[10px] text-emerald-700 font-semibold block">Within SLA</span>
              <span className="text-lg font-bold text-emerald-800">92%</span>
            </div>
            <div className="p-2 bg-amber-50/60 border border-amber-200/60 rounded-lg">
              <span className="text-[10px] text-amber-700 font-semibold block">At Risk</span>
              <span className="text-lg font-bold text-amber-800">5%</span>
            </div>
            <div className="p-2 bg-rose-50/60 border border-rose-200/60 rounded-lg">
              <span className="text-[10px] text-rose-700 font-semibold block">Breached</span>
              <span className="text-lg font-bold text-rose-800">3%</span>
            </div>
          </div>

          {/* Top Delayed Departments */}
          <div className="pt-2 border-t border-surface-100">
            <span className="text-[11px] font-bold text-surface-400 uppercase tracking-wider block mb-2">
              Top Departments by TAT
            </span>
            <div className="space-y-1.5 text-xs">
              <div
                onClick={() => navigate('/pathology')}
                className="flex items-center justify-between p-2 rounded hover:bg-surface-50 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-surface-800">1. Histopathology & Biopsy</span>
                <span className="font-bold text-amber-700">3.8 hrs (Complex stain)</span>
              </div>
              <div
                onClick={() => navigate('/radiology')}
                className="flex items-center justify-between p-2 rounded hover:bg-surface-50 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-surface-800">2. MRI Multi-Sequence Brain</span>
                <span className="font-bold text-surface-700">2.8 hrs</span>
              </div>
              <div
                onClick={() => navigate('/laboratory')}
                className="flex items-center justify-between p-2 rounded hover:bg-surface-50 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-surface-800">3. Special Immunology / Hormones</span>
                <span className="font-bold text-surface-700">2.2 hrs</span>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Compact Revenue & Financial Overview (7 Cols) */}
        <section className="lg:col-span-7 bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-surface-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Revenue & Financial Performance</span>
                </h2>
                <p className="text-[11px] text-surface-500">7-day collection run rate vs outstanding balances</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-surface-900">₹{(stats.totalRevenue / 100000).toFixed(2)}L</span>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> 14.2%
                </span>
              </div>
            </div>

            {/* Financial Breakdown Cards */}
            <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
              <div className="p-2 bg-surface-50 rounded-lg border border-surface-100">
                <span className="text-surface-400 block text-[10px]">Total Invoiced</span>
                <span className="font-bold text-surface-900">₹2.14L</span>
              </div>
              <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <span className="text-emerald-700 block text-[10px]">Collected</span>
                <span className="font-bold text-emerald-800">₹1.82L</span>
              </div>
              <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-100">
                <span className="text-amber-700 block text-[10px]">Outstanding</span>
                <span className="font-bold text-amber-800">₹32K</span>
              </div>
              <div className="p-2 bg-rose-50/50 rounded-lg border border-rose-100">
                <span className="text-rose-700 block text-[10px]">Refunds / Disc</span>
                <span className="font-bold text-rose-800">₹3.5K</span>
              </div>
            </div>

            {/* Compact Revenue Trend Chart */}
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

          <div className="pt-2 border-t border-surface-100 flex items-center justify-between text-[11px] text-surface-500">
            <span>Segments: Lab (52%) • Radiology (31%) • Pathology (11%) • Home Visits (6%)</span>
            <button onClick={() => navigate('/finance')} className="text-brand-600 font-semibold hover:underline">
              Detailed Ledger →
            </button>
          </div>
        </section>
      </div>

      {/* ── 12. DEPARTMENT PERFORMANCE & 13. RECENT ORDERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 12. Department Analytics (6 Cols) */}
        <section className="lg:col-span-6 bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-sm font-bold text-surface-900">Department Performance</h2>
              <p className="text-[11px] text-surface-500">Cross-department workload and operational efficiency</p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1 text-[11px]">
              {(['volume', 'revenue', 'tat', 'sla'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setDeptMetric(m)}
                  className={cn(
                    'px-2 py-0.5 rounded font-medium uppercase tracking-wider text-[10px] transition-colors cursor-pointer',
                    deptMetric === m
                      ? 'bg-brand-600 text-white font-bold'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.departmentMetrics}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => [
                    deptMetric === 'revenue' ? `₹${Number(val).toLocaleString('en-IN')}` :
                    deptMetric === 'tat' ? `${val} hrs` :
                    deptMetric === 'sla' ? `${val}%` : `${val} tests`,
                    deptMetric.toUpperCase()
                  ]}
                />
                <Bar
                  dataKey={deptMetric}
                  fill={deptMetric === 'revenue' ? '#10b981' : deptMetric === 'sla' ? '#8b5cf6' : '#3381ff'}
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 13. Recent Orders Quick Queue (6 Cols) */}
        <section className="lg:col-span-6 bg-surface-0 border border-surface-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-surface-900">Recent Diagnostic Orders</h2>
                <p className="text-[11px] text-surface-500">Live order arrivals and barcode dispatch</p>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className="text-xs text-brand-600 font-semibold hover:underline"
              >
                View All ({data.orders.length}) →
              </button>
            </div>

            <div className="space-y-1.5">
              {data.orders.slice(0, 6).map((order) => {
                const statusBadge: Record<string, string> = {
                  Booked: 'bg-surface-100 text-surface-600',
                  Confirmed: 'bg-brand-50 text-brand-700',
                  Collected: 'bg-info-50 text-info-700',
                  Processing: 'bg-warning-50 text-warning-800',
                  Completed: 'bg-success-50 text-success-700',
                  Verified: 'bg-success-100 text-success-800',
                };

                return (
                  <div
                    key={order.id}
                    onClick={() => openQuickView('order', order)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-50 transition-colors cursor-pointer border border-transparent hover:border-surface-200 text-xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-surface-900 shrink-0">
                        {order.orderId}
                      </span>
                      {order.priority === 'STAT' && (
                        <span className="px-1.5 py-0.2 bg-danger-500 text-white rounded text-[9px] font-bold">
                          STAT
                        </span>
                      )}
                      <div className="truncate">
                        <span className="font-semibold text-surface-800">{order.patientName}</span>
                        <span className="text-surface-400 ml-1 truncate">
                          • {order.testNames[0]}
                          {order.testNames.length > 1 && ` +${order.testNames.length - 1}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', statusBadge[order.status] || 'bg-surface-100 text-surface-600')}>
                        {order.status}
                      </span>
                      <Eye className="w-3.5 h-3.5 text-surface-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-surface-100 flex items-center justify-between text-[11px] text-surface-400">
            <span>Click any order to open the Quick Inspector Drawer</span>
            <button onClick={() => setQuickCreateOpen(true)} className="text-brand-600 font-bold hover:underline">
              + New Order
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
