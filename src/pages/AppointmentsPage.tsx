import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  CalendarDays, Search, Filter, Plus, Clock, CheckCircle2,
  User, Phone, ChevronLeft, ChevronRight, MapPin
} from 'lucide-react';

type ViewMode = 'list' | 'day' | 'week';

export default function AppointmentsPage() {
  const { data } = useAppStore();
  const [view, setView] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const filtered = useMemo(() => {
    let result = [...data.appointments];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.patientName.toLowerCase().includes(q) || a.appointmentId.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    if (view === 'day' || view === 'list') result = result.filter(a => a.date === dateFilter);
    return result.sort((a, b) => a.time.localeCompare(b.time));
  }, [data.appointments, searchQuery, statusFilter, dateFilter, view]);

  const statusCounts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = data.appointments.filter(a => a.date === today);
    return {
      total: todayAppts.length,
      scheduled: todayAppts.filter(a => a.status === 'Scheduled').length,
      confirmed: todayAppts.filter(a => a.status === 'Confirmed').length,
      checkedIn: todayAppts.filter(a => a.status === 'Checked In').length,
      inProgress: todayAppts.filter(a => a.status === 'In Progress').length,
      completed: todayAppts.filter(a => a.status === 'Completed').length,
    };
  }, [data.appointments]);

  const statusColor: Record<string, string> = {
    'Scheduled': 'bg-brand-50 text-brand-700 border-brand-200',
    'Confirmed': 'bg-info-50 text-info-700 border-info-200',
    'Checked In': 'bg-warning-50 text-warning-700 border-warning-200',
    'In Progress': 'bg-warning-100 text-warning-800 border-warning-300',
    'Completed': 'bg-success-50 text-success-700 border-success-200',
    'Cancelled': 'bg-danger-50 text-danger-700 border-danger-200',
    'No Show': 'bg-surface-100 text-surface-600 border-surface-200',
  };

  return (
    <div className="fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Appointments</h1>
          <p className="text-[13px] text-surface-500 mt-0.5">{statusCounts.total} appointments today</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700 transition-colors">
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: 'Scheduled', count: statusCounts.scheduled, color: 'brand' },
          { label: 'Confirmed', count: statusCounts.confirmed, color: 'info' },
          { label: 'Checked In', count: statusCounts.checkedIn, color: 'warning' },
          { label: 'In Progress', count: statusCounts.inProgress, color: 'warning' },
          { label: 'Completed', count: statusCounts.completed, color: 'success' },
          { label: 'Total', count: statusCounts.total, color: 'brand' },
        ].map(item => (
          <div key={item.label} className="metric-card text-center">
            <p className="text-2xl font-bold text-surface-900">{item.count}</p>
            <p className="text-[11px] text-surface-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text" placeholder="Search appointments..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 w-full"
            />
          </div>
          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="flex items-center gap-1 border border-surface-200 rounded-lg p-0.5">
            <button onClick={() => setDateFilter(new Date(new Date(dateFilter).getTime() - 86400000).toISOString().split('T')[0])} className="p-1.5 hover:bg-surface-50 rounded">
              <ChevronLeft className="w-4 h-4 text-surface-500" />
            </button>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-2 py-1 text-[13px] text-surface-700 bg-transparent border-0 focus:outline-none" />
            <button onClick={() => setDateFilter(new Date(new Date(dateFilter).getTime() + 86400000).toISOString().split('T')[0])} className="p-1.5 hover:bg-surface-50 rounded">
              <ChevronRight className="w-4 h-4 text-surface-500" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface-100 rounded-lg p-0.5">
          {(['list', 'day', 'week'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${view === v ? 'bg-surface-0 text-surface-900 shadow-xs' : 'text-surface-500 hover:text-surface-700'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List View */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-surface-700">No appointments found</p>
            <p className="text-[13px] text-surface-500 mt-1">No appointments match your current filters.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Status</th>
                <th>Branch</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(apt => (
                <tr key={apt.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-surface-400" />
                      <span className="text-[13px] font-medium">{apt.time}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-surface-900">{apt.patientName}</p>
                        <p className="text-[11px] text-surface-400">{apt.patientPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-[12px] px-2 py-0.5 bg-surface-50 border border-surface-200 rounded text-surface-700">
                      {apt.type}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge border ${statusColor[apt.status] || ''}`}>{apt.status}</span>
                  </td>
                  <td><span className="text-[12px] text-surface-500">{apt.branchId}</span></td>
                  <td><span className="text-[12px] text-surface-500">{apt.duration} min</span></td>
                  <td>
                    <div className="flex items-center gap-1">
                      {apt.status === 'Scheduled' && (
                        <button className="px-2 py-1 text-[11px] font-medium bg-info-50 text-info-700 rounded hover:bg-info-100 transition-colors">Confirm</button>
                      )}
                      {apt.status === 'Confirmed' && (
                        <button className="px-2 py-1 text-[11px] font-medium bg-success-50 text-success-700 rounded hover:bg-success-100 transition-colors">Check In</button>
                      )}
                      {apt.status === 'Checked In' && (
                        <button className="px-2 py-1 text-[11px] font-medium bg-brand-50 text-brand-700 rounded hover:bg-brand-100 transition-colors">Start</button>
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
