
import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Stethoscope, Activity, CheckCircle2 } from 'lucide-react';

const QueueInfoPage: React.FC = () => {
    const { id } = useParams();

    // In a real app, use 'id' to fetch data from backend.
    // For this mock, we simulate data based on the ID or use static placeholders.
    const mockData = {
        queueNo: id || 'A-01',
        patientName: 'Emma Wilson', // This would come from DB
        status: 'Waiting',
        doctor: 'Dr. Sarah',
        treatment: 'Laser Rejuvenation',
        time: '10:00',
        date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        estimatedWait: '15 Mins'
    };

    return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-4 font-sans animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                
                {/* Header Brand */}
                <div className="bg-text-dark p-6 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-2xl font-serif font-bold tracking-wide text-soft-gold">Esthirae</h1>
                        <p className="text-xs uppercase tracking-widest opacity-70">Aesthetic Intelligence</p>
                    </div>
                    {/* Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                </div>

                <div className="p-8">
                    {/* Queue Card */}
                    <div className="text-center mb-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-soft-gold/10 text-soft-gold text-xs font-bold uppercase tracking-wider mb-4 border border-soft-gold/20">
                            Queue Number / Nomor Antrean
                        </div>
                        <h2 className="text-6xl font-black text-text-dark mb-2 tracking-tighter">{mockData.queueNo}</h2>
                        <div className="flex items-center justify-center gap-2 text-sage font-bold bg-sage/10 py-2 px-4 rounded-xl mx-auto w-fit">
                            <Activity size={18} className="animate-pulse"/>
                            <span>Status: {mockData.status}</span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                                    <User size={20}/>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted uppercase font-bold">Patient</p>
                                    <p className="text-sm font-bold text-text-dark">{mockData.patientName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="mb-2 text-gray-400"><Stethoscope size={20}/></div>
                                <p className="text-xs text-text-muted uppercase font-bold">Doctor</p>
                                <p className="text-sm font-bold text-text-dark">{mockData.doctor}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="mb-2 text-gray-400"><Clock size={20}/></div>
                                <p className="text-xs text-text-muted uppercase font-bold">Time</p>
                                <p className="text-sm font-bold text-text-dark">{mockData.time}</p>
                            </div>
                        </div>

                        <div className="bg-ivory p-4 rounded-xl border border-soft-gold/20">
                            <p className="text-xs text-text-muted uppercase font-bold mb-1 flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-soft-gold"/> Treatment
                            </p>
                            <p className="text-lg font-serif font-bold text-text-dark">{mockData.treatment}</p>
                            <div className="h-px w-full bg-soft-gold/20 my-3"></div>
                            <p className="text-xs text-center text-text-muted">
                                Please arrive 10 minutes before your scheduled time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                    <p className="text-[10px] text-text-muted">
                        &copy; {new Date().getFullYear()} Esthirae Clinic System.<br/>
                        Jl. Kesehatan No. 88, Jakarta
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QueueInfoPage;
