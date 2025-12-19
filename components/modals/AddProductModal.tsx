
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Info, AlertCircle, Pill, Beaker } from 'lucide-react';
import { TreatmentProduct, ProductIngredient } from '../../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: TreatmentProduct) => void;
}

// Mock Inventory Data for Selection
const INVENTORY_ITEMS = [
  { id: 'INV-001', name: 'Nutriplus Gel', unit: 'Tube', price: 188500 },
  { id: 'INV-002', name: 'Antibiotic Powder', unit: 'gr', price: 15000 },
  { id: 'INV-003', name: 'Sterile Water', unit: 'ml', price: 5000 },
  { id: 'INV-004', name: 'Vitamin C Serum', unit: 'ml', price: 45000 },
  { id: 'INV-005', name: 'Sunscreen SPF 50', unit: 'Tube', price: 120000 },
  { id: 'INV-006', name: 'Soothing Cream', unit: 'Pot', price: 85000 },
];

const PACKAGING_UNITS = ['Bottle', 'Pot', 'Tube', 'Sachet', 'Pcs'];
const DOSE_UNITS = ['Tablet', 'Capsule', 'Tablespoon', 'Apply Thinly', 'Drops', 'Pack'];

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  // Mode: Retail (Obat Jadi) vs Compound (Racikan)
  const [productType, setProductType] = useState<'Retail' | 'Compound'>('Compound');
  
  // Compound State
  const [concoctionName, setConcoctionName] = useState('');
  const [ingredients, setIngredients] = useState<ProductIngredient[]>([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  
  // General State
  const [selectedProductId, setSelectedProductId] = useState(''); // For Retail mode
  const [qty, setQty] = useState(1);
  const [packaging, setPackaging] = useState('Bottle');
  
  // Signa State
  const [signaActive, setSignaActive] = useState(true);
  const [signaFreq, setSignaFreq] = useState(1);
  const [signaDose, setSignaDose] = useState('1');
  const [signaUnit, setSignaUnit] = useState('Apply Thinly'); // Context aware default
  
  // Reset Form when opening
  useEffect(() => {
    if (isOpen) {
      setProductType('Compound');
      setConcoctionName('');
      setIngredients([]);
      setQty(1);
      setPackaging('Bottle');
      setSignaActive(true);
      setSignaFreq(1);
      setSignaDose('1');
    }
  }, [isOpen]);

  // Handle Adding Ingredient to List
  const handleAddIngredient = () => {
    if (!selectedIngredientId) return;
    const item = INVENTORY_ITEMS.find(i => i.id === selectedIngredientId);
    if (item) {
        const newIngredient: ProductIngredient = {
            id: item.id,
            name: item.name,
            qty: 1,
            unit: item.unit,
            price: item.price
        };
        setIngredients([...ingredients, newIngredient]);
        setSelectedIngredientId(''); // Reset selection
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const updateIngredientQty = (index: number, val: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index].qty = val;
    newIngredients[index].price = (INVENTORY_ITEMS.find(i => i.id === newIngredients[index].id)?.price || 0) * val;
    setIngredients(newIngredients);
  }

  // Calculation
  const totalCost = ingredients.reduce((sum, item) => sum + item.price, 0);
  
  // Signa Summary
  const signaSummary = signaActive 
    ? `${signaFreq}x${signaDose} ${productType === 'Compound' ? packaging : signaUnit} per day` 
    : '';

  const handleSave = () => {
    // Validation
    if (productType === 'Compound' && ingredients.length === 0) {
        alert("Please add at least one ingredient for the concoction.");
        return;
    }
    if (productType === 'Retail' && !selectedProductId) {
        alert("Please select a product.");
        return;
    }

    const finalName = productType === 'Compound' 
        ? concoctionName || 'Unnamed Compound' 
        : INVENTORY_ITEMS.find(i => i.id === selectedProductId)?.name || 'Unknown Product';

    const newProduct: TreatmentProduct = {
        id: `TP-${Date.now()}`,
        name: finalName,
        type: productType,
        quantity: qty,
        unit: productType === 'Compound' ? packaging : (INVENTORY_ITEMS.find(i => i.id === selectedProductId)?.unit || 'Pcs'),
        ingredients: productType === 'Compound' ? ingredients : undefined,
        price: productType === 'Compound' ? totalCost : (INVENTORY_ITEMS.find(i => i.id === selectedProductId)?.price || 0) * qty,
        signa: {
            active: signaActive,
            frequency: signaFreq.toString(),
            dose: signaDose,
            unit: productType === 'Compound' ? packaging : signaUnit,
            summary: signaSummary
        }
    };

    onAdd(newProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-text-dark">Add Product / Prescription</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* 1. Product Type */}
            <div>
                <label className="block text-xs font-bold text-text-dark mb-1.5">
                    Product Type <span className="text-rose">*</span>
                </label>
                <select 
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-dark focus:outline-none focus:border-soft-gold"
                >
                    <option value="Compound">Compound (Racikan)</option>
                    <option value="Retail">Retail Product</option>
                </select>
            </div>

            {/* --- COMPOUND MODE FORM --- */}
            {productType === 'Compound' && (
                <>
                    {/* Compound Name */}
                    <div>
                        <label className="block text-xs font-bold text-text-dark mb-1.5">
                            Compound Name <span className="text-rose">*</span>
                        </label>
                        <input 
                            type="text"
                            placeholder="e.g. Night Acne Cream Formulation"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                            value={concoctionName}
                            onChange={(e) => setConcoctionName(e.target.value)}
                        />
                    </div>

                    {/* Ingredients */}
                    <div>
                        <label className="block text-xs font-bold text-text-dark mb-1.5">
                            Ingredients <span className="text-rose">*</span>
                        </label>
                        <div className="flex gap-2 mb-3">
                            <select 
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                value={selectedIngredientId}
                                onChange={(e) => setSelectedIngredientId(e.target.value)}
                            >
                                <option value="">Select Product / Material...</option>
                                {INVENTORY_ITEMS.map(item => (
                                    <option key={item.id} value={item.id}>{item.name} (@ {item.price.toLocaleString()})</option>
                                ))}
                            </select>
                            <button 
                                onClick={handleAddIngredient}
                                disabled={!selectedIngredientId}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* Ingredients Table */}
                        <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                            {ingredients.length > 0 ? (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-xs font-semibold text-text-muted uppercase">
                                        <tr>
                                            <th className="px-4 py-3">Product</th>
                                            <th className="px-4 py-3 text-right">Price</th>
                                            <th className="px-4 py-3 w-40">Ingr. Qty</th>
                                            <th className="px-4 py-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {ingredients.map((ing, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 font-medium text-text-dark">{ing.name}</td>
                                                <td className="px-4 py-3 text-right text-text-muted">{ing.price.toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="number" 
                                                            min="1"
                                                            className="w-16 px-2 py-1 border border-gray-200 rounded text-center text-sm bg-white"
                                                            value={ing.qty}
                                                            onChange={(e) => updateIngredientQty(idx, parseInt(e.target.value) || 1)}
                                                        />
                                                        <span className="text-xs text-text-muted">{ing.unit}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button 
                                                        onClick={() => handleRemoveIngredient(idx)}
                                                        className="text-white bg-rose rounded p-1.5 hover:bg-rose/80 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-100">
                                        <tr>
                                            <td colSpan={4} className="px-4 py-2 text-right text-xs font-bold text-text-dark">
                                                Total Ingredient Cost : {totalCost.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            ) : (
                                <div className="p-8 text-center text-text-muted flex flex-col items-center">
                                    <Beaker size={32} className="mb-2 opacity-20"/>
                                    <p className="text-sm">No ingredients added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* --- RETAIL MODE FORM --- */}
            {productType === 'Retail' && (
                <div>
                     <label className="block text-xs font-bold text-text-dark mb-1.5">
                        Product Name <span className="text-rose">*</span>
                    </label>
                    <select 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                        <option value="">Select Medication / Skincare...</option>
                        {INVENTORY_ITEMS.map(item => (
                            <option key={item.id} value={item.id}>{item.name} - Stock: 50 {item.unit}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Quantity & Packaging */}
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5">
                        Quantity <span className="text-rose">*</span>
                    </label>
                    <input 
                        type="number" 
                        min="1"
                        value={qty}
                        onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5">
                        Packaging / Unit <span className="text-rose">*</span>
                    </label>
                    <div className="relative">
                        <select 
                            value={packaging}
                            onChange={(e) => setPackaging(e.target.value)}
                            disabled={productType === 'Retail'} // Retail usually has fixed unit
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            {PACKAGING_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                 </div>
            </div>

            {/* Cost Summary Info Box */}
            <div className="bg-blue-100 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-2 text-blue-800">
                <Info size={18} />
                <span className="font-bold text-sm">
                    Cost per {packaging.toUpperCase()}: {productType === 'Compound' ? totalCost.toLocaleString() : (INVENTORY_ITEMS.find(i => i.id === selectedProductId)?.price || 0).toLocaleString()}
                </span>
            </div>

            {/* Signa / Instructions */}
            <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3 mb-4">
                     <label className="text-sm font-bold text-text-dark">Signa / Instructions</label>
                     <div 
                        onClick={() => setSignaActive(!signaActive)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${signaActive ? 'bg-green-500' : 'bg-gray-300'}`}
                     >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${signaActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                     </div>
                </div>

                {signaActive && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5">
                                    Frequency (per day) <span className="text-rose">*</span>
                                </label>
                                <div className="flex items-center">
                                    <button 
                                        onClick={() => setSignaFreq(Math.max(1, signaFreq - 1))} 
                                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-l-lg hover:bg-gray-100 text-soft-gold font-bold transition-colors"
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        value={signaFreq}
                                        onChange={(e) => setSignaFreq(parseInt(e.target.value) || 1)}
                                        className="w-full px-2 py-2 border-y border-gray-200 text-center text-sm focus:outline-none bg-white"
                                    />
                                    <button 
                                        onClick={() => setSignaFreq(signaFreq + 1)} 
                                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-r-lg hover:bg-gray-100 text-soft-gold font-bold transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-1.5">
                                    Dosage / Amount <span className="text-rose">*</span>
                                </label>
                                <div className="flex">
                                    <input 
                                        type="text" 
                                        value={signaDose}
                                        onChange={(e) => setSignaDose(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:border-soft-gold"
                                    />
                                    <div className="bg-gray-100 border border-gray-200 border-l-0 px-3 py-2 text-sm text-text-muted rounded-r-lg flex items-center">
                                        {productType === 'Compound' ? packaging : (
                                            <select 
                                                value={signaUnit}
                                                onChange={(e) => setSignaUnit(e.target.value)}
                                                className="bg-transparent outline-none cursor-pointer"
                                            >
                                                {DOSE_UNITS.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-text-muted italic">
                            Generated Signa: <span className="font-medium text-text-dark">{signaSummary}</span>
                        </p>
                    </div>
                )}
            </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-gray-50 hover:text-text-dark transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave}
                className="px-6 py-2 bg-soft-gold text-white rounded-lg text-sm font-medium shadow-md hover:bg-[#cbad85] transition-colors flex items-center gap-2"
            >
                Save Product
            </button>
        </div>

      </div>
    </div>
  );
};

export default AddProductModal;
