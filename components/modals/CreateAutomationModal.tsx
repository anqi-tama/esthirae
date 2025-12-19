
import React, { useState, useEffect } from 'react';
import { X, Save, Zap, MessageCircle, TicketPercent, Mail, Clock, Gift, Wallet, Activity, Plus } from 'lucide-react';
import { AutomationRule, WhatsAppTemplate } from '../../types';

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: AutomationRule) => void;
  ruleToEdit?: AutomationRule | null;
  availableTemplates: WhatsAppTemplate[]; // Receive templates from parent
}

const TRIGGER_TYPES = [
    { id: 'Inactive Duration', label: 'Inactive Duration (Days)', icon: Clock },
    { id: 'Birthday', label: 'Birthday (Days Before)', icon: Gift },
    { id: 'Wallet Balance', label: 'Wallet Balance > X', icon: Wallet },
    { id: 'Post-Treatment', label: 'Post-Treatment Follow-up (Hours)', icon: Activity },
];

const ACTION_TYPES = [
    { id: 'Send WhatsApp', label: 'Send WhatsApp Message', icon: MessageCircle },
    { id: 'Inject Voucher', label: 'Inject Voucher Code', icon: TicketPercent },
    { id: 'Email', label: 'Send Email Blast', icon: Mail },
];

const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({ isOpen, onClose, onSave, ruleToEdit, availableTemplates }) => {
  const [formData, setFormData] = useState<Partial<AutomationRule>>({
    name: '',
    triggerType: 'Inactive Duration',
    triggerValue: '',
    actionType: 'Send WhatsApp',
    actionValue: '',
    status: 'Active'
  });

  useEffect(() => {
    if (isOpen) {
        if (ruleToEdit) {
            setFormData({ ...ruleToEdit });
        } else {
            setFormData({
                name: '',
                triggerType: 'Inactive Duration',
                triggerValue: '',
                actionType: 'Send WhatsApp',
                actionValue: '',
                status: 'Active'
            });
        }
    }
  }, [isOpen, ruleToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.triggerValue || !formData.actionValue) {
          alert("Please fill in all fields.");
          return;
      }

      const rule: AutomationRule = {
          id: ruleToEdit ? ruleToEdit.id : `AUTO-${Date.now()}`,
          name: formData.name!,
          triggerType: formData.triggerType as any,
          triggerValue: formData.triggerValue!,
          actionType: formData.actionType as any,
          actionValue: formData.actionValue!,
          status: formData.status as any
      };

      onSave(rule);
      onClose();
  };

  // --- Handlers ---

  const handleLoadTemplate = (templateId: string) => {
      const template = availableTemplates.find(t => t.id === templateId);
      if (template) {
          setFormData({ ...formData, actionValue: template.content });
      }
  };

  const handleInsertVariable = (variable: string) => {
      setFormData(prev => ({
          ...prev,
          actionValue: (prev.actionValue || '') + ` ${variable}`
      }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col animate-fade-in max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
                <Zap size={20} className="text-soft-gold" />
                {ruleToEdit ? 'Edit Automation' : 'New Automation'}
            </h2>
            <p className="text-xs text-text-muted mt-1">Configure automated marketing triggers.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5">Automation Name</label>
                    <input 
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        placeholder="e.g. Sleeping Beauty Wake-up"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                {/* IF (Trigger) */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <span className="bg-blue-100 px-2 py-0.5 rounded text-xs">IF</span> Trigger Condition
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1">When...</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300"
                                value={formData.triggerType}
                                onChange={e => setFormData({...formData, triggerType: e.target.value as any})}
                            >
                                {TRIGGER_TYPES.map(t => (
                                    <option key={t.id} value={t.id}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1">Value (Days / Amount)</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300"
                                placeholder="e.g. 90"
                                value={formData.triggerValue}
                                onChange={e => setFormData({...formData, triggerValue: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* THEN (Action) */}
                <div className="bg-sage/10 p-4 rounded-xl border border-sage/20">
                    <h3 className="text-sm font-bold text-sage mb-3 flex items-center gap-2">
                        <span className="bg-sage/20 px-2 py-0.5 rounded text-xs">THEN</span> Perform Action
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1">Do this...</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage"
                                value={formData.actionType}
                                onChange={e => setFormData({...formData, actionType: e.target.value as any})}
                            >
                                {ACTION_TYPES.map(t => (
                                    <option key={t.id} value={t.id}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-semibold text-text-muted">
                                    {formData.actionType === 'Inject Voucher' ? 'Voucher Code' : 'Message Content'}
                                </label>
                                
                                {formData.actionType === 'Send WhatsApp' && (
                                    <div className="flex items-center gap-2">
                                        <select 
                                            className="text-[10px] bg-white border border-gray-200 rounded px-2 py-1 outline-none cursor-pointer"
                                            onChange={(e) => handleLoadTemplate(e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Load Template...</option>
                                            {availableTemplates.map(t => (
                                                <option key={t.id} value={t.id}>{t.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {formData.actionType === 'Inject Voucher' ? (
                                <input 
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage uppercase"
                                    placeholder="e.g. BDAY-GIFT"
                                    value={formData.actionValue}
                                    onChange={e => setFormData({...formData, actionValue: e.target.value})}
                                />
                            ) : (
                                <div className="relative">
                                    <textarea 
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage resize-none"
                                        placeholder="Hi [Name], we miss you..."
                                        value={formData.actionValue}
                                        onChange={e => setFormData({...formData, actionValue: e.target.value})}
                                    />
                                    
                                    {/* Helper Tools */}
                                    <div className="flex justify-between items-center mt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => handleInsertVariable('[Name]')}
                                            className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-1 text-text-dark"
                                        >
                                            <Plus size={10}/> Insert Name Variable
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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
                                checked={formData.status === 'Paused'} 
                                onChange={() => setFormData({...formData, status: 'Paused'})}
                                className="text-gray-400 focus:ring-gray-400"
                            />
                            <span className="text-sm text-text-muted">Paused</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-text-muted hover:text-text-dark transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 bg-soft-gold text-white text-sm font-medium rounded-xl shadow-lg hover:bg-[#cbad85] transition-colors flex items-center justify-center gap-2">
                        <Save size={18} /> Save Rule
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAutomationModal;
