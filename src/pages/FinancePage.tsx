import { useAppStore } from '../store/useAppStore';
import { Wallet, IndianRupee, TrendingUp, Clock, CheckCircle2, ArrowUpRight, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function FinancePage() {
  const { data } = useAppStore();
  const totals = {
    revenue: data.invoices.reduce((s, i) => s + i.paid, 0),
    outstanding: data.invoices.reduce((s, i) => s + i.balance, 0),
    discounts: data.invoices.reduce((s, i) => s + i.discount, 0),
    tax: data.invoices.reduce((s, i) => s + i.tax, 0),
  };

  const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { day: d.toLocaleDateString('en-IN', { weekday: 'short' }), revenue: Math.floor(Math.random() * 200000 + 80000), collection: Math.floor(Math.random() * 180000 + 70000) };
  });

  const deptRevenue = [
    { dept: 'Biochemistry', revenue: 320000 }, { dept: 'Hematology', revenue: 180000 },
    { dept: 'Immunology', revenue: 250000 }, { dept: 'Radiology', revenue: 450000 },
    { dept: 'Pathology', revenue: 120000 }, { dept: 'Microbiology', revenue: 85000 },
  ];

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-surface-900">Finance</h1><p className="text-[13px] text-surface-500">Financial overview & reporting</p></div>
        <button className="flex items-center gap-2 px-3 py-2 border border-surface-200 rounded-lg text-[13px] text-surface-600 hover:bg-surface-50"><Download className="w-4 h-4" />Export Report</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><IndianRupee className="w-4 h-4 text-success-500" /><span className="text-[12px] text-surface-500">Total Revenue</span></div><p className="text-2xl font-bold text-success-600">₹{(totals.revenue / 100000).toFixed(1)}L</p></div>
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-warning-500" /><span className="text-[12px] text-surface-500">Outstanding</span></div><p className="text-2xl font-bold text-warning-600">₹{(totals.outstanding / 1000).toFixed(0)}K</p></div>
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-brand-500" /><span className="text-[12px] text-surface-500">Discounts Given</span></div><p className="text-2xl font-bold">₹{(totals.discounts / 1000).toFixed(0)}K</p></div>
        <div className="metric-card"><div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-info-500" /><span className="text-[12px] text-surface-500">Tax Collected</span></div><p className="text-2xl font-bold">₹{(totals.tax / 1000).toFixed(0)}K</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Daily Revenue vs Collection</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyRevenue}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} formatter={(v: any) => [`₹${Number(v || 0).toLocaleString('en-IN')}`]} />
              <Bar dataKey="revenue" fill="#3381ff" radius={[4, 4, 0, 0]} barSize={16} name="Revenue" />
              <Bar dataKey="collection" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} name="Collection" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Revenue by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptRevenue} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} formatter={(v: any) => [`₹${Number(v || 0).toLocaleString('en-IN')}`]} />
              <Bar dataKey="revenue" fill="#3381ff" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
