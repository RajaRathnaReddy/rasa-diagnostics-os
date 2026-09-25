import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  Search, Users, CalendarDays, ClipboardList, Receipt, TestTubes,
  FlaskConical, Scan, FileText, Stethoscope, Home, Package,
  BarChart3, Settings, LayoutDashboard, ArrowRight, User, Hash,
  Tag, Clock, AlertTriangle, Layers, Building2, Check
} from 'lucide-react';
import { cn } from '../../lib/cn';

interface CommandItem {
  id: string;
  label: string;
  sublabel?: string;
  category: 'Patients' | 'Orders' | 'Reports' | 'Doctors' | 'Tests' | 'Appointments' | 'Invoices' | 'Pages';
  icon: React.ElementType;
  action: () => void;
}

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, data, openQuickView } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const allItems = useMemo<CommandItem[]>(() => {
    // 1. Pages
    const pages: CommandItem[] = [
      { id: 'page-dashboard', label: 'Command Center', sublabel: 'Operational overview & KPIs', category: 'Pages', icon: LayoutDashboard, action: () => go('/') },
      { id: 'page-reception', label: 'Reception & Tokens', sublabel: 'Live patient walk-in desk', category: 'Pages', icon: Clock, action: () => go('/reception') },
      { id: 'page-consultations', label: 'Doctor Consultations', sublabel: 'Consultation & contrast safety screening', category: 'Pages', icon: Stethoscope, action: () => go('/consultations') },
      { id: 'page-patients', label: 'Patients Master', sublabel: 'Patient directory & 360 view', category: 'Pages', icon: Users, action: () => go('/patients') },
      { id: 'page-orders', label: 'Diagnostic Orders', sublabel: 'Accessioning & order queue', category: 'Pages', icon: Layers, action: () => go('/orders') },
      { id: 'page-samples', label: 'Sample Collection', sublabel: 'Phlebotomy & tube barcoding', category: 'Pages', icon: TestTubes, action: () => go('/samples') },
      { id: 'page-lab', label: 'Laboratory (LIS)', sublabel: 'Analyzers, delta-checks, QC', category: 'Pages', icon: FlaskConical, action: () => go('/laboratory') },
      { id: 'page-radiology', label: 'Radiology (RIS/PACS)', sublabel: 'DICOM Viewer, MRI, CT, USG', category: 'Pages', icon: Scan, action: () => go('/radiology') },
      { id: 'page-reports', label: 'Reports Hub', sublabel: 'Verification & dispatch', category: 'Pages', icon: FileText, action: () => go('/reports') },
      { id: 'page-billing', label: 'Billing & Cashier', sublabel: 'Invoices, insurance, receipts', category: 'Pages', icon: Receipt, action: () => go('/billing') },
      { id: 'page-inventory', label: 'Inventory & Consumables', sublabel: 'Tubes, reagents, PPE', category: 'Pages', icon: Package, action: () => go('/inventory') },
      { id: 'page-analytics', label: 'Analytics & TAT', sublabel: 'SLA compliance & revenue', category: 'Pages', icon: BarChart3, action: () => go('/analytics') },
    ];

    // 2. Patients
    const patients: CommandItem[] = data.patients.map(p => ({
      id: `pat-${p.id}`,
      label: p.fullName,
      sublabel: `${p.patientId} • Phone: ${p.phone} • ${p.age}y/${p.gender}`,
      category: 'Patients',
      icon: User,
      action: () => {
        setCommandPaletteOpen(false);
        openQuickView('patient', p);
      },
    }));

    // 3. Orders
    const orders: CommandItem[] = data.orders.map(o => ({
      id: `ord-${o.id}`,
      label: `${o.orderId} — ${o.patientName}`,
      sublabel: `${o.testNames.join(', ')} • Priority: ${o.priority}`,
      category: 'Orders',
      icon: Hash,
      action: () => {
        setCommandPaletteOpen(false);
        openQuickView('order', o);
      },
    }));

    // 4. Reports
    const reports: CommandItem[] = data.reports.map(r => ({
      id: `rep-${r.id}`,
      label: `${r.reportId} • ${r.testNames?.join(', ') || r.patientName}`,
      sublabel: `Status: ${r.status} • Verified by: ${r.verifiedBy || 'Pending'}`,
      category: 'Reports',
      icon: FileText,
      action: () => {
        setCommandPaletteOpen(false);
        openQuickView('report', r);
      },
    }));

    // 5. Doctors
    const doctors: CommandItem[] = data.doctors.map(d => ({
      id: `doc-${d.id}`,
      label: d.fullName,
      sublabel: `${d.specialization} • ${d.hospital} • Reg: ${d.registrationNumber}`,
      category: 'Doctors',
      icon: Stethoscope,
      action: () => go('/doctors'),
    }));

    // 6. Test Catalog
    const tests: CommandItem[] = data.testCatalog.map(t => ({
      id: `tst-${t.id}`,
      label: `${t.name} (${t.testCode})`,
      sublabel: `${t.department} • ₹${t.price} • Sample: ${t.sampleType} • TAT: ${t.tatHours}h`,
      category: 'Tests',
      icon: Tag,
      action: () => go('/laboratory'),
    }));

    // 7. Appointments
    const appointments: CommandItem[] = data.appointments.map(a => ({
      id: `apt-${a.id}`,
      label: `${a.patientName} • ${a.appointmentId}`,
      sublabel: `${a.date} at ${a.time} • ${a.type} • Dr. ${a.doctorName || 'Assigned'}`,
      category: 'Appointments',
      icon: CalendarDays,
      action: () => {
        setCommandPaletteOpen(false);
        openQuickView('appointment', a);
      },
    }));

    // 8. Invoices
    const invoices: CommandItem[] = data.invoices.map(inv => ({
      id: `inv-${inv.id}`,
      label: `${inv.invoiceId} • ${inv.patientName}`,
      sublabel: `Total: ₹${inv.total} • Paid: ₹${inv.paid} • Status: ${inv.status}`,
      category: 'Invoices',
      icon: Receipt,
      action: () => go('/billing'),
    }));

    return [...pages, ...patients, ...orders, ...reports, ...doctors, ...tests, ...appointments, ...invoices];
  }, [data, openQuickView]);

  // Filtered by query
  const filtered = useMemo(() => {
    if (!query.trim()) {
      // Default recommended commands when query is empty
      return allItems.slice(0, 18);
    }
    const q = query.toLowerCase();
    return allItems
      .filter(item =>
        item.label.toLowerCase().includes(q) ||
        (item.sublabel && item.sublabel.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [query, allItems]);

  // Grouped results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filtered]);

  // Auto-focus input on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  if (!commandPaletteOpen) return null;

  let flatIndexCounter = 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-950/50 backdrop-blur-xs transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      <div className="relative mx-auto max-w-2xl bg-surface-0 rounded-2xl shadow-command border border-surface-200 overflow-hidden transform transition-all">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-surface-200">
          <Search className="w-5 h-5 text-brand-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patients, ID, phone, orders, tests, reports, doctors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-13 px-3 bg-transparent text-sm text-surface-900 placeholder-surface-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-surface-400 hover:text-surface-600 px-2 py-1"
            >
              Clear
            </button>
          )}
          <span className="text-[10px] font-bold text-surface-400 bg-surface-100 px-1.5 py-0.5 rounded border border-surface-200 shrink-0">
            ESC
          </span>
        </div>

        {/* Grouped Search Results List */}
        <div className="max-h-[440px] overflow-y-auto p-2 no-scrollbar">
          {filtered.length > 0 ? (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-surface-400">
                  {category} ({items.length})
                </div>

                <div className="space-y-0.5">
                  {items.map((item) => {
                    const currentIndex = flatIndexCounter++;
                    const isSelected = currentIndex === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-brand-50 text-brand-900 font-semibold'
                            : 'text-surface-700 hover:bg-surface-50'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                            isSelected ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-500'
                          )}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-semibold text-surface-900">
                              {item.label}
                            </div>
                            {item.sublabel && (
                              <div className="text-[11px] text-surface-500 truncate">
                                {item.sublabel}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="text-[10px] text-surface-400 bg-surface-100 px-1.5 py-0.2 rounded capitalize">
                            {item.category}
                          </span>
                          {isSelected && <ArrowRight className="w-3.5 h-3.5 text-brand-600" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-surface-500">
              No matching diagnostic records found for <span className="font-semibold text-surface-800">"{query}"</span>.
            </div>
          )}
        </div>

        {/* Footer Keyboard Hints */}
        <div className="px-4 py-2 bg-surface-50 border-t border-surface-200 flex items-center justify-between text-[11px] text-surface-400">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="font-mono bg-surface-200 px-1 rounded text-surface-700">↑</kbd> <kbd className="font-mono bg-surface-200 px-1 rounded text-surface-700">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-surface-200 px-1 rounded text-surface-700">Enter</kbd> to select</span>
          </div>
          <span>Showing {filtered.length} indexed records</span>
        </div>
      </div>
    </div>
  );
}
