import { MessageSquare, Send, Mail, Phone, Bell, CheckCircle2 } from 'lucide-react';

export default function CommunicationPage() {
  const channels = [
    { name: 'WhatsApp', sent: 1245, delivered: 1198, icon: '💬', color: 'bg-success-50 text-success-700' },
    { name: 'SMS', sent: 856, delivered: 823, icon: '📱', color: 'bg-brand-50 text-brand-700' },
    { name: 'Email', sent: 432, delivered: 410, icon: '📧', color: 'bg-info-50 text-info-700' },
    { name: 'In-App', sent: 678, delivered: 678, icon: '🔔', color: 'bg-warning-50 text-warning-700' },
  ];
  const templates = [
    'Appointment Confirmation', 'Appointment Reminder', 'Report Ready', 'Payment Reminder',
    'Critical Result Alert', 'Home Collection Confirmation', 'Sample Recollection', 'Follow-up Reminder',
  ];
  const recentMessages = [
    { patient: 'Lakshmi Reddy', template: 'Report Ready', channel: 'WhatsApp', status: 'Delivered', time: '10 min ago' },
    { patient: 'Rajesh Kumar', template: 'Critical Result Alert', channel: 'SMS + Call', status: 'Delivered', time: '25 min ago' },
    { patient: 'Priya Sharma', template: 'Appointment Reminder', channel: 'WhatsApp', status: 'Sent', time: '1 hour ago' },
    { patient: 'Suresh Rao', template: 'Payment Reminder', channel: 'SMS', status: 'Delivered', time: '2 hours ago' },
    { patient: 'Divya Patel', template: 'Home Collection Confirmation', channel: 'WhatsApp', status: 'Delivered', time: '3 hours ago' },
  ];

  return (
    <div className="fade-in space-y-5">
      <div><h1 className="text-xl font-bold text-surface-900">Communication Center</h1><p className="text-[13px] text-surface-500">Multi-channel patient communication</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {channels.map(ch => (
          <div key={ch.name} className="metric-card">
            <div className="flex items-center gap-2 mb-2"><span className="text-lg">{ch.icon}</span><span className="text-[12px] text-surface-500">{ch.name}</span></div>
            <p className="text-2xl font-bold">{ch.sent}</p>
            <p className="text-[11px] text-surface-400">{ch.delivered} delivered</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Recent Messages</h3>
          <div className="space-y-0">
            {recentMessages.map((msg, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
                <div><p className="text-[13px] font-medium text-surface-900">{msg.patient}</p><p className="text-[12px] text-surface-500">{msg.template} via {msg.channel}</p></div>
                <div className="text-right"><span className={`status-badge ${msg.status === 'Delivered' ? 'bg-success-50 text-success-700' : 'bg-info-50 text-info-700'}`}>{msg.status}</span><p className="text-[11px] text-surface-400 mt-1">{msg.time}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Templates</h3>
          <div className="space-y-1">
            {templates.map(t => (
              <div key={t} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors">
                <span className="text-[13px] text-surface-700">{t}</span>
                <Send className="w-3.5 h-3.5 text-surface-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
