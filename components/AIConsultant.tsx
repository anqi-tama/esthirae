import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, RefreshCw, AlertCircle, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const AIConsultant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hello, I am Esthirae Intelligence. How can I help you manage your clinic operations today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // System instructions focused on clinic management
            const systemInstruction = `
                You are Esthirae Assistant, an expert AI Consultant for Esthirae Aesthetic & Wellness Clinic.
                Your goal is to help clinic owners and doctors optimize operations, patient retention, and revenue.
                You have deep knowledge of aesthetic treatments (Laser, Botox, Fillers, Facials), 
                inventory management (BOM, FIFO, stock auditing), and loyalty programs (Deposit wallets, Tiering).
                
                Guidelines:
                1. Be professional, sophisticated, and insightful.
                2. Provide actionable advice for clinic growth.
                3. If asked about clinic data, provide hypothetical examples based on standard clinic KPIs.
                4. Use Indonesian terms for localized context where appropriate, but keep the core professional language sophisticated.
                5. Keep responses concise and formatted with bullet points for readability.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userMessage,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                }
            });

            const aiResponseText = response.text || "I apologize, I'm experiencing a minor sync issue. How else can I assist you?";
            setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
        } catch (error) {
            console.error("Gemini AI Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my central brain. Please check your API configuration or try again shortly." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 transform ${
                    isOpen ? 'rotate-90 bg-text-dark text-white' : 'bg-soft-gold text-white hover:scale-110 active:scale-95 animate-pulse-slow'
                }`}
            >
                {isOpen ? <X size={24} /> : <BrainCircuit size={28} />}
            </button>

            {/* AI Side Drawer */}
            <div 
                className={`fixed top-0 right-0 h-screen w-full md:w-[400px] bg-white shadow-2xl z-[998] transition-transform duration-500 ease-in-out flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="bg-ivory px-6 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-soft-gold rounded-xl flex items-center justify-center text-white shadow-md">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-text-dark">Esthirae Intelligence</h3>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-sage animate-pulse"></span>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Assistant</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-text-dark text-white' : 'bg-ivory border border-gray-100 text-soft-gold'}`}>
                                {msg.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
                            </div>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-soft-gold text-white shadow-md rounded-tr-none' 
                                : 'bg-white border border-gray-100 text-text-dark shadow-sm rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 animate-fade-in">
                            <div className="w-8 h-8 rounded-lg bg-ivory border border-gray-100 flex items-center justify-center text-soft-gold shrink-0">
                                <RefreshCw size={16} className="animate-spin"/>
                            </div>
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-soft-gold animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-soft-gold animate-bounce" style={{ animationDelay: '200ms' }}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-soft-gold animate-bounce" style={{ animationDelay: '400ms' }}></span>
                                </div>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Consulting Gemini...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1.5 focus-within:border-soft-gold transition-colors">
                        <textarea 
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-text-dark py-2 outline-none resize-none max-h-32"
                            placeholder="Ask me anything about your clinic..."
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                            className={`p-2 rounded-xl transition-all ${
                                input.trim() && !isLoading ? 'bg-soft-gold text-white shadow-lg hover:bg-[#cbad85]' : 'bg-gray-200 text-gray-400'
                            }`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[9px] text-text-muted text-center mt-3 uppercase tracking-tighter">
                        Powered by Gemini 3 Flash • Clinic AI Strategy Mode
                    </p>
                </div>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[997] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default AIConsultant;