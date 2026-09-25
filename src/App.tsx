import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from './components/layout/AppLayout';

// Public & Auth Pages
const LandingPage = lazy(() => import('./features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage })));

// Core Operational Pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ReceptionPage = lazy(() => import('./pages/ReceptionPage'));
const ConsultationsPage = lazy(() => import('./pages/ConsultationsPage'));
const PatientsPage = lazy(() => import('./pages/PatientsPage'));
const PatientDetailPage = lazy(() => import('./pages/PatientDetailPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const SamplesPage = lazy(() => import('./pages/SamplesPage'));
const LaboratoryPage = lazy(() => import('./pages/LaboratoryPage'));
const RadiologyPage = lazy(() => import('./pages/RadiologyPage'));
const PathologyPage = lazy(() => import('./pages/PathologyPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage'));
const HomeCollectionPage = lazy(() => import('./pages/HomeCollectionPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const QualityPage = lazy(() => import('./pages/QualityPage'));
const CommunicationPage = lazy(() => import('./pages/CommunicationPage'));
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const StaffPage = lazy(() => import('./pages/StaffPage'));
const BranchesPage = lazy(() => import('./pages/BranchesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-4 w-64" />
      <div className="grid grid-cols-4 gap-4 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>
      <div className="skeleton h-64 rounded-xl mt-4" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public SaaS & Presentation Routes */}
      <Route path="/landing" element={<Suspense fallback={<PageLoader />}><LandingPage /></Suspense>} />
      <Route path="/overview" element={<Suspense fallback={<PageLoader />}><LandingPage /></Suspense>} />
      <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />

      {/* Main Diagnostic Center Protected Workspace */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
        <Route path="/reception" element={<Suspense fallback={<PageLoader />}><ReceptionPage /></Suspense>} />
        <Route path="/consultations" element={<Suspense fallback={<PageLoader />}><ConsultationsPage /></Suspense>} />
        <Route path="/patients" element={<Suspense fallback={<PageLoader />}><PatientsPage /></Suspense>} />
        <Route path="/patients/:id" element={<Suspense fallback={<PageLoader />}><PatientDetailPage /></Suspense>} />
        <Route path="/appointments" element={<Suspense fallback={<PageLoader />}><AppointmentsPage /></Suspense>} />
        <Route path="/registration" element={<Suspense fallback={<PageLoader />}><RegistrationPage /></Suspense>} />
        <Route path="/billing" element={<Suspense fallback={<PageLoader />}><BillingPage /></Suspense>} />
        <Route path="/samples" element={<Suspense fallback={<PageLoader />}><SamplesPage /></Suspense>} />
        <Route path="/laboratory" element={<Suspense fallback={<PageLoader />}><LaboratoryPage /></Suspense>} />
        <Route path="/radiology" element={<Suspense fallback={<PageLoader />}><RadiologyPage /></Suspense>} />
        <Route path="/pathology" element={<Suspense fallback={<PageLoader />}><PathologyPage /></Suspense>} />
        <Route path="/reports" element={<Suspense fallback={<PageLoader />}><ReportsPage /></Suspense>} />
        <Route path="/doctors" element={<Suspense fallback={<PageLoader />}><DoctorsPage /></Suspense>} />
        <Route path="/home-collection" element={<Suspense fallback={<PageLoader />}><HomeCollectionPage /></Suspense>} />
        <Route path="/inventory" element={<Suspense fallback={<PageLoader />}><InventoryPage /></Suspense>} />
        <Route path="/quality" element={<Suspense fallback={<PageLoader />}><QualityPage /></Suspense>} />
        <Route path="/communication" element={<Suspense fallback={<PageLoader />}><CommunicationPage /></Suspense>} />
        <Route path="/ai-assistant" element={<Suspense fallback={<PageLoader />}><AIAssistantPage /></Suspense>} />
        <Route path="/analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
        <Route path="/finance" element={<Suspense fallback={<PageLoader />}><FinancePage /></Suspense>} />
        <Route path="/staff" element={<Suspense fallback={<PageLoader />}><StaffPage /></Suspense>} />
        <Route path="/branches" element={<Suspense fallback={<PageLoader />}><BranchesPage /></Suspense>} />
        <Route path="/settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
        <Route path="/admin/users" element={<Suspense fallback={<PageLoader />}><UserManagementPage /></Suspense>} />

        {/* Catch-all */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-xl font-bold text-surface-900">404 — Page Not Found</h2>
            <p className="text-[13px] text-surface-500 mt-2">The page you're looking for doesn't exist.</p>
            <a href="/" className="mt-4 text-brand-600 text-[13px] font-medium hover:underline">Go to Dashboard</a>
          </div>
        } />
      </Route>
    </Routes>
  );
}
