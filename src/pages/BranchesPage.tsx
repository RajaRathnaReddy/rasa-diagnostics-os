import { useAppStore } from '../store/useAppStore';
import { Building2, MapPin, Phone, Users, CheckCircle2, TrendingUp, IndianRupee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function BranchesPage() {
  const { data } = useAppStore();
  const branchStats = data.branches.map(b => ({
    ...b, patients: Math.floor(Math.random() * 1000 + 200),
    revenue: Math.floor(Math.random() * 800000 + 200000),
    orders: Math.floor(Math.random() * 500 + 100),
    staff: Math.floor(Math.random() * 20 + 5),
  }));

  return (
    <div className="fade-in space-y-5">
      <div><h1 className="text-xl font-bold text-surface-900">Branches</h1><p className="text-[13px] text-surface-500">{data.branches.length} branches</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branchStats.map(branch => (
          <div key={branch.id} className="bg-surface-0 border border-surface-200 rounded-xl p-5 hover:border-brand-300 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center"><Building2 className="w-5 h-5 text-brand-500" /></div>
                <div><p className="text-[13px] font-semibold text-surface-900">{branch.name}</p><p className="text-[11px] text-surface-400">{branch.code}</p></div>
              </div>
              <span className={`status-badge ${branch.isActive ? 'bg-success-50 text-success-700' : 'bg-surface-100 text-surface-500'}`}>{branch.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="space-y-2 text-[12px] text-surface-600 mb-4">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-surface-400" />{branch.address}, {branch.city}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-surface-400" />{branch.phone}</div>
              <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-surface-400" />Manager: {branch.manager}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surface-200">
              <div className="text-center"><p className="text-lg font-bold text-surface-900">{branch.patients}</p><p className="text-[10px] text-surface-400">Patients</p></div>
              <div className="text-center"><p className="text-lg font-bold text-surface-900">{branch.orders}</p><p className="text-[10px] text-surface-400">Orders</p></div>
              <div className="text-center"><p className="text-lg font-bold text-success-600">₹{(branch.revenue / 100000).toFixed(1)}L</p><p className="text-[10px] text-surface-400">Revenue</p></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Branch Revenue Comparison</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={branchStats.map(b => ({ name: b.code, revenue: b.revenue }))}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} formatter={(v: any) => [`₹${Number(v || 0).toLocaleString('en-IN')}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#3381ff" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
