
import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Tag, FileText, ChevronRight } from 'lucide-react';
import { MOCK_PROMOTIONS, MOCK_WHATSAPP_TEMPLATES } from '../../constants';
import { Promotion, WhatsAppTemplate } from '../../types';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientCount: number;
  onSend: (message: string) => void;
}

const BroadcastModal: React.FC<BroadcastModalProps> = ({ isOpen, onClose, recipientCount, onSend }) => {
  const [activeTab, setActiveTab] = useState<'Templates' | 'Promos'>('Templates');
  const [message, setMessage] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter only active promotions
  const activePromos = MOCK_PROMOTIONS.filter(p => p.status === 'Active');

  useEffect(() => {
      if (isOpen) {
          setMessage('');
          setSelectedId(null);
          setActiveTab('Templates');
      }
  }, [isOpen]);

  const handleSelectTemplate = (template: WhatsAppTemplate) => {
      setMessage(template.content);
      setSelectedId(template.id);
  };

  const handleSelectPromo = (promo: Promotion) => {
      const promoText = `Special Deal: ${promo.name}! ✨\nNikmati ${promo.valueType === 'Percent' ? `Diskon ${promo.value}%` : `Potongan Rp ${promo.value.toLocaleString()}`} khusus untuk Kakak.\nBerlaku sampai ${new Date(promo.endDate).toLocaleDateString()}. Book sekarang!`;
      setMessage(promoText);
      setSelectedId(promo.id);
  };

  const handleSend = () => {
      if (!message.trim()) {
          alert("Please enter a message or select a template.");
          return;
      }
      onSend(message);
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
                <MessageSquare size={18} className="text-soft-gold"/> Broadcast Message
            </h2>
            <p className="text-xs text-text-muted mt-1">Sending to <span className="font-bold text-text-dark">{recipientCount} patients</span></p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Selection */}
            <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col">
                <div className="flex border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab('Templates')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'Templates' ? 'bg-white text-soft-gold border-b-2 border-soft-gold' : 'text-text-muted hover:bg-gray-100'}`}
                    >
                        Templates
                    </button>
                    <button 
                        onClick={() => setActiveTab('Promos')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'Promos' ? 'bg-white text-soft-gold border-b-2 border-soft-gold' : 'text-text-muted hover:bg-gray-100'}`}
                    >
                        Active Promos
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {activeTab === 'Templates' ? (
                        MOCK_WHATSAPP_TEMPLATES.map(t => (
                            <div 
                                key={t.id}
                                onClick={() => handleSelectTemplate(t)}
                                className={`p-3 rounded-lg cursor-pointer border text-left transition-all ${selectedId === t.id ? 'bg-white border-soft-gold shadow-sm ring-1 ring-soft-gold/20' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText size={14} className={selectedId === t.id ? 'text-soft-gold' : 'text-text-muted'}/>
                                    <span className="text-xs font-bold text-text-dark line-clamp-1">{t.title}</span>
                                </div>
                                <p className="text-[10px] text-text-muted line-clamp-2">{t.content}</p>
                            </div>
                        ))
                    ) : (
                        activePromos.length > 0 ? activePromos.map(p => (
                            <div 
                                key={p.id}
                                onClick={() => handleSelectPromo(p)}
                                className={`p-3 rounded-lg cursor-pointer border text-left transition-all ${selectedId === p.id ? 'bg-white border-sage shadow-sm ring-1 ring-sage/20' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Tag size={14} className={selectedId === p.id ? 'text-sage' : 'text-text-muted'}/>
                                    <span className="text-xs font-bold text-text-dark line-clamp-1">{p.name}</span>
                                </div>
                                <p className="text-[10px] text-text-muted">
                                    {p.valueType === 'Percent' ? `${p.value}% Off` : `Cut Rp ${p.value.toLocaleString()}`} • {p.targetTier}
                                </p>
                            </div>
                        )) : (
                            <div className="p-4 text-center text-xs text-text-muted italic">No active promotions found.</div>
                        )
                    )}
                </div>
            </div>

            {/* Right Content: Preview & Edit */}
            <div className="flex-1 p-6 flex flex-col bg-white">
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Message Preview</label>
                <div className="flex-1 relative">
                    <textarea 
                        className="w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-text-dark focus:outline-none focus:border-soft-gold resize-none leading-relaxed"
                        placeholder="Select a template or type your message here..."
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            setSelectedId(null); // Deselect template if modified manually
                        }}
                    ></textarea>
                    <div className="absolute bottom-4 right-4 text-[10px] text-text-muted bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                        [Name] will be replaced automatically
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors">Cancel</button>
            <button 
                onClick={handleSend} 
                disabled={!message}
                className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
            >
                <Send size={16}/> Send WhatsApp Blast
            </button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastModal;
