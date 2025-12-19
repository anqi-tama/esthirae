
import React, { useState } from 'react';
import { 
    Users, 
    Clock, 
    MoreHorizontal, 
    PlayCircle, 
    CheckCircle2, 
    ArrowRight,
    Stethoscope,
    MonitorPlay
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock Data for Queues
const MOCK_QUEUES = [
    {
        doctorId: 'DR-001',
        doctorName: 'Dr. Sarah',
        specialty: 'Dermatologist',
        room: 'Room B (Laser)',
        status: 'Active',
        currentPatient: {
            queueNo: 'A-05',
            name: 'Emma Wilson',
            treatment: 'Laser Rejuvenation',
            startTime: '10:15'
        },
        waitingList: [
            { queueNo: 'A-06', name: 'Olivia Brown', treatment: 'Consultation' },
            { queueNo: 'A-07', name: 'Michael Chen', treatment: 'Acne Injection' },
            { queueNo: 'A-08', name: 'Sinta W.', treatment: 'Control' },
        ]
    },
    {
        doctorId: 'DR-002',
        doctorName: 'Dr. James',
        specialty: 'Aesthetic GP',
        room: 'Room C (Facial)',
        status: 'Active',
        currentPatient: {
            queueNo: 'B-02',
            name: 'Sophia Miller',
            treatment: 'Korean Glow Facial',
            startTime: '10:45'
        },
        waitingList: [
            { queueNo: 'B-03', name: 'Isabella Davis', treatment: 'Slimming' }
        ]
    },
    {
        doctorId: 'DR-003',
        doctorName: 'Dr. A. Wijaya',
        specialty: 'Plastic Surgeon',
        room: 'Room A (VIP)',
        status: 'Break',
        currentPatient: null, // No current patient
        waitingList: [
            { queueNo: 'C-01', name: 'Budi Santoso', treatment: 'Surgery Consult' },
            { queueNo: 'C-02', name: 'Linda K.', treatment: 'Post-op Control' }
        ]
    }
];

const QueueMonitor: React.FC = () => {
    const navigate = useNavigate();
    const [queues, setQueues] = useState(MOCK_QUEUES);

    const handleNextPatient = (docIndex: number) => {
        // Logic to move waiting[0] to current, and archive current
        const newQueues = [...queues];
        const queue = newQueues[docIndex];
        
        if (queue.waitingList.length > 0) {
            const next = queue.waitingList[0];
            queue.currentPatient = {
                ...next,
                startTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            queue.waitingList = queue.waitingList.slice(1);
            queue.status = 'Active';
            setQueues(newQueues);
        } else {
            alert("No patients in waiting list.");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">Patient Queue Monitor</h1>
                    <p className="text-text-muted mt-1">Live tracking of ongoing treatments and waiting lines.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-200 text-text-dark px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2">
                        <Clock size={18} /> History Log
                    </button>
                    <button 
                        onClick={() => navigate('/queue-tv')}
                        className="bg-text-dark text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-black flex items-center gap-2"
                    >
                        <MonitorPlay size={18} /> TV Display Mode
                    </button>
                </div>
            </div>

            {/* Queue Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {queues.map((q, idx) => (
                    <div key={q.doctorId} className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden flex flex-col">
                        
                        {/* Doctor Header */}
                        <div className="p-5 border-b border-gray-100 bg-ivory/50 flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-soft-gold shadow-sm">
                                    <Stethoscope size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-dark">{q.doctorName}</h3>
                                    <p className="text-xs text-text-muted">{q.specialty} • {q.room}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                q.status === 'Active' ? 'bg-sage/10 text-sage border-sage/20' : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}>
                                {q.status}
                            </span>
                        </div>

                        {/* Current Patient (Hero Section) */}
                        <div className="p-6 bg-white flex-1 flex flex-col items-center justify-center text-center border-b border-gray-100 relative overflow-hidden">
                            {q.currentPatient ? (
                                <>
                                    <div className="text-xs font-bold text-soft-gold uppercase tracking-widest mb-2">Now Serving</div>
                                    <div className="text-5xl font-black text-text-dark mb-1">{q.currentPatient.queueNo}</div>
                                    <div className="text-lg font-medium text-text-dark">{q.currentPatient.name}</div>
                                    <div className="text-sm text-text-muted mt-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                        {q.currentPatient.treatment}
                                    </div>
                                    <div className="absolute top-4 right-4 text-[10px] text-text-muted flex items-center gap-1">
                                        <Clock size={10}/> Started {q.currentPatient.startTime}
                                    </div>
                                </>
                            ) : (
                                <div className="py-8 opacity-40">
                                    <Users size={48} className="mx-auto mb-2"/>
                                    <p>No active patient</p>
                                </div>
                            )}
                        </div>

                        {/* Waiting List */}
                        <div className="bg-gray-50 p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-2">
                                    <Users size={12}/> Next in Line ({q.waitingList.length})
                                </h4>
                            </div>
                            
                            <div className="space-y-2 mb-4 max-h-[120px] overflow-y-auto custom-scrollbar">
                                {q.waitingList.length > 0 ? q.waitingList.map((wait, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-bold text-text-dark bg-gray-100 px-1.5 rounded text-xs">{wait.queueNo}</span>
                                            <div>
                                                <div className="text-sm font-medium text-text-dark">{wait.name}</div>
                                                <div className="text-[10px] text-text-muted">{wait.treatment}</div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-4 text-xs text-text-muted italic">Queue is empty.</div>
                                )}
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={() => handleNextPatient(idx)}
                                disabled={q.waitingList.length === 0}
                                className="w-full py-2.5 bg-soft-gold text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#cbad85] transition-all disabled:bg-gray-200 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Call Next Patient <ArrowRight size={16}/>
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default QueueMonitor;
