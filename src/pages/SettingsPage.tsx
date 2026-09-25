import { Settings, Building2, TestTubes, FileText, Users, Bell, Shield, Globe, Palette, Database } from 'lucide-react';

const settingsSections = [
  { icon: Building2, label: 'Organization', desc: 'Company details, logo, branding, contact information', items: ['Company Name', 'Logo', 'Address', 'Contact', 'GST/Tax Details'] },
  { icon: TestTubes, label: 'Test Catalog', desc: 'Tests, profiles, packages, pricing, reference ranges', items: ['Individual Tests', 'Test Profiles', 'Health Packages', 'Pricing', 'Reference Ranges', 'Critical Values'] },
  { icon: FileText, label: 'Report Templates', desc: 'Configure report formats, headers, footers, disclaimers', items: ['Lab Report Template', 'Radiology Report Template', 'Invoice Template', 'Letterhead'] },
  { icon: Users, label: 'Departments', desc: 'Laboratory departments, radiology modalities', items: ['Hematology', 'Biochemistry', 'Microbiology', 'Immunology', 'Radiology'] },
  { icon: Bell, label: 'Notifications', desc: 'Notification rules, channels, templates', items: ['Critical Value Alerts', 'Report Ready', 'Appointment Reminders', 'Payment Reminders'] },
  { icon: Shield, label: 'Security & Access', desc: 'Roles, permissions, password policies, session management', items: ['Roles', 'Permissions', 'Password Policy', 'Session Timeout', 'Two-Factor Auth'] },
  { icon: Globe, label: 'Localization', desc: 'Language, date format, currency, timezone', items: ['Language', 'Date Format', 'Currency', 'Timezone'] },
  { icon: Palette, label: 'Workflow Rules', desc: 'SLA rules, TAT targets, auto-escalation, approval workflows', items: ['TAT Targets', 'Escalation Rules', 'Approval Workflows', 'Auto-notifications'] },
  { icon: Database, label: 'Integrations', desc: 'PACS, DICOM, Analyzers, SMS Gateway, Payment Gateway', items: ['Analyzer Interfaces', 'PACS/DICOM', 'SMS Gateway', 'WhatsApp API', 'Payment Gateway'] },
];

export default function SettingsPage() {
  return (
    <div className="fade-in space-y-5">
      <div><h1 className="text-xl font-bold text-surface-900">Settings</h1><p className="text-[13px] text-surface-500">System configuration & preferences</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsSections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.label} className="bg-surface-0 border border-surface-200 rounded-xl p-5 hover:border-brand-300 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <Icon className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-surface-900">{section.label}</p>
                  <p className="text-[11px] text-surface-500">{section.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {section.items.map(item => (
                  <span key={item} className="text-[11px] px-2 py-0.5 bg-surface-50 border border-surface-200 rounded text-surface-600">{item}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
