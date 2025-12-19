
import React, { useState, useEffect } from 'react';
import { X, Save, Box, AlertCircle, Plus, Trash2, Clock, Calculator } from 'lucide-react';
import { PackageMaster, PackageItem, Procedure } from '../../types';
import { MOCK_PROCEDURES } from '../../constants';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkg: PackageMaster) => void;
  packageToEdit?: PackageMaster | null;
}

const PackageModal: React.FC<PackageModalProps> = ({ isOpen, onClose, onSave, packageToEdit }) => {
  // --- Form State ---
  const [formData, setFormData] = useState<Partial<PackageMaster>>({
    code: '',
    name: '',
    totalPrice: 0,
    validityDays: 365,
    items: [],
    description: '',
    status: 'Active'
  });

  const [selectedProcedureId, setSelectedProcedureId] = useState('');
  const [unitCount, setUnitCount] = useState(1);

  // Reset or Load Data
  useEffect(() => {
    if (isOpen) {
      if (packageToEdit) {
        setFormData({ ...packageToEdit });
      } else {
        setFormData({
          code: '',
          name: '',
          totalPrice: 0,
          validityDays: 365,
          items: [],
          description: '',
          status: 'Active'
        });
      }
      setSelectedProcedureId('');
      setUnitCount(1);
    }
  }, [isOpen, packageToEdit]);

  // --- Logic ---

  // Calculated Fields
  const totalNormalPrice = formData.items?.reduce((sum, item) => sum + (item.normalPriceSnapshot || 0) * item.unitCount, 0) || 0;
  const currentPrice = formData.totalPrice || 0;
  const savingsAmount = totalNormalPrice - currentPrice;
  const savingsPercent = totalNormalPrice > 0 ? (savingsAmount / totalNormalPrice) * 100 : 0;

  const handleAddItem = () => {
    if (!selectedProcedureId) return;
    
    const proc = MOCK_PROCEDURES.find(p => p.id === selectedProcedureId);
    if (!proc) return;

    // Check if exists
    const existingIndex = formData.items?.findIndex(i => i.procedureId === selectedProcedureId);
    
    let newItems = [...(formData.items || [])];

    if (existingIndex !== undefined && existingIndex >= 0) {
        // Update existing
        newItems[existingIndex].unitCount += unitCount;
    } else {
        // Add new
        newItems.push({
            procedureId: proc.id,
            procedureName: proc.name,
            unitCount: unitCount,
            normalPriceSnapshot: proc.finalPrice
        });
    }

    setFormData({ ...formData, items: newItems });
    setSelectedProcedureId('');
    setUnitCount(1);
  };

  const handleRemoveItem = (index: number) => {
      const newItems = [...(formData.items || [])];
      newItems.splice(index, 1);
      setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.code || !formData.totalPrice) {
          alert("Please fill in Name, Code, and Selling Price.");
          return;
      }
      if (!formData.items || formData.items.length === 0) {
          alert("Please add at least one treatment to the package.");
          return;
      }

      const pkg: PackageMaster = {
          id: packageToEdit ? packageToEdit.id : `PKG-${Date.now()}`,
          code: formData.code!,
          name: formData.name!,
          totalPrice: formData.totalPrice!,
          validityDays: formData.validityDays || 365,
          items: formData.items!,
          description: formData.description,
          status: formData.status as 'Active' | 'Inactive',
          totalNormalPrice: totalNormalPrice,
          savingsPercent: parseFloat(savingsPercent.toFixed(1))
      };

      onSave(pkg);
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                <Box size={24} className="text-soft-gold" />
                {packageToEdit ? 'Edit Package' : 'Create Package Treatment'}
            </h2>
            <p className="text-xs text-text-muted mt-1">Bundle treatments into a single product offering.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Package Name <span className="text-rose">*</span></label>
                            <input 
                                type="text"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                placeholder="e.g. Acne Warrior 10x"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Package Code <span className="text-rose">*</span></label>
                            <input 
                                type="text"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold uppercase font-medium"
                                placeholder="e.g. ACN-10"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Description</label>
                            <textarea 
                                rows={2}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold resize-none"
                                placeholder="Marketing description..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Package Selling Price <span className="text-rose">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-bold">Rp</span>
                                <input 
                                    type="number"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-lg font-bold text-text-dark focus:outline-none focus:border-soft-gold"
                                    placeholder="0"
                                    value={formData.totalPrice}
                                    onChange={e => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5 flex items-center gap-2">
                                <Clock size={12}/> Validity Period (Days) <span className="text-rose">*</span>
                            </label>
                            <input 
                                type="number"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                placeholder="365"
                                value={formData.validityDays}
                                onChange={e => setFormData({ ...formData, validityDays: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-[10px] text-text-muted mt-1 italic">
                                Starts counting from the purchase date.
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Status</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Composition / Items */}
                <div>
                    <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                        <Box size={16} className="text-soft-gold"/> Package Composition
                    </h3>
                    
                    {/* Add Item Control */}
                    <div className="flex gap-2 mb-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <select 
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                            value={selectedProcedureId}
                            onChange={e => setSelectedProcedureId(e.target.value)}
                        >
                            <option value="">Select Treatment...</option>
                            {MOCK_PROCEDURES.map(proc => (
                                <option key={proc.id} value={proc.id}>
                                    {proc.name} (Normal: Rp {proc.finalPrice.toLocaleString()})
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-text-muted">Qty:</span>
                            <input 
                                type="number" 
                                min="1" 
                                className="w-16 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:border-soft-gold"
                                value={unitCount}
                                onChange={e => setUnitCount(parseInt(e.target.value) || 1)}
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={handleAddItem}
                            disabled={!selectedProcedureId}
                            className="px-4 py-2 bg-text-dark text-white rounded-lg hover:bg-black disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Items Table */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs font-semibold text-text-muted uppercase">
                                <tr>
                                    <th className="px-6 py-3">Treatment Name</th>
                                    <th className="px-6 py-3 text-right">Normal Price</th>
                                    <th className="px-6 py-3 text-center">Qty</th>
                                    <th className="px-6 py-3 text-right">Total Value</th>
                                    <th className="px-6 py-3 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {formData.items?.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-3 font-medium text-text-dark">{item.procedureName}</td>
                                        <td className="px-6 py-3 text-right text-text-muted">
                                            Rp {(item.normalPriceSnapshot || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3 text-center font-bold">{item.unitCount}x</td>
                                        <td className="px-6 py-3 text-right font-medium">
                                            Rp {((item.normalPriceSnapshot || 0) * item.unitCount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <button type="button" onClick={() => handleRemoveItem(index)} className="text-gray-300 hover:text-rose">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!formData.items || formData.items.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-text-muted italic">
                                            No treatments added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Calculation */}
                    <div className="mt-4 bg-ivory p-4 rounded-xl border border-soft-gold/20">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-text-muted">Total Normal Value (Retail)</span>
                            <span className="font-bold text-text-dark strike-through decoration-gray-400">
                                Rp {totalNormalPrice.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-text-muted">Package Selling Price</span>
                            <span className="font-bold text-soft-gold text-lg">
                                Rp {currentPrice.toLocaleString()}
                            </span>
                        </div>
                        <div className="border-t border-soft-gold/10 pt-2 flex justify-between items-center text-xs">
                            <span className="flex items-center gap-1 text-sage font-bold">
                                <Calculator size={12}/> Estimated Savings: {savingsPercent.toFixed(1)}%
                            </span>
                            <span className="text-text-muted italic">
                                ~ Rp {((currentPrice / (formData.items?.reduce((sum, i) => sum + i.unitCount, 0) || 1)) || 0).toLocaleString()} per unit avg
                            </span>
                        </div>
                    </div>
                </div>

            </form>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-gray-200 hover:text-text-dark transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-soft-gold text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:bg-[#c5a676] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
                <Save size={18}/> Save Package
            </button>
        </div>

      </div>
    </div>
  );
};

export default PackageModal;
