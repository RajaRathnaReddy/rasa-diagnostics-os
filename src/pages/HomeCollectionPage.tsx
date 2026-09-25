import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Home, Search, MapPin, Clock, User, Phone, Truck, Plus } from 'lucide-react';

export default function HomeCollectionPage() {
  const { data } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = [...data.homeCollections];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h => h.patientName.toLowerCase().includes(q) || h.bookingId.toLowerCase().includes(q) || h.collector.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter(h => h.status === statusFilter);
    return result;
  }, [data.homeCollections, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    booked: data.homeCollections.filter(h => h.status === 'Booked' || h.status === 'Assigned').length,
    enRoute: data.homeCollections.filter(h => h.status === 'En Route' || h.status === 'Arrived').length,
    collected: data.homeCollections.filter(h => h.status === 'Collected' || h.status === 'In Transit').length,
    delivered: data.homeCollections.filter(h => h.status === 'Delivered').length,
  }), [data.homeCollections]);

  const statusColor: Record<string, string> = {
    'Booked': 'bg-brand-50 text-brand-700', 'Assigned': 'bg-info-50 text-info-700',
    'En Route': 'bg-warning-50 text-warning-700', 'Arrived': 'bg-warning-100 text-warning-800',
    'Collected': 'bg-info-100 text-info-700', 'In Transit': 'bg-brand-100 text-brand-700',
    'Delivered': 'bg-success-50 text-success-700', 'Cancelled': 'bg-danger-50 text-danger-700',
  };

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-surface-900">Home Collection</h1><p className="text-[13px] text-surface-500">{data.homeCollections.length} bookings</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700"><Plus className="w-4 h-4" />New Booking</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="metric-card"><p className="text-2xl font-bold text-brand-600">{stats.booked}</p><p className="text-[12px] text-surface-500">Booked / Assigned</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-warning-600">{stats.enRoute}</p><p className="text-[12px] text-surface-500">En Route / Arrived</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-info-600">{stats.collected}</p><p className="text-[12px] text-surface-500">Collected / Transit</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-success-600">{stats.delivered}</p><p className="text-[12px] text-surface-500">Delivered</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input type="text" placeholder="Search bookings..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px]">
          <option value="all">All Status</option>
          <option value="Booked">Booked</option><option value="Assigned">Assigned</option><option value="En Route">En Route</option><option value="Collected">Collected</option><option value="Delivered">Delivered</option>
        </select>
      </div>
      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Booking ID</th><th>Patient</th><th>Date / Slot</th><th>Address</th><th>Tests</th><th>Collector</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(hc => (
              <tr key={hc.id}>
                <td><span className="font-mono text-[12px]">{hc.bookingId}</span></td>
                <td>
                  <div><p className="text-[13px] font-medium">{hc.patientName}</p><p className="text-[11px] text-surface-400 flex items-center gap-1"><Phone className="w-3 h-3" />{hc.patientPhone}</p></div>
                </td>
                <td><div><p className="text-[12px]">{hc.date}</p><p className="text-[11px] text-surface-400">{hc.timeSlot}</p></div></td>
                <td><span className="flex items-center gap-1 text-[12px] max-w-[180px] truncate"><MapPin className="w-3 h-3 text-surface-400 flex-shrink-0" />{hc.address}</span></td>
                <td className="text-[12px] max-w-[150px] truncate">{hc.tests.join(', ')}</td>
                <td><span className="flex items-center gap-1 text-[12px]"><Truck className="w-3 h-3 text-surface-400" />{hc.collector}</span></td>
                <td className="text-[12px] font-medium">₹{hc.amount.toLocaleString('en-IN')}</td>
                <td><span className={`status-badge ${statusColor[hc.status]}`}>{hc.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
