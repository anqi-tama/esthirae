
import React, { useState, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { ExecutedProcedure } from '../../types';
import { MOCK_PROCEDURES } from '../../constants';

interface AddProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (procedure: ExecutedProcedure) => void;
}

const AddProcedureModal: React.FC<AddProcedureModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [selectedProcedureId, setSelectedProcedureId] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedProcedureId('');
      setNotes('');
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleAdd = () => {
    if (!selectedProcedureId) return;
    
    const procedure = MOCK_PROCEDURES.find(p => p.id === selectedProcedureId);
    if (procedure) {
        const newProcedure: ExecutedProcedure = {
            id: `EP-${Date.now()}`,
            procedureId: procedure.id,
            name: procedure.name,
            price: procedure.finalPrice,
            notes: notes
        };
        onAdd(newProcedure);
        onClose();
    }
  };

  const filteredProcedures = MOCK_PROCEDURES.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <h2 className="text-lg font-bold text-text-dark">Add Treatment / Procedure</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
            
            {/* Search & Select */}
            <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">Select Service</label>
                <div className="relative mb-2">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input 
                        type="text"
                        placeholder="Filter services..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <select 
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                    value={selectedProcedureId}
                    onChange={(e) => setSelectedProcedureId(e.target.value)}
                    size={5} // Show as list box
                >
                    {filteredProcedures.map(p => (
                        <option key={p.id} value={p.id} className="py-2 px-1">
                            {p.name} - Rp {p.finalPrice.toLocaleString()}
                        </option>
                    ))}
                    {filteredProcedures.length === 0 && <option disabled>No services found.</option>}
                </select>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">Treatment Note (Optional)</label>
                <input 
                    type="text"
                    placeholder="e.g. Specific area only, add-on to facial..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-gray-200 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleAdd}
                disabled={!selectedProcedureId}
                className="px-6 py-2 bg-soft-gold text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#cbad85] transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
            >
                <Plus size={16}/> Add Procedure
            </button>
        </div>

      </div>
    </div>
  );
};

export default AddProcedureModal;
