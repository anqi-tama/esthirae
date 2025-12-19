
import React, { useState } from 'react';
import { X, Send, MessageSquare, User, Quote } from 'lucide-react';

interface ReplyFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  originalComment: string;
  onSend: (message: string) => void;
}

const ReplyFeedbackModal: React.FC<ReplyFeedbackModalProps> = ({ 
    isOpen, 
    onClose, 
    patientName, 
    originalComment,
    onSend 
}) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
      if (!message.trim()) {
          alert("Please enter a reply message.");
          return;
      }
      onSend(message);
      setMessage(''); // Reset
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ivory">
          <div>
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
                <MessageSquare size={18} className="text-soft-gold"/> Reply to Feedback
            </h2>
            <p className="text-xs text-text-muted mt-1">Responding to <span className="font-bold text-text-dark">{patientName}</span></p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
            {/* Original Comment Context */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                <Quote size={16} className="absolute top-3 left-3 text-gray-300"/>
                <p className="text-sm text-text-dark italic pl-6">"{originalComment}"</p>
            </div>

            {/* Message Area */}
            <div>
                <label className="block text-xs font-bold text-text-dark mb-2">Your Reply</label>
                <textarea 
                    className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-sm text-text-dark focus:outline-none focus:border-soft-gold resize-none leading-relaxed shadow-inner"
                    placeholder="Type your response here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    autoFocus
                ></textarea>
                <div className="flex gap-2 mt-2">
                    <button 
                        onClick={() => setMessage(`Halo Kak ${patientName}, terima kasih atas feedbacknya! Kami sangat menghargai masukan Kakak dan akan segera kami evaluasi.`)}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-text-muted transition-colors"
                    >
                        + Use Template: Thank You
                    </button>
                    <button 
                        onClick={() => setMessage(`Halo Kak ${patientName}, mohon maaf atas ketidaknyamanan yang dialami. Tim kami akan segera menghubungi Kakak untuk investigasi lebih lanjut.`)}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-text-muted transition-colors"
                    >
                        + Use Template: Apology
                    </button>
                </div>
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors">Cancel</button>
            <button 
                onClick={handleSend} 
                className="px-6 py-2 bg-soft-gold text-white text-sm font-bold rounded-lg shadow-md hover:bg-[#cbad85] transition-colors flex items-center gap-2"
            >
                <Send size={16}/> Send Reply
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyFeedbackModal;
