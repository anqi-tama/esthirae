import React, { useState, useEffect } from 'react';
import { X, Save, Package, Tag, DollarSign, Archive, Layers } from 'lucide-react';
import { InventoryItem } from '../../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

const PRODUCT_TYPES = ['Retail Product', 'Consumable', 'Raw Material', 'Asset / Equipment'];
const SUPPLIERS = ['PT. Derma Indo', 'PT. Medika Farma', 'PT. Glow Asia', 'PT. Alat Kes', 'Global Aesthetics'];

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSave }) => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    type: 'Retail Product',
    name: '',
    smallUnit: '', // Base Unit
    sku: '', // Abbreviation
    supplier: '',
    minStock: 0,
    sellPrice: 0,
    // Packaging Logic (Units & Packaging)
    packagingName: '', // e.g., Box
    packagingContent: 1, // e.g., 10 (means 1 Box = 10 smallUnit)
  });

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: 'Retail Product',
        name: '',
        smallUnit: 'Pcs',
        sku: '',
        supplier: '',
        minStock: 10,
        sellPrice: 0,
        packagingName: '',
        packagingContent: 1,
      });
    }
  }, [isOpen]);

  // Logic: Auto-generate SKU / Abbreviation (3 letters)
  const handleNameChange = (val: string) => {
    // Only auto-update SKU if user hasn't manually edited it significantly, 
    // or simplicity: always suggest unless SKU field is focused (simplified here)
    const suggestedSku = val.replace(/\s/g, '').substring(0, 3).toUpperCase();
    setFormData(prev => ({
        ...prev, 
        name: val,
        sku: prev.sku === '' || prev.sku.length < 3 ? suggestedSku : prev.sku 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the final object
    const newItem: InventoryItem = {
        id: `INV-${Date.now()}`,
        sku: formData.sku,
        name: formData.name,
        category: formData.type,
        unit: formData.smallUnit,
        currentStock: 0, // Initial stock is 0, separate process for "Stock In" usually
        minStock: formData.minStock,
        buyPrice: 0, // Default 0, set in Purchasing
        sellPrice: formData.sellPrice,
        supplierName: formData.supplier,
        status: 'Active',
        lastUpdated: new Date()
    };

    onSave(newItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
            <h2 className="text-xl font-bold text-text-dark">Add New Product</h2>
            <p className="text-xs text-text-muted mt-1">Enter product details into the system catalog.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Catalog Information */}
                <div>
                    <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                        <Tag size={16} className="text-soft-gold"/> Catalog Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-muted">Product Type <span className="text-rose">*</span></label>
                            <select 
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-muted">Product Name <span className="text-rose">*</span></label>
                            <input 
                                type="text"
                                required
                                placeholder="e.g. Facial Wash Gentle"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                value={formData.name}
                                onChange={e => handleNameChange(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-muted">Supplier <span className="text-rose">*</span></label>
                            <select 
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                value={formData.supplier}
                                onChange={e => setFormData({...formData, supplier: e.target.value})}
                            >
                                <option value="">Select Supplier...</option>
                                {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Base Unit & SKU */}
                <div>
                    <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                        <Package size={16} className="text-soft-gold"/> Base Unit
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-muted">Smallest Unit <span className="text-rose">*</span></label>
                            <input 
                                type="text"
                                required
                                placeholder="e.g. Pcs, Tube, Ampoule"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                value={formData.smallUnit}
                                onChange={e => setFormData({...formData, smallUnit: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-muted">Abbreviation / SKU (Custom) <span className="text-rose">*</span></label>
                            <input 
                                type="text"
                                required
                                placeholder="Auto 3 Letters"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold uppercase tracking-wider font-medium"
                                value={formData.sku}
                                onChange={e => setFormData({...formData, sku: e.target.value.toUpperCase()})}
                                maxLength={6}
                            />
                            <p className="text-[10px] text-text-muted italic">Automatically generated from the first 3 letters.</p>
                        </div>
                    </div>
                </div>

                {/* 3. Unit & Packaging (Multi-Unit) */}
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                    <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Layers size={16} className="text-blue-500"/> Unit & Packaging (Optional)
                    </h3>
                    <p className="text-xs text-text-muted mb-4">
                        If this product is purchased in bulk packaging (e.g. Box) but sold/used individually (e.g. Pcs).
                    </p>
                    
                    <div className="flex items-end gap-3">
                         <div className="flex-1 space-y-1.5">
                            <label className="text-xs font-semibold text-text-muted">Large Packaging Name</label>
                            <input 
                                type="text"
                                placeholder="e.g. Box"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300"
                                value={formData.packagingName}
                                onChange={e => setFormData({...formData, packagingName: e.target.value})}
                            />
                        </div>
                         <div className="w-24 space-y-1.5">
                            <label className="text-xs font-semibold text-text-muted">Content Qty</label>
                            <input 
                                type="number"
                                min="1"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300"
                                value={formData.packagingContent}
                                onChange={e => setFormData({...formData, packagingContent: parseInt(e.target.value) || 1})}
                            />
                        </div>
                         <div className="pb-2 text-sm font-medium text-text-dark">
                             {formData.smallUnit || 'Unit'}
                         </div>
                    </div>
                    
                    {formData.packagingName && (
                        <div className="mt-3 text-xs text-blue-600 bg-blue-100/50 px-3 py-2 rounded-lg inline-block">
                            💡 Conversion: 1 {formData.packagingName} = {formData.packagingContent} {formData.smallUnit}
                        </div>
                    )}
                </div>

                {/* 4. Stock & Price Control */}
                <div>
                    <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                        <Archive size={16} className="text-soft-gold"/> Stock & Price Management
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-muted">Minimum Stock (Alert)</label>
                            <input 
                                type="number"
                                min="0"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                value={formData.minStock}
                                onChange={e => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-muted">Selling Price (per {formData.smallUnit})</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">Rp</span>
                                <input 
                                    type="number"
                                    min="0"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold font-medium"
                                    value={formData.sellPrice}
                                    onChange={e => setFormData({...formData, sellPrice: parseFloat(e.target.value) || 0})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-gray-50 hover:text-text-dark transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-8 py-2.5 bg-soft-gold text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:bg-[#c5a676] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <Save size={18}/> Save Product
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;