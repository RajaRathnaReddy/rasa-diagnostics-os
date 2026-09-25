import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TestTubes, Search, Filter, Barcode, CheckCircle2, XCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export default function SamplesPage() {
  const { data } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = [...data.samples];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.patientName.toLowerCase().includes(q) || s.sampleId.toLowerCase().includes(q) || s.barcode.includes(q));
    }
    if (statusFilter !== 'all') result = result.filter(s => s.status === statusFilter);
    return result;
  }, [data.samples, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => ({
    pending: data.samples.filter(s => s.status === 'Pending').length,
    collected: data.samples.filter(s => s.status === 'Collected').length,
    received: data.samples.filter(s => s.status === 'Received').length,
    processing: data.samples.filter(s => s.status === 'Processing').length,
    completed: data.samples.filter(s => s.status === 'Completed').length,
    rejected: data.samples.filter(s => s.status === 'Rejected').length,
  }), [data.samples]);

  const statusColor: Record<string, string> = {
    'Pending': 'bg-surface-100 text-surface-600',
    'Collected': 'bg-brand-50 text-brand-700',
    'Received': 'bg-info-50 text-info-700',
    'Processing': 'bg-warning-50 text-warning-700',
    'Completed': 'bg-success-50 text-success-700',
    'Rejected': 'bg-danger-50 text-danger-700',
  };

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Sample Collection</h1>
          <p className="text-[13px] text-surface-500">{data.samples.length} total samples</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-surface-200 rounded-lg text-[13px] text-surface-600 hover:bg-surface-50">
            <Barcode className="w-4 h-4" /> Scan Barcode
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700">
            <TestTubes className="w-4 h-4" /> Collect Sample
          </button>
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
        <h3 className="text-[13px] font-semibold text-surface-500 uppercase tracking-wider mb-4">Sample Pipeline</h3>
        <div className="flex items-center justify-between">
          {[
            { label: 'Pending', count: statusCounts.pending, color: 'bg-surface-400' },
            { label: 'Collected', count: statusCounts.collected, color: 'bg-brand-500' },
            { label: 'Received', count: statusCounts.received, color: 'bg-info-500' },
            { label: 'Processing', count: statusCounts.processing, color: 'bg-warning-500' },
            { label: 'Completed', count: statusCounts.completed, color: 'bg-success-500' },
          ].map((stage, i, arr) => (
            <div key={stage.label} className="flex items-center">
              <div className="pipeline-stage">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${stage.color}`}>{stage.count}</div>
                <span className="text-[11px] text-surface-600 font-medium mt-1">{stage.label}</span>
              </div>
              {i < arr.length - 1 && <div className="pipeline-connector" />}
            </div>
          ))}
          <div className="flex items-center ml-4 pl-4 border-l border-surface-200">
            <div className="pipeline-stage">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-danger-500">{statusCounts.rejected}</div>
              <span className="text-[11px] text-danger-600 font-medium mt-1">Rejected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input type="text" placeholder="Search by sample ID, barcode, patient..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none">
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Collected">Collected</option>
          <option value="Received">Received</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        <table className="data-table">
          <thead>
            <tr><th>Sample ID</th><th>Barcode</th><th>Patient</th><th>Test</th><th>Type</th><th>Container</th><th>Collector</th><th>Status</th><th>Time</th></tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(sample => (
              <tr key={sample.id}>
                <td><span className="font-mono text-[12px]">{sample.sampleId}</span></td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <Barcode className="w-3.5 h-3.5 text-surface-400" />
                    <span className="font-mono text-[11px] text-surface-600">{sample.barcode}</span>
                  </div>
                </td>
                <td className="text-[13px]">{sample.patientName}</td>
                <td className="text-[12px] text-surface-600 max-w-[150px] truncate">{sample.testName}</td>
                <td className="text-[12px]">{sample.sampleType}</td>
                <td className="text-[12px] text-surface-500">{sample.container}</td>
                <td className="text-[12px]">{sample.collectedBy || '—'}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <span className={`status-badge ${statusColor[sample.status]}`}>{sample.status}</span>
                    {sample.rejectionReason && (
                      <span title={sample.rejectionReason} className="text-danger-500 cursor-help"><AlertTriangle className="w-3.5 h-3.5" /></span>
                    )}
                  </div>
                </td>
                <td className="text-[12px] text-surface-500">{sample.collectedAt ? new Date(sample.collectedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
