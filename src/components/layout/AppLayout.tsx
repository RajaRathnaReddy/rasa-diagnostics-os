import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import CommandPalette from './CommandPalette';
import { NotificationPanel } from '../ui/NotificationPanel';
import { QuickCreateModal } from '../ui/QuickCreateModal';
import { FloatingCopilotWidget } from '../ui/FloatingCopilotWidget';
import { DicomViewerModal } from '../ui/DicomViewerModal';
import { QuickViewDrawer } from '../ui/QuickViewDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { useAppStore } from '../../store/useAppStore';

export default function AppLayout() {
  const { sidebarCollapsed, dicomViewerOpen, closeDicomViewer, selectedDicomStudy } = useAppStore();

  return (
    <div className="min-h-screen bg-surface-50 font-sans pb-16 md:pb-0">
      <Sidebar />
      <TopNav />
      <CommandPalette />
      <NotificationPanel />
      <QuickCreateModal />
      <QuickViewDrawer />
      <MobileBottomNav />
      <FloatingCopilotWidget />
      <DicomViewerModal
        isOpen={dicomViewerOpen}
        onClose={closeDicomViewer}
        study={selectedDicomStudy}
      />
      <main
        className={`pt-14 transition-[margin-left] duration-200 ${
          sidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
