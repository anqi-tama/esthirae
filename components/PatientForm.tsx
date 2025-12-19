import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Calendar, ArrowLeft, Save } from 'lucide-react';
import { Patient } from '../types';

interface PatientFormProps {
  initialData?: Patient | null; // If null, it's "Add New", if provided, it's "Detail/Edit"
  onCancel: () => void;
  onSave: (data: any) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ initialData, onCancel, onSave }) => {
  // Initial state structure
  const defaultState = {
    name: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    tier: 'Silver',
    gender: 'Female'
  };

  const [formData, setFormData] = useState(defaultState);

  // Populate form if editing/viewing details
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        dob: initialData.dob || '',
        phone: initialData.phone,
        email: initialData.email || '',
        address: initialData.address || '',
        tier: initialData.tier,
        gender: initialData.gender || 'Female'
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft h-full flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-ivory rounded-t-2xl">
          <div className="flex items-center gap-4">
            <button 
                onClick={onCancel}
                className="p-2 -ml-2 hover:bg-white rounded-full text-text-muted hover:text-text-dark transition-colors"
            >
                <ArrowLeft size={20}/>
            </button>
            <div>
                <h2 className="font-serif text-2xl font-bold text-text-dark">
                {initialData ? 'Patient Details' : 'Register New Patient'}
                </h2>
                <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">
                {initialData ? `Viewing profile for ${initialData.id}` : 'Client Onboarding'}
                </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
            
            {/* Personal Info Section */}
            <div>
                <h3 className="text-lg font-medium text-text-dark mb-4 border-b border-gray-50 pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2">
                            <User size={14} /> Full Name
                        </label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Jane Doe"
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl px-4 py-3 text-text-dark outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2">
                            <Calendar size={14} /> Date of Birth
                        </label>
                        <input 
                            type="date" 
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl px-4 py-3 text-text-dark outline-none transition-all"
                            value={formData.dob}
                            onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {/* Contact Info Section */}
            <div>
                <h3 className="text-lg font-medium text-text-dark mb-4 border-b border-gray-50 pb-2">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2">
                            <Phone size={14} /> Phone Number
                        </label>
                        <input 
                            type="tel" 
                            placeholder="+62 ..."
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl px-4 py-3 text-text-dark outline-none transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2">
                            <Mail size={14} /> Email Address
                        </label>
                        <input 
                            type="email" 
                            placeholder="jane@example.com"
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl px-4 py-3 text-text-dark outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2 mt-6">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2">
                    <MapPin size={14} /> Address
                    </label>
                    <textarea 
                        rows={3}
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl px-4 py-3 text-text-dark outline-none resize-none transition-all"
                        placeholder="Residential address..."
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                </div>
            </div>

            {/* Clinical & Membership Section */}
            <div>
                <h3 className="text-lg font-medium text-text-dark mb-4 border-b border-gray-50 pb-2">Clinic Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                            Membership Tier
                        </label>
                        <div className="relative">
                            <select 
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-soft-gold rounded-xl px-4 py-3 text-text-dark outline-none appearance-none transition-all"
                            value={formData.tier}
                            onChange={(e) => setFormData({...formData, tier: e.target.value})}
                            >
                                <option value="Silver">Silver (Standard)</option>
                                <option value="Gold">Gold</option>
                                <option value="Platinum">Platinum</option>
                            </select>
                            {/* Custom arrow could go here */}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                            Gender
                        </label>
                        <div className="flex gap-6 pt-3">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.gender === 'Female' ? 'border-soft-gold' : 'border-gray-300'}`}>
                                    {formData.gender === 'Female' && <div className="w-3 h-3 rounded-full bg-soft-gold"></div>}
                                </div>
                                <input 
                                type="radio" 
                                name="gender" 
                                className="hidden" 
                                checked={formData.gender === 'Female'}
                                onChange={() => setFormData({...formData, gender: 'Female'})}
                                />
                                <span className="text-sm text-text-dark group-hover:text-soft-gold transition-colors">Female</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.gender === 'Male' ? 'border-soft-gold' : 'border-gray-300'}`}>
                                    {formData.gender === 'Male' && <div className="w-3 h-3 rounded-full bg-soft-gold"></div>}
                                </div>
                                <input 
                                type="radio" 
                                name="gender" 
                                className="hidden"
                                checked={formData.gender === 'Male'}
                                onChange={() => setFormData({...formData, gender: 'Male'})} 
                                />
                                <span className="text-sm text-text-dark group-hover:text-soft-gold transition-colors">Male</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button 
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-text-dark hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="px-8 py-3 rounded-xl text-sm font-medium bg-soft-gold text-white shadow-lg hover:shadow-xl hover:bg-[#c5a676] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                    <Save size={18} />
                    {initialData ? 'Save Changes' : 'Create Profile'}
                </button>
            </div>
          </form>
        </div>
    </div>
  );
};

export default PatientForm;