
import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Phone, Hash, Building2 } from 'lucide-react';
import { Branch } from '../../types';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branch: Branch) => void;
  branchToEdit?: Branch | null;
}

const BranchModal: React.FC<BranchModalProps> = ({ isOpen, onClose, onSave, branchToEdit }) => {
  const [formData, setFormData] = useState<Partial<Branch>>({
    name: '',
    code: '',
    address: '',
    phone: '',
    status: 'Active'
  });

  useEffect(() => {
    if (isOpen) {
      if (branchToEdit) {
        setFormData({ ...branchToEdit });
      } else {
        setFormData({
          name: '',
          code: '',
          address: '',
          phone: '',
          status: 'Active'
        });
      }
    }
  }, [isOpen, branchToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const branch: Branch = {
      id: branchToEdit ? branchToEdit.id : `BR-${Date.now()}`,
      name: formData.name!,
      code: formData.code!.toUpperCase(),
      address: formData.address || '',
      phone: formData.phone || '',
      status: formData.status as 'Active' | 'Inactive'
    };

    onSave(branch);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col animate-fade-in">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
            <h2 className="text-lg font-bold text-text-dark">
                {branchToEdit ? 'Edit Branch' : 'Register New Branch'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Define location details for the new branch.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Branch Code</label>
                        <div className="relative">
                            <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                required
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold uppercase font-bold"
                                placeholder="e.g. JKT01"
                                value={formData.code}
                                onChange={e => setFormData({...formData, code: e.target.value})}
                                maxLength={5}
                            />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Status</label>
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
                    <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Branch Name</label>
                    <div className="relative">
                        <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            required
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold font-medium"
                            placeholder="e.g. Esthirae Central Park"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Phone Number</label>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="tel"
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                            placeholder="Branch contact..."
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Address</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                        <textarea 
                            rows={3}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold resize-none"
                            placeholder="Full physical address..."
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        ></textarea>
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-medium text-text-muted hover:text-text-dark transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-soft-gold text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#cbad85] transition-colors flex items-center justify-center gap-2">
                        <Save size={18} /> Save Branch
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default BranchModal;
