import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bell, AlertTriangle, AlertCircle, Clock, Info, CheckCheck,
  CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/cn';

export function NotificationPanel() {
  const { notificationsPanelOpen, setNotificationsPanelOpen, data, markNotificationRead } = useAppStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'unread'>('all');

  const notifications = data.notifications || [];

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (filterMode === 'critical') return n.type === 'critical';
      if (filterMode === 'unread') return !n.read;
      return true;
    });
  }, [notifications, filterMode]);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!notificationsPanelOpen) return null;

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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-surface-900">Notifications & Alerts</h3>
                <p className="text-[11px] text-surface-500">
                  {unreadCount} unread · Active User: <strong className="text-surface-700 capitalize">{user?.role?.replace('_', ' ') || 'Staff'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotificationsPanelOpen(false)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-surface-200 bg-surface-0 flex items-center gap-1.5 text-xs">
            {(['all', 'critical', 'unread'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterMode(tab)}
                className={cn(
                  'px-3 py-1 rounded-full font-medium capitalize transition-colors',
                  filterMode === tab
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                )}
              >
                {tab === 'critical' ? '🚨 Panic / Critical' : tab}
              </button>
            ))}
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-success-500 mx-auto" />
                <p className="text-xs font-semibold text-surface-700">No notifications in this filter</p>
                <p className="text-[11px] text-surface-400">All panic values and alerts cleared.</p>
              </div>
            ) : (
              filtered.map(item => {
                const isCritical = item.type === 'critical';
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      markNotificationRead(item.id);
                      if (isCritical) navigate('/laboratory');
                      else if (item.title?.toLowerCase().includes('report')) navigate('/reports');
                      else if (item.title?.toLowerCase().includes('stock')) navigate('/inventory');
                      setNotificationsPanelOpen(false);
                    }}
                    className={cn(
                      'p-3.5 rounded-xl border text-xs transition-all cursor-pointer space-y-1.5 hover:shadow-xs',
                      isCritical
                        ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                        : item.read
                        ? 'bg-surface-0 border-surface-200 opacity-70'
                        : 'bg-brand-50/30 border-brand-200 hover:bg-brand-50/60'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold">
                        {isCritical ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-brand-600 shrink-0" />
                        )}
                        <span className={isCritical ? 'text-rose-900' : 'text-surface-900'}>
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-surface-400 font-mono whitespace-nowrap">
                        {item.timestamp || 'Just now'}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-surface-600 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-mono font-bold',
                          isCritical
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-surface-100 text-surface-600'
                        )}
                      >
                        {item.type || 'Alert'}
                      </span>
                      <span className="text-[11px] text-brand-600 font-medium flex items-center gap-0.5">
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
