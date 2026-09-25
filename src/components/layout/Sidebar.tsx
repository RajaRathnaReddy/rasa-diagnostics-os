import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard, Users, CalendarDays, ClipboardList, Receipt, TestTubes,
  FlaskConical, Scan, Microscope, FileText, Stethoscope, Home, Package,
  ShieldCheck, MessageSquare, Bot, BarChart3, Wallet, UserCog, Building2,
  Settings, ChevronLeft, ChevronRight, Activity, Clock, Crown, ExternalLink,
  Layers, ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/cn';

interface NavGroup {
  groupName: string;
  items: {
    path: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const isMasterRaja =
    user?.email?.toLowerCase() === 'a.rajarathnareddychenni@gmail.com' ||
    user?.id === 'user-raja-007' ||
    user?.name?.toLowerCase().trim() === 'raja rathna reddy';

  const navGroups: NavGroup[] = [
    {
      groupName: 'Operations',
      items: [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/appointments', label: 'Appointments', icon: CalendarDays },
        { path: '/registration', label: 'Registration', icon: ClipboardList },
        { path: '/patients', label: 'Patients', icon: Users },
        { path: '/reception', label: 'Walk-in Tokens', icon: Clock, badge: 'Live' },
        { path: '/consultations', label: 'Consultations', icon: Stethoscope },
      ],
    },
    {
      groupName: 'Diagnostics',
      items: [
        { path: '/orders', label: 'Orders', icon: Layers },
        { path: '/samples', label: 'Sample Collection', icon: TestTubes },
        { path: '/laboratory', label: 'Laboratory', icon: FlaskConical },
        { path: '/radiology', label: 'Radiology', icon: Scan },
        { path: '/pathology', label: 'Pathology', icon: Microscope },
        { path: '/reports', label: 'Reports', icon: FileText },
      ],
    },
    {
      groupName: 'Business',
      items: [
        { path: '/billing', label: 'Billing', icon: Receipt },
        { path: '/finance', label: 'Finance', icon: Wallet },
        { path: '/doctors', label: 'Doctors / Referrers', icon: Stethoscope },
        { path: '/home-collection', label: 'Home Collection', icon: Home },
        { path: '/inventory', label: 'Inventory', icon: Package },
      ],
    },
    {
      groupName: 'Intelligence',
      items: [
        { path: '/ai-assistant', label: 'AI Assistant', icon: Bot },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/quality', label: 'Quality', icon: ShieldCheck },
        { path: '/communication', label: 'Communication', icon: MessageSquare },
      ],
    },
    {
      groupName: 'Administration',
      items: [
        { path: '/staff', label: 'Staff', icon: UserCog },
        { path: '/branches', label: 'Branches', icon: Building2 },
        { path: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-surface-0 border-r border-surface-200 sidebar-transition select-none',
        sidebarCollapsed ? 'w-[60px]' : 'w-[240px]'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3.5 h-14 border-b border-surface-200 flex-shrink-0 bg-surface-0">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Activity className="w-4.5 h-4.5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-surface-900 tracking-tight truncate flex items-center gap-1.5">
              <span>RASA</span>
              <span className="text-[10px] bg-brand-50 text-brand-700 px-1 py-0.2 rounded font-semibold border border-brand-100">OS</span>
            </span>
            <span className="text-[10.5px] text-surface-500 font-medium tracking-tight truncate">Diagnostic Intelligence</span>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.groupName} className="space-y-0.5">
            {!sidebarCollapsed ? (
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-surface-400">
                {group.groupName}
              </div>
            ) : (
              <div className="h-px bg-surface-100 my-2 mx-1" />
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={sidebarCollapsed ? `${group.groupName}: ${item.label}` : undefined}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all group relative',
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        'w-[17px] h-[17px] flex-shrink-0 transition-colors',
                        isActive ? 'text-brand-600' : 'text-surface-400 group-hover:text-surface-600'
                      )}
                    />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-brand-100 text-brand-700 font-bold">
                      {item.badge}
                    </span>
                  )}

                  {/* Active left indicator line */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-600 rounded-r-full" />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}

        {/* Administration / Access Control Link */}
        <div className="pt-2 border-t border-surface-100 space-y-0.5">
          {!sidebarCollapsed && (
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-500">
              Security
            </div>
          )}
          {isMasterRaja ? (
            <NavLink
              to="/admin/users"
              title={sidebarCollapsed ? 'Access Control (Master Admin)' : undefined}
              className={cn(
                'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors group',
                location.pathname === '/admin/users'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-indigo-600 hover:bg-indigo-50/50'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Crown className="w-[17px] h-[17px] text-amber-500 flex-shrink-0" />
                {!sidebarCollapsed && <span className="truncate">Access Control</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                  Raja
                </span>
              )}
            </NavLink>
          ) : (
            <NavLink
              to="/settings"
              title={sidebarCollapsed ? 'Access Control' : undefined}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-surface-500 hover:bg-surface-50 hover:text-surface-800"
            >
              <ShieldCheck className="w-[17px] h-[17px] text-surface-400" />
              {!sidebarCollapsed && <span className="truncate">Access Control</span>}
            </NavLink>
          )}

          {/* Public SaaS Landing Link */}
          <NavLink
            to="/landing"
            title={sidebarCollapsed ? 'Product Landing' : undefined}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-surface-500 hover:bg-surface-50 hover:text-surface-800 transition-colors"
          >
            <ExternalLink className="w-[17px] h-[17px] text-surface-400" />
            {!sidebarCollapsed && <span className="truncate">Product Overview</span>}
          </NavLink>
        </div>
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
