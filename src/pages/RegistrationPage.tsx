import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Search, Plus, User, Phone, ClipboardList, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

export default function RegistrationPage() {
  const { data } = useAppStore();
  const [step, setStep] = useState<'search' | 'form'>('search');
  const [searchPhone, setSearchPhone] = useState('');
  const [matchedPatient, setMatchedPatient] = useState<typeof data.patients[0] | null>(null);

  const handleSearch = () => {
    const match = data.patients.find(p => p.phone.includes(searchPhone));
    setMatchedPatient(match || null);
    if (!match) setStep('form');
  };

  return (
    <div className="fade-in space-y-5">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Patient Registration</h1>
        <p className="text-[13px] text-surface-500 mt-0.5">Fast registration with duplicate detection</p>
      </div>

      {/* Registration Steps */}
      <div className="flex items-center gap-3 mb-6">
        {['Search', 'Patient Info', 'Test Selection', 'Billing'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
              i === 0 ? 'bg-brand-600 text-white' : 'bg-surface-200 text-surface-500'
            }`}>{i + 1}</div>
            <span className={`text-[13px] font-medium ${i === 0 ? 'text-surface-900' : 'text-surface-400'}`}>{s}</span>
            {i < 3 && <div className="w-8 h-px bg-surface-200" />}
          </div>
        ))}
      </div>

      {step === 'search' && (
        <div className="max-w-xl mx-auto">
          <div className="bg-surface-0 border border-surface-200 rounded-xl p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-3">
                <User className="w-7 h-7 text-brand-500" />
              </div>
              <h2 className="text-lg font-semibold text-surface-900">Find or Register Patient</h2>
              <p className="text-[13px] text-surface-500 mt-1">Search by phone number or patient ID to check existing records</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-surface-700 mb-1.5">Phone Number or Patient ID</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Enter phone number or patient ID..."
                    value={searchPhone}
                    onChange={e => setSearchPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleSearch} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700 transition-colors">
                  <Search className="w-4 h-4" /> Search
                </button>
                <button onClick={() => setStep('form')} className="flex items-center gap-2 px-4 py-2.5 border border-surface-200 rounded-lg text-[13px] text-surface-700 hover:bg-surface-50 transition-colors">
                  <Plus className="w-4 h-4" /> New Patient
                </button>
              </div>

              {matchedPatient && (
                <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning-600" />
                    <span className="text-[13px] font-semibold text-warning-800">Possible Match Found</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-surface-0 rounded-lg border border-surface-200">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                      <User className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-surface-900">{matchedPatient.fullName}</p>
                      <p className="text-[12px] text-surface-500">{matchedPatient.patientId} • {matchedPatient.phone} • {matchedPatient.age}y {matchedPatient.gender}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-[12px] font-medium hover:bg-brand-700">
                      Select
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface-0 border border-surface-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-surface-900 mb-4">New Patient Registration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'First Name', placeholder: 'Enter first name', required: true },
                { label: 'Last Name', placeholder: 'Enter last name', required: true },
                { label: 'Phone Number', placeholder: '+91', required: true },
                { label: 'Email', placeholder: 'email@example.com' },
                { label: 'Date of Birth', placeholder: 'DD/MM/YYYY', type: 'date' },
                { label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                { label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
                { label: 'Preferred Language', type: 'select', options: ['English', 'Telugu', 'Hindi'] },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-[12px] font-medium text-surface-700 mb-1.5">
                    {field.label} {field.required && <span className="text-danger-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select className="w-full px-3 py-2.5 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                      <option value="">Select {field.label}</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                    />
                  )}
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-[12px] font-medium text-surface-700 mb-1.5">Address</label>
                <textarea
                  placeholder="Enter full address"
                  rows={2}
                  className="w-full px-3 py-2.5 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-surface-700 mb-1.5">Emergency Contact Name</label>
                <input type="text" placeholder="Emergency contact name" className="w-full px-3 py-2.5 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-surface-700 mb-1.5">Emergency Contact Phone</label>
                <input type="text" placeholder="+91" className="w-full px-3 py-2.5 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-surface-700 mb-1.5">Insurance Provider</label>
                <input type="text" placeholder="Optional" className="w-full px-3 py-2.5 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-surface-700 mb-1.5">Insurance ID</label>
                <input type="text" placeholder="Optional" className="w-full px-3 py-2.5 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-200">
              <button onClick={() => setStep('search')} className="text-[13px] text-surface-600 hover:text-surface-800">← Back to Search</button>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-surface-200 rounded-lg text-[13px] text-surface-600 hover:bg-surface-50">Cancel</button>
                <button className="px-6 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700">Register & Continue</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
