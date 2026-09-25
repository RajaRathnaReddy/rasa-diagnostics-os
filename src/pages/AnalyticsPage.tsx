import { useAppStore } from '../store/useAppStore';
import { BarChart3, TrendingUp, Users, TestTubes, IndianRupee, Scan, Building2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

export default function AnalyticsPage() {
  const { data } = useAppStore();
  const COLORS = ['#3381ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  const patientTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    newPatients: Math.floor(Math.random() * 200 + 100),
    returning: Math.floor(Math.random() * 300 + 200),
  }));

  const revenueTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: Math.floor(Math.random() * 500000 + 300000),
  }));

  const modalityData = [
    { name: 'X-Ray', value: 35 }, { name: 'CT', value: 20 }, { name: 'MRI', value: 15 },
    { name: 'Ultrasound', value: 18 }, { name: 'ECG', value: 8 }, { name: 'Other', value: 4 },
  ];

  const branchData = data.branches.map(b => ({
    name: b.code, revenue: Math.floor(Math.random() * 800000 + 200000),
    patients: Math.floor(Math.random() * 500 + 100), tests: Math.floor(Math.random() * 2000 + 500),
  }));

  return (
    <div className="fade-in space-y-5">
      <div><h1 className="text-xl font-bold text-surface-900">Analytics</h1><p className="text-[13px] text-surface-500">Business intelligence & operational insights</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-brand-500" /><span className="text-[12px] text-surface-500">Total Patients</span></div><p className="text-2xl font-bold">{data.patients.length}</p></div>
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><TestTubes className="w-4 h-4 text-info-500" /><span className="text-[12px] text-surface-500">Total Tests</span></div><p className="text-2xl font-bold">{data.labResults.length}</p></div>
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><Scan className="w-4 h-4 text-brand-500" /><span className="text-[12px] text-surface-500">Imaging Studies</span></div><p className="text-2xl font-bold">{data.imagingStudies.length}</p></div>
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><IndianRupee className="w-4 h-4 text-success-500" /><span className="text-[12px] text-surface-500">Revenue</span></div><p className="text-2xl font-bold">₹{(data.invoices.reduce((s, i) => s + i.paid, 0) / 100000).toFixed(1)}L</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Patient Volume Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={patientTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="newPatients" fill="#3381ff" radius={[4, 4, 0, 0]} barSize={12} name="New" />
              <Bar dataKey="returning" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} name="Returning" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueTrend}>
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} formatter={(v: any) => [`₹${Number(v || 0).toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Modality Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={modalityData} cx="50%" cy="50%" outerRadius={90} innerRadius={55} dataKey="value" paddingAngle={2}>
                {modalityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Branch Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={branchData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} formatter={(v: any) => [`₹${Number(v || 0).toLocaleString('en-IN')}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#3381ff" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
