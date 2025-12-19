
import React, { useState } from 'react';
import { X, Layers, Columns, Download, ArrowRight, ArrowLeft } from 'lucide-react';

interface ComparePhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  beforeImage: string;
  afterImage: string;
}

const ComparePhotosModal: React.FC<ComparePhotosModalProps> = ({ isOpen, onClose, beforeImage, afterImage }) => {
  const [mode, setMode] = useState<'SideBySide' | 'Overlay'>('SideBySide');
  const [opacity, setOpacity] = useState(50);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-6xl h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-white">
            <div>
                <h2 className="text-2xl font-bold font-serif">Treatment Analysis</h2>
                <p className="text-sm opacity-70">Compare Before & After results.</p>
            </div>
            <div className="flex gap-4">
                <div className="bg-gray-800 rounded-lg p-1 flex border border-gray-700">
                    <button 
                        onClick={() => setMode('SideBySide')}
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${mode === 'SideBySide' ? 'bg-soft-gold text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Columns size={16}/> Side by Side
                    </button>
                    <button 
                        onClick={() => setMode('Overlay')}
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${mode === 'Overlay' ? 'bg-soft-gold text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Layers size={16}/> Ghosting Overlay
                    </button>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <X size={24}/>
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#121212] rounded-2xl overflow-hidden border border-gray-800 relative flex items-center justify-center p-4">
            
            {mode === 'SideBySide' ? (
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                    <div className="relative h-full bg-black flex items-center justify-center overflow-hidden rounded-l-xl group">
                        <img src={beforeImage} alt="Before" className="max-w-full max-h-full object-contain"/>
                        <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">BEFORE</span>
                    </div>
                    <div className="relative h-full bg-black flex items-center justify-center overflow-hidden rounded-r-xl group">
                        <img src={afterImage} alt="After" className="max-w-full max-h-full object-contain"/>
                        <span className="absolute top-4 right-4 bg-soft-gold backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">AFTER</span>
                    </div>
                </div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* Base Layer (Before) */}
                    <img 
                        src={beforeImage} 
                        alt="Before Base" 
                        className="absolute max-w-full max-h-full object-contain"
                    />
                    
                    {/* Overlay Layer (After) */}
                    <img 
                        src={afterImage} 
                        alt="After Overlay" 
                        className="absolute max-w-full max-h-full object-contain transition-opacity duration-75"
                        style={{ opacity: opacity / 100 }}
                    />

                    {/* Controls */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-96">
                        <div className="flex justify-between text-xs font-bold text-white mb-2 uppercase tracking-wide">
                            <span>Before</span>
                            <span>Overlay Opacity: {opacity}%</span>
                            <span>After</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={opacity}
                            onChange={(e) => setOpacity(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-soft-gold"
                        />
                    </div>
                </div>
            )}

        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center">
            <div className="text-gray-400 text-xs">
                * Drag slider in Overlay mode to check structural changes.
            </div>
            <button className="px-6 py-3 bg-white text-text-dark font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Download size={18}/> Export Collage (JPG)
            </button>
        </div>

      </div>
    </div>
  );
};

export default ComparePhotosModal;
