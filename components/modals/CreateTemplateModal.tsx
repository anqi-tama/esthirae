
import React, { useState } from 'react';
import { X, Save, MessageSquare, Plus, FileText } from 'lucide-react';
import { WhatsAppTemplate } from '../../types';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: WhatsAppTemplate) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in both Title and Content.");
      return;
    }

    const newTemplate: WhatsAppTemplate = {
      id: `T-${Date.now()}`,
      title,
      content
    };

    onSave(newTemplate);
    onClose();
    // Reset
    setTitle('');
    setContent('');
  };

  const handleInsertVariable = (variable: string) => {
    setContent(prev => prev + ` ${variable}`);
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
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
                <MessageSquare size={20} className="text-soft-gold" />
                New WhatsApp Template
            </h2>
            <p className="text-xs text-text-muted mt-1">Create a reusable message for broadcasts and automation.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5">Template Title</label>
                    <input 
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold"
                        placeholder="e.g. Birthday Greeting V2"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5">Message Content</label>
                    <div className="relative">
                        <textarea 
                            rows={5}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold resize-none leading-relaxed"
                            placeholder="Type your message here..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        
                        {/* Helper Tools */}
                        <div className="flex gap-2 mt-2">
                            <button 
                                type="button" 
                                onClick={() => handleInsertVariable('[Name]')}
                                className="text-[10px] bg-gray-100 border border-gray-200 px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1 text-text-dark transition-colors"
                            >
                                <Plus size={10}/> Insert Name
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleInsertVariable('[Link]')}
                                className="text-[10px] bg-gray-100 border border-gray-200 px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1 text-text-dark transition-colors"
                            >
                                <Plus size={10}/> Insert Link Placeholder
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-text-muted hover:text-text-dark transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 bg-soft-gold text-white text-sm font-medium rounded-xl shadow-lg hover:bg-[#cbad85] transition-colors flex items-center justify-center gap-2">
                        <Save size={18} /> Save Template
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
