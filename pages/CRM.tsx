
import React, { useState, useMemo } from 'react';
import { 
    Users,
    Search,
    User,
    Calendar,
    Phone,
    Activity,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertTriangle,
    BarChart3,
    Heart,
    Star,
    ArrowRight,
    Square,
    CheckSquare,
    Check,
    ThumbsUp,
    ThumbsDown,
    AlertCircle
} from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';
import { Patient } from '../types';
import BroadcastModal from '../components/modals/BroadcastModal';
import FollowUpModal, { TaskItem } from '../components/modals/FollowUpModal';
import ReplyFeedbackModal from '../components/modals/ReplyFeedbackModal';

type CRMTab = 'Dashboard' | 'Segmentation' | 'Tasks' | 'Feedback';

const CRM: React.FC = () => {
    const [activeTab, setActiveTab] = useState<CRMTab>('Dashboard');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Task State ---
    const [tasks, setTasks] = useState<TaskItem[]>([
        { id: 'T1', type: 'Post-Care', patient: 'Emma Wilson', phone: '081234567890', note: 'Ask about redness after Laser (H+1)', due: 'Today', priority: 'High', status: 'Pending' },
        { id: 'T2', type: 'Birthday', patient: 'Olivia Brown', phone: '081298765432', note: 'Send birthday voucher via WA', due: 'Today', priority: 'Medium', status: 'Pending' },
        { id: 'T3', type: 'Reminder', patient: 'Sophia Miller', phone: '081345678901', note: 'Package expiring in 7 days', due: 'Tomorrow', priority: 'Low', status: 'Pending' },
        { id: 'T4', type: 'Post-Care', patient: 'Isabella Davis', phone: '081122334455', note: 'Botox follow up (H+3)', due: 'Today', priority: 'High', status: 'Completed' },
    ]);
    
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

    // --- Handlers ---

    const handleOpenFollowUp = (task: TaskItem) => {
        setSelectedTask(task);
        setIsFollowUpModalOpen(true);
    };

    const handleTaskComplete = () => {
        if (selectedTask) {
            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'Completed' } : t));
        }
    };

    // --- Sub-components ---

    const Patient360Dashboard = () => {
        // Mock Patient for 360 View Demo
        const patient = MOCK_PATIENTS[0]; 

        return (
            <div className="space-y-6 animate-fade-in">
                {/* Search Bar */}
                <div className="bg-white p-6 rounded-xl shadow-soft flex flex-col items-center justify-center text-center">
                    <h2 className="text-xl font-bold text-text-dark mb-2">Patient 360° Search</h2>
                    <p className="text-text-muted mb-4 text-sm">Find any patient to view comprehensive history and insights.</p>
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                        <input 
                            type="text" 
                            placeholder="Enter Name, Phone, or Patient ID..." 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-soft-gold shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* 360 Profile Card (Demo) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Bio & Tags */}
                    <div className="bg-white p-6 rounded-xl shadow-soft border-t-4 border-t-soft-gold">
                        <div className="flex items-center gap-4 mb-6">
                            <img src={patient.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"/>
                            <div>
                                <h3 className="font-bold text-lg text-text-dark">{patient.name}</h3>
                                <p className="text-sm text-text-muted">{patient.id} • {patient.tier}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">Medical Profile</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-rose/10 text-rose px-2 py-1 rounded text-xs font-bold border border-rose/20">Allergy: Penicillin</span>
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs border border-blue-100">Skin: Oily/Acne</span>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">Preferences</h4>
                                <ul className="text-sm space-y-1 text-text-dark">
                                    <li className="flex items-center gap-2"><User size={14} className="text-soft-gold"/> Prefers Dr. Sarah</li>
                                    <li className="flex items-center gap-2"><Clock size={14} className="text-soft-gold"/> Weekend Mornings</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Financial & Behavior */}
                    <div className="bg-white p-6 rounded-xl shadow-soft">
                        <h4 className="text-sm font-bold text-text-dark mb-4 flex items-center gap-2">
                            <BarChart3 size={16} className="text-soft-gold"/> Financial & Behavior
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-xs text-text-muted">Lifetime Value</div>
                                <div className="text-lg font-bold text-text-dark">Rp 12.5M</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-xs text-text-muted">Avg Ticket Size</div>
                                <div className="text-lg font-bold text-text-dark">Rp 1.2M</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-xs text-text-muted">Deposit Balance</div>
                                <div className="text-lg font-bold text-sage">Rp 2.5M</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-xs text-text-muted">Visit Freq</div>
                                <div className="text-lg font-bold text-text-dark">1.2 / mo</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">Top Treatments</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Laser Rejuvenation</span>
                                    <span className="font-bold">5x</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Acne Peel</span>
                                    <span className="font-bold">3x</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Next Actions / Tasks */}
                    <div className="bg-white p-6 rounded-xl shadow-soft border-t-4 border-t-lavender">
                        <h4 className="text-sm font-bold text-text-dark mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-lavender"/> Recommended Actions
                        </h4>
                        
                        <div className="space-y-3">
                            <div className="p-3 bg-ivory border border-soft-gold/20 rounded-lg flex gap-3">
                                <MessageSquare size={18} className="text-soft-gold shrink-0 mt-0.5"/>
                                <div>
                                    <div className="text-sm font-bold text-text-dark">Post-Treatment Check</div>
                                    <p className="text-xs text-text-muted mt-1">3 days since Laser. Ask about redness/recovery.</p>
                                    <button className="mt-2 text-xs bg-white border border-gray-200 px-3 py-1 rounded font-medium hover:bg-gray-50">Open WhatsApp</button>
                                </div>
                            </div>
                            
                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex gap-3">
                                <Heart size={18} className="text-rose shrink-0 mt-0.5"/>
                                <div>
                                    <div className="text-sm font-bold text-text-dark">Package Renewal</div>
                                    <p className="text-xs text-text-muted mt-1">Acne Package has 1 session left. Offer renewal promo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const SegmentationView = () => {
        const [selectedSegment, setSelectedSegment] = useState('Sleeping Beauty');
        
        // Broadcast State
        const [isSelectionMode, setIsSelectionMode] = useState(false);
        const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
        const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

        // Map Mock Patients to Segments for Demo purposes
        const enrichedPatients = useMemo(() => {
            return MOCK_PATIENTS.map((p, index) => {
                let seg = 'Newbies';
                if (index === 0 || index === 3) seg = 'VIP / Whales';
                if (index === 1) seg = 'Sleeping Beauty';
                if (index === 2) seg = 'Loyal Regulars';
                if (index === 4) seg = 'At Risk';
                
                return { 
                    ...p, 
                    segment: seg,
                    lastTreatmentName: index === 0 ? 'Laser Rejuvenation' : 'Korean Glow Facial' 
                };
            });
        }, []);

        const segments = [
            { name: 'VIP / Whales', count: 45, desc: 'High Spenders, Frequent Visits', color: 'bg-soft-gold' },
            { name: 'Loyal Regulars', count: 120, desc: 'Consistent visits, Avg Spend', color: 'bg-lavender' },
            { name: 'Newbies', count: 58, desc: '1st Visit in last 30 days', color: 'bg-sage' },
            { name: 'Sleeping Beauty', count: 210, desc: 'Inactive > 90 Days', color: 'bg-gray-400' },
            { name: 'At Risk', count: 12, desc: 'Negative feedback or refund history', color: 'bg-rose' },
        ];

        const displayedPatients = enrichedPatients.filter(p => p.segment === selectedSegment);

        // Checkbox Logic
        const toggleSelection = (id: string) => {
            if (selectedPatientIds.includes(id)) {
                setSelectedPatientIds(selectedPatientIds.filter(pid => pid !== id));
            } else {
                setSelectedPatientIds([...selectedPatientIds, id]);
            }
        };

        const toggleSelectAll = () => {
            if (selectedPatientIds.length === displayedPatients.length) {
                setSelectedPatientIds([]);
            } else {
                setSelectedPatientIds(displayedPatients.map(p => p.id));
            }
        };

        const handleBroadcastSend = (message: string) => {
            const count = selectedPatientIds.length;
            if (count > 0) {
                const firstPatient = displayedPatients.find(p => p.id === selectedPatientIds[0]);
                if (firstPatient) {
                    const cleanPhone = firstPatient.phone.replace(/^0/, '62').replace(/\D/g, '');
                    const personalizedMsg = message.replace('[Name]', firstPatient.name);
                    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalizedMsg)}`;
                    
                    alert(`Simulating Broadcast to ${count} patients... Opening first chat.`);
                    window.open(url, '_blank');
                }
            }
            setIsSelectionMode(false);
            setSelectedPatientIds([]);
        };

        const handleWhatsAppFollowUp = (patient: any) => {
            const cleanPhone = patient.phone.replace(/^0/, '62').replace(/\D/g, '');
            let message = '';
            
            switch(selectedSegment) {
                case 'VIP / Whales':
                    message = `Halo Kak ${patient.name}, terima kasih telah menjadi pelanggan setia Esthirae. Kami ada penawaran eksklusif VIP untuk Kakak...`;
                    break;
                case 'Sleeping Beauty':
                    message = `Halo Kak ${patient.name}, sudah lama tidak mampir ke Esthirae nih! Kami kangen. Yuk treatment lagi, ada diskon spesial lho...`;
                    break;
                case 'Newbies':
                    message = `Halo Kak ${patient.name}, gimana hasil treatment pertamanya? Semoga cocok ya. Jangan lupa jadwal kontrol berikutnya...`;
                    break;
                default:
                    message = `Halo Kak ${patient.name}, info promo terbaru dari Esthirae Clinic...`;
            }

            const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        };

        return (
            <div className="space-y-6 animate-fade-in">
                <BroadcastModal 
                    isOpen={isBroadcastModalOpen}
                    onClose={() => setIsBroadcastModalOpen(false)}
                    recipientCount={selectedPatientIds.length}
                    onSend={handleBroadcastSend}
                />

                {/* Segments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {segments.map((seg, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => { 
                                setSelectedSegment(seg.name); 
                                setIsSelectionMode(false); 
                                setSelectedPatientIds([]); 
                            }}
                            className={`p-4 rounded-xl shadow-sm border cursor-pointer transition-all ${
                                selectedSegment === seg.name 
                                ? 'bg-white border-soft-gold ring-2 ring-soft-gold/20 shadow-md transform -translate-y-1' 
                                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-md'
                            }`}
                        >
                            <div className={`w-2 h-2 rounded-full mb-3 ${seg.color}`}></div>
                            <h3 className="font-bold text-lg text-text-dark">{seg.count}</h3>
                            <div className="font-medium text-text-dark text-sm">{seg.name}</div>
                            <p className="text-xs text-text-muted mt-1">{seg.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-text-dark text-lg flex items-center gap-2">
                                <Users size={20} className="text-soft-gold"/> {selectedSegment} List
                            </h3>
                            <p className="text-xs text-text-muted">Found {displayedPatients.length} patients in this segment.</p>
                        </div>
                        
                        <div className="flex gap-2">
                            {!isSelectionMode ? (
                                <button 
                                    onClick={() => setIsSelectionMode(true)}
                                    className="text-xs bg-white border border-gray-200 text-text-dark px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all"
                                >
                                    Select Patients
                                </button>
                            ) : (
                                <div className="flex gap-2 animate-fade-in">
                                    <button 
                                        onClick={() => { setIsSelectionMode(false); setSelectedPatientIds([]); }}
                                        className="text-xs text-text-muted px-3 py-2 hover:text-text-dark"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => setIsBroadcastModalOpen(true)}
                                        disabled={selectedPatientIds.length === 0}
                                        className="text-xs bg-text-dark text-white px-4 py-2 rounded-lg hover:bg-black shadow-lg flex items-center gap-2 disabled:bg-gray-300 disabled:shadow-none transition-all"
                                    >
                                        <MessageSquare size={14}/> Broadcast ({selectedPatientIds.length})
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                                <tr>
                                    {isSelectionMode && (
                                        <th className="px-4 py-3 w-10">
                                            <div 
                                                onClick={toggleSelectAll}
                                                className="cursor-pointer text-gray-400 hover:text-soft-gold"
                                            >
                                                {selectedPatientIds.length === displayedPatients.length && displayedPatients.length > 0 ? (
                                                    <CheckSquare size={18} className="text-soft-gold"/>
                                                ) : (
                                                    <Square size={18} />
                                                )}
                                            </div>
                                        </th>
                                    )}
                                    <th className="px-4 py-3">Patient Name</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Last Visit</th>
                                    <th className="px-4 py-3">Last Treatment</th>
                                    <th className="px-4 py-3">Wallet Balance</th>
                                    <th className="px-4 py-3 text-right">Quick Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {displayedPatients.length > 0 ? displayedPatients.map((p) => {
                                    const isSelected = selectedPatientIds.includes(p.id);
                                    return (
                                        <tr 
                                            key={p.id} 
                                            className={`hover:bg-gray-50/50 transition-colors ${isSelected ? 'bg-soft-gold/5' : ''}`}
                                            onClick={() => isSelectionMode && toggleSelection(p.id)}
                                        >
                                            {isSelectionMode && (
                                                <td className="px-4 py-3">
                                                    <div className={`cursor-pointer ${isSelected ? 'text-soft-gold' : 'text-gray-300'}`}>
                                                        {isSelected ? <CheckSquare size={18}/> : <Square size={18}/>}
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-text-dark">{p.name}</div>
                                                <div className="text-[10px] text-text-muted">{p.tier} Member</div>
                                            </td>
                                            <td className="px-4 py-3 text-text-muted">{p.phone}</td>
                                            <td className="px-4 py-3 text-text-muted">
                                                {p.lastVisit.toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="px-4 py-3">{p.lastTreatmentName}</td>
                                            <td className="px-4 py-3 font-medium text-soft-gold">
                                                Rp {(p.walletBalance || 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleWhatsAppFollowUp(p); }}
                                                    className="text-xs border border-green-500 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 font-medium flex items-center gap-1 ml-auto transition-colors"
                                                >
                                                    <MessageSquare size={12}/> Follow Up
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={isSelectionMode ? 7 : 6} className="px-4 py-8 text-center text-text-muted italic">
                                            No patients found for this demo segment. Try selecting "VIP" or "Loyal Regulars".
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const TaskManagerView = () => {
        // Calculate Progress
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return (
            <div className="bg-white rounded-xl shadow-soft p-6 animate-fade-in relative">
                <FollowUpModal 
                    isOpen={isFollowUpModalOpen}
                    onClose={() => setIsFollowUpModalOpen(false)}
                    task={selectedTask}
                    onComplete={handleTaskComplete}
                />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-bold text-text-dark flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-sage"/> Daily Follow-up Tasks
                        </h3>
                        <p className="text-xs text-text-muted mt-1">Generated based on patient lifecycle rules.</p>
                    </div>
                    
                    {/* Progress Header */}
                    <div className="text-right">
                        <div className="text-sm font-bold text-text-dark">
                            Completed: <span className="text-sage">{completedTasks}/{totalTasks}</span>
                        </div>
                        <div className="w-32 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-sage to-green-400 transition-all duration-500" 
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                            task.status === 'Completed' ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 hover:border-soft-gold/30 hover:bg-soft-gold/5'
                        }`}>
                            <div className="flex items-start gap-4">
                                <div className={`mt-1.5 w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-rose' : task.priority === 'Medium' ? 'bg-amber' : 'bg-blue-400'}`}></div>
                                <div>
                                    <h4 className={`font-bold text-sm ${task.status === 'Completed' ? 'text-text-muted line-through' : 'text-text-dark'}`}>
                                        {task.patient} 
                                        <span className="font-normal text-text-muted text-xs no-line-through"> • {task.type}</span>
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-0.5">{task.note}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {task.status === 'Completed' ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-sage px-3 py-1.5 bg-sage/10 rounded-lg">
                                        <Check size={14}/> Done
                                    </span>
                                ) : (
                                    <>
                                        <span className="text-xs text-text-muted font-medium bg-gray-100 px-2 py-1 rounded">{task.due}</span>
                                        <button 
                                            onClick={() => handleOpenFollowUp(task)}
                                            className="text-xs px-4 py-2 bg-text-dark text-white rounded-lg shadow-sm hover:bg-black transition-all flex items-center gap-2"
                                        >
                                            <MessageSquare size={14}/> Follow Up
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const FeedbackView = () => {
        const [selectedMetric, setSelectedMetric] = useState<'NPS' | 'Rating' | 'Complaints'>('NPS');
        
        // Reply Modal State
        const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
        const [selectedFeedbackForReply, setSelectedFeedbackForReply] = useState<{name: string, comment: string} | null>(null);

        // Mock data with proper Date objects for formatting
        const MOCK_FEEDBACK_LIST = useMemo(() => [
            { id: 1, patient: 'Emma Wilson', rating: 5, nps: 10, comment: 'Dr. Sarah was amazing! Loved the facial.', date: new Date('2023-10-24T10:00:00'), type: 'Review' },
            { id: 2, patient: 'John Doe', rating: 3, nps: 6, comment: 'Great treatment but waiting time was a bit long.', date: new Date('2023-10-23T14:30:00'), type: 'Complaint' },
            { id: 3, patient: 'Anonymous', rating: 5, nps: 9, comment: 'Very clean and professional.', date: new Date('2023-10-22T09:15:00'), type: 'Review' },
            { id: 4, patient: 'Sinta R.', rating: 1, nps: 2, comment: 'Sakit banget pas ekstraksi, terapis kurang ramah.', date: new Date('2023-10-21T11:00:00'), type: 'Complaint' },
            { id: 5, patient: 'Budi S.', rating: 5, nps: 10, comment: 'Best clinic in town!', date: new Date('2023-10-15T16:00:00'), type: 'Review' },
            { id: 6, patient: 'Linda K.', rating: 4, nps: 8, comment: 'Hasil oke, harga agak pricey.', date: new Date('2023-10-15T13:45:00'), type: 'Review' },
        ], []);

        const filteredFeedback = useMemo(() => {
            if (selectedMetric === 'Complaints') {
                return MOCK_FEEDBACK_LIST.filter(f => f.rating <= 3);
            }
            if (selectedMetric === 'NPS') {
                // Show Promoters (High Rating) for NPS context
                return MOCK_FEEDBACK_LIST.filter(f => f.rating === 5);
            }
            // Rating -> Show All
            return MOCK_FEEDBACK_LIST;
        }, [selectedMetric, MOCK_FEEDBACK_LIST]);

        const handleReplyClick = (feedback: typeof MOCK_FEEDBACK_LIST[0]) => {
            setSelectedFeedbackForReply({ name: feedback.patient, comment: feedback.comment });
            setIsReplyModalOpen(true);
        };

        const handleSendReply = (message: string) => {
            // Logic to send reply to backend
            console.log(`Sending reply to ${selectedFeedbackForReply?.name}: ${message}`);
            alert(`Reply sent to ${selectedFeedbackForReply?.name}!`);
        };

        return (
            <div className="space-y-6 animate-fade-in">
                {selectedFeedbackForReply && (
                    <ReplyFeedbackModal 
                        isOpen={isReplyModalOpen}
                        onClose={() => setIsReplyModalOpen(false)}
                        patientName={selectedFeedbackForReply.name}
                        originalComment={selectedFeedbackForReply.comment}
                        onSend={handleSendReply}
                    />
                )}

                {/* Metric Cards - Interactive */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div 
                        onClick={() => setSelectedMetric('NPS')}
                        className={`bg-white p-6 rounded-xl shadow-sm border-t-4 cursor-pointer transition-all ${
                            selectedMetric === 'NPS' ? 'border-t-sage border shadow-md ring-2 ring-sage/10' : 'border-t-sage hover:bg-gray-50'
                        }`}
                    >
                        <div className="text-xs text-text-muted uppercase tracking-wide">Net Promoter Score</div>
                        <div className="text-4xl font-bold text-text-dark mt-2">78</div>
                        <div className="text-xs text-sage mt-2 font-medium flex items-center gap-1">
                            <ThumbsUp size={12}/> Excellent (Promoters)
                        </div>
                    </div>
                    
                    <div 
                        onClick={() => setSelectedMetric('Rating')}
                        className={`bg-white p-6 rounded-xl shadow-sm border-t-4 cursor-pointer transition-all ${
                            selectedMetric === 'Rating' ? 'border-t-soft-gold border shadow-md ring-2 ring-soft-gold/10' : 'border-t-soft-gold hover:bg-gray-50'
                        }`}
                    >
                        <div className="text-xs text-text-muted uppercase tracking-wide">Avg Rating</div>
                        <div className="text-4xl font-bold text-text-dark mt-2 flex items-center gap-2">
                            4.8 <Star size={24} className="fill-soft-gold text-soft-gold"/>
                        </div>
                        <div className="text-xs text-text-muted mt-2">Based on 150 reviews (Show All)</div>
                    </div>
                    
                    <div 
                        onClick={() => setSelectedMetric('Complaints')}
                        className={`bg-white p-6 rounded-xl shadow-sm border-t-4 cursor-pointer transition-all ${
                            selectedMetric === 'Complaints' ? 'border-t-rose border shadow-md ring-2 ring-rose/10' : 'border-t-rose hover:bg-gray-50'
                        }`}
                    >
                        <div className="text-xs text-text-muted uppercase tracking-wide">Complaints</div>
                        <div className="text-4xl font-bold text-text-dark mt-2">2</div>
                        <div className="text-xs text-rose mt-2 font-medium flex items-center gap-1">
                            <ThumbsDown size={12}/> Needs Attention (Negative)
                        </div>
                    </div>
                </div>

                {/* Filtered Table */}
                <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-text-dark flex items-center gap-2">
                            <MessageSquare size={18} className="text-soft-gold"/> 
                            {selectedMetric === 'NPS' ? 'Positive Feedback (Promoters)' : selectedMetric === 'Complaints' ? 'Complaint List' : 'All Recent Feedback'}
                        </h3>
                        <span className="text-xs bg-gray-200 text-text-muted px-2 py-1 rounded-full">{filteredFeedback.length} Items</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-ivory text-xs font-semibold text-text-muted uppercase">
                                <tr>
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Rating / NPS</th>
                                    <th className="px-6 py-3">Comment</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredFeedback.map((fb) => (
                                    <tr key={fb.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-bold text-text-dark">{fb.patient}</td>
                                        <td className="px-6 py-4 text-text-muted text-xs">
                                            {/* Specific Format: DD/MM/YYYY */}
                                            {fb.date.toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className={`fill-current ${fb.rating >= 4 ? 'text-soft-gold' : 'text-gray-300'}`}/>
                                                <span className="font-medium text-text-dark">{fb.rating}</span>
                                                <span className="text-xs text-gray-400 ml-1">(NPS: {fb.nps})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-text-dark italic">"{fb.comment}"</p>
                                            {fb.rating <= 3 && (
                                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-rose/10 text-rose text-[10px] font-bold uppercase">
                                                    <AlertCircle size={10}/> Complaint
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleReplyClick(fb)}
                                                className="text-xs text-soft-gold hover:underline font-medium"
                                            >
                                                Reply
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredFeedback.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-text-muted italic">
                                            No feedback found for this category.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-medium text-text-dark">CRM & Patient Intelligence</h1>
                    <p className="text-text-muted mt-1">360-degree view, segmentation, and relationship management.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200">
                {[
                    { id: 'Dashboard', label: 'Patient 360', icon: Users },
                    { id: 'Segmentation', label: 'RFM Segments', icon: BarChart3 },
                    { id: 'Tasks', label: 'Tasks & Follow-up', icon: CheckCircle2 },
                    { id: 'Feedback', label: 'Feedback & NPS', icon: MessageSquare },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as CRMTab)}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                            activeTab === tab.id 
                            ? 'border-soft-gold text-soft-gold' 
                            : 'border-transparent text-text-muted hover:text-text-dark'
                        }`}
                    >
                        <tab.icon size={18}/> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'Dashboard' && <Patient360Dashboard />}
                {activeTab === 'Segmentation' && <SegmentationView />}
                {activeTab === 'Tasks' && <TaskManagerView />}
                {activeTab === 'Feedback' && <FeedbackView />}
            </div>
        </div>
    );
};

export default CRM;
