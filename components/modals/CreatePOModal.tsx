import React, { useState, useEffect } from 'react';
import { X, Save, Truck, Calendar, Plus, Trash2, DollarSign, FileText, Printer } from 'lucide-react';
import { InventoryItem, PurchaseOrder, PurchaseOrderItem } from '../../types';

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (po: PurchaseOrder) => void;
  catalogItems: InventoryItem[];
}

const SUPPLIERS = ['PT. Derma Indo', 'PT. Medika Farma', 'PT. Glow Asia', 'PT. Alat Kes', 'Global Aesthetics'];

const CreatePOModal: React.FC<CreatePOModalProps> = ({ isOpen, onClose, onSave, catalogItems }) => {
  // --- Form State ---
  const [poNumber, setPoNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  
  // Item adding state
  const [selectedItemId, setSelectedItemId] = useState('');

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setPoNumber(`PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`);
      setDate(new Date().toISOString().split('T')[0]);
      setSupplier('');
      setNotes('');
      setItems([]);
      setSelectedItemId('');
    }
  }, [isOpen]);

  // --- Logic ---

  const handleAddItem = () => {
    if (!selectedItemId) return;

    // Check if already exists
    if (items.find(i => i.itemId === selectedItemId)) {
      alert("Item already added to PO.");
      return;
    }

    const catalogItem = catalogItems.find(i => i.id === selectedItemId);
    if (!catalogItem) return;

    const newItem: PurchaseOrderItem = {
      itemId: catalogItem.id,
      itemName: catalogItem.name,
      qty: 1,
      unitCost: catalogItem.buyPrice, // Default to master data buy price
      subtotal: catalogItem.buyPrice * 1
    };

    setItems([...items, newItem]);
    setSelectedItemId('');
  };

  const handleUpdateItem = (index: number, field: keyof PurchaseOrderItem, value: number) => {
    const updatedItems = [...items];
    const item = updatedItems[index];
    
    // Type safety for dynamic assignment
    if (field === 'qty' || field === 'unitCost') {
       (item as any)[field] = value;
       item.subtotal = item.qty * item.unitCost;
    }

    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = (status: 'Draft' | 'Ordered', shouldPrint: boolean = false) => {
    if (!supplier) {
      alert("Please select a supplier.");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    const newPO: PurchaseOrder = {
      id: poNumber,
      date: new Date(date),
      supplier,
      status,
      items,
      totalAmount: calculateTotal(),
      itemsCount: items.length,
      notes
    };

    onSave(newPO);
    
    if (shouldPrint) {
        // Simulation of printing
        alert(`Printing Purchase Order ${poNumber}...\n(In a real app, this opens the print dialog)`);
        // window.print(); // Uncomment to actually trigger browser print
    }

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
            <h2 className="text-xl font-bold text-text-dark">Create Purchase Order</h2>
            <p className="text-xs text-text-muted mt-1">Order stock replenishment from suppliers.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-8">
            
            {/* 1. PO Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">PO Number</label>
                    <input 
                        type="text"
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-text-muted cursor-not-allowed"
                        value={poNumber}
                    />
                </div>
                <div>
                     <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Supplier <span className="text-rose">*</span></label>
                     <select 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                     >
                        <option value="">Select Supplier...</option>
                        {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                </div>
                 <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Order Date <span className="text-rose">*</span></label>
                    <input 
                        type="date"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {/* 2. Items Table */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-sm text-text-dark flex items-center gap-2">
                        <Truck size={16} className="text-soft-gold"/> Items
                    </h3>
                    
                    {/* Add Item Control */}
                    <div className="flex gap-2 w-1/2 justify-end">
                        <select 
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                            value={selectedItemId}
                            onChange={(e) => setSelectedItemId(e.target.value)}
                        >
                            <option value="">Select Product to Add...</option>
                            {catalogItems.map(item => (
                                <option key={item.id} value={item.id}>{item.name} (Stock: {item.currentStock})</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleAddItem}
                            disabled={!selectedItemId}
                            className="px-4 py-2 bg-text-dark text-white text-sm font-medium rounded-lg hover:bg-black disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                        <tr>
                            <th className="px-6 py-3">Item Name</th>
                            <th className="px-6 py-3 w-32 text-center">Qty</th>
                            <th className="px-6 py-3 w-40 text-right">Unit Cost (Rp)</th>
                            <th className="px-6 py-3 w-40 text-right">Subtotal</th>
                            <th className="px-6 py-3 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {items.length > 0 ? items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50/50">
                                <td className="px-6 py-3 font-medium text-text-dark align-middle">{item.itemName}</td>
                                <td className="px-6 py-3 text-center align-middle">
                                    <input 
                                        type="number"
                                        min="1"
                                        className="w-24 px-3 py-1.5 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-lg text-center text-sm font-medium focus:bg-white focus:outline-none focus:border-soft-gold focus:shadow-sm transition-all"
                                        value={item.qty}
                                        onChange={(e) => handleUpdateItem(index, 'qty', parseInt(e.target.value) || 0)}
                                    />
                                </td>
                                <td className="px-6 py-3 text-right align-middle">
                                     <input 
                                        type="number"
                                        min="0"
                                        className="w-32 px-3 py-1.5 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-lg text-right text-sm font-medium focus:bg-white focus:outline-none focus:border-soft-gold focus:shadow-sm transition-all"
                                        value={item.unitCost}
                                        onChange={(e) => handleUpdateItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                                    />
                                </td>
                                <td className="px-6 py-3 text-right font-medium align-middle">
                                    {item.subtotal.toLocaleString()}
                                </td>
                                <td className="px-6 py-3 text-center align-middle">
                                    <button 
                                        onClick={() => handleRemoveItem(index)}
                                        className="text-gray-300 hover:text-rose transition-colors"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-text-muted italic">
                                    No items added. Select a product above to begin.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-100">
                        <tr>
                            <td colSpan={3} className="px-6 py-4 text-right font-bold text-text-dark">Total Amount</td>
                            <td className="px-6 py-4 text-right font-bold text-soft-gold text-lg">
                                Rp {calculateTotal().toLocaleString()}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* 3. Notes */}
            <div>
                 <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Notes / Reference</label>
                 <textarea 
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold resize-none"
                    placeholder="e.g. Urgent request for promotional period..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                 ></textarea>
            </div>

        </div>
        
        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
             <div className="text-xs text-text-muted italic">
                * Cost updates here do not automatically update master data.
             </div>
             <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-gray-200 hover:text-text-dark transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={() => handleSubmit('Draft')}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-text-dark rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <FileText size={16} /> Save Draft
                </button>
                
                {/* Print Button */}
                <button 
                    onClick={() => handleSubmit('Ordered', true)}
                    className="px-6 py-2.5 bg-text-dark text-white rounded-xl text-sm font-medium shadow-md hover:bg-black transition-colors flex items-center gap-2"
                >
                    <Printer size={16} /> Submit & Print
                </button>

                <button 
                    onClick={() => handleSubmit('Ordered')}
                    className="px-8 py-2.5 bg-soft-gold text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:bg-[#c5a676] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                    <Truck size={16}/> Submit Order
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CreatePOModal;