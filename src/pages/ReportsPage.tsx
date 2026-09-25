import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FileText, Search, Download, Eye, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ReportsPage() {
  const { data } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = [...data.reports];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => r.patientName.toLowerCase().includes(q) || r.reportId.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    return result;
  }, [data.reports, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    pending: data.reports.filter(r => r.status === 'Pending').length,
    generated: data.reports.filter(r => r.status === 'Generated').length,
    verified: data.reports.filter(r => r.status === 'Verified').length,
    sent: data.reports.filter(r => r.status === 'Sent' || r.status === 'Delivered').length,
    viewed: data.reports.filter(r => r.status === 'Viewed').length,
  }), [data.reports]);

  const statusColor: Record<string, string> = {
    'Pending': 'bg-surface-100 text-surface-600', 'Generated': 'bg-warning-50 text-warning-700',
    'Verified': 'bg-brand-50 text-brand-700', 'Sent': 'bg-info-50 text-info-700',
    'Delivered': 'bg-success-50 text-success-700', 'Viewed': 'bg-success-100 text-success-700',
  };

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Reports</h1>
          <p className="text-[13px] text-surface-500">{data.reports.length} total reports</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="metric-card"><p className="text-2xl font-bold">{stats.pending}</p><p className="text-[12px] text-surface-500">Pending</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-warning-600">{stats.generated}</p><p className="text-[12px] text-surface-500">Generated</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-brand-600">{stats.verified}</p><p className="text-[12px] text-surface-500">Verified</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-info-600">{stats.sent}</p><p className="text-[12px] text-surface-500">Sent/Delivered</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-success-600">{stats.viewed}</p><p className="text-[12px] text-surface-500">Viewed</p></div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input type="text" placeholder="Search reports..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px]">
          <option value="all">All Status</option>
          <option value="Pending">Pending</option><option value="Generated">Generated</option><option value="Verified">Verified</option><option value="Sent">Sent</option><option value="Delivered">Delivered</option><option value="Viewed">Viewed</option>
        </select>
      </div>

      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Report ID</th><th>Patient</th><th>Tests</th><th>Status</th><th>Verified By</th><th>Delivery</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(report => (
              <tr key={report.id}>
                <td><span className="font-mono text-[12px]">{report.reportId}</span></td>
                <td className="text-[13px]">{report.patientName}</td>
                <td className="text-[12px] max-w-[200px] truncate">{report.testNames.join(', ')}</td>
                <td><span className={`status-badge ${statusColor[report.status]}`}>{report.status}</span></td>
                <td className="text-[12px]">{report.verifiedBy || '—'}</td>
                <td className="text-[12px]">{report.deliveryMethod || '—'}</td>
                <td className="text-[12px] text-surface-500">{report.generatedAt ? new Date(report.generatedAt).toLocaleDateString('en-IN') : '—'}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-surface-400 hover:text-brand-600 rounded hover:bg-brand-50"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 text-surface-400 hover:text-brand-600 rounded hover:bg-brand-50"><Download className="w-3.5 h-3.5" /></button>
                    {report.status === 'Verified' && <button className="p-1.5 text-surface-400 hover:text-success-600 rounded hover:bg-success-50"><Send className="w-3.5 h-3.5" /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
