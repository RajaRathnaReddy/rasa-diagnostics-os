import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Scan, Search, Filter, Monitor, User, Clock, CheckCircle2, Eye } from 'lucide-react';

export default function RadiologyPage() {
  const { data, openDicomViewer } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const modalities = useMemo(() => Array.from(new Set(data.imagingStudies.map(s => s.modality))).sort(), [data.imagingStudies]);

  const filtered = useMemo(() => {
    let result = [...data.imagingStudies];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.patientName.toLowerCase().includes(q) || s.studyId.toLowerCase().includes(q) || s.modality.toLowerCase().includes(q));
    }
    if (modalityFilter !== 'all') result = result.filter(s => s.modality === modalityFilter);
    if (statusFilter !== 'all') result = result.filter(s => s.status === statusFilter);
    return result;
  }, [data.imagingStudies, searchQuery, modalityFilter, statusFilter]);

  const stats = useMemo(() => ({
    scheduled: data.imagingStudies.filter(s => s.status === 'Scheduled').length,
    inProgress: data.imagingStudies.filter(s => s.status === 'In Progress').length,
    reporting: data.imagingStudies.filter(s => s.status === 'Reporting' || s.status === 'Completed').length,
    published: data.imagingStudies.filter(s => s.status === 'Published' || s.status === 'Verified').length,
  }), [data.imagingStudies]);

  const statusColor: Record<string, string> = {
    'Scheduled': 'bg-brand-50 text-brand-700', 'Checked In': 'bg-info-50 text-info-700',
    'In Progress': 'bg-warning-50 text-warning-700', 'Completed': 'bg-info-100 text-info-700',
    'Reporting': 'bg-brand-100 text-brand-700', 'Verified': 'bg-success-50 text-success-700',
    'Published': 'bg-success-100 text-success-700',
  };

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Radiology</h1>
          <p className="text-[13px] text-surface-500">{data.imagingStudies.length} imaging studies</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700">
          <Scan className="w-4 h-4" /> New Study
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="metric-card"><p className="text-2xl font-bold text-brand-600">{stats.scheduled}</p><p className="text-[12px] text-surface-500">Scheduled</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-warning-600">{stats.inProgress}</p><p className="text-[12px] text-surface-500">In Progress</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-info-600">{stats.reporting}</p><p className="text-[12px] text-surface-500">Reporting</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-success-600">{stats.published}</p><p className="text-[12px] text-surface-500">Published</p></div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input type="text" placeholder="Search studies..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <select value={modalityFilter} onChange={e => setModalityFilter(e.target.value)} className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none">
          <option value="all">All Modalities</option>
          {modalities.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none">
          <option value="all">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Reporting">Reporting</option>
          <option value="Verified">Verified</option>
          <option value="Published">Published</option>
        </select>
      </div>

      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Scan className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-surface-700">No imaging studies found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Study ID</th><th>Patient</th><th>Modality</th><th>Body Part</th><th>Machine</th><th>Technician</th><th>Radiologist</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(study => (
                <tr key={study.id}>
                  <td><span className="font-mono text-[12px]">{study.studyId}</span></td>
                  <td className="text-[13px]">{study.patientName}</td>
                  <td>
                    <span className="flex items-center gap-1.5 text-[12px]">
                      <Monitor className="w-3.5 h-3.5 text-surface-400" />{study.modality}
                    </span>
                  </td>
                  <td className="text-[12px]">{study.bodyPart}</td>
                  <td className="text-[12px] text-surface-500 max-w-[120px] truncate">{study.machine}</td>
                  <td className="text-[12px]">{study.technician}</td>
                  <td className="text-[12px]">{study.radiologist || '—'}</td>
                  <td><span className={`status-badge ${statusColor[study.status] || ''}`}>{study.status}</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openDicomViewer(study)}
                        className="px-2 py-1 text-[11px] font-semibold bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>PACS View</span>
                      </button>
                      {study.status === 'Completed' && (
                        <button
                          onClick={() => openDicomViewer(study)}
                          className="px-2 py-1 text-[11px] font-medium bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 cursor-pointer"
                        >
                          Report
                        </button>
                      )}
                      {study.status === 'Reporting' && (
                        <button
                          onClick={() => openDicomViewer(study)}
                          className="px-2 py-1 text-[11px] font-medium bg-success-50 text-success-700 rounded-lg hover:bg-success-100 cursor-pointer"
                        >
                          Verify
                        </button>
                      )}
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
