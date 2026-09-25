import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Receipt, Search, Filter, Download, IndianRupee, Clock, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';

export default function BillingPage() {
  const { data } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = [...data.invoices];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => i.patientName.toLowerCase().includes(q) || i.invoiceId.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter(i => i.status === statusFilter);
    return result;
  }, [data.invoices, searchQuery, statusFilter]);

  const totals = useMemo(() => ({
    revenue: data.invoices.reduce((s, i) => s + i.paid, 0),
    outstanding: data.invoices.reduce((s, i) => s + i.balance, 0),
    invoices: data.invoices.length,
    paid: data.invoices.filter(i => i.status === 'Paid').length,
  }), [data.invoices]);

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Billing & Payments</h1>
          <p className="text-[13px] text-surface-500">{data.invoices.length} invoices</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700">
          <Receipt className="w-4 h-4" /> New Invoice
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2"><IndianRupee className="w-4 h-4 text-success-500" /><span className="text-[12px] text-surface-500">Total Revenue</span></div>
          <p className="text-xl font-bold text-surface-900">₹{totals.revenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-warning-500" /><span className="text-[12px] text-surface-500">Outstanding</span></div>
          <p className="text-xl font-bold text-warning-600">₹{totals.outstanding.toLocaleString('en-IN')}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-success-500" /><span className="text-[12px] text-surface-500">Paid</span></div>
          <p className="text-xl font-bold text-surface-900">{totals.paid}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2"><Receipt className="w-4 h-4 text-brand-500" /><span className="text-[12px] text-surface-500">Total Invoices</span></div>
          <p className="text-xl font-bold text-surface-900">{totals.invoices}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input type="text" placeholder="Search invoices..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none">
          <option value="all">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
        </select>
        <button className="flex items-center gap-2 px-3 py-2 border border-surface-200 rounded-lg text-[13px] text-surface-600 hover:bg-surface-50"><Download className="w-4 h-4" />Export</button>
      </div>

      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Invoice</th><th>Patient</th><th>Amount</th><th>Discount</th><th>Total</th><th>Paid</th><th>Balance</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id}>
                <td><span className="font-mono text-[12px]">{inv.invoiceId}</span></td>
                <td className="text-[13px]">{inv.patientName}</td>
                <td className="text-[12px]">₹{inv.amount.toLocaleString('en-IN')}</td>
                <td className="text-[12px] text-success-600">{inv.discount > 0 ? `-₹${inv.discount.toLocaleString('en-IN')}` : '—'}</td>
                <td className="text-[13px] font-medium">₹{inv.total.toLocaleString('en-IN')}</td>
                <td className="text-[12px] text-success-600">₹{inv.paid.toLocaleString('en-IN')}</td>
                <td className={`text-[12px] ${inv.balance > 0 ? 'text-danger-600 font-medium' : 'text-surface-500'}`}>₹{inv.balance.toLocaleString('en-IN')}</td>
                <td className="text-[12px]">{inv.paymentMethod}</td>
                <td>
                  <span className={`status-badge ${inv.status === 'Paid' ? 'bg-success-50 text-success-700' : inv.status === 'Partial' ? 'bg-warning-50 text-warning-700' : 'bg-danger-50 text-danger-700'}`}>{inv.status}</span>
                </td>
                <td className="text-[12px] text-surface-500">{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
