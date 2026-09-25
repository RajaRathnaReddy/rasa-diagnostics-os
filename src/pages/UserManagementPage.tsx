import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  ShieldCheck, UserPlus, Search, Lock, Unlock, Trash2,
  Edit3, Eye, EyeOff, Building2, CheckCircle2, RefreshCw,
  KeyRound, Crown, AlertTriangle, X, ShieldAlert, Mail, Send
} from 'lucide-react';
import { useAuthStore, type ManagedUser, type UserRole } from '../stores/authStore';
import { cn } from '../lib/cn';

const roleBadgeStyles: Record<UserRole, { label: string; bg: string }> = {
  super_admin: { label: 'Master Admin', bg: 'bg-indigo-50 text-indigo-700' },
  pathologist: { label: 'Chief Pathologist', bg: 'bg-teal-50 text-teal-700' },
  radiologist: { label: 'Consultant Radiologist', bg: 'bg-purple-50 text-purple-700' },
  doctor: { label: 'Consulting Physician', bg: 'bg-sky-50 text-sky-700' },
  phlebotomist: { label: 'Phlebotomist', bg: 'bg-rose-50 text-rose-700' },
  billing_reception: { label: 'Billing & Front Desk', bg: 'bg-blue-50 text-blue-700' },
  lab_technician: { label: 'Lab Biochemist', bg: 'bg-emerald-50 text-emerald-700' },
  inventory_manager: { label: 'Inventory Lead', bg: 'bg-amber-50 text-amber-700' },
};

export default function UserManagementPage() {
  const {
    managedUsers,
    addUser,
    toggleBlockUser,
    deleteUser,
    updateUser,
    resetDemoUsers,
    sendPasswordReset,
    changeUserPasscode,
    user: currentLoggedInUser,
  } = useAuthStore();

  // Strictly protected for Raja Rathna Reddy
  const isOnlyRaja =
    currentLoggedInUser?.email?.toLowerCase() === 'a.rajarathnareddychenni@gmail.com' ||
    currentLoggedInUser?.id === 'user-raja-007' ||
    currentLoggedInUser?.name?.toLowerCase().trim() === 'raja rathna reddy';

  if (!isOnlyRaja) {
    return <Navigate to="/" replace />;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [passcodeModalUser, setPasscodeModalUser] = useState<ManagedUser | null>(null);
  const [newPasscodeValue, setNewPasscodeValue] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendResetEmail = async (u: ManagedUser) => {
    showToast(`Dispatching password reset link to ${u.email}...`);
    const res = await sendPasswordReset(u.email);
    showToast(res.message);
  };

  const handleSaveNewPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeModalUser) return;
    const res = changeUserPasscode(passcodeModalUser.id, newPasscodeValue);
    showToast(res.message);
    if (res.success) {
      setPasscodeModalUser(null);
      setNewPasscodeValue('');
    }
  };

  // Add User Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'pathologist' as UserRole,
    branchName: 'Banjara Hills (Central)',
    passcode: 'rasa2026',
    title: 'Senior Specialist',
    regNumber: 'MED-2026-001',
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required.');
      return;
    }

    const result = addUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+91 98765 00000',
      role: formData.role,
      branchName: formData.branchName,
      passcode: formData.passcode || 'rasa2026',
      title: formData.title,
      regNumber: formData.regNumber,
      permissions: {
        verifyLabReports: formData.role === 'pathologist' || formData.role === 'super_admin',
        signRadiologyStudies: formData.role === 'radiologist' || formData.role === 'super_admin',
        overridePanicValues: true,
        editBillingInvoices: formData.role === 'billing_reception' || formData.role === 'super_admin',
        manageReagents: true,
        exportAuditLogs: formData.role === 'super_admin',
      },
    });

    if (result.success) {
      showToast(result.message || 'Staff member registered successfully!');
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'pathologist',
        branchName: 'Banjara Hills (Central)',
        passcode: 'rasa2026',
        title: 'Senior Specialist',
        regNumber: 'MED-2026-001',
      });
    } else {
      showToast(result.message || 'Registration failed.');
    }
  };

  const filteredUsers = managedUsers.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch =
      !searchQuery.trim() ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="fade-in space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-900 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center font-bold text-xl">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                Master Security & Access Control Console
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                RAJA RATHNA REDDY ONLY
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              Manage diagnostic staff credentials, RBAC permissions, and security lockout states
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDemoUsers}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Staff</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff User</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-success-50 border border-success-200 text-success-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search staff by name, email, or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-xl text-xs"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-xl text-xs w-full sm:w-auto"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Master Admin</option>
          <option value="pathologist">Chief Pathologist</option>
          <option value="radiologist">Radiologist</option>
          <option value="doctor">Consulting Physician</option>
          <option value="phlebotomist">Phlebotomist</option>
          <option value="billing_reception">Billing & Reception</option>
        </select>
      </div>

      {/* Staff Accounts Table */}
      <div className="bg-surface-0 border border-surface-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff User</th>
              <th>Role & Title</th>
              <th>Branch / Location</th>
              <th>Security Passcode</th>
              <th>Status</th>
              <th>Permissions</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => {
              const roleStyle = roleBadgeStyles[u.role] || roleBadgeStyles.pathologist;
              const isPasswordRevealed = revealedPasswords[u.id];

              return (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-700 text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-surface-900">{u.name}</p>
                          {u.isOwner && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <p className="text-[11px] text-surface-500">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', roleStyle.bg)}>
                      {roleStyle.label}
                    </span>
                    <p className="text-[10px] text-surface-400 mt-0.5">{u.title || 'Staff'}</p>
                  </td>

                  <td className="text-xs text-surface-600">{u.branchName}</td>

                  <td>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span>{isPasswordRevealed ? u.passcode : '••••••••'}</span>
                      <button
                        onClick={() =>
                          setRevealedPasswords({
                            ...revealedPasswords,
                            [u.id]: !isPasswordRevealed,
                          })
                        }
                        className="text-surface-400 hover:text-surface-700"
                      >
                        {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>

                  <td>
                    {u.isBlocked ? (
                      <span className="badge bg-rose-100 text-rose-700 text-[10px] font-bold">Locked Out</span>
                    ) : (
                      <span className="badge bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
                    )}
                  </td>

                  <td>
                    <div className="flex gap-1 flex-wrap max-w-xs">
                      {u.permissions?.verifyLabReports && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-mono">Lab Sign</span>
                      )}
                      {u.permissions?.signRadiologyStudies && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-mono">RIS Sign</span>
                      )}
                      {u.permissions?.overridePanicValues && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono">Panic Override</span>
                      )}
                      {u.permissions?.editBillingInvoices && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">Billing</span>
                      )}
                    </div>
                  </td>

                  <td className="text-right">
                    {!u.isOwner ? (
                      <div className="flex items-center justify-end gap-1">
                        {/* Send Password Reset Email */}
                        <button
                          onClick={() => handleSendResetEmail(u)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title={`Send Password Reset Link to ${u.email}`}
                        >
                          <Mail className="w-4 h-4" />
                        </button>

                        {/* Reassign Passcode Directly */}
                        <button
                          onClick={() => {
                            setPasscodeModalUser(u);
                            setNewPasscodeValue('');
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Reassign Passcode Directly"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {/* Block / Lockout Toggle */}
                        <button
                          onClick={() => toggleBlockUser(u.id)}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            u.isBlocked
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-amber-600 hover:bg-amber-50'
                          )}
                          title={u.isBlocked ? 'Unlock Staff Account' : 'Block / Lockout'}
                        >
                          {u.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete staff account for ${u.name}? This action cannot be undone.`)) {
                              const res = deleteUser(u.id);
                              if (res.message) showToast(res.message);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setPasscodeModalUser(u);
                            setNewPasscodeValue('');
                          }}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
                          title="Change Master Passcode"
                        >
                          Change Passcode
                        </button>
                        <span className="text-[10px] font-bold text-amber-600 font-mono bg-amber-50 px-2 py-1 rounded-md">Master Owner</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Staff User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-surface-0 border border-surface-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-100 pb-3">
              <h3 className="text-base font-bold text-surface-900">Add Diagnostic Staff Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-surface-400 hover:text-surface-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-surface-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Babu"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-surface-700 block mb-1">Staff Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@rasadiagnostics.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-surface-700 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-surface-700 block mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                  >
                    <option value="pathologist">Chief Pathologist</option>
                    <option value="radiologist">Consultant Radiologist</option>
                    <option value="doctor">Consulting Physician</option>
                    <option value="phlebotomist">Phlebotomist</option>
                    <option value="billing_reception">Billing & Reception</option>
                    <option value="lab_technician">Lab Biochemist</option>
                    <option value="inventory_manager">Inventory Manager</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-surface-700 block mb-1">Assigned Branch</label>
                  <select
                    value={formData.branchName}
                    onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                  >
                    <option>Banjara Hills (Central)</option>
                    <option>Jubilee Hills Centre</option>
                    <option>Kukatpally Branch</option>
                    <option>All Diagnostic Branches</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-surface-700 block mb-1">Designation Title</label>
                  <input
                    type="text"
                    placeholder="Consultant Microbiologist"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-surface-700 block mb-1">Security Passcode</label>
                  <input
                    type="text"
                    value={formData.passcode}
                    onChange={e => setFormData({ ...formData, passcode: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-surface-200 rounded-xl text-xs font-semibold text-surface-600 hover:bg-surface-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ REASSIGN PASSCODE DIRECT MODAL ═══ */}
      {passcodeModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-0 border border-surface-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-surface-900">Reassign Passcode</h3>
                  <p className="text-[11px] text-surface-500">{passcodeModalUser.name} ({passcodeModalUser.email})</p>
                </div>
              </div>
              <button
                onClick={() => setPasscodeModalUser(null)}
                className="text-surface-400 hover:text-surface-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPasscode} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-surface-700 block mb-1">New Security Passcode</label>
                <input
                  type="text"
                  placeholder="Enter at least 6 characters"
                  value={newPasscodeValue}
                  onChange={e => setNewPasscodeValue(e.target.value)}
                  className="w-full px-3 py-2.5 border border-surface-200 rounded-xl text-xs font-mono bg-surface-50 focus:bg-surface-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
                <p className="text-[10px] text-surface-400 mt-1">
                  The staff member can immediately use this passcode to authenticate into Rasa Diagnstic OS.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setNewPasscodeValue(`Rasa@${Math.floor(1000 + Math.random() * 9000)}`)}
                  className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold"
                >
                  Generate Strong Passcode
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPasscodeModalUser(null)}
                    className="px-4 py-2 border border-surface-200 rounded-xl text-xs font-semibold text-surface-600 hover:bg-surface-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Save Passcode
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
