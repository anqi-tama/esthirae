import React from 'react';
import { X, Printer, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { Patient } from '../../types.ts';

interface BookingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        patient: Patient;
        treatment: string;
        doctor: string;
        date: string;
        time: string;
        queueNo: string;
    } | null;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.queueNo)}&color=2f2f2f`;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col md:flex-row animate-fade-in">
                <div className="flex-1 p-8 flex flex-col justify-center bg-white border-r border-gray-100 text-center">
                    <div className="w-16 h-16 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-text-dark">Booking Confirmed!</h2>
                    <p className="text-text-muted mt-2 mb-8">Appointment scheduled for {data.patient.name}</p>
                    <button onClick={onClose} className="w-full py-3 bg-gray-100 text-text-dark font-bold rounded-xl hover:bg-gray-200 transition-colors">Done & Close</button>
                </div>
                <div className="w-full md:w-80 bg-gray-100 p-8 flex flex-col items-center justify-center">
                    <div className="bg-white w-[260px] p-6 shadow-lg text-center relative font-mono text-text-dark rounded-sm">
                        <h3 className="font-bold text-lg border-b border-dashed border-gray-300 pb-2 mb-4">ESTHIRAE</h3>
                        <p className="text-xs text-text-muted uppercase">Queue Number</p>
                        <h1 className="text-5xl font-black my-4">{data.queueNo}</h1>
                        <p className="text-xs font-bold mb-4">{data.treatment}</p>
                        <img src={qrCodeImageUrl} alt="QR" className="w-32 h-32 mx-auto mb-4 opacity-80" />
                        <p className="text-[10px] text-text-muted">SCAN FOR LIVE QUEUE</p>
                    </div>
                    <button className="mt-6 px-6 py-2 bg-text-dark text-white rounded-lg text-sm font-bold flex items-center gap-2">
                        <Printer size={16}/> Print Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessModal;