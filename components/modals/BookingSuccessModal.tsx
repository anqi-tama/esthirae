
import React from 'react';
import { X, Printer, Send, MessageCircle, Copy, CheckCircle2 } from 'lucide-react';
import { Patient } from '../../types';

interface BookingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void; // Usually navigates back to agenda
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

    // Format Date for display
    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // WhatsApp Template
    const waMessage = `Halo Kak ${data.patient.name},%0A%0AKonfirmasi Booking Treatment di *Esthirae Clinic*:%0A%0A🗓 Tanggal: ${formattedDate}%0A⏰ Jam: ${data.time}%0A👩‍⚕ Dokter: ${data.doctor}%0A✨ Treatment: ${data.treatment}%0A%0AMohon hadir 10 menit sebelum jadwal. Terima kasih!`;
    
    // Clean phone number for URL (replace 08 with 628)
    const cleanPhone = data.patient.phone.replace(/^0/, '62').replace(/\D/g, '');
    const waLink = `https://wa.me/${cleanPhone}?text=${waMessage}`;

    // --- Generate QR Code URL ---
    // In a real deployed app, this would be the actual domain.
    // Since we are using HashRouter, we construct it carefully.
    const baseUrl = window.location.origin + window.location.pathname; // Gets current base e.g. http://localhost:5173/
    const queuePageUrl = `${baseUrl}#/queue/${data.queueNo}`;
    
    // Using a public API for QR Code generation (standard for simple frontend demos without libraries)
    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(queuePageUrl)}&color=2f2f2f`;

    const handlePrint = () => {
        // In a real app, this would trigger window.print() with specific CSS for the ticket div
        // or send data to a thermal printer API.
        const printContent = document.getElementById('thermal-ticket');
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to restore state after body replace hack
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col md:flex-row animate-fade-in max-h-[90vh]">
                
                {/* LEFT: Success & WhatsApp Action */}
                <div className="flex-1 p-8 flex flex-col justify-center bg-white border-r border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-short">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-text-dark">Booking Confirmed!</h2>
                        <p className="text-text-muted mt-2">Appointment has been scheduled successfully.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-2 mb-2">
                                <MessageCircle size={14} className="text-green-600"/> WhatsApp Reminder
                            </label>
                            <div className="bg-white border border-gray-200 p-3 rounded-lg text-sm text-text-dark font-mono whitespace-pre-line mb-3">
                                {decodeURIComponent(waMessage).replace(/\+/g, ' ')}
                            </div>
                            <div className="flex gap-2">
                                <a 
                                    href={waLink} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                                >
                                    <Send size={16}/> Send WA
                                </a>
                                <button className="px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors" title="Copy Text">
                                    <Copy size={16}/>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        <button 
                            onClick={onClose}
                            className="w-full py-3 bg-gray-100 text-text-dark font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Done & Close
                        </button>
                    </div>
                </div>

                {/* RIGHT: Thermal Printer Preview */}
                <div className="w-full md:w-80 bg-gray-200 p-8 flex flex-col items-center justify-center overflow-y-auto">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <Printer size={14}/> Thermal Preview
                    </div>
                    
                    {/* TICKET MOCKUP */}
                    <div id="thermal-ticket" className="bg-white w-[280px] p-5 shadow-lg text-center relative font-mono text-text-dark leading-tight">
                        {/* Cut Patterns (Visual Only) */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-[linear-gradient(135deg,transparent_4px,white_4px),linear-gradient(225deg,transparent_4px,white_4px)] bg-[size:10px_10px] -mt-2"></div>
                        
                        <div className="mb-4 pb-4 border-b-2 border-dashed border-gray-300">
                            <h3 className="font-bold text-xl mb-1">ESTHIRAE</h3>
                            <p className="text-[10px] text-gray-500">Aesthetic & Wellness Clinic</p>
                            <p className="text-[10px] text-gray-500">Jl. Kesehatan No. 88, Jakarta</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-gray-500 uppercase">Nomor Antrean</p>
                            <h1 className="text-5xl font-black text-text-dark my-2">{data.queueNo}</h1>
                            <p className="text-xs font-bold">{data.treatment}</p>
                        </div>

                        <div className="text-left text-xs space-y-2 mb-4 pb-4 border-b-2 border-dashed border-gray-300">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Date:</span>
                                <span>{data.date.split('T')[0]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Time:</span>
                                <span>{data.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Doctor:</span>
                                <span>{data.doctor.split(' ')[1]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Patient:</span>
                                <span className="font-bold">{data.patient.name.substring(0, 15)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center mb-4">
                            {/* Functional QR Code Image */}
                            <img 
                                src={qrCodeImageUrl} 
                                alt="Queue QR" 
                                className="w-32 h-32 mb-1 border-2 border-gray-100 p-1 rounded"
                            />
                            <p className="text-[9px] text-gray-400 font-mono tracking-tighter">SCAN FOR LIVE QUEUE</p>
                        </div>

                        <p className="text-[10px] text-gray-500 mt-2">
                            Simpan struk ini sampai<br/>giliran Anda dipanggil.
                        </p>
                        
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-[linear-gradient(45deg,transparent_4px,white_4px),linear-gradient(-45deg,transparent_4px,white_4px)] bg-[size:10px_10px] -mb-2 transform rotate-180"></div>
                    </div>

                    <button 
                        onClick={handlePrint}
                        className="mt-6 px-6 py-2 bg-text-dark text-white rounded-lg text-sm font-bold shadow-lg hover:bg-black transition-all flex items-center gap-2"
                    >
                        <Printer size={16}/> Print Ticket
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BookingSuccessModal;
