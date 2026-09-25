import { create } from 'zustand';
import { getDemoData } from '../data/demoData';
import type { DemoData, Notification, Branch } from '../data/demoData';

interface AppState {
  // ── UI State ──
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  activeBranch: Branch;
  setActiveBranch: (branch: Branch) => void;
  notificationsPanelOpen: boolean;
  setNotificationsPanelOpen: (open: boolean) => void;
  toggleNotificationsPanel: () => void;

  // ── Quick Create Modal ──
  quickCreateOpen: boolean;
  setQuickCreateOpen: (open: boolean) => void;
  toggleQuickCreate: () => void;

  // ── Floating Diagnostic Copilot ──
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  toggleCopilot: () => void;
  copilotInitialQuery?: string;
  setCopilotInitialQuery: (query?: string) => void;

  // ── Zero-Footprint PACS DICOM Viewer ──
  dicomViewerOpen: boolean;
  selectedDicomStudy?: any;
  openDicomViewer: (studyOrId?: any) => void;
  closeDicomViewer: () => void;

  // ── Quick View Drawer ──
  quickViewDrawer: {
    open: boolean;
    type: 'patient' | 'order' | 'sample' | 'report' | 'appointment' | 'invoice' | 'action_item' | null;
    data: any;
  };
  openQuickView: (type: 'patient' | 'order' | 'sample' | 'report' | 'appointment' | 'invoice' | 'action_item', data: any) => void;
  closeQuickView: () => void;

  // ── Role Dashboard Switcher ──
  dashboardRole: 'all' | 'receptionist' | 'lab_supervisor' | 'pathologist' | 'radiologist' | 'home_collection' | 'management';
  setDashboardRole: (role: 'all' | 'receptionist' | 'lab_supervisor' | 'pathologist' | 'radiologist' | 'home_collection' | 'management') => void;

  // ── Data ──
  data: DemoData;
  markNotificationRead: (id: string) => void;
  unreadNotificationCount: number;
}

export const useAppStore = create<AppState>((set, get) => {
  const data = getDemoData();

  return {
    // UI
    sidebarCollapsed: false,
    toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    commandPaletteOpen: false,
    setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    activeBranch: data.branches[0],
    setActiveBranch: (branch) => set({ activeBranch: branch }),
    notificationsPanelOpen: false,
    setNotificationsPanelOpen: (open) => set({ notificationsPanelOpen: open }),
    toggleNotificationsPanel: () => set(s => ({ notificationsPanelOpen: !s.notificationsPanelOpen })),

    // Quick Create Modal
    quickCreateOpen: false,
    setQuickCreateOpen: (open) => set({ quickCreateOpen: open }),
    toggleQuickCreate: () => set(s => ({ quickCreateOpen: !s.quickCreateOpen })),

    // Floating Diagnostic Copilot
    copilotOpen: false,
    setCopilotOpen: (open) => set({ copilotOpen: open }),
    toggleCopilot: () => set(s => ({ copilotOpen: !s.copilotOpen })),
    copilotInitialQuery: undefined,
    setCopilotInitialQuery: (query) => set({ copilotInitialQuery: query, copilotOpen: true }),

    // Zero-Footprint PACS DICOM Viewer
    dicomViewerOpen: false,
    selectedDicomStudy: null,
    openDicomViewer: (studyOrId) => set({ dicomViewerOpen: true, selectedDicomStudy: studyOrId }),
    closeDicomViewer: () => set({ dicomViewerOpen: false, selectedDicomStudy: null }),

    // Quick View Drawer
    quickViewDrawer: {
      open: false,
      type: null,
      data: null,
    },
    openQuickView: (type, data) => set({
      quickViewDrawer: { open: true, type, data }
    }),
    closeQuickView: () => set(s => ({
      quickViewDrawer: { ...s.quickViewDrawer, open: false }
    })),

    // Role Dashboard Switcher
    dashboardRole: 'all',
    setDashboardRole: (role) => set({ dashboardRole: role }),

    // Data
    data,
    unreadNotificationCount: data.notifications.filter(n => !n.read).length,
    markNotificationRead: (id) => set(s => {
      const notifications = s.data.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        data: { ...s.data, notifications },
        unreadNotificationCount: notifications.filter(n => !n.read).length,
      };
    }),
  };
});
