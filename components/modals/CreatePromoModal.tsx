
import React, { useState, useMemo } from 'react';
import { X, Save, Tag, Target, CalendarClock, DollarSign, Gift, ArrowRight, Wallet, Percent, QrCode, Lock, Users, AlertTriangle, FileSpreadsheet, CheckCircle, Download } from 'lucide-react';
import { Promotion } from '../../types';
import { MOCK_PROCEDURES, MOCK_INVENTORY_ITEMS } from '../../constants';

interface CreatePromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Promotion) => void;
}

type PromoStep = 'Identity' | 'Rules' | 'Reward' | 'Success';

const CreatePromoModal: React.FC<CreatePromoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState<PromoStep>('Identity');

  // --- Form State ---
  const [formData, setFormData] = useState<Partial<Promotion> & { uniqueCodeQty?: number }>({
    name: '',
    type: 'Discount', // Default
    codeMethod: 'Auto', // Default
    promoCode: '',
    uniqueCodePrefix: 'GIFT-',
    uniqueCodeQty: 100, // Default qty
    
    // Constraints
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    audienceFilter: 'All',
    minTransaction: 0,
    maxDiscountValue: 0,
    globalQuota: 0,
    userQuota: 1,
    validTimeStart: '00:00',
    validTimeEnd: '23:59',
    
    // Reward
    valueType: 'Percent',
    value: 0,
    buyItem: '',
    getItem: '',
    description: ''
  });

  // State for Generated Codes (for Download)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  // Combined List for Dropdowns
  const availableItems = useMemo(() => {
      const treatments = MOCK_PROCEDURES.map(p => ({ id: p.name, name: p.name, type: 'Treatment' }));
      const products = MOCK_INVENTORY_ITEMS.map(i => ({ id: i.name, name: i.name, type: 'Product' }));
      return [...treatments, ...products];
  }, []);

  const handleNext = () => {
      if (currentStep === 'Identity') setCurrentStep('Rules');
      else if (currentStep === 'Rules') setCurrentStep('Reward');
  };

  const handleBack = () => {
      if (currentStep === 'Reward') setCurrentStep('Rules');
      else if (currentStep === 'Rules') setCurrentStep('Identity');
  };

  const generateCodeList = () => {
      const codes: string[] = [];
      if (formData.codeMethod === 'Generic') {
          codes.push(formData.promoCode || 'PROMO');
      } else if (formData.codeMethod === 'Unique') {
          const prefix = formData.uniqueCodePrefix || 'VOUCHER-';
          const qty = formData.uniqueCodeQty || 10;
          for (let i = 0; i < qty; i++) {
              // Generate random 5 char string
              const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
              codes.push(`${prefix}${randomPart}`);
          }
      }
      return codes;
  };

  const handleSubmit = () => {
    if (!formData.name) return alert("Promo Name required");
    
    // Construct final object
    const newPromo: Promotion = {
        id: `PRM-${Date.now()}`,
        name: formData.name!,
        type: formData.type as any,
        targetTier: formData.audienceFilter === 'Tier' ? 'Gold & Platinum' : 'All', // Simplified for demo
        valueType: formData.valueType as any,
        value: formData.value || 0,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        status: 'Active',
        usageCount: 0,
        description: formData.description || 'Custom Promotion',
        
        // New Fields
        codeMethod: formData.codeMethod,
        promoCode: formData.promoCode,
        uniqueCodePrefix: formData.uniqueCodePrefix,
        minTransaction: formData.minTransaction,
        maxDiscountValue: formData.maxDiscountValue,
        audienceFilter: formData.audienceFilter,
        globalQuota: formData.globalQuota,
        
        // Buy X Get Y
        buyItem: formData.buyItem,
        getItem: formData.getItem
    };

    // Generate codes if needed
    if (formData.codeMethod !== 'Auto') {
        const codes = generateCodeList();
        setGeneratedCodes(codes);
        // In a real app, you would send `codes` to the backend here
    }

    onSave(newPromo);
    
    // If Manual Codes involved, show download step. Else close.
    if (formData.codeMethod !== 'Auto') {
        setCurrentStep('Success');
    } else {
        onClose();
        setCurrentStep('Identity'); // Reset
    }
  };

  const handleDownloadCodes = () => {
      if (generatedCodes.length === 0) return;

      const csvContent = "data:text/csv;charset=utf-8," 
          + "Voucher Code,Promo Name,Status,Expiry Date\n"
          + generatedCodes.map(code => `${code},${formData.name},Active,${formData.endDate?.toISOString().split('T')[0]}`).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${formData.name?.replace(/\s/g,'_')}_Codes.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // --- Render Steps ---

  const renderIdentityStep = () => (
      <div className="space-y-6 animate-fade-in">
          {/* Promo Name */}
          <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Promo Name</label>
                <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-soft-gold"
                    placeholder="e.g. Merdeka Glowing Sale"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    autoFocus
                />
          </div>

          {/* Promo Type Cards */}
          <div>
              <label className="block text-xs font-bold text-text-muted mb-3 uppercase tracking-wide">Promo Type</label>
              <div className="grid grid-cols-2 gap-3">
                  {[
                      { id: 'Discount', label: 'Discount %', icon: Percent, desc: 'Cut by percentage' },
                      { id: 'Fixed Cut', label: 'Fixed Cut', icon: DollarSign, desc: 'Cut by nominal amount' },
                      { id: 'Cashback', label: 'Cashback Wallet', icon: Wallet, desc: 'Return value to wallet' },
                      { id: 'Buy X Get Y', label: 'Buy X Get Y', icon: Gift, desc: 'Free item / treatment' }
                  ].map((type) => (
                      <div 
                        key={type.id}
                        onClick={() => setFormData({...formData, type: type.id as any})}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                            formData.type === type.id 
                            ? 'bg-soft-gold/10 border-soft-gold shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                          <div className={`p-2 rounded-lg ${formData.type === type.id ? 'bg-soft-gold text-white' : 'bg-gray-100 text-gray-400'}`}>
                              <type.icon size={18} />
                          </div>
                          <div>
                              <div className={`text-sm font-bold ${formData.type === type.id ? 'text-text-dark' : 'text-gray-600'}`}>{type.label}</div>
                              <div className="text-[10px] text-text-muted">{type.desc}</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Code Method */}
          <div>
              <label className="block text-xs font-bold text-text-muted mb-3 uppercase tracking-wide">Redemption Method</label>
              <div className="flex gap-2">
                  {['Auto', 'Generic', 'Unique'].map((method) => (
                      <button 
                        key={method}
                        onClick={() => setFormData({...formData, codeMethod: method as any})}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                            formData.codeMethod === method 
                            ? 'bg-text-dark text-white border-text-dark' 
                            : 'bg-white text-text-muted border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                          {method === 'Auto' && 'No Code (Auto)'}
                          {method === 'Generic' && 'Single Code'}
                          {method === 'Unique' && 'Unique Generated'}
                      </button>
                  ))}
              </div>

              {/* Dynamic Input based on Code Method */}
              <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {formData.codeMethod === 'Auto' && (
                      <p className="text-xs text-text-muted flex items-center gap-2">
                          <Target size={14} className="text-soft-gold"/> System will automatically apply this promo if rules are met at checkout.
                      </p>
                  )}
                  {formData.codeMethod === 'Generic' && (
                      <div>
                          <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Voucher Code</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-text-dark uppercase tracking-wider"
                            placeholder="e.g. MERDEKA78"
                            value={formData.promoCode}
                            onChange={e => setFormData({...formData, promoCode: e.target.value.toUpperCase()})}
                          />
                      </div>
                  )}
                  {formData.codeMethod === 'Unique' && (
                      <div>
                          <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Code Prefix & Qty</label>
                          <div className="flex gap-2">
                              <input 
                                type="text" 
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-text-dark uppercase tracking-wider"
                                placeholder="Prefix e.g. GIFT-"
                                value={formData.uniqueCodePrefix}
                                onChange={e => setFormData({...formData, uniqueCodePrefix: e.target.value.toUpperCase()})}
                              />
                              <input 
                                type="number" 
                                className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center"
                                placeholder="Qty"
                                value={formData.uniqueCodeQty}
                                onChange={e => setFormData({...formData, uniqueCodeQty: parseInt(e.target.value) || 0})}
                              />
                          </div>
                          <p className="text-[10px] text-text-muted mt-2 flex items-center gap-1">
                              <QrCode size={12}/> {formData.uniqueCodeQty} unique codes will be generated and downloadable after saving.
                          </p>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );

  const renderRulesStep = () => (
      <div className="space-y-6 animate-fade-in">
          
          {/* Validity Period */}
          <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="block text-xs font-bold text-text-muted mb-1.5">Start Date</label>
                     <input 
                        type="date"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                        value={formData.startDate?.toISOString().split('T')[0]}
                        onChange={e => setFormData({...formData, startDate: new Date(e.target.value)})}
                     />
                </div>
                 <div>
                     <label className="block text-xs font-bold text-text-muted mb-1.5">End Date</label>
                     <input 
                        type="date"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                        value={formData.endDate?.toISOString().split('T')[0]}
                        onChange={e => setFormData({...formData, endDate: new Date(e.target.value)})}
                     />
                </div>
          </div>

          {/* Time Restriction (Happy Hour) */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                      <CalendarClock size={16} className="text-soft-gold"/>
                      <span className="text-sm font-bold text-text-dark">Happy Hour / Time Limit</span>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                  <input 
                    type="time" 
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    value={formData.validTimeStart}
                    onChange={e => setFormData({...formData, validTimeStart: e.target.value})}
                  />
                  <span className="text-text-muted">-</span>
                  <input 
                    type="time" 
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    value={formData.validTimeEnd}
                    onChange={e => setFormData({...formData, validTimeEnd: e.target.value})}
                  />
              </div>
          </div>

          {/* Audience Filter */}
          <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Target Audience</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                  {['All', 'New', 'Tier', 'Birthday'].map(aud => (
                      <button 
                        key={aud}
                        onClick={() => setFormData({...formData, audienceFilter: aud as any})}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                            formData.audienceFilter === aud 
                            ? 'bg-text-dark text-white border-text-dark' 
                            : 'bg-white text-text-muted border-gray-200 hover:border-gray-300'
                        }`}
                      >
                          {aud === 'New' ? 'New Customer' : aud}
                      </button>
                  ))}
              </div>
          </div>

          {/* Anti Boncos Rules */}
          <div className="bg-rose/5 border border-rose/10 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 text-rose mb-1">
                  <Lock size={14} />
                  <span className="text-xs font-bold uppercase tracking-wide">Anti-Boncos Limits</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-[10px] font-bold text-text-muted mb-1">Min. Transaction</label>
                      <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">Rp</span>
                          <input 
                            type="number" 
                            className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rose/50"
                            placeholder="0"
                            value={formData.minTransaction}
                            onChange={e => setFormData({...formData, minTransaction: parseInt(e.target.value)})}
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-text-muted mb-1">Max Discount Cap</label>
                      <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">Rp</span>
                          <input 
                            type="number" 
                            className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rose/50"
                            placeholder="Unlimited"
                            value={formData.maxDiscountValue}
                            onChange={e => setFormData({...formData, maxDiscountValue: parseInt(e.target.value)})}
                          />
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-[10px] font-bold text-text-muted mb-1">Global Quota</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rose/50"
                        placeholder="e.g. 100 first people"
                        value={formData.globalQuota}
                        onChange={e => setFormData({...formData, globalQuota: parseInt(e.target.value)})}
                      />
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-text-muted mb-1">User Quota</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rose/50"
                        value={formData.userQuota}
                        onChange={e => setFormData({...formData, userQuota: parseInt(e.target.value)})}
                      />
                  </div>
              </div>
          </div>
      </div>
  );

  const renderRewardStep = () => (
      <div className="space-y-6 animate-fade-in">
          
          <div className="text-center py-4">
              <div className="w-16 h-16 bg-soft-gold/20 text-soft-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  {formData.type === 'Discount' && <Percent size={32}/>}
                  {formData.type === 'Fixed Cut' && <DollarSign size={32}/>}
                  {formData.type === 'Cashback' && <Wallet size={32}/>}
                  {formData.type === 'Buy X Get Y' && <Gift size={32}/>}
              </div>
              <h3 className="text-lg font-bold text-text-dark">{formData.type} Reward</h3>
              <p className="text-xs text-text-muted">Configure what the customer actually gets.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {formData.type === 'Buy X Get Y' ? (
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Buy Item (Trigger)</label>
                          <select 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                            value={formData.buyItem}
                            onChange={e => setFormData({...formData, buyItem: e.target.value})}
                          >
                              <option value="">Select Treatment / Product...</option>
                              {availableItems.map((item, idx) => (
                                  <option key={idx} value={item.name}>{item.name} ({item.type})</option>
                              ))}
                          </select>
                      </div>
                      <div className="flex justify-center text-soft-gold"><ArrowRight size={20}/></div>
                      <div>
                          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Get Item (Free/Disc)</label>
                          <select 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold"
                            value={formData.getItem}
                            onChange={e => setFormData({...formData, getItem: e.target.value})}
                          >
                              <option value="">Select Reward Item...</option>
                              {availableItems.map((item, idx) => (
                                  <option key={idx} value={item.name}>{item.name} ({item.type})</option>
                              ))}
                          </select>
                      </div>
                  </div>
              ) : (
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-text-muted mb-2 uppercase">
                              {formData.type === 'Cashback' ? 'Cashback Amount' : 'Discount Amount'}
                          </label>
                          <div className="flex gap-2">
                              {formData.type !== 'Fixed Cut' && (
                                <select 
                                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none"
                                    value={formData.valueType}
                                    onChange={e => setFormData({...formData, valueType: e.target.value as any})}
                                >
                                    <option value="Percent">Percent (%)</option>
                                    <option value="Nominal">Nominal (Rp)</option>
                                </select>
                              )}
                              <input 
                                type="number" 
                                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-xl font-bold text-text-dark focus:outline-none focus:border-soft-gold"
                                placeholder="0"
                                value={formData.value}
                                onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})}
                              />
                          </div>
                      </div>
                      
                      {/* Preview Context */}
                      <div className="bg-gray-50 p-3 rounded-lg text-xs text-text-muted border border-gray-100 flex items-start gap-2">
                          <AlertTriangle size={14} className="mt-0.5"/>
                          <p>
                              {formData.type === 'Cashback' 
                                ? "Cashback will be injected to Patient's Deposit Wallet after full payment." 
                                : "Discount will be deducted directly from the invoice total."}
                          </p>
                      </div>
                  </div>
              )}
          </div>

          <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Description / T&C</label>
              <textarea 
                rows={2}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-soft-gold resize-none"
                placeholder="Marketing text shown to patient..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
          </div>
      </div>
  );

  const renderSuccessStep = () => (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle size={40} />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-text-dark">Promotion Created!</h2>
              <p className="text-text-muted mt-2">
                  <span className="font-bold text-text-dark">{formData.name}</span> is now active.
              </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                  <div className="text-left">
                      <p className="text-xs text-text-muted uppercase tracking-wide">Generated Codes</p>
                      <p className="text-lg font-bold text-text-dark">{generatedCodes.length} Codes</p>
                  </div>
                  <FileSpreadsheet size={32} className="text-green-600 opacity-50"/>
              </div>
              
              <button 
                onClick={handleDownloadCodes}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                  <Download size={18} /> Download Excel (.csv)
              </button>
              <p className="text-xs text-text-muted mt-2 italic">
                  * Download is recommended for distribution.
              </p>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header with Steps */}
        <div className="px-6 py-4 border-b border-gray-100 bg-ivory">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-dark">Create Promotion</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
                <X size={20} />
            </button>
          </div>
          
          {/* Stepper */}
          {currentStep !== 'Success' && (
            <div className="flex items-center justify-between px-2">
                <div className={`flex items-center gap-2 ${currentStep === 'Identity' ? 'text-soft-gold font-bold' : 'text-text-muted'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${currentStep === 'Identity' ? 'border-soft-gold bg-soft-gold text-white' : 'border-gray-300'}`}>1</div>
                    <span className="text-xs">Identity</span>
                </div>
                <div className="h-px w-8 bg-gray-200"></div>
                <div className={`flex items-center gap-2 ${currentStep === 'Rules' ? 'text-soft-gold font-bold' : 'text-text-muted'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${currentStep === 'Rules' ? 'border-soft-gold bg-soft-gold text-white' : 'border-gray-300'}`}>2</div>
                    <span className="text-xs">Rules</span>
                </div>
                <div className="h-px w-8 bg-gray-200"></div>
                <div className={`flex items-center gap-2 ${currentStep === 'Reward' ? 'text-soft-gold font-bold' : 'text-text-muted'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${currentStep === 'Reward' ? 'border-soft-gold bg-soft-gold text-white' : 'border-gray-300'}`}>3</div>
                    <span className="text-xs">Reward</span>
                </div>
            </div>
          )}
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            {currentStep === 'Identity' && renderIdentityStep()}
            {currentStep === 'Rules' && renderRulesStep()}
            {currentStep === 'Reward' && renderRewardStep()}
            {currentStep === 'Success' && renderSuccessStep()}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-3">
            {currentStep === 'Success' ? (
                <button onClick={() => { onClose(); setCurrentStep('Identity'); }} className="w-full py-2.5 bg-gray-200 text-text-dark font-bold rounded-xl hover:bg-gray-300 transition-colors">
                    Close
                </button>
            ) : (
                <>
                    {currentStep !== 'Identity' ? (
                        <button onClick={handleBack} className="px-6 py-2.5 text-sm font-medium text-text-dark bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            Back
                        </button>
                    ) : (
                        <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-text-muted hover:text-text-dark transition-colors">
                            Cancel
                        </button>
                    )}

                    {currentStep !== 'Reward' ? (
                        <button onClick={handleNext} className="px-8 py-2.5 bg-text-dark text-white text-sm font-bold rounded-xl shadow-md hover:bg-black transition-colors flex items-center gap-2">
                            Next Step <ArrowRight size={16}/>
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="px-8 py-2.5 bg-soft-gold text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#cbad85] transition-colors flex items-center gap-2">
                            <Save size={16}/> Create & Launch
                        </button>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CreatePromoModal;
