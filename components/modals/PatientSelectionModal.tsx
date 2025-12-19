
import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, CheckCircle2, Circle, User } from 'lucide-react';
import { Patient } from '../../types';
import { MOCK_PATIENTS } from '../../constants';

interface PatientSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: Patient[]) => void;
  initialSelection: string[]; // IDs
}

const PatientSelectionModal: React.FC<PatientSelectionModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    initialSelection 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Initialize selection when opening
  useEffect(() => {
    if (isOpen) {
        setSelectedIds(initialSelection || []);
        setSearchTerm('');
    }
  }, [isOpen, initialSelection]);

  const filteredPatients = useMemo(() => {
      return MOCK_PATIENTS.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.phone.includes(searchTerm)
      );
  }, [searchTerm]);

  const toggleSelection = (id: string) => {
      setSelectedIds(prev => 
          prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
      );
  };

  const toggleSelectAll = () => {
      if (selectedIds.length === filteredPatients.length && filteredPatients.length > 0) {
          setSelectedIds([]);
      } else {
          setSelectedIds(filteredPatients.map(p => p.id));
      }
  };

  const handleConfirm = () => {
      const selectedPatients = MOCK_PATIENTS.filter(p => selectedIds.includes(p.id));
      onConfirm(selectedPatients);
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
            <h2 className="text-lg font-bold text-text-dark">Select Patients</h2>
            <p className="text-xs text-text-muted">Choose recipients for the broadcast.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                <input 
                    type="text" 
                    placeholder="Search by name or phone..." 
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex justify-between items-center">
                <button 
                    onClick={toggleSelectAll}
                    className="text-xs font-bold text-soft-gold hover:text-[#cbad85] transition-colors"
                >
                    {selectedIds.length === filteredPatients.length && filteredPatients.length > 0 ? 'Deselect All' : 'Select All Filtered'}
                </button>
                <span className="text-xs text-text-muted">
                    {selectedIds.length} selected
                </span>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {filteredPatients.length > 0 ? (
                <div className="space-y-1">
                    {filteredPatients.map(patient => {
                        const isSelected = selectedIds.includes(patient.id);
                        return (
                            <div 
                                key={patient.id} 
                                onClick={() => toggleSelection(patient.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                                    isSelected 
                                    ? 'bg-soft-gold/5 border-soft-gold/30' 
                                    : 'bg-white border-transparent hover:bg-gray-50'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                    isSelected ? 'bg-soft-gold border-soft-gold text-white' : 'border-gray-300 bg-white'
                                }`}>
                                    {isSelected && <CheckCircle2 size={14} />}
                                </div>
                                
                                <img src={patient.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-200"/>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className={`text-sm font-bold ${isSelected ? 'text-soft-gold' : 'text-text-dark'}`}>{patient.name}</h4>
                                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-text-muted">{patient.tier}</span>
                                    </div>
                                    <p className="text-xs text-text-muted">{patient.phone}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="h-40 flex flex-col items-center justify-center text-text-muted">
                    <User size={32} className="opacity-20 mb-2"/>
                    <p className="text-sm">No patients found.</p>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors">
                Cancel
            </button>
            <button 
                onClick={handleConfirm}
                className="px-6 py-2 bg-text-dark text-white text-sm font-bold rounded-lg shadow-md hover:bg-black transition-colors"
            >
                Confirm ({selectedIds.length})
            </button>
        </div>

      </div>
    </div>
  );
};

export default PatientSelectionModal;
