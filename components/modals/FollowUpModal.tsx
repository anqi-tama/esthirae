
import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, User, FileText } from 'lucide-react';

export interface TaskItem {
    id: string;
    type: 'Post-Care' | 'Birthday' | 'Reminder';
    patient: string;
    phone: string; // Added for WA link
    note: string;
    due: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Completed';
}

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  onComplete: () => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ isOpen, onClose, task, onComplete }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && task) {
      // Auto-generate template based on task condition
      let template = '';
      switch (task.type) {
        case 'Post-Care':
            template = `Halo Kak ${task.patient}, ini dari Esthirae Clinic. ✨\n\nKami ingin menanyakan kondisi kulit Kakak setelah treatment kemarin. Apakah ada kemerahan atau keluhan? Jangan lupa pakai moisturizer ya.`;
            break;
        case 'Birthday':
            template = `Happy Birthday Kak ${task.patient}! 🎂🥳\n\nKami punya kado spesial untuk Kakak: Voucher Diskon 20% untuk treatment apapun bulan ini. Ditunggu kedatangannya ya!`;
            break;
        case 'Reminder':
            template = `Halo Kak ${task.patient}, reminder ramah dari Esthirae. 👋\n\nPaket treatment Kakak akan segera berakhir dalam 7 hari. Yuk booking sesi terakhir atau perpanjang paketnya sebelum hangus.`;
            break;
        default:
            template = `Halo Kak ${task.patient}, ada info terbaru dari Esthirae Clinic...`;
      }
      setMessage(template);
    }
  }, [isOpen, task]);

  const handleSend = () => {
      if (!task) return;

      const cleanPhone = task.phone.replace(/^0/, '62').replace(/\D/g, '');
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(url, '_blank');
      
      // Mark as done
      onComplete();
      onClose();
  };

  if (!isOpen || !task) return null;

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
                <MessageSquare size={18} className="text-soft-gold"/> Task Follow Up
            </h2>
            <p className="text-xs text-text-muted mt-1">Contacting <span className="font-bold text-text-dark">{task.patient}</span> regarding <span className="font-bold text-text-dark">{task.type}</span>.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
            {/* Task Context */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-text-muted">
                    <FileText size={16}/>
                </div>
                <div>
                    <div className="text-xs font-bold text-text-muted uppercase tracking-wide">Internal Note</div>
                    <p className="text-sm text-text-dark">{task.note}</p>
                </div>
            </div>

            {/* Message Area */}
            <div>
                <label className="block text-xs font-bold text-text-dark mb-2">WhatsApp Message Preview</label>
                <textarea 
                    className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-sm text-text-dark focus:outline-none focus:border-soft-gold resize-none leading-relaxed shadow-inner"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <p className="text-[10px] text-text-muted mt-2 text-right">
                    *Sending this will automatically mark the task as <strong>Completed</strong>.
                </p>
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors">Cancel</button>
            <button 
                onClick={handleSend} 
                className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
                <Send size={16}/> Send & Complete Task
            </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
