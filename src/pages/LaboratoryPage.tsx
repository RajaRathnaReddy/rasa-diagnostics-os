import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FlaskConical, Search, Filter, AlertTriangle, CheckCircle2, Clock, ArrowUpDown } from 'lucide-react';

export default function LaboratoryPage() {
  const { data } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tab, setTab] = useState<'results' | 'worklist' | 'verification'>('worklist');

  const departments = useMemo(() => {
    const depts = new Set(data.labResults.map(r => r.department));
    return Array.from(depts).sort();
  }, [data.labResults]);

  const filtered = useMemo(() => {
    let result = [...data.labResults];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => r.patientName.toLowerCase().includes(q) || r.testName.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q));
    }
    if (deptFilter !== 'all') result = result.filter(r => r.department === deptFilter);
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    if (tab === 'worklist') result = result.filter(r => r.status === 'Pending' || r.status === 'Entered');
    if (tab === 'verification') result = result.filter(r => r.status === 'Validated');
    return result;
  }, [data.labResults, searchQuery, deptFilter, statusFilter, tab]);

  const stats = useMemo(() => ({
    total: data.labResults.length,
    pending: data.labResults.filter(r => r.status === 'Pending').length,
    entered: data.labResults.filter(r => r.status === 'Entered').length,
    validated: data.labResults.filter(r => r.status === 'Validated').length,
    verified: data.labResults.filter(r => r.status === 'Verified').length,
    critical: data.labResults.filter(r => r.isCritical).length,
    abnormal: data.labResults.filter(r => r.isAbnormal && !r.isCritical).length,
  }), [data.labResults]);

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Laboratory</h1>
          <p className="text-[13px] text-surface-500">{stats.total} results • {stats.critical} critical</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="metric-card"><p className="text-2xl font-bold text-surface-900">{stats.pending}</p><p className="text-[12px] text-surface-500">Pending Entry</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-warning-600">{stats.entered}</p><p className="text-[12px] text-surface-500">Entered</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-brand-600">{stats.validated}</p><p className="text-[12px] text-surface-500">Awaiting Verification</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-success-600">{stats.verified}</p><p className="text-[12px] text-surface-500">Verified</p></div>
        <div className="metric-card border-danger-200">
          <div className="flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-danger-500" /><p className="text-2xl font-bold text-danger-600">{stats.critical}</p></div>
          <p className="text-[12px] text-danger-600">Critical Results</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-surface-200">
        {[
          { id: 'worklist' as const, label: 'Worklist', count: stats.pending + stats.entered },
          { id: 'verification' as const, label: 'Verification Queue', count: stats.validated },
          { id: 'results' as const, label: 'All Results', count: stats.total },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${tab === t.id ? 'border-brand-600 text-brand-700' : 'border-transparent text-surface-500 hover:text-surface-700'}`}>
            {t.label} <span className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-500'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input type="text" placeholder="Search results..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none">
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FlaskConical className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-surface-700">No results found</p>
            <p className="text-[13px] text-surface-500 mt-1">{tab === 'worklist' ? 'All results have been entered.' : tab === 'verification' ? 'No results pending verification.' : 'No results match your filters.'}</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Test</th><th>Patient</th><th>Department</th><th>Value</th><th>Reference</th><th>Flags</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(result => (
                <tr key={result.id} className={result.isCritical ? 'bg-danger-50/30' : ''}>
                  <td className="text-[13px] font-medium">{result.testName}</td>
                  <td className="text-[12px]">{result.patientName}</td>
                  <td><span className="text-[11px] px-2 py-0.5 bg-surface-50 border border-surface-200 rounded text-surface-600">{result.department}</span></td>
                  <td>
                    <span className={`text-[13px] font-semibold ${result.isCritical ? 'text-danger-600' : result.isAbnormal ? 'text-warning-600' : 'text-surface-900'}`}>
                      {result.value} {result.unit}
                    </span>
                  </td>
                  <td className="text-[12px] text-surface-500">{result.referenceRange}</td>
                  <td>
                    <div className="flex gap-1">
                      {result.isCritical && <span className="flex items-center gap-0.5 text-[10px] font-bold text-danger-600 bg-danger-50 border border-danger-200 px-1.5 py-0.5 rounded"><AlertTriangle className="w-3 h-3" />CRITICAL</span>}
                      {result.isAbnormal && !result.isCritical && <span className="text-[10px] font-bold text-warning-600 bg-warning-50 border border-warning-200 px-1.5 py-0.5 rounded">ABN</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      result.status === 'Verified' ? 'bg-success-50 text-success-700' :
                      result.status === 'Validated' ? 'bg-brand-50 text-brand-700' :
                      result.status === 'Entered' ? 'bg-warning-50 text-warning-700' :
                      'bg-surface-100 text-surface-600'
                    }`}>{result.status}</span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {result.status === 'Pending' && <button className="px-2 py-1 text-[11px] font-medium bg-brand-50 text-brand-700 rounded hover:bg-brand-100">Enter Result</button>}
                      {result.status === 'Entered' && <button className="px-2 py-1 text-[11px] font-medium bg-info-50 text-info-700 rounded hover:bg-info-100">Validate</button>}
                      {result.status === 'Validated' && <button className="px-2 py-1 text-[11px] font-medium bg-success-50 text-success-700 rounded hover:bg-success-100">Verify</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
