import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, Mail, FileBadge, Stethoscope, Lock, Key, Eye, EyeOff } from 'lucide-react';
import { Staff, StaffRole } from '../../types';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Staff) => void;
  staffToEdit?: Staff | null;
}

const ROLES: StaffRole[] = ['Doctor', 'Nurse', 'Therapist', 'Cashier', 'Admin'];

const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose, onSave, staffToEdit }) => {
  const [formData, setFormData] = useState<Partial<Staff>>({
    name: '',
    role: 'Doctor',
    phone: '',
    email: '',
    status: 'Active',
    strNumber: '',
    sipNumber: '',
    specialization: '',
    password: ''
  });

  // Local state for password confirmation and visibility
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset visibility and confirm password on open
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);

      if (staffToEdit) {
        setFormData({ ...staffToEdit, password: staffToEdit.password || '' });
      } else {
        setFormData({
          name: '',
          role: 'Doctor',
          phone: '',
          email: '',
          status: 'Active',
          strNumber: '',
          sipNumber: '',
          specialization: '',
          password: ''
        });
      }
    }
  }, [isOpen, staffToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    // Password Validation
    if (formData.password && formData.password !== confirmPassword) {
        alert("Passwords do not match. Please retype correctly.");
        return;
    }

    const staff: Staff = {
        id: staffToEdit ? staffToEdit.id : `ST-${Date.now()}`,
        name: formData.name!,
        role: formData.role as StaffRole,
        phone: formData.phone || '',
        email: formData.email || '',
        status: formData.status as 'Active' | 'Inactive',
        avatarUrl: staffToEdit?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name!)}&background=random`,
        strNumber: formData.strNumber,
        sipNumber: formData.sipNumber,
        specialization: formData.specialization,
        password: formData.password
    };

    onSave(staff);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col animate-fade-in max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
            <h2 className="text-lg font-bold text-text-dark">{staffToEdit ? 'Edit Staff Profile' : 'Add New Staff'}</h2>
            <p className="text-xs text-text-muted">Manage employee details and access.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* General Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-text-dark border-b border-gray-100 pb-1 mb-2">General Information</h3>
                    
                    <div>
                        <label className="block text-xs font-bold text-text-muted mb-1.5">Full Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                required
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                placeholder="e.g. Dr. Jane Doe"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Role / Position</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value as StaffRole})}
                            >
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Status</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value as any})}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-muted mb-1.5">Phone Number</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="tel"
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                placeholder="08..."
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-muted mb-1.5">Email (Optional)</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="email"
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                placeholder="staff@clinic.com"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* System Access / Password Section */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold text-text-dark border-b border-gray-100 pb-1 mb-2 flex items-center gap-2">
                        <Lock size={16} className="text-soft-gold"/> System Access
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Login Password</label>
                            <div className="relative">
                                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                    placeholder={staffToEdit ? "Update password" : "Set password"}
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-dark focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Retype Password</label>
                            <div className="relative">
                                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`w-full pl-9 pr-10 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-soft-gold ${
                                        confirmPassword && formData.password !== confirmPassword ? 'border-rose' : 'border-gray-200'
                                    }`}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    disabled={!formData.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-dark focus:outline-none"
                                    disabled={!formData.password}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    {confirmPassword && formData.password !== confirmPassword && (
                        <p className="text-[10px] text-rose mt-1 ml-1">Passwords do not match.</p>
                    )}
                    <p className="text-[10px] text-text-muted mt-1 ml-1">Used for system authentication.</p>
                </div>

                {/* Medical Info (Conditional) */}
                {(formData.role === 'Doctor' || formData.role === 'Nurse') && (
                    <div className="space-y-4 pt-2">
                        <h3 className="text-sm font-bold text-text-dark border-b border-gray-100 pb-1 mb-2 flex items-center gap-2">
                            <Stethoscope size={16} className="text-soft-gold"/> Medical Credentials
                        </h3>
                        
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Specialization</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                placeholder="e.g. Dermatologist"
                                value={formData.specialization}
                                onChange={e => setFormData({...formData, specialization: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5">STR Number</label>
                                <div className="relative">
                                    <FileBadge size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text"
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                        value={formData.strNumber}
                                        onChange={e => setFormData({...formData, strNumber: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5">SIP Number</label>
                                <div className="relative">
                                    <FileBadge size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text"
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                        value={formData.sipNumber}
                                        onChange={e => setFormData({...formData, sipNumber: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-text-muted hover:text-text-dark transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 bg-soft-gold text-white text-sm font-medium rounded-xl shadow-lg hover:bg-[#cbad85] transition-colors flex items-center justify-center gap-2">
                        <Save size={18} /> Save Staff
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;