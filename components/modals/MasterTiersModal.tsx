import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Crown, Save, ArrowLeft, Check, MinusCircle } from 'lucide-react';
import { LoyaltyTier } from '../../types';

interface MasterTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: LoyaltyTier[];
  onUpdate: (updatedTiers: LoyaltyTier[]) => void;
}

const COLORS = [
    { label: 'Silver', class: 'bg-gray-100 border-gray-300 text-gray-700' },
    { label: 'Gold', class: 'bg-amber/10 border-amber/30 text-amber' },
    { label: 'Platinum', class: 'bg-[#e5e4e2] border-gray-400 text-gray-800' },
    { label: 'Black', class: 'bg-gray-900 border-gray-800 text-white' },
    { label: 'Rose Gold', class: 'bg-rose/10 border-rose/30 text-rose' },
];

const MasterTiersModal: React.FC<MasterTiersModalProps> = ({ isOpen, onClose, tiers, onUpdate }) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingTier, setEditingTier] = useState<Partial<LoyaltyTier>>({});
  const [benefitInput, setBenefitInput] = useState('');

  // Reset when opening
  useEffect(() => {
      if (isOpen) {
          setView('list');
          setEditingTier({});
          setBenefitInput('');
      }
  }, [isOpen]);

  // --- Handlers ---

  const handleAddNew = () => {
      setEditingTier({
          id: `TIER-${Date.now()}`,
          name: '',
          minSpend: 0,
          color: COLORS[0].class,
          benefits: []
      });
      setView('form');
  };

  const handleEdit = (tier: LoyaltyTier) => {
      setEditingTier({ ...tier });
      setView('form');
  };

  const handleDelete = (id: string) => {
      if (window.confirm("Are you sure you want to delete this tier?")) {
          const updated = tiers.filter(t => t.id !== id);
          onUpdate(updated);
      }
  };

  const handleAddBenefit = () => {
      if (!benefitInput.trim()) return;
      setEditingTier(prev => ({
          ...prev,
          benefits: [...(prev.benefits || []), benefitInput.trim()]
      }));
      setBenefitInput('');
  };

  const handleRemoveBenefit = (index: number) => {
      setEditingTier(prev => {
          const newBenefits = [...(prev.benefits || [])];
          newBenefits.splice(index, 1);
          return { ...prev, benefits: newBenefits };
      });
  };

  const handleSave = () => {
      if (!editingTier.name || editingTier.minSpend === undefined) {
          alert("Please fill in Name and Minimum Spend");
          return;
      }

      const newTier = editingTier as LoyaltyTier;
      
      // Check if updating existing or adding new
      const exists = tiers.find(t => t.id === newTier.id);
      let updatedTiers;
      
      if (exists) {
          updatedTiers = tiers.map(t => t.id === newTier.id ? newTier : t);
      } else {
          updatedTiers = [...tiers, newTier];
      }

      // Sort by minSpend to keep logical order
      updatedTiers.sort((a, b) => a.minSpend - b.minSpend);

      onUpdate(updatedTiers);
      setView('list');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col animate-fade-in max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div className="flex items-center gap-3">
            {view === 'form' && (
                <button onClick={() => setView('list')} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-text-muted"/>
                </button>
            )}
            <div>
                <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
                    <Crown size={20} className="text-soft-gold" /> 
                    {view === 'list' ? 'Master Tiers Management' : (editingTier.name ? `Edit ${editingTier.name}` : 'Create New Tier')}
                </h2>
                <p className="text-xs text-text-muted mt-1">Configure loyalty levels, thresholds, and associated benefits.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content - LIST VIEW */}
        {view === 'list' && (
            <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-text-muted">
                        Total Tiers: <span className="font-bold text-text-dark">{tiers.length}</span>
                    </div>
                    <button 
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-4 py-2 bg-soft-gold text-white rounded-lg text-sm font-medium hover:bg-[#cbad85] shadow-md transition-all"
                    >
                        <Plus size={16} /> Add New Tier
                    </button>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-text-muted uppercase">
                            <tr>
                                <th className="px-6 py-3">Tier Name</th>
                                <th className="px-6 py-3">Min. Spend Threshold</th>
                                <th className="px-6 py-3">Color Code</th>
                                <th className="px-6 py-3">Benefits Configured</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tiers.map(tier => (
                                <tr key={tier.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-text-dark">{tier.name}</span>
                                        <div className="text-[10px] text-text-muted">{tier.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-text-dark font-medium">
                                        Rp {tier.minSpend.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-full border shadow-sm ${tier.color.split(' ')[0]}`}></div>
                                            <span className="text-xs text-text-muted font-mono">
                                                {tier.color.split(' ')[0].replace('bg-', '')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {tier.benefits.slice(0, 2).map((b, i) => (
                                                <span key={i} className="text-[10px] bg-gray-100 px-2 py-1 rounded border border-gray-200 text-text-dark">
                                                    {b}
                                                </span>
                                            ))}
                                            {tier.benefits.length > 2 && (
                                                <span className="text-[10px] text-text-muted flex items-center bg-gray-50 px-1.5 rounded">
                                                    +{tier.benefits.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(tier)}
                                                className="p-2 text-gray-400 hover:text-soft-gold hover:bg-soft-gold/10 rounded-lg transition-colors" 
                                                title="Edit"
                                            >
                                                <Edit2 size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(tier.id)}
                                                className="p-2 text-gray-400 hover:text-rose hover:bg-rose/10 rounded-lg transition-colors" 
                                                title="Delete"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Content - FORM VIEW */}
        {view === 'form' && (
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left: Basic Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Tier Name</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                placeholder="e.g. Diamond"
                                value={editingTier.name}
                                onChange={e => setEditingTier({...editingTier, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1.5">Minimum Spend (Accumulated)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">Rp</span>
                                <input 
                                    type="number"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                                    placeholder="0"
                                    value={editingTier.minSpend}
                                    onChange={e => setEditingTier({...editingTier, minSpend: parseInt(e.target.value) || 0})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-3">Color Theme</label>
                            <div className="grid grid-cols-5 gap-2">
                                {COLORS.map((c) => (
                                    <div 
                                        key={c.label}
                                        onClick={() => setEditingTier({...editingTier, color: c.class})}
                                        className={`cursor-pointer rounded-lg p-2 border-2 text-center transition-all ${
                                            editingTier.color === c.class ? 'border-soft-gold bg-soft-gold/5' : 'border-transparent hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full mx-auto mb-1 shadow-sm ${c.class.split(' ')[0]}`}></div>
                                        <span className="text-[10px] text-text-muted font-medium">{c.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Benefits */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col">
                        <label className="block text-xs font-bold text-text-muted mb-3">Member Benefits</label>
                        
                        <div className="flex gap-2 mb-3">
                            <input 
                                type="text"
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                                placeholder="e.g. Free Consultation"
                                value={benefitInput}
                                onChange={e => setBenefitInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddBenefit()}
                            />
                            <button 
                                onClick={handleAddBenefit}
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-soft-gold"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 max-h-[250px]">
                            {editingTier.benefits?.map((benefit, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm group">
                                    <div className="flex items-center gap-2 text-sm text-text-dark">
                                        <Check size={14} className="text-sage" />
                                        {benefit}
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveBenefit(idx)}
                                        className="text-gray-300 hover:text-rose opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MinusCircle size={16} />
                                    </button>
                                </div>
                            ))}
                            {(!editingTier.benefits || editingTier.benefits.length === 0) && (
                                <div className="text-center py-8 text-text-muted text-xs italic">
                                    No benefits added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            {view === 'form' ? (
                <>
                    <button onClick={() => setView('list')} className="px-6 py-2 bg-white border border-gray-200 text-text-muted font-medium rounded-lg hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-soft-gold text-white font-medium rounded-lg hover:bg-[#cbad85] transition-colors shadow-md flex items-center gap-2">
                        <Save size={16}/> Save Tier
                    </button>
                </>
            ) : (
                <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-200 text-text-dark font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    Close
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default MasterTiersModal;