import React, { useState } from 'react';
import { X, Save, Star } from 'lucide-react';
import { PointRule } from '../../types';

interface CreatePointRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: PointRule) => void;
}

const CreatePointRuleModal: React.FC<CreatePointRuleModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Spend' | 'Treatment' | 'Product'>('Spend');
  const [conditionItem, setConditionItem] = useState('');
  const [points, setPoints] = useState<number>(1);

  const handleSubmit = () => {
    if (!name) return alert("Rule Name is required");
    if (type !== 'Spend' && !conditionItem) return alert("Please specify the treatment or product.");

    const newRule: PointRule = {
      id: `RULE-${Date.now()}`,
      name,
      type,
      conditionItem: type === 'Spend' ? 'Every Rp 10.000' : conditionItem,
      points,
      status: 'Active'
    };

    onSave(newRule);
    onClose();
    // Reset form
    setName('');
    setType('Spend');
    setConditionItem('');
    setPoints(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <h2 className="text-lg font-bold text-text-dark">Add Point Rule</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
            <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">Rule Name</label>
                <input 
                    type="text"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                    placeholder="e.g. Laser Bonus"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                 <label className="block text-xs font-bold text-text-muted mb-1.5">Earning Type</label>
                 <select 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-soft-gold"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value as any);
                        if(e.target.value === 'Spend') setConditionItem('Every Rp 10.000');
                        else setConditionItem('');
                    }}
                 >
                    <option value="Spend">Transaction Amount (Spend)</option>
                    <option value="Treatment">Specific Treatment</option>
                    <option value="Product">Specific Product</option>
                 </select>
            </div>

            {type !== 'Spend' && (
                <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5">
                        {type === 'Treatment' ? 'Treatment Name' : 'Product Name'}
                    </label>
                    <input 
                        type="text"
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                        placeholder={type === 'Treatment' ? "e.g. Laser Rejuvenation" : "e.g. Sunscreen SPF 50"}
                        value={conditionItem}
                        onChange={(e) => setConditionItem(e.target.value)}
                    />
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">Points Awarded</label>
                <div className="flex items-center gap-2">
                    <Star size={18} className="text-soft-gold fill-soft-gold"/>
                    <input 
                        type="number"
                        min="1"
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-soft-gold"
                        value={points}
                        onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                    />
                    <span className="text-sm text-text-muted">pts</span>
                </div>
                <p className="text-xs text-text-muted mt-2">
                    {type === 'Spend' 
                        ? `Customer earns ${points} points for every Rp 10.000 spent.` 
                        : `Customer earns ${points} points for every ${conditionItem || 'item'} purchased.`}
                </p>
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="px-6 py-2 bg-soft-gold text-white text-sm font-bold rounded-lg shadow-md hover:bg-[#cbad85] transition-colors flex items-center gap-2">
                <Save size={16}/> Save Rule
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePointRuleModal;