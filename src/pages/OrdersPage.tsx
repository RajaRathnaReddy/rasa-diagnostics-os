import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Layers, Search, Filter, Hash, User, Calendar, CheckCircle2,
  Clock, AlertTriangle, Eye, Printer, Plus, ArrowRight
} from 'lucide-react';
import { cn } from '../lib/cn';

export default function OrdersPage() {
  const { data, openQuickView, setQuickCreateOpen } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = [...data.orders];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.orderId.toLowerCase().includes(q) ||
        o.patientName.toLowerCase().includes(q) ||
        o.doctorName.toLowerCase().includes(q) ||
        o.testNames.some(t => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      result = result.filter(o => o.priority === priorityFilter);
    }
    return result;
  }, [data.orders, searchQuery, statusFilter, priorityFilter]);

  const counts = useMemo(() => ({
    all: data.orders.length,
    stat: data.orders.filter(o => o.priority === 'STAT').length,
    urgent: data.orders.filter(o => o.priority === 'Urgent').length,
    processing: data.orders.filter(o => o.status === 'Processing').length,
    verified: data.orders.filter(o => o.status === 'Verified' || o.status === 'Reported').length,
  }), [data.orders]);

  const statusColors: Record<string, string> = {
    Booked: 'bg-surface-100 text-surface-700',
    Confirmed: 'bg-brand-50 text-brand-700',
    Collected: 'bg-info-50 text-info-700',
    Received: 'bg-info-100 text-info-800',
    Processing: 'bg-warning-50 text-warning-800',
    Completed: 'bg-success-50 text-success-700',
    Verified: 'bg-success-100 text-success-800',
    Reported: 'bg-emerald-50 text-emerald-800',
    Cancelled: 'bg-danger-50 text-danger-700',
  };

  return (
    <div className="fade-in space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" />
            <span>Diagnostic Orders Queue</span>
          </h1>
          <p className="text-[13px] text-surface-500 mt-0.5">
            Real-time accessioning, barcode dispatch, and workflow pipeline tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-bold hover:bg-brand-700 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Diagnostic Order</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-surface-0 border border-surface-200 rounded-xl">
          <span className="text-surface-400 text-xs block">Total Orders</span>
          <span className="text-2xl font-bold text-surface-900">{counts.all}</span>
        </div>
        <div className="p-3.5 bg-surface-0 border border-surface-200 rounded-xl">
          <span className="text-danger-600 text-xs font-semibold block">STAT Emergencies</span>
          <span className="text-2xl font-bold text-danger-600">{counts.stat}</span>
        </div>
        <div className="p-3.5 bg-surface-0 border border-surface-200 rounded-xl">
          <span className="text-warning-600 text-xs font-semibold block">Active Processing</span>
          <span className="text-2xl font-bold text-warning-700">{counts.processing}</span>
        </div>
        <div className="p-3.5 bg-surface-0 border border-surface-200 rounded-xl">
          <span className="text-success-600 text-xs font-semibold block">Verified & Reported</span>
          <span className="text-2xl font-bold text-success-700">{counts.verified}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface-0 p-3 rounded-xl border border-surface-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search order ID, patient, referring doctor, or test name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-[13px] text-surface-800 placeholder-surface-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-surface-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Booked">Booked</option>
            <option value="Collected">Collected</option>
            <option value="Received">Received</option>
            <option value="Processing">Processing</option>
            <option value="Verified">Verified</option>
            <option value="Reported">Reported</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-surface-700 font-medium focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
            <option value="STAT">STAT</option>
          </select>

          {(statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                setSearchQuery('');
              }}
              className="px-2.5 py-1.5 text-brand-600 hover:bg-brand-50 rounded-lg font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-50 border-b border-surface-200 text-surface-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Tests Included</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Billing</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-surface-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-surface-900 font-mono text-[13px]">{order.orderId}</div>
                    <div className="text-[11px] text-surface-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-surface-900">{order.patientName}</div>
                    <div className="text-[11px] text-surface-400">ID: {order.patientId}</div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-medium text-surface-800 truncate">
                      {order.testNames.slice(0, 2).join(', ')}
                      {order.testNames.length > 2 && (
                        <span className="text-surface-400 font-normal"> +{order.testNames.length - 2} more</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-surface-600">
                    {order.doctorName || 'Self Referral'}
                  </td>

                  <td className="py-3 px-4">
                    <span className={cn(
                      'px-2 py-0.5 rounded font-bold text-[10px]',
                      order.priority === 'STAT' ? 'bg-danger-500 text-white' :
                      order.priority === 'Urgent' ? 'bg-warning-100 text-warning-800' : 'bg-surface-100 text-surface-600'
                    )}>
                      {order.priority}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-surface-900">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-success-600">Paid: ₹{order.paidAmount.toLocaleString('en-IN')}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={cn('px-2 py-0.5 rounded text-[11px] font-semibold', statusColors[order.status] || 'bg-surface-100 text-surface-600')}>
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openQuickView('order', order)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-brand-600 hover:bg-brand-50 rounded-lg font-medium cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-surface-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
