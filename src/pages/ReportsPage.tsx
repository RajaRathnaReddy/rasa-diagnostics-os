import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  FileText, Search, Download, Eye, Send, CheckCircle2, Clock,
  Printer, Sparkles, Filter, Check, MessageSquare, AlertTriangle,
  ChevronRight, RefreshCw, QrCode, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/cn';

export default function ReportsPage() {
  const { data, openReportModal, setReportGeneratorOpen, updateReportStatus, openQuickView } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = useMemo(() => {
    let result = [...data.reports];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.patientName.toLowerCase().includes(q) ||
        r.reportId.toLowerCase().includes(q) ||
        r.testNames.some(t => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    return result;
  }, [data.reports, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: data.reports.length,
    pending: data.reports.filter(r => r.status === 'Pending').length,
    generated: data.reports.filter(r => r.status === 'Generated').length,
    verified: data.reports.filter(r => r.status === 'Verified').length,
    sent: data.reports.filter(r => r.status === 'Sent' || r.status === 'Delivered').length,
    viewed: data.reports.filter(r => r.status === 'Viewed').length,
  }), [data.reports]);

  const statusColor: Record<string, string> = {
    'Pending': 'bg-slate-100 text-slate-700 border-slate-200',
    'Generated': 'bg-amber-50 text-amber-800 border-amber-200',
    'Verified': 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
    'Sent': 'bg-blue-50 text-blue-800 border-blue-200',
    'Delivered': 'bg-teal-50 text-teal-800 border-teal-200',
    'Viewed': 'bg-purple-50 text-purple-800 border-purple-200',
  };

  const handleSendReport = (report: any) => {
    updateReportStatus(report.reportId || report.id, 'Delivered');
    showToast(`📲 Official Medical Report ${report.reportId} sent to ${report.patientName} via ${report.deliveryMethod || 'WhatsApp'}!`);
  };

  const handleBatchPrint = () => {
    const verified = data.reports.find(r => r.status === 'Verified');
    if (verified) {
      openReportModal(verified, true);
    } else if (filtered[0]) {
      openReportModal(filtered[0], true);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Diagnostic Laboratory Reports
            </h1>
            <span className="badge bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-xs">
              NABL Accredited
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, generate, print official A4 clinical reports and dispatch via WhatsApp / SMS / Email
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setReportGeneratorOpen(true)}
            className="btn-primary !bg-brand-600 hover:!bg-brand-700 !text-xs !py-2 !px-3.5 shadow-md flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Generate Test Report</span>
          </button>

          <button
            onClick={handleBatchPrint}
            className="btn-secondary !text-xs !py-2 !px-3 flex items-center gap-1.5 font-bold cursor-pointer"
            title="Print verified reports"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Batch Print (PDF)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="card p-3.5 border-t-2 border-t-slate-400 bg-white">
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{stats.total}</p>
          <p className="text-[11px] font-bold text-slate-600 mt-0.5">Total Reports</p>
          <p className="text-[9.5px] text-slate-400 font-medium">All archived</p>
        </div>
        <div className="card p-3.5 border-t-2 border-t-amber-500 bg-white">
          <p className="text-2xl font-extrabold text-amber-700 tracking-tight">{stats.pending}</p>
          <p className="text-[11px] font-bold text-slate-600 mt-0.5">Pending Signoff</p>
          <p className="text-[9.5px] text-slate-400 font-medium">Lab processing</p>
        </div>
        <div className="card p-3.5 border-t-2 border-t-blue-500 bg-white">
          <p className="text-2xl font-extrabold text-blue-700 tracking-tight">{stats.generated}</p>
          <p className="text-[11px] font-bold text-slate-600 mt-0.5">Generated</p>
          <p className="text-[9.5px] text-slate-400 font-medium">Awaiting MD review</p>
        </div>
        <div className="card p-3.5 border-t-2 border-t-emerald-500 bg-white">
          <p className="text-2xl font-extrabold text-emerald-700 tracking-tight">{stats.verified}</p>
          <p className="text-[11px] font-bold text-slate-600 mt-0.5">Verified & Signed</p>
          <p className="text-[9.5px] text-slate-400 font-medium">Ready to dispatch</p>
        </div>
        <div className="card p-3.5 border-t-2 border-t-teal-500 bg-white">
          <p className="text-2xl font-extrabold text-teal-700 tracking-tight">{stats.sent}</p>
          <p className="text-[11px] font-bold text-slate-600 mt-0.5">Sent / Delivered</p>
          <p className="text-[9.5px] text-slate-400 font-medium">WhatsApp / Email</p>
        </div>
        <div className="card p-3.5 border-t-2 border-t-purple-500 bg-white">
          <p className="text-2xl font-extrabold text-purple-700 tracking-tight">{stats.viewed}</p>
          <p className="text-[11px] font-bold text-slate-600 mt-0.5">Viewed by Patient</p>
          <p className="text-[9.5px] text-slate-400 font-medium">Patient portal</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-3.5 bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Report ID, patient name, or test (e.g. HbA1c, CBC)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Reports' },
            { id: 'Verified', label: 'Verified (Signed)' },
            { id: 'Generated', label: 'Generated' },
            { id: 'Delivered', label: 'Delivered' },
            { id: 'Viewed', label: 'Viewed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white font-bold shadow-2xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="card overflow-hidden border border-slate-200 shadow-xs bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Diagnostic Tests</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Verified By</th>
                <th className="py-3 px-3">Delivery</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(report => (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => openReportModal(report, false)}
                >
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200">
                      {report.reportId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors block">
                      {report.patientName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Order: {report.orderId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-700 block max-w-[280px] truncate" title={report.testNames.join(', ')}>
                      {report.testNames.join(', ')}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={cn('badge text-[10px] font-bold px-2 py-0.5 border shadow-2xs', statusColor[report.status] || 'bg-slate-100 text-slate-700')}>
                      <span className="w-1.5 h-1.5 rounded-full mr-1 bg-current" />
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {report.verifiedBy || 'Dr. Sunita Rao, MD'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-700 text-[11px]">
                      {report.deliveryMethod || 'WhatsApp'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {report.generatedAt ? new Date(report.generatedAt).toLocaleDateString('en-IN') : 'Today'}
                  </td>
                  <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Report Button (Opens official Report Viewer Modal) */}
                      <button
                        onClick={() => openReportModal(report, false)}
                        className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-brand-200"
                        title="View Official Diagnostic Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Download / Print PDF Button (Opens and prints) */}
                      <button
                        onClick={() => openReportModal(report, true)}
                        className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-brand-200"
                        title="Print / Save Official PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Send via WhatsApp / Email */}
                      <button
                        onClick={() => handleSendReport(report)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
                        title="Dispatch via WhatsApp / Email"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
