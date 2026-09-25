import { UserCog, Search, Shield, Plus } from 'lucide-react';

const staffMembers = [
  { name: 'Dr. Padma Rao', role: 'Pathologist', dept: 'Laboratory', branch: 'BH', status: 'Active', phone: '+91 98765 43210' },
  { name: 'Dr. Krishna Murthy', role: 'Pathologist', dept: 'Laboratory', branch: 'BH', status: 'Active', phone: '+91 98765 43211' },
  { name: 'Dr. Suresh Iyer', role: 'Radiologist', dept: 'Radiology', branch: 'BH', status: 'Active', phone: '+91 98765 43212' },
  { name: 'Dr. Meena Nair', role: 'Radiologist', dept: 'Radiology', branch: 'MP', status: 'Active', phone: '+91 98765 43213' },
  { name: 'Srinivas T.', role: 'Lab Technician', dept: 'Hematology', branch: 'BH', status: 'Active', phone: '+91 98765 43214' },
  { name: 'Meena K.', role: 'Lab Technician', dept: 'Biochemistry', branch: 'BH', status: 'Active', phone: '+91 98765 43215' },
  { name: 'Ramesh K.', role: 'Phlebotomist', dept: 'Collection', branch: 'BH', status: 'Active', phone: '+91 98765 43216' },
  { name: 'Sunitha P.', role: 'Phlebotomist', dept: 'Collection', branch: 'MP', status: 'Active', phone: '+91 98765 43217' },
  { name: 'Kavitha R.', role: 'Receptionist', dept: 'Front Desk', branch: 'BH', status: 'Active', phone: '+91 98765 43218' },
  { name: 'Pavan Kumar', role: 'Home Collection', dept: 'Field', branch: 'BH', status: 'Active', phone: '+91 98765 43219' },
  { name: 'Priya Sharma', role: 'Branch Manager', dept: 'Management', branch: 'MP', status: 'Active', phone: '+91 98765 43220' },
  { name: 'Mohan K.', role: 'Inventory Manager', dept: 'Operations', branch: 'BH', status: 'Active', phone: '+91 98765 43221' },
];

const roles = [
  { name: 'Super Admin', users: 1, permissions: 'Full Access' },
  { name: 'Branch Admin', users: 5, permissions: 'Branch Operations, Staff, Reports' },
  { name: 'Pathologist', users: 4, permissions: 'Results, Verification, Reports' },
  { name: 'Radiologist', users: 3, permissions: 'Studies, Reporting, Verification' },
  { name: 'Lab Technician', users: 8, permissions: 'Result Entry, Samples' },
  { name: 'Phlebotomist', users: 6, permissions: 'Collection, Samples, Barcodes' },
  { name: 'Receptionist', users: 5, permissions: 'Registration, Appointments, Billing' },
  { name: 'Finance Manager', users: 2, permissions: 'Billing, Payments, Reports' },
];

export default function StaffPage() {
  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-surface-900">Staff Management</h1><p className="text-[13px] text-surface-500">{staffMembers.length} staff members</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700"><Plus className="w-4 h-4" />Add Staff</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-200"><h3 className="text-sm font-semibold text-surface-900">Staff Directory</h3></div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Branch</th><th>Phone</th><th>Status</th></tr></thead>
            <tbody>
              {staffMembers.map((s, i) => (
                <tr key={i}>
                  <td className="text-[13px] font-medium">{s.name}</td>
                  <td><span className="text-[11px] px-2 py-0.5 bg-brand-50 text-brand-700 rounded">{s.role}</span></td>
                  <td className="text-[12px]">{s.dept}</td>
                  <td className="text-[12px]">{s.branch}</td>
                  <td className="text-[12px]">{s.phone}</td>
                  <td><span className="status-badge bg-success-50 text-success-700">{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-brand-500" />Roles & Permissions</h3>
          <div className="space-y-2">
            {roles.map(role => (
              <div key={role.name} className="p-3 border border-surface-200 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between"><span className="text-[13px] font-medium text-surface-900">{role.name}</span><span className="text-[11px] text-surface-400">{role.users} users</span></div>
                <p className="text-[11px] text-surface-500 mt-0.5">{role.permissions}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
