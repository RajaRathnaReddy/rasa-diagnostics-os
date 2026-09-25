import { useAppStore } from '../store/useAppStore';
import { ShieldCheck, AlertTriangle, CheckCircle2, TrendingDown, Clock, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function QualityPage() {
  const rejectionData = [
    { week: 'W1', rate: 4.2 }, { week: 'W2', rate: 3.8 }, { week: 'W3', rate: 5.1 },
    { week: 'W4', rate: 4.5 }, { week: 'W5', rate: 3.2 }, { week: 'W6', rate: 2.9 }, { week: 'W7', rate: 3.5 },
  ];
  const tatData = [
    { dept: 'Hematology', avg: 1.8, target: 2 }, { dept: 'Biochemistry', avg: 2.5, target: 3 },
    { dept: 'Immunology', avg: 4.2, target: 4 }, { dept: 'Microbiology', avg: 48, target: 72 },
    { dept: 'Clinical Path', avg: 1.5, target: 2 },
  ];

  return (
    <div className="fade-in space-y-5">
      <div><h1 className="text-xl font-bold text-surface-900">Quality Management</h1><p className="text-[13px] text-surface-500">Quality command center & compliance</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-success-500" /><span className="text-[12px] text-surface-500">QC Pass Rate</span></div><p className="text-2xl font-bold text-success-600">98.2%</p></div>
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-warning-500" /><span className="text-[12px] text-surface-500">Sample Rejection</span></div><p className="text-2xl font-bold text-warning-600">3.5%</p></div>
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-brand-500" /><span className="text-[12px] text-surface-500">TAT Compliance</span></div><p className="text-2xl font-bold text-brand-600">94.7%</p></div>
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-success-500" /><span className="text-[12px] text-surface-500">Report Correction</span></div><p className="text-2xl font-bold">0.8%</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Sample Rejection Rate Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={rejectionData}>
              <defs><linearGradient id="rejGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={2} fill="url(#rejGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">TAT by Department (Hours)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tatData}>
              <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="avg" fill="#3381ff" radius={[4, 4, 0, 0]} barSize={24} name="Actual" />
              <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Recent Quality Events</h3>
        <div className="space-y-2">
          {[
            { type: 'success', text: 'Internal QC — Hematology: All controls within range', time: '2 hours ago' },
            { type: 'warning', text: 'Sample rejection rate at Kukatpally exceeded 5% threshold', time: '5 hours ago' },
            { type: 'success', text: 'External QC — Biochemistry: Proficiency test passed', time: '1 day ago' },
            { type: 'info', text: 'Siemens Advia 2400 calibration completed at Banjara Hills', time: '2 days ago' },
            { type: 'warning', text: 'TAT breach: 3 Thyroid Profile results exceeded 4-hour target', time: '2 days ago' },
          ].map((event, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-surface-100 last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${event.type === 'success' ? 'bg-success-500' : event.type === 'warning' ? 'bg-warning-500' : 'bg-info-500'}`} />
              <span className="text-[13px] text-surface-700 flex-1">{event.text}</span>
              <span className="text-[11px] text-surface-400 flex-shrink-0">{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
