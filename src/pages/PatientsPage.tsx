import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  Search, Filter, Download, Plus, User, Phone, MapPin,
  ChevronRight, ArrowUpDown, MoreHorizontal
} from 'lucide-react';

export default function PatientsPage() {
  const { data } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'fullName' | 'age' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const filtered = useMemo(() => {
    let result = [...data.patients];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.fullName.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return result;
  }, [data.patients, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  return (
    <div className="fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Patients</h1>
          <p className="text-[13px] text-surface-500 mt-0.5">{data.patients.length} total patients</p>
        </div>
        <Link
          to="/registration"
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Patient
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search by name, ID, phone, email..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-surface-200 rounded-lg text-[13px] text-surface-600 hover:bg-surface-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-surface-200 rounded-lg text-[13px] text-surface-600 hover:bg-surface-50 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-12">
                  <input type="checkbox" className="rounded border-surface-300" />
                </th>
                <th>
                  <button onClick={() => toggleSort('fullName')} className="flex items-center gap-1 hover:text-surface-700">
                    Patient <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th>Patient ID</th>
                <th>Contact</th>
                <th>
                  <button onClick={() => toggleSort('age')} className="flex items-center gap-1 hover:text-surface-700">
                    Age / Gender <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th>Blood Group</th>
                <th>City</th>
                <th>Branch</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map(patient => (
                <tr key={patient.id} className="group">
                  <td>
                    <input type="checkbox" className="rounded border-surface-300" />
                  </td>
                  <td>
                    <Link to={`/patients/${patient.id}`} className="flex items-center gap-3 group/link">
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-surface-900 group-hover/link:text-brand-600">{patient.fullName}</p>
                        {patient.allergies[0] !== 'None' && (
                          <span className="text-[10px] text-danger-600 bg-danger-50 px-1 rounded">Allergy: {patient.allergies[0]}</span>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td>
                    <span className="text-[12px] font-mono text-surface-600 bg-surface-50 px-2 py-0.5 rounded">{patient.patientId}</span>
                  </td>
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 text-[12px] text-surface-600">
                        <Phone className="w-3 h-3" />{patient.phone}
                      </span>
                      <span className="text-[11px] text-surface-400 truncate max-w-[180px]">{patient.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-[13px] text-surface-700">{patient.age}y / {patient.gender.charAt(0)}</span>
                  </td>
                  <td>
                    <span className="text-[12px] font-medium text-surface-700 bg-surface-100 px-2 py-0.5 rounded">{patient.bloodGroup}</span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-[12px] text-surface-600">
                      <MapPin className="w-3 h-3" />{patient.city}
                    </span>
                  </td>
                  <td>
                    <span className="text-[12px] text-surface-500">{patient.branchId}</span>
                  </td>
                  <td>
                    <Link to={`/patients/${patient.id}`} className="p-1 text-surface-400 hover:text-surface-600">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200">
          <p className="text-[12px] text-surface-500">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[12px] border border-surface-200 rounded-lg hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-[12px] rounded-lg ${currentPage === page ? 'bg-brand-600 text-white' : 'text-surface-600 hover:bg-surface-50'}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[12px] border border-surface-200 rounded-lg hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
