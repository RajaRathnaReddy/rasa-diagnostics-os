import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Users, CalendarDays, TestTubes, FlaskConical, FileText, Scan,
  Home, AlertTriangle, Clock, TrendingUp, TrendingDown,
  Activity, CheckCircle2, XCircle, Timer, Truck,
  IndianRupee, ArrowUpRight, ArrowDownRight, AlertCircle, Package
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function MetricCard({ label, value, icon: Icon, trend, trendValue, color = 'brand', subtitle }: {
  label: string; value: string | number; icon: React.ElementType;
  trend?: 'up' | 'down'; trendValue?: string; color?: string; subtitle?: string;
}) {
  const colorMap: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
    info: 'bg-info-50 text-info-600',
  };

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.brand}`}>
          <Icon className="w-[18px] h-[18px]" />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[12px] font-medium ${trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-surface-900 tracking-tight">{value}</p>
      <p className="text-[12px] text-surface-500 mt-0.5">{label}</p>
      {subtitle && <p className="text-[11px] text-surface-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function PipelineStage({ label, count, color, isLast = false }: {
  label: string; count: number; color: string; isLast?: boolean;
}) {
  return (
    <>
      <div className="pipeline-stage">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${color}`}>
          {count}
        </div>
        <span className="text-[11px] text-surface-600 font-medium mt-1">{label}</span>
      </div>
      {!isLast && <div className="pipeline-connector" />}
    </>
  );
}

function AlertCard({ type, title, message, time }: {
  type: 'critical' | 'warning' | 'info'; title: string; message: string; time: string;
}) {
  const config = {
    critical: { icon: AlertTriangle, bg: 'bg-danger-50 border-danger-200', iconColor: 'text-danger-500', dot: 'bg-danger-500' },
    warning: { icon: AlertCircle, bg: 'bg-warning-50 border-warning-200', iconColor: 'text-warning-500', dot: 'bg-warning-500' },
    info: { icon: Activity, bg: 'bg-info-50 border-info-200', iconColor: 'text-info-500', dot: 'bg-info-500' },
  };
  const c = config[type];
  const Icon = c.icon;

  return (
    <div className={`flex gap-3 p-3 rounded-lg border ${c.bg}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white/70`}>
        <Icon className={`w-4 h-4 ${c.iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
          <p className="text-[13px] font-semibold text-surface-900">{title}</p>
        </div>
        <p className="text-[12px] text-surface-600 mt-0.5">{message}</p>
        <p className="text-[11px] text-surface-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, activeBranch } = useAppStore();

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

    // Revenue (last 7 days chart data)
    const revenueData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString('en-IN', { weekday: 'short' });
      return { day: dateStr, revenue: Math.floor(Math.random() * 200000 + 100000), patients: Math.floor(Math.random() * 80 + 40) };
    });

    // Department volume
    const deptCounts: Record<string, number> = {};
    data.labResults.forEach(r => {
      deptCounts[r.department] = (deptCounts[r.department] || 0) + 1;
    });
    const departmentData = Object.entries(deptCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    // Order pipeline
    const pipeline = {
      ordered: data.orders.filter(o => o.status === 'Booked' || o.status === 'Confirmed').length,
      collected: data.orders.filter(o => o.status === 'Collected').length,
      received: data.orders.filter(o => o.status === 'Received').length,
      processing: data.orders.filter(o => o.status === 'Processing').length,
      completed: data.orders.filter(o => o.status === 'Completed').length,
      verified: data.orders.filter(o => o.status === 'Verified').length,
      reported: data.orders.filter(o => o.status === 'Reported').length,
    };

    // Imaging pipeline
    const imgPipeline = {
      scheduled: data.imagingStudies.filter(s => s.status === 'Scheduled').length,
      checkedIn: data.imagingStudies.filter(s => s.status === 'Checked In').length,
      inProgress: data.imagingStudies.filter(s => s.status === 'In Progress').length,
      completed: data.imagingStudies.filter(s => s.status === 'Completed').length,
      reporting: data.imagingStudies.filter(s => s.status === 'Reporting').length,
      verified: data.imagingStudies.filter(s => s.status === 'Verified').length,
      published: data.imagingStudies.filter(s => s.status === 'Published').length,
    };

    const totalRevenue = data.invoices.reduce((s, i) => s + i.paid, 0);
    const totalOutstanding = data.invoices.reduce((s, i) => s + i.balance, 0);

    return {
      todayAppointments: todayAppointments.length,
      walkIns: Math.floor(todayAppointments.length * 0.3),
      checkedIn: todayAppointments.filter(a => a.status === 'Checked In').length,
      waiting: todayAppointments.filter(a => a.status === 'Checked In' || a.status === 'Confirmed').length,
      samplesCollected: data.samples.filter(s => s.status !== 'Pending').length,
      testsInProgress: data.labResults.filter(r => r.status === 'Entered' || r.status === 'Validated').length,
      pendingReports: pendingReports.length,
      verifiedReports: verifiedReports.length,
      deliveredReports: data.reports.filter(r => r.status === 'Delivered' || r.status === 'Viewed').length,
      homeCollections: todayHomeCollections.length,
      imagingStudies: todayImaging.length,
      criticalResults: criticalResults.length,
      rejectedSamples: rejectedSamples.length,
      pendingVerification: pendingVerification.length,
      lowStockItems: lowStockItems.length,
      revenueData,
      departmentData,
      pipeline,
      imgPipeline,
      totalRevenue,
      totalOutstanding,
    };
  }, [data]);

  const COLORS = ['#3381ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

  return (
    <div className="fade-in space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Command Center</h1>
          <p className="text-[13px] text-surface-500 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' • '}{activeBranch.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-success-50 text-success-700 border border-success-200 rounded-lg text-[12px] font-medium">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            System Operational
          </span>
        </div>
      </div>

      {/* Today's Operations */}
      <section>
        <h2 className="text-[13px] font-semibold text-surface-500 uppercase tracking-wider mb-3">Today's Operations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <MetricCard label="Appointments" value={stats.todayAppointments} icon={CalendarDays} trend="up" trendValue="12%" />
          <MetricCard label="Walk-ins" value={stats.walkIns} icon={Users} color="info" />
          <MetricCard label="Checked In" value={stats.checkedIn} icon={CheckCircle2} color="success" />
          <MetricCard label="Samples Collected" value={stats.samplesCollected} icon={TestTubes} color="brand" trend="up" trendValue="8%" />
          <MetricCard label="Reports Verified" value={stats.verifiedReports} icon={FileText} color="success" />
          <MetricCard label="Home Collections" value={stats.homeCollections} icon={Truck} color="info" />
        </div>
      </section>

      {/* Critical Attention */}
      {(stats.criticalResults > 0 || stats.rejectedSamples > 0 || stats.pendingVerification > 0 || stats.lowStockItems > 0) && (
        <section>
          <h2 className="text-[13px] font-semibold text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger-500" />
            Critical Attention
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.criticalResults > 0 && (
              <AlertCard type="critical" title={`${stats.criticalResults} Critical Results`} message="Require immediate acknowledgement and physician notification" time="Action Required" />
            )}
            {stats.pendingVerification > 0 && (
              <AlertCard type="warning" title={`${stats.pendingVerification} Pending Verification`} message="Lab results awaiting pathologist verification" time="Review Required" />
            )}
            {stats.rejectedSamples > 0 && (
              <AlertCard type="warning" title={`${stats.rejectedSamples} Rejected Samples`} message="Samples rejected and need recollection" time="Follow up required" />
            )}
            {stats.lowStockItems > 0 && (
              <AlertCard type="info" title={`${stats.lowStockItems} Low Stock Items`} message="Inventory items below minimum stock level" time="Reorder recommended" />
            )}
          </div>
        </section>
      )}

      {/* Lab & Imaging Pipelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lab Pipeline */}
        <section className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-brand-500" />
              Lab Operations Pipeline
            </h2>
            <span className="text-[12px] text-surface-500">{Object.values(stats.pipeline).reduce((a, b) => a + b, 0)} total orders</span>
          </div>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            <PipelineStage label="Ordered" count={stats.pipeline.ordered} color="bg-surface-400" />
            <PipelineStage label="Collected" count={stats.pipeline.collected} color="bg-brand-400" />
            <PipelineStage label="Received" count={stats.pipeline.received} color="bg-brand-500" />
            <PipelineStage label="Processing" count={stats.pipeline.processing} color="bg-warning-500" />
            <PipelineStage label="Completed" count={stats.pipeline.completed} color="bg-info-500" />
            <PipelineStage label="Verified" count={stats.pipeline.verified} color="bg-success-500" />
            <PipelineStage label="Reported" count={stats.pipeline.reported} color="bg-success-600" isLast />
          </div>
        </section>

        {/* Imaging Pipeline */}
        <section className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
              <Scan className="w-4 h-4 text-brand-500" />
              Imaging Operations Pipeline
            </h2>
            <span className="text-[12px] text-surface-500">{Object.values(stats.imgPipeline).reduce((a, b) => a + b, 0)} total studies</span>
          </div>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            <PipelineStage label="Scheduled" count={stats.imgPipeline.scheduled} color="bg-surface-400" />
            <PipelineStage label="Checked In" count={stats.imgPipeline.checkedIn} color="bg-brand-400" />
            <PipelineStage label="Scanning" count={stats.imgPipeline.inProgress} color="bg-warning-500" />
            <PipelineStage label="Completed" count={stats.imgPipeline.completed} color="bg-info-500" />
            <PipelineStage label="Reporting" count={stats.imgPipeline.reporting} color="bg-brand-600" />
            <PipelineStage label="Verified" count={stats.imgPipeline.verified} color="bg-success-500" />
            <PipelineStage label="Published" count={stats.imgPipeline.published} color="bg-success-600" isLast />
          </div>
        </section>
      </div>

      {/* Business Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <section className="lg:col-span-2 bg-surface-0 border border-surface-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success-500" />
              Revenue Trend (7 Days)
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-surface-900">₹{(stats.totalRevenue / 100000).toFixed(1)}L</span>
              <span className="text-[12px] text-success-600 font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />14.2%
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3381ff" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3381ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3381ff" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* Key Metrics */}
        <section className="space-y-3">
          <MetricCard label="Total Revenue" value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`} icon={IndianRupee} color="success" trend="up" trendValue="14%" />
          <MetricCard label="Outstanding" value={`₹${(stats.totalOutstanding / 1000).toFixed(0)}K`} icon={Clock} color="warning" />
          <MetricCard label="Avg. TAT" value="2.4 hrs" icon={Timer} color="brand" trend="down" trendValue="8%" subtitle="Below target of 3 hrs" />
        </section>
      </div>

      {/* Department Volume & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Volume */}
        <section className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-surface-900 mb-4">Department Test Volume</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.departmentData} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="value" fill="#3381ff" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Recent Orders */}
        <section className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-surface-900 mb-4">Recent Orders</h2>
          <div className="space-y-0">
            {data.orders.slice(0, 8).map(order => {
              const statusColor: Record<string, string> = {
                'Booked': 'bg-surface-100 text-surface-600',
                'Confirmed': 'bg-brand-50 text-brand-700',
                'Collected': 'bg-info-50 text-info-700',
                'Received': 'bg-info-100 text-info-700',
                'Processing': 'bg-warning-50 text-warning-700',
                'Completed': 'bg-success-50 text-success-700',
                'Verified': 'bg-success-100 text-success-700',
                'Reported': 'bg-success-50 text-success-700',
                'Cancelled': 'bg-danger-50 text-danger-700',
                'Draft': 'bg-surface-100 text-surface-500',
              };
              return (
                <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-surface-900">{order.orderId}</span>
                      {order.priority === 'Urgent' && (
                        <span className="text-[10px] font-bold text-danger-600 bg-danger-50 px-1.5 py-0.5 rounded">URGENT</span>
                      )}
                      {order.priority === 'STAT' && (
                        <span className="text-[10px] font-bold text-white bg-danger-500 px-1.5 py-0.5 rounded">STAT</span>
                      )}
                    </div>
                    <p className="text-[12px] text-surface-500 truncate">{order.patientName} • {order.testNames[0]}{order.testNames.length > 1 ? ` +${order.testNames.length - 1}` : ''}</p>
                  </div>
                  <span className={`status-badge ${statusColor[order.status] || 'bg-surface-100 text-surface-600'}`}>
                    {order.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
