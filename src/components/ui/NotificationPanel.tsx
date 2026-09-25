import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bell, AlertTriangle, AlertCircle, Clock, Info, CheckCheck,
  CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Filter, Package,
  FileText, TestTubes, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/cn';

export function NotificationPanel() {
  const { notificationsPanelOpen, setNotificationsPanelOpen, data, markNotificationRead, openQuickView } = useAppStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'important' | 'reminder' | 'info'>('all');

  const notifications = data.notifications || [];

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (filterMode === 'critical') return n.type === 'critical';
      if (filterMode === 'important') return n.type === 'important';
      if (filterMode === 'reminder') return n.type === 'reminder';
      if (filterMode === 'info') return n.type === 'info';
      return true;
    });
  }, [notifications, filterMode]);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!notificationsPanelOpen) return null;

  const handleAction = (n: any) => {
    markNotificationRead(n.id);
    setNotificationsPanelOpen(false);

    if (n.title.toLowerCase().includes('critical') || n.title.toLowerCase().includes('panic')) {
      navigate('/laboratory');
    } else if (n.title.toLowerCase().includes('verification') || n.title.toLowerCase().includes('tat')) {
      navigate('/reports');
    } else if (n.title.toLowerCase().includes('sample') || n.title.toLowerCase().includes('rejection')) {
      navigate('/samples');
    } else if (n.title.toLowerCase().includes('stock') || n.title.toLowerCase().includes('tubes')) {
      navigate('/inventory');
    } else if (n.title.toLowerCase().includes('collection') || n.title.toLowerCase().includes('home')) {
      navigate('/home-collection');
    } else {
      navigate('/quality');
    }
  };

  const typeConfig: Record<string, { badge: string; icon: React.ElementType; color: string; border: string }> = {
    critical: { badge: 'Critical', icon: AlertTriangle, color: 'bg-rose-50 text-rose-800', border: 'border-l-rose-500' },
    important: { badge: 'Important', icon: AlertCircle, color: 'bg-amber-50 text-amber-800', border: 'border-l-amber-500' },
    reminder: { badge: 'Reminder', icon: Clock, color: 'bg-blue-50 text-blue-800', border: 'border-l-blue-500' },
    info: { badge: 'Information', icon: Info, color: 'bg-emerald-50 text-emerald-800', border: 'border-l-emerald-500' },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setNotificationsPanelOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs cursor-pointer"
        />

        {/* Slide-over Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md bg-surface-0 border-l border-surface-200 shadow-2xl z-10 flex flex-col h-full"
        >
          {/* Header */}
          <div className="p-4 border-b border-surface-200 bg-surface-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-surface-900">Notification Command</h3>
                <p className="text-[11px] text-surface-500">
                  {unreadCount} pending operator attention • <span className="capitalize">{user?.role?.replace('_', ' ') || 'Staff'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotificationsPanelOpen(false)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Tabs (Section 21) */}
          <div className="px-3 py-2 border-b border-surface-200 bg-surface-0 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
            {(['all', 'critical', 'important', 'reminder', 'info'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterMode(tab)}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer text-[11px]',
                  filterMode === tab
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-surface-50 text-surface-600 hover:bg-surface-100 border border-surface-200/50'
                )}
              >
                {tab === 'critical' ? '🚨 Critical' :
                 tab === 'important' ? '⚠️ Important' :
                 tab === 'reminder' ? '⏰ Reminder' :
                 tab === 'info' ? 'ℹ️ Info' : 'All'}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
            {filtered.map(n => {
              const cfg = typeConfig[n.type] || typeConfig.info;
              const Icon = cfg.icon;

              return (
                <div
                  key={n.id}
                  className={cn(
                    'p-3 rounded-xl border border-surface-200 border-l-4 transition-all text-xs flex flex-col justify-between space-y-2',
                    cfg.border,
                    n.read ? 'bg-surface-0 opacity-80' : 'bg-surface-50 shadow-2xs'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={cn('px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider', cfg.color)}>
                        {cfg.badge}
                      </span>
                      <span className="text-[10px] text-surface-400">
                        {new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="font-bold text-surface-900 text-[13px]">{n.title}</h4>
                    <p className="text-surface-600 mt-1 text-[11.5px] leading-relaxed">{n.message}</p>
                  </div>

                  <div className="pt-2 border-t border-surface-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-surface-400 font-mono">ID: {n.id}</span>
                    <button
                      onClick={() => handleAction(n)}
                      className="flex items-center gap-1 px-3 py-1 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors cursor-pointer text-[11px] shadow-2xs"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-surface-700">All alerts in this category resolved</p>
                <p className="text-[11px] text-surface-400">The operational queue is currently clear.</p>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-3 border-t border-surface-200 bg-surface-50/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-surface-500">Live Webhook Dispatch: Active</span>
            <button
              onClick={() => {
                notifications.forEach(n => markNotificationRead(n.id));
              }}
              className="text-brand-600 font-semibold hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
