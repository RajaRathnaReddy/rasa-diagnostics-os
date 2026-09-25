import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  LayoutDashboard, Users, CalendarDays, CheckSquare, Plus,
  Search, Stethoscope, MoreHorizontal, Bell, FlaskConical
} from 'lucide-react';
import { cn } from '../../lib/cn';

export function MobileBottomNav() {
  const { setQuickCreateOpen, setCommandPaletteOpen, unreadNotificationCount, toggleNotificationsPanel } = useAppStore();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/appointments', label: 'Appts', icon: CalendarDays },
    { path: '/samples', label: 'Lab Queue', icon: FlaskConical },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-0 border-t border-surface-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors',
              isActive ? 'text-brand-600 bg-brand-50' : 'text-surface-500 hover:text-surface-900'
            )}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      {/* Quick Action Floating Center Button */}
      <button
        onClick={() => setQuickCreateOpen(true)}
        className="flex flex-col items-center justify-center p-2 rounded-full bg-brand-600 text-white shadow-md active:scale-95 transition-transform cursor-pointer -mt-4 border-2 border-white"
        aria-label="Quick Action"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Global Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold text-surface-500 hover:text-surface-900 cursor-pointer"
        aria-label="Search"
      >
        <Search className="w-5 h-5 mb-0.5" />
        <span>Search</span>
      </button>

      {/* Alerts */}
      <button
        onClick={toggleNotificationsPanel}
        className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold text-surface-500 hover:text-surface-900 cursor-pointer"
        aria-label="Alerts"
      >
        <Bell className="w-5 h-5 mb-0.5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-danger-500" />
        )}
        <span>Alerts</span>
      </button>
    </nav>
  );
}
