import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  User, Phone, Mail, MapPin, Heart, Droplets, Globe, Building2,
  Calendar, FileText, TestTubes, Scan, Receipt, Clock,
  ArrowLeft, Edit, MoreHorizontal, Activity, CheckCircle2,
  AlertTriangle, ChevronRight, Shield, Eye
} from 'lucide-react';

type TabId = 'overview' | 'appointments' | 'orders' | 'laboratory' | 'radiology' | 'reports' | 'billing' | 'timeline';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, openDicomViewer } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const patient = data.patients.find(p => p.id === id);
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <User className="w-12 h-12 text-surface-300 mb-4" />
        <h2 className="text-lg font-semibold text-surface-700">Patient Not Found</h2>
        <p className="text-[13px] text-surface-500 mt-1">The patient record could not be located.</p>
        <Link to="/patients" className="mt-4 text-brand-600 text-[13px] font-medium hover:underline">← Back to Patients</Link>
      </div>
    );
  }

  const patientOrders = data.orders.filter(o => o.patientId === patient.id);
  const patientAppointments = data.appointments.filter(a => a.patientId === patient.id);
  const patientResults = data.labResults.filter(r => r.patientId === patient.id);
  const patientReports = data.reports.filter(r => r.patientId === patient.id);
  const patientImaging = data.imagingStudies.filter(s => s.patientId === patient.id);
  const patientInvoices = data.invoices.filter(i => i.patientId === patient.id);

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments', count: patientAppointments.length },
    { id: 'orders', label: 'Orders', count: patientOrders.length },
    { id: 'laboratory', label: 'Laboratory', count: patientResults.length },
    { id: 'radiology', label: 'Radiology', count: patientImaging.length },
    { id: 'reports', label: 'Reports', count: patientReports.length },
    { id: 'billing', label: 'Billing', count: patientInvoices.length },
    { id: 'timeline', label: 'Timeline' },
  ];

  // Build timeline
  const timeline = useMemo(() => {
    const events: { date: string; time: string; title: string; type: string; detail: string }[] = [];
    patientOrders.forEach(o => {
      events.push({ date: o.createdAt.split('T')[0], time: new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), title: 'Order Created', type: 'order', detail: `${o.orderId} — ${o.testNames.join(', ')}` });
      if (o.collectedAt) events.push({ date: o.collectedAt.split('T')[0], time: new Date(o.collectedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), title: 'Sample Collected', type: 'sample', detail: o.orderId });
      if (o.verifiedAt) events.push({ date: o.verifiedAt.split('T')[0], time: new Date(o.verifiedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), title: 'Report Verified', type: 'report', detail: o.orderId });
    });
    return events.sort((a, b) => b.date.localeCompare(a.date));
  }, [patientOrders]);

  const statusColor: Record<string, string> = {
    'Booked': 'bg-surface-100 text-surface-600', 'Confirmed': 'bg-brand-50 text-brand-700',
    'Collected': 'bg-info-50 text-info-700', 'Processing': 'bg-warning-50 text-warning-700',
    'Completed': 'bg-success-50 text-success-700', 'Verified': 'bg-success-100 text-success-700',
    'Reported': 'bg-success-50 text-success-700', 'Cancelled': 'bg-danger-50 text-danger-700',
    'Scheduled': 'bg-brand-50 text-brand-700', 'Checked In': 'bg-info-50 text-info-700',
    'In Progress': 'bg-warning-50 text-warning-700', 'No Show': 'bg-danger-50 text-danger-700',
    'Generated': 'bg-warning-50 text-warning-700', 'Sent': 'bg-info-50 text-info-700',
    'Delivered': 'bg-success-50 text-success-700', 'Viewed': 'bg-success-100 text-success-700',
    'Pending': 'bg-surface-100 text-surface-600', 'Paid': 'bg-success-50 text-success-700',
    'Partial': 'bg-warning-50 text-warning-700',
  };

  return (
    <div className="fade-in space-y-5">
      {/* Back */}
      <Link to="/patients" className="inline-flex items-center gap-1.5 text-[13px] text-surface-500 hover:text-surface-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Patients
      </Link>

      {/* Patient Header */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-brand-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-surface-900">{patient.fullName}</h1>
                <p className="text-[13px] text-surface-500 mt-0.5 font-mono">{patient.patientId}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-surface-200 rounded-lg text-[13px] text-surface-600 hover:bg-surface-50">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button className="p-2 border border-surface-200 rounded-lg text-surface-500 hover:bg-surface-50">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
              <div className="flex items-center gap-2 text-[12px] text-surface-600">
                <Calendar className="w-3.5 h-3.5 text-surface-400" />
                <span>{patient.age}y, {patient.gender}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-surface-600">
                <Phone className="w-3.5 h-3.5 text-surface-400" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-surface-600">
                <Mail className="w-3.5 h-3.5 text-surface-400" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-surface-600">
                <Droplets className="w-3.5 h-3.5 text-danger-400" />
                <span>{patient.bloodGroup}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-surface-600">
                <MapPin className="w-3.5 h-3.5 text-surface-400" />
                <span className="truncate">{patient.city}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-surface-600">
                <Globe className="w-3.5 h-3.5 text-surface-400" />
                <span>{patient.preferredLanguage}</span>
              </div>
            </div>
            {patient.allergies[0] !== 'None' && (
              <div className="mt-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-danger-500" />
                <span className="text-[12px] font-medium text-danger-600 bg-danger-50 px-2 py-0.5 rounded-full">
                  Allergies: {patient.allergies.join(', ')}
                </span>
              </div>
            )}
            {patient.insuranceProvider && (
              <div className="mt-2 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-[12px] text-surface-600">{patient.insuranceProvider} — {patient.insuranceId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="fade-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="metric-card">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-brand-500" />
                  <span className="text-[12px] font-medium text-surface-500">Total Orders</span>
                </div>
                <p className="text-2xl font-bold text-surface-900">{patientOrders.length}</p>
              </div>
              <div className="metric-card">
                <div className="flex items-center gap-2 mb-2">
                  <TestTubes className="w-4 h-4 text-info-500" />
                  <span className="text-[12px] font-medium text-surface-500">Lab Results</span>
                </div>
                <p className="text-2xl font-bold text-surface-900">{patientResults.length}</p>
              </div>
              <div className="metric-card">
                <div className="flex items-center gap-2 mb-2">
                  <Scan className="w-4 h-4 text-brand-500" />
                  <span className="text-[12px] font-medium text-surface-500">Imaging Studies</span>
                </div>
                <p className="text-2xl font-bold text-surface-900">{patientImaging.length}</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-2 bg-surface-0 border border-surface-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-surface-900 mb-4">Recent Activity</h3>
              {timeline.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                  <p className="text-[13px] text-surface-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {timeline.slice(0, 10).map((event, i) => (
                    <div key={i} className="flex gap-3 py-2.5 border-b border-surface-100 last:border-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        event.type === 'order' ? 'bg-brand-50' : event.type === 'sample' ? 'bg-info-50' : 'bg-success-50'
                      }`}>
                        {event.type === 'order' ? <FileText className="w-4 h-4 text-brand-500" /> :
                         event.type === 'sample' ? <TestTubes className="w-4 h-4 text-info-500" /> :
                         <CheckCircle2 className="w-4 h-4 text-success-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-surface-900">{event.title}</p>
                        <p className="text-[12px] text-surface-500 truncate">{event.detail}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[12px] text-surface-500">{event.time}</p>
                        <p className="text-[11px] text-surface-400">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
            {patientOrders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-[13px] text-surface-500">No orders found for this patient.</p>
                <button className="mt-3 text-brand-600 text-[13px] font-medium hover:underline">Create New Order</button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Tests</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patientOrders.map(order => (
                    <tr key={order.id}>
                      <td><span className="font-mono text-[12px]">{order.orderId}</span></td>
                      <td>
                        <span className="text-[12px]">{order.testNames[0]}{order.testNames.length > 1 ? ` +${order.testNames.length - 1}` : ''}</span>
                      </td>
                      <td><span className="text-[12px]">{order.doctorName}</span></td>
                      <td><span className={`status-badge ${statusColor[order.status] || ''}`}>{order.status}</span></td>
                      <td>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          order.priority === 'STAT' ? 'bg-danger-500 text-white' :
                          order.priority === 'Urgent' ? 'bg-danger-50 text-danger-700' :
                          'bg-surface-100 text-surface-600'
                        }`}>{order.priority}</span>
                      </td>
                      <td><span className="text-[12px] font-medium">₹{order.totalAmount.toLocaleString('en-IN')}</span></td>
                      <td><span className="text-[12px] text-surface-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'laboratory' && (
          <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
            {patientResults.length === 0 ? (
              <div className="text-center py-12">
                <TestTubes className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-[13px] text-surface-500">No lab results found for this patient.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Department</th>
                    <th>Result</th>
                    <th>Reference Range</th>
                    <th>Status</th>
                    <th>Flags</th>
                    <th>Verified By</th>
                  </tr>
                </thead>
                <tbody>
                  {patientResults.map(result => (
                    <tr key={result.id}>
                      <td><span className="text-[13px] font-medium">{result.testName}</span></td>
                      <td><span className="text-[12px] text-surface-500">{result.department}</span></td>
                      <td>
                        <span className={`text-[13px] font-semibold ${result.isCritical ? 'text-danger-600' : result.isAbnormal ? 'text-warning-600' : 'text-surface-900'}`}>
                          {result.value} {result.unit}
                        </span>
                      </td>
                      <td><span className="text-[12px] text-surface-500">{result.referenceRange}</span></td>
                      <td><span className={`status-badge ${statusColor[result.status] || ''}`}>{result.status}</span></td>
                      <td>
                        <div className="flex gap-1">
                          {result.isCritical && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-danger-600 bg-danger-50 px-1.5 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" /> CRITICAL
                            </span>
                          )}
                          {result.isAbnormal && !result.isCritical && (
                            <span className="text-[10px] font-bold text-warning-600 bg-warning-50 px-1.5 py-0.5 rounded">ABNORMAL</span>
                          )}
                        </div>
                      </td>
                      <td><span className="text-[12px] text-surface-500">{result.verifiedBy || '—'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
            {patientAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-[13px] text-surface-500">No appointments found.</p>
                <button className="mt-3 text-brand-600 text-[13px] font-medium hover:underline">Book Appointment</button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>ID</th><th>Type</th><th>Date</th><th>Time</th><th>Status</th><th>Branch</th></tr>
                </thead>
                <tbody>
                  {patientAppointments.map(apt => (
                    <tr key={apt.id}>
                      <td><span className="font-mono text-[12px]">{apt.appointmentId}</span></td>
                      <td><span className="text-[12px]">{apt.type}</span></td>
                      <td><span className="text-[12px]">{apt.date}</span></td>
                      <td><span className="text-[12px]">{apt.time}</span></td>
                      <td><span className={`status-badge ${statusColor[apt.status] || ''}`}>{apt.status}</span></td>
                      <td><span className="text-[12px] text-surface-500">{apt.branchId}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'radiology' && (
          <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
            {patientImaging.length === 0 ? (
              <div className="text-center py-12">
                <Scan className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-[13px] text-surface-500">No imaging studies found.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Study ID</th><th>Modality</th><th>Body Part</th><th>Status</th><th>Radiologist</th><th>Date</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {patientImaging.map(study => (
                    <tr key={study.id}>
                      <td><span className="font-mono text-[12px]">{study.studyId}</span></td>
                      <td><span className="text-[12px] font-medium">{study.modality}</span></td>
                      <td><span className="text-[12px]">{study.bodyPart}</span></td>
                      <td><span className={`status-badge ${statusColor[study.status] || ''}`}>{study.status}</span></td>
                      <td><span className="text-[12px]">{study.radiologist || '—'}</span></td>
                      <td><span className="text-[12px]">{new Date(study.scheduledAt).toLocaleDateString('en-IN')}</span></td>
                      <td>
                        <button
                          onClick={() => openDicomViewer(study)}
                          className="px-2 py-1 text-[11px] font-semibold bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>PACS View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
            {patientReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-[13px] text-surface-500">No reports available.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Report ID</th><th>Tests</th><th>Status</th><th>Verified By</th><th>Delivery</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {patientReports.map(report => (
                    <tr key={report.id}>
                      <td><span className="font-mono text-[12px]">{report.reportId}</span></td>
                      <td><span className="text-[12px]">{report.testNames.join(', ')}</span></td>
                      <td><span className={`status-badge ${statusColor[report.status] || ''}`}>{report.status}</span></td>
                      <td><span className="text-[12px]">{report.verifiedBy || '—'}</span></td>
                      <td><span className="text-[12px]">{report.deliveryMethod || '—'}</span></td>
                      <td><span className="text-[12px]">{report.generatedAt ? new Date(report.generatedAt).toLocaleDateString('en-IN') : '—'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
            {patientInvoices.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-[13px] text-surface-500">No billing records found.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Invoice</th><th>Amount</th><th>Discount</th><th>Total</th><th>Paid</th><th>Balance</th><th>Method</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {patientInvoices.map(inv => (
                    <tr key={inv.id}>
                      <td><span className="font-mono text-[12px]">{inv.invoiceId}</span></td>
                      <td>₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td>₹{inv.discount.toLocaleString('en-IN')}</td>
                      <td className="font-medium">₹{inv.total.toLocaleString('en-IN')}</td>
                      <td className="text-success-600">₹{inv.paid.toLocaleString('en-IN')}</td>
                      <td className={inv.balance > 0 ? 'text-danger-600 font-medium' : ''}>₹{inv.balance.toLocaleString('en-IN')}</td>
                      <td><span className="text-[12px]">{inv.paymentMethod}</span></td>
                      <td><span className={`status-badge ${statusColor[inv.status] || ''}`}>{inv.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
            {timeline.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-[13px] text-surface-500">No timeline events available.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-200" />
                {timeline.map((event, i) => (
                  <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      event.type === 'order' ? 'bg-brand-50 border-2 border-brand-200' :
                      event.type === 'sample' ? 'bg-info-50 border-2 border-info-200' :
                      'bg-success-50 border-2 border-success-200'
                    }`}>
                      {event.type === 'order' ? <FileText className="w-3.5 h-3.5 text-brand-500" /> :
                       event.type === 'sample' ? <TestTubes className="w-3.5 h-3.5 text-info-500" /> :
                       <CheckCircle2 className="w-3.5 h-3.5 text-success-500" />}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-medium text-surface-900">{event.title}</p>
                        <p className="text-[12px] text-surface-400 flex-shrink-0">{event.date} {event.time}</p>
                      </div>
                      <p className="text-[12px] text-surface-500 mt-0.5">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
