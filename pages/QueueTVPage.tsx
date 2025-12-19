
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Stethoscope, Volume2 } from 'lucide-react';

// Mock Data (Synced structure with Monitor)
const MOCK_QUEUES = [
    {
        doctorId: 'DR-001',
        doctorName: 'Dr. Sarah',
        specialty: 'Dermatologist',
        room: 'Room B (Laser)',
        status: 'Active',
        currentPatient: {
            queueNo: 'A-05',
            name: 'Emma W.', // Privacy masking
            treatment: 'Laser Rejuve',
        },
        nextPatients: ['A-06', 'A-07', 'A-08']
    },
    {
        doctorId: 'DR-002',
        doctorName: 'Dr. James',
        specialty: 'Aesthetic GP',
        room: 'Room C (Facial)',
        status: 'Active',
        currentPatient: {
            queueNo: 'B-02',
            name: 'Sophia M.',
            treatment: 'Glow Facial',
        },
        nextPatients: ['B-03']
    },
    {
        doctorId: 'DR-003',
        doctorName: 'Dr. A. Wijaya',
        specialty: 'Plastic Surgeon',
        room: 'Room A (VIP)',
        status: 'Break',
        currentPatient: null, 
        nextPatients: ['C-01', 'C-02']
    }
];

const QueueTVPage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Live Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-ivory flex flex-col overflow-hidden font-sans text-text-dark animate-fade-in cursor-none">
            
            {/* 1. TV Header */}
            <div className="bg-white px-8 py-5 shadow-sm border-b-4 border-soft-gold flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-text-dark rounded-xl flex items-center justify-center text-soft-gold font-serif font-bold text-2xl shadow-lg">
                        E
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold tracking-wide text-text-dark">Esthirae Clinic</h1>
                        <p className="text-xs uppercase tracking-widest text-text-muted">Queue Information System</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-3xl font-mono font-bold text-text-dark leading-none">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm font-medium text-text-muted uppercase mt-1">
                            {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start content-start">
                
                {MOCK_QUEUES.map((q, idx) => (
                    <div key={idx} className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden flex flex-col h-full max-h-[600px] transform transition-all duration-500 hover:scale-[1.01]">
                        
                        {/* Doctor Header */}
                        <div className="bg-text-dark text-white p-6 relative overflow-hidden">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full border-2 border-soft-gold bg-gray-700 overflow-hidden shrink-0">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(q.doctorName)}&background=random`} 
                                        alt={q.doctorName} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-soft-gold">{q.doctorName}</h2>
                                    <p className="text-sm opacity-80">{q.specialty}</p>
                                    <div className="flex items-center gap-1.5 mt-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                                        <MapPin size={12}/> {q.room}
                                    </div>
                                </div>
                            </div>
                            {/* Bg Decoration */}
                            <div className="absolute -right-6 -bottom-12 text-white/5 rotate-12">
                                <Stethoscope size={150} />
                            </div>
                        </div>

                        {/* Status Area */}
                        {q.status === 'Active' && q.currentPatient ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-ivory relative">
                                {/* Blinking Indicator for "Called" status effect */}
                                <div className="absolute top-4 right-4 flex items-center gap-2 text-rose animate-pulse font-bold text-xs uppercase tracking-widest border border-rose/20 px-3 py-1 rounded-full bg-rose/5">
                                    <Volume2 size={14}/> Serving
                                </div>

                                <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Nomor Antrean</p>
                                
                                <div className="text-8xl font-black text-text-dark mb-6 tracking-tighter drop-shadow-sm">
                                    {q.currentPatient.queueNo}
                                </div>
                                
                                <div className="text-2xl font-serif font-bold text-soft-gold">
                                    {q.currentPatient.name}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/50">
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-400">
                                    <Clock size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-400">On Break</h3>
                                <p className="text-sm text-gray-400 mt-2">Session will resume shortly</p>
                            </div>
                        )}

                        {/* Footer / Next List */}
                        <div className="bg-gray-100 p-5 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-text-dark uppercase bg-white border border-gray-300 px-2 py-1 rounded">
                                    Next
                                </span>
                                <div className="flex-1 flex gap-3 overflow-hidden">
                                    {q.nextPatients.length > 0 ? q.nextPatients.map((nextNo, i) => (
                                        <span key={i} className={`text-lg font-bold ${i === 0 ? 'text-text-dark' : 'text-gray-400'}`}>
                                            {nextNo}
                                        </span>
                                    )) : (
                                        <span className="text-sm text-text-muted italic">No waiting patients</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Running Text Footer */}
            <div className="bg-text-dark text-white py-3 overflow-hidden relative border-t-4 border-soft-gold">
                <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] flex gap-16 text-lg font-medium">
                    <span>✨ Welcome to Esthirae Clinic. Please wait for your number to be called.</span>
                    <span>🌿 Promo of the Month: Get 20% OFF for Laser Rejuvenation Package!</span>
                    <span>👩‍⚕️ Maintain silence in the waiting area for comfort.</span>
                    <span>📲 Download our App to book appointments from home.</span>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
};

export default QueueTVPage;
