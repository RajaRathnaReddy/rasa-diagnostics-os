import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Stethoscope, Search, Phone, Building2, TrendingUp, IndianRupee, Plus } from 'lucide-react';

export default function DoctorsPage() {
  const { data } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery) return data.doctors;
    const q = searchQuery.toLowerCase();
    return data.doctors.filter(d => d.fullName.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q));
  }, [data.doctors, searchQuery]);

  const totalReferrals = data.doctors.reduce((s, d) => s + d.totalReferrals, 0);
  const totalRevenue = data.doctors.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-surface-900">Doctors / Referrers</h1><p className="text-[13px] text-surface-500">{data.doctors.length} doctors</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700"><Plus className="w-4 h-4" />Add Doctor</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="metric-card"><p className="text-2xl font-bold">{data.doctors.length}</p><p className="text-[12px] text-surface-500">Total Doctors</p></div>
        <div className="metric-card"><p className="text-2xl font-bold">{data.doctors.filter(d => d.isActive).length}</p><p className="text-[12px] text-surface-500">Active</p></div>
        <div className="metric-card"><p className="text-2xl font-bold">{totalReferrals.toLocaleString()}</p><p className="text-[12px] text-surface-500">Total Referrals</p></div>
        <div className="metric-card"><p className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p><p className="text-[12px] text-surface-500">Total Revenue</p></div>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input type="text" placeholder="Search doctors..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
      </div>
      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Doctor</th><th>Specialization</th><th>Hospital</th><th>Contact</th><th>Referrals</th><th>Revenue</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(doc => (
              <tr key={doc.id}>
                <td>
                  <div><p className="text-[13px] font-medium text-surface-900">{doc.fullName}</p><p className="text-[11px] text-surface-400">{doc.qualification}</p></div>
                </td>
                <td className="text-[12px]">{doc.specialization}</td>
                <td><span className="flex items-center gap-1 text-[12px]"><Building2 className="w-3 h-3 text-surface-400" />{doc.hospital}</span></td>
                <td><span className="flex items-center gap-1 text-[12px]"><Phone className="w-3 h-3 text-surface-400" />{doc.phone}</span></td>
                <td className="text-[13px] font-medium">{doc.totalReferrals}</td>
                <td className="text-[12px] font-medium text-success-600">₹{doc.revenue.toLocaleString('en-IN')}</td>
                <td><span className={`status-badge ${doc.isActive ? 'bg-success-50 text-success-700' : 'bg-surface-100 text-surface-500'}`}>{doc.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
