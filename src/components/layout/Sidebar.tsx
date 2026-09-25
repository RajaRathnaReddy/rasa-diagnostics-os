import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard, Users, CalendarDays, ClipboardList, Receipt, TestTubes,
  FlaskConical, Scan, Microscope, FileText, Stethoscope, Home, Package,
  ShieldCheck, MessageSquare, Bot, BarChart3, Wallet, UserCog, Building2,
  Settings, ChevronLeft, ChevronRight, Activity, Clock, Crown, ExternalLink
} from 'lucide-react';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const isMasterRaja =
    user?.email?.toLowerCase() === 'a.rajarathnareddychenni@gmail.com' ||
    user?.id === 'user-raja-007' ||
    user?.name?.toLowerCase().trim() === 'raja rathna reddy';

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/reception', label: 'Walk-in Tokens', icon: Clock, badge: 'Live Queue' },
    { path: '/consultations', label: 'Consultations', icon: Stethoscope },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/appointments', label: 'Appointments', icon: CalendarDays },
    { path: '/registration', label: 'Registration', icon: ClipboardList },
    { path: '/billing', label: 'Billing', icon: Receipt },
    { path: '/samples', label: 'Sample Collection', icon: TestTubes },
    { path: '/laboratory', label: 'Laboratory', icon: FlaskConical },
    { path: '/radiology', label: 'Radiology (RIS/PACS)', icon: Scan },
    { path: '/pathology', label: 'Pathology', icon: Microscope },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/doctors', label: 'Doctors / Referrers', icon: Stethoscope },
    { path: '/home-collection', label: 'Home Collection', icon: Home },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/quality', label: 'Quality', icon: ShieldCheck },
    { path: '/communication', label: 'Communication', icon: MessageSquare },
    { path: '/ai-assistant', label: 'AI Assistant', icon: Bot },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/finance', label: 'Finance', icon: Wallet },
    { path: '/staff', label: 'Staff', icon: UserCog },
    { path: '/branches', label: 'Branches', icon: Building2 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-surface-0 border-r border-surface-200 sidebar-transition ${
        sidebarCollapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-surface-200 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Activity className="w-4.5 h-4.5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-surface-900 tracking-tight truncate">RASA</span>
            <span className="text-[10px] text-brand-600 font-semibold tracking-wider uppercase">Diagnostics OS</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={sidebarCollapsed ? item.label : undefined}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 group ${
                isActive
                  ? 'bg-brand-50 text-brand-700 border border-brand-100 font-semibold'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-brand-600' : 'text-surface-400 group-hover:text-surface-600'}`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!sidebarCollapsed && item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Master Admin Security Link */}
        {isMasterRaja && (
          <NavLink
            to="/admin/users"
            title={sidebarCollapsed ? 'Access Control' : undefined}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 group ${
              location.pathname === '/admin/users'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                : 'text-indigo-600 hover:bg-indigo-50/50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Crown className="w-[18px] h-[18px] text-amber-500 flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">Access Control</span>}
            </div>
            {!sidebarCollapsed && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                Raja
              </span>
            )}
          </NavLink>
        )}

        {/* Public SaaS Landing Link */}
        <NavLink
          to="/landing"
          title={sidebarCollapsed ? 'Product Landing' : undefined}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-surface-500 hover:bg-surface-50 hover:text-surface-800 transition-colors"
        >
          <ExternalLink className="w-[18px] h-[18px] text-surface-400" />
          {!sidebarCollapsed && <span className="truncate">Product Landing</span>}
        </NavLink>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-10 border-t border-surface-200 text-surface-400 hover:text-surface-600 hover:bg-surface-50 transition-colors cursor-pointer"
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
