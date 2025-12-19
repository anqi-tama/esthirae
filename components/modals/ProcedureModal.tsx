import React, { useState, useEffect } from 'react';
import { X, Save, ClipboardList, Package, DollarSign, Calculator, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Procedure, ProcedureCategory, ProcedureItem, InventoryItem } from '../../types';
import { MOCK_INVENTORY_ITEMS } from '../../constants';

interface ProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (procedure: Procedure) => void;
  procedureToEdit?: Procedure | null;
}

const CATEGORIES: ProcedureCategory[] = ['Injectable', 'Laser & Light', 'Facial', 'Body', 'Consultation', 'Other'];

const ProcedureModal: React.FC<ProcedureModalProps> = ({ isOpen, onClose, onSave, procedureToEdit }) => {
  const [activeTab, setActiveTab] = useState<'General' | 'Composition' | 'Pricing'>('General');
  
  // --- Form States ---
  const [formData, setFormData] = useState<Partial<Procedure>>({
    name: '',
    code: '',
    category: 'Facial',
    description: '',
    status: 'Active',
    items: [],
    materialCost: 0,
    doctorFee: 0,
    adminFee: 0,
    otherCost: 0,
    totalCost: 0,
    marginPercent: 0,
    finalPrice: 0
  });

  // State for Item Selector
  const [selectedInventoryId, setSelectedInventoryId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('General');
      if (procedureToEdit) {
        setFormData({ ...procedureToEdit });
      } else {
        setFormData({
          name: '',
          code: '',
          category: 'Facial',
          description: '',
          status: 'Active',
          items: [],
          materialCost: 0,
          doctorFee: 0,
          adminFee: 0,
          otherCost: 0,
          totalCost: 0,
          marginPercent: 0,
          finalPrice: 0
        });
      }
    }
  }, [isOpen, procedureToEdit]);

  // --- Calculations ---

  // Recalculate Totals whenever dependencies change
  useEffect(() => {
    const matCost = formData.items?.reduce((sum, item) => sum + item.subtotal, 0) || 0;
    const docFee = formData.doctorFee || 0;
    const admFee = formData.adminFee || 0;
    const other = formData.otherCost || 0;
    
    const total = matCost + docFee + admFee + other;
    
    // Calculate Margin based on manually entered Final Price if we aren't editing margin directly
    // Ideally we need to know which field was last edited. For simplicity:
    // If we update costs, we keep margin constant and update price? Or keep price constant and update margin?
    // Let's adopt: Update Cost -> Update Price based on existing Margin.
    
    const currentPrice = formData.finalPrice || 0;
    let margin = formData.marginPercent || 0;
    let price = currentPrice;

    // Logic: If Total Cost changes, update Price to maintain Margin
    // Price = Cost + (Cost * Margin%)
    price = total + (total * (margin / 100));

    setFormData(prev => ({
        ...prev,
        materialCost: matCost,
        totalCost: total,
        finalPrice: price // Auto-update price based on margin
    }));

  }, [formData.items, formData.doctorFee, formData.adminFee, formData.otherCost]);

  // Specific handler for Margin Change -> Update Price
  const handleMarginChange = (margin: number) => {
      const total = formData.totalCost || 0;
      const price = total + (total * (margin / 100));
      setFormData(prev => ({ ...prev, marginPercent: margin, finalPrice: price }));
  };

  // Specific handler for Price Change -> Update Margin
  const handlePriceChange = (price: number) => {
      const total = formData.totalCost || 0;
      let margin = 0;
      if (total > 0) {
          margin = ((price - total) / total) * 100;
      }
      setFormData(prev => ({ ...prev, finalPrice: price, marginPercent: parseFloat(margin.toFixed(1)) }));
  };

  // --- Composition Handlers ---

  const handleAddItem = () => {
      if (!selectedInventoryId) return;
      
      const invItem = MOCK_INVENTORY_ITEMS.find(i => i.id === selectedInventoryId);
      if (!invItem) return;

      // Check duplications
      if (formData.items?.some(i => i.itemId === invItem.id)) {
          alert("Item already added.");
          return;
      }

      const newItem: ProcedureItem = {
          itemId: invItem.id,
          itemName: invItem.name,
          type: invItem.category === 'Asset / Equipment' ? 'Asset' : 'Consumable',
          quantity: 1,
          unit: invItem.unit,
          unitCost: invItem.buyPrice, // Snapshot cost
          subtotal: invItem.buyPrice * 1
      };

      setFormData(prev => ({
          ...prev,
          items: [...(prev.items || []), newItem]
      }));
      setSelectedInventoryId('');
  };

  const handleUpdateItemQty = (index: number, qty: number) => {
      const newItems = [...(formData.items || [])];
      newItems[index].quantity = qty;
      newItems[index].subtotal = qty * newItems[index].unitCost;
      setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleRemoveItem = (index: number) => {
      const newItems = [...(formData.items || [])];
      newItems.splice(index, 1);
      setFormData(prev => ({ ...prev, items: newItems }));
  };

  // --- Save ---

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.code) {
          alert("Please fill in Name and Code.");
          return;
      }

      const procedure: Procedure = {
          id: procedureToEdit ? procedureToEdit.id : `PRC-${Date.now()}`,
          code: formData.code!,
          name: formData.name!,
          category: formData.category as ProcedureCategory,
          description: formData.description,
          status: formData.status as 'Active' | 'Inactive',
          items: formData.items || [],
          materialCost: formData.materialCost || 0,
          doctorFee: formData.doctorFee || 0,
          adminFee: formData.adminFee || 0,
          otherCost: formData.otherCost || 0,
          totalCost: formData.totalCost || 0,
          marginPercent: formData.marginPercent || 0,
          finalPrice: formData.finalPrice || 0,
          updatedAt: new Date()
      };

      onSave(procedure);
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
            <h2 className="text-xl font-bold text-text-dark">{procedureToEdit ? 'Edit Service' : 'Create New Service'}</h2>
            <p className="text-xs text-text-muted mt-1">Define treatment package, BOM, and pricing.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white px-8">
            {['General', 'Composition', 'Pricing'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === tab 
                        ? 'border-soft-gold text-soft-gold' 
                        : 'border-transparent text-text-muted hover:text-text-dark'
                    }`}
                >
                    {tab === 'General' && <ClipboardList size={16}/>}
                    {tab === 'Composition' && <Package size={16}/>}
                    {tab === 'Pricing' && <DollarSign size={16}/>}
                    {tab}
                </button>
            ))}
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* TAB 1: General Info */}
                {activeTab === 'General' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5">Service Name <span className="text-rose">*</span></label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                    placeholder="e.g. Botox Injection (50 Units)"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5">Service Code <span className="text-rose">*</span></label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold uppercase"
                                    placeholder="e.g. BOT-50"
                                    value={formData.code}
                                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5">Category</label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value as ProcedureCategory})}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5">Description</label>
                                <textarea 
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold resize-none"
                                    placeholder="Brief description of the service..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5">Status</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="status" 
                                            checked={formData.status === 'Active'}
                                            onChange={() => setFormData({...formData, status: 'Active'})}
                                            className="text-soft-gold focus:ring-soft-gold"
                                        />
                                        <span className="text-sm">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="status" 
                                            checked={formData.status === 'Inactive'}
                                            onChange={() => setFormData({...formData, status: 'Inactive'})}
                                            className="text-gray-400 focus:ring-gray-400"
                                        />
                                        <span className="text-sm text-text-muted">Inactive</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: Composition (BOM) */}
                {activeTab === 'Composition' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                            <AlertCircle size={20} className="text-blue-500 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-blue-700">Bill of Materials (BOM)</h4>
                                <p className="text-xs text-blue-600/80 mt-1">
                                    Define inventory items consumed during this service. Stocks will be automatically deducted upon treatment completion.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <select 
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                value={selectedInventoryId}
                                onChange={e => setSelectedInventoryId(e.target.value)}
                            >
                                <option value="">Select Inventory Item (Consumable / Medicine)...</option>
                                {MOCK_INVENTORY_ITEMS.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} ({item.unit}) - Cost: Rp {item.buyPrice.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={handleAddItem}
                                disabled={!selectedInventoryId}
                                className="px-4 py-2 bg-text-dark text-white rounded-lg hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs font-semibold text-text-muted uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Item Name</th>
                                        <th className="px-6 py-3 w-32 text-center">Qty Required</th>
                                        <th className="px-6 py-3 text-right">Unit Cost</th>
                                        <th className="px-6 py-3 text-right">Subtotal</th>
                                        <th className="px-6 py-3 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {formData.items?.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-3 font-medium text-text-dark">
                                                {item.itemName} <span className="text-xs text-text-muted font-normal">({item.unit})</span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <input 
                                                    type="number"
                                                    min="0.1"
                                                    step="0.1"
                                                    className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-center text-sm focus:outline-none focus:border-soft-gold"
                                                    value={item.quantity}
                                                    onChange={e => handleUpdateItemQty(index, parseFloat(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="px-6 py-3 text-right text-text-muted">
                                                {item.unitCost.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3 text-right font-medium">
                                                {item.subtotal.toLocaleString()}
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
                                                No items added to composition.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-gray-50 border-t border-gray-200">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-right font-bold text-text-dark">Total Material Cost</td>
                                        <td className="px-6 py-3 text-right font-bold text-soft-gold">
                                            Rp {formData.materialCost?.toLocaleString()}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: Pricing & Costing */}
                {activeTab === 'Pricing' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                        
                        {/* Cost Structure */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide border-b border-gray-100 pb-2 flex items-center gap-2">
                                <Calculator size={16} className="text-soft-gold"/> Cost Breakdown
                            </h3>
                            
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Material Cost (Auto)</span>
                                    <span className="font-medium text-text-dark">Rp {formData.materialCost?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Doctor Fee / Commission</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-text-muted">Rp</span>
                                        <input 
                                            type="number" 
                                            className="w-28 px-2 py-1 bg-white border border-gray-200 rounded text-right text-sm focus:outline-none focus:border-soft-gold"
                                            value={formData.doctorFee}
                                            onChange={e => setFormData({...formData, doctorFee: parseFloat(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Admin / Facility Fee</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-text-muted">Rp</span>
                                        <input 
                                            type="number" 
                                            className="w-28 px-2 py-1 bg-white border border-gray-200 rounded text-right text-sm focus:outline-none focus:border-soft-gold"
                                            value={formData.adminFee}
                                            onChange={e => setFormData({...formData, adminFee: parseFloat(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Other Operational Cost</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-text-muted">Rp</span>
                                        <input 
                                            type="number" 
                                            className="w-28 px-2 py-1 bg-white border border-gray-200 rounded text-right text-sm focus:outline-none focus:border-soft-gold"
                                            value={formData.otherCost}
                                            onChange={e => setFormData({...formData, otherCost: parseFloat(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-text-dark">Total COGS</span>
                                    <span className="font-bold text-text-dark text-lg">Rp {formData.totalCost?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Margin */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide border-b border-gray-100 pb-2 flex items-center gap-2">
                                <DollarSign size={16} className="text-soft-gold"/> Pricing Strategy
                            </h3>

                            <div className="bg-white border border-soft-gold/20 p-6 rounded-xl shadow-sm space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-text-muted mb-1.5">Target Margin (%)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-medium text-text-dark focus:outline-none focus:border-soft-gold"
                                            placeholder="0"
                                            value={formData.marginPercent}
                                            onChange={e => handleMarginChange(parseFloat(e.target.value) || 0)}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">%</span>
                                    </div>
                                    <p className="text-[10px] text-text-muted mt-1">Adjust margin to auto-calculate price.</p>
                                </div>

                                <div className="flex items-center justify-center text-gray-300">
                                    <div className="h-px w-full bg-gray-100"></div>
                                    <span className="px-2 text-xs uppercase font-bold">OR</span>
                                    <div className="h-px w-full bg-gray-100"></div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-soft-gold uppercase tracking-wide mb-1.5">Final Selling Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">Rp</span>
                                        <input 
                                            type="number" 
                                            className="w-full pl-12 pr-4 py-4 bg-soft-gold/5 border border-soft-gold/30 rounded-xl text-2xl font-bold text-text-dark focus:outline-none focus:ring-2 focus:ring-soft-gold/20"
                                            placeholder="0"
                                            value={formData.finalPrice}
                                            onChange={e => handlePriceChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <p className="text-[10px] text-text-muted mt-1">Set fixed price to auto-calculate margin.</p>
                                </div>

                                {/* Profit Display */}
                                <div className="bg-sage/10 p-3 rounded-lg border border-sage/20 text-center">
                                    <span className="text-xs text-sage font-bold uppercase tracking-wide">Estimated Profit per Service</span>
                                    <div className="text-xl font-bold text-sage mt-1">
                                        Rp {((formData.finalPrice || 0) - (formData.totalCost || 0)).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

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
                <Save size={18}/> Save Service
            </button>
        </div>

      </div>
    </div>
  );
};

export default ProcedureModal;