import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  Search, Users, CalendarDays, ClipboardList, Receipt, TestTubes,
  FlaskConical, Scan, FileText, Stethoscope, Home, Package,
  BarChart3, Settings, LayoutDashboard, ArrowRight, User, Hash
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  category: string;
  action: () => void;
}

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, data } = useAppStore();
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
    const pages: CommandItem[] = [
      { id: 'nav-dashboard', label: 'Dashboard', description: 'Command Center', icon: LayoutDashboard, category: 'Pages', action: () => go('/') },
      { id: 'nav-patients', label: 'Patients', description: 'Patient Management', icon: Users, category: 'Pages', action: () => go('/patients') },
      { id: 'nav-appointments', label: 'Appointments', description: 'Scheduling', icon: CalendarDays, category: 'Pages', action: () => go('/appointments') },
      { id: 'nav-registration', label: 'Registration', description: 'Patient Registration', icon: ClipboardList, category: 'Pages', action: () => go('/registration') },
      { id: 'nav-billing', label: 'Billing', description: 'Billing & Payments', icon: Receipt, category: 'Pages', action: () => go('/billing') },
      { id: 'nav-samples', label: 'Sample Collection', description: 'Sample Management', icon: TestTubes, category: 'Pages', action: () => go('/samples') },
      { id: 'nav-lab', label: 'Laboratory', description: 'Lab Operations', icon: FlaskConical, category: 'Pages', action: () => go('/laboratory') },
      { id: 'nav-radiology', label: 'Radiology', description: 'Imaging Studies', icon: Scan, category: 'Pages', action: () => go('/radiology') },
      { id: 'nav-reports', label: 'Reports', description: 'Report Management', icon: FileText, category: 'Pages', action: () => go('/reports') },
      { id: 'nav-doctors', label: 'Doctors / Referrers', description: 'Doctor Management', icon: Stethoscope, category: 'Pages', action: () => go('/doctors') },
      { id: 'nav-home', label: 'Home Collection', description: 'Home Sample Collection', icon: Home, category: 'Pages', action: () => go('/home-collection') },
      { id: 'nav-inventory', label: 'Inventory', description: 'Stock Management', icon: Package, category: 'Pages', action: () => go('/inventory') },
      { id: 'nav-analytics', label: 'Analytics', description: 'Business Intelligence', icon: BarChart3, category: 'Pages', action: () => go('/analytics') },
      { id: 'nav-settings', label: 'Settings', description: 'System Configuration', icon: Settings, category: 'Pages', action: () => go('/settings') },
    ];

    const patientItems: CommandItem[] = data.patients.slice(0, 20).map(p => ({
      id: `patient-${p.id}`,
      label: p.fullName,
      description: `${p.patientId} • ${p.phone}`,
      icon: User,
      category: 'Patients',
      action: () => go(`/patients/${p.id}`),
    }));

    const orderItems: CommandItem[] = data.orders.slice(0, 10).map(o => ({
      id: `order-${o.id}`,
      label: o.orderId,
      description: `${o.patientName} • ${o.status}`,
      icon: Hash,
      category: 'Orders',
      action: () => go(`/orders/${o.id}`),
    }));

    return [...pages, ...patientItems, ...orderItems];
  }, [data]);

  const filtered = useMemo(() => {
    if (!query) return allItems.slice(0, 15);
    const q = query.toLowerCase();
    return allItems.filter(
      item => item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [query, allItems]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  if (!commandPaletteOpen) return null;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <div className="command-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div
        className="w-full max-w-lg bg-surface-0 rounded-xl shadow-command border border-surface-200 overflow-hidden fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200">
          <Search className="w-5 h-5 text-surface-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patients, orders, pages..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-surface-900 placeholder:text-surface-400 outline-none"
          />
          <kbd className="text-[11px] text-surface-400 bg-surface-100 px-1.5 py-0.5 rounded border border-surface-200">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-surface-500">No results found for "{query}"</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-1.5 text-[11px] font-medium text-surface-500 uppercase tracking-wider">{category}</div>
                {items.map(item => {
                  flatIndex++;
                  const Icon = item.icon;
                  const isSelected = flatIndex === selectedIndex;
                  const currentIndex = flatIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                        isSelected ? 'bg-brand-50 text-brand-700' : 'text-surface-700 hover:bg-surface-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-brand-500' : 'text-surface-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">{item.label}</p>
                        {item.description && <p className="text-[11px] text-surface-500 truncate">{item.description}</p>}
                      </div>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5 text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-surface-200 text-[11px] text-surface-400">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}
