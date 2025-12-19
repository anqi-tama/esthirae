import React, { useState } from 'react';
import { X, Save, ShieldAlert, Clock, RefreshCw } from 'lucide-react';
import { WalletRuleConfig } from '../../types';

interface WalletRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WalletRuleConfig;
  onSave: (config: WalletRuleConfig) => void;
}

const WalletRulesModal: React.FC<WalletRulesModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<WalletRuleConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
            <h2 className="text-lg font-bold text-text-dark">Deposit Wallet Policy</h2>
            <p className="text-xs text-text-muted">Configure validity and refund rules.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Expiry Section */}
            <div className="space-y-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <Clock size={18} className="text-soft-gold"/>
                    <h3 className="font-bold text-text-dark">Validity Period</h3>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                        <div className="text-sm font-medium text-text-dark">Enable Balance Expiry</div>
                        <div className="text-xs text-text-muted">Balances expire after a set period.</div>
                    </div>
                    <div 
                        onClick={() => setLocalConfig({...localConfig, enableExpiry: !localConfig.enableExpiry})}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${localConfig.enableExpiry ? 'bg-soft-gold' : 'bg-gray-300'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${localConfig.enableExpiry ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                </div>

                {localConfig.enableExpiry && (
                    <div className="animate-fade-in">
                        <label className="block text-xs font-bold text-text-muted mb-1.5">Expiry Duration (Months)</label>
                        <input 
                            type="number"
                            min="1"
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-soft-gold"
                            value={localConfig.expiryMonths}
                            onChange={(e) => setLocalConfig({...localConfig, expiryMonths: parseInt(e.target.value) || 12})}
                        />
                         <p className="text-[10px] text-text-muted mt-1 italic">
                            Calculated from the date of Top Up.
                        </p>
                    </div>
                )}
            </div>

            {/* Refund Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <RefreshCw size={18} className="text-rose"/>
                    <h3 className="font-bold text-text-dark">Refund Policy</h3>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                        <div className="text-sm font-medium text-text-dark">Allow Cash Refunds</div>
                        <div className="text-xs text-text-muted">Can patients request withdrawal?</div>
                    </div>
                    <div 
                        onClick={() => setLocalConfig({...localConfig, allowRefund: !localConfig.allowRefund})}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${localConfig.allowRefund ? 'bg-rose' : 'bg-gray-300'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${localConfig.allowRefund ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                </div>

                {localConfig.allowRefund && (
                     <div className="animate-fade-in">
                        <label className="block text-xs font-bold text-text-muted mb-1.5">Admin Fee for Refund (%)</label>
                        <div className="relative">
                            <input 
                                type="number"
                                min="0"
                                max="100"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-soft-gold"
                                value={localConfig.refundAdminFeePercent}
                                onChange={(e) => setLocalConfig({...localConfig, refundAdminFeePercent: parseFloat(e.target.value) || 0})}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">%</span>
                        </div>
                    </div>
                )}

                {!localConfig.allowRefund && (
                    <div className="flex items-center gap-2 text-xs text-amber bg-amber/10 p-2 rounded-lg border border-amber/20">
                        <ShieldAlert size={14}/> Deposit balance is strictly non-refundable.
                    </div>
                )}
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-soft-gold text-white text-sm font-bold rounded-lg shadow-md hover:bg-[#cbad85] transition-colors flex items-center gap-2">
                <Save size={16}/> Save Configuration
            </button>
        </div>
      </div>
    </div>
  );
};

export default WalletRulesModal;