
import React, { useRef, useState, useEffect } from 'react';
import { 
    X, Save, Camera, Smartphone, Upload, Type, PenTool, 
    MousePointer2, Eraser, Undo, Redo, Disc, PlusCircle, 
    SmartphoneCharging, CheckCircle2, RefreshCw
} from 'lucide-react';

interface MedicalCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imgData: string) => void;
  initialImage?: string;
}

type ToolType = 'pen' | 'stamp' | 'text' | 'eraser';

const MedicalCanvasModal: React.FC<MedicalCanvasModalProps> = ({ isOpen, onClose, onSave, initialImage }) => {
  // --- Canvas State ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // --- Tools State ---
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [color, setColor] = useState('#ef4444'); // Red default
  const [brushSize, setBrushSize] = useState(3);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // --- Mobile Capture State ---
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Init
  useEffect(() => {
    if (isOpen) {
        if (initialImage) setBackgroundImage(initialImage);
        else setBackgroundImage(null); // Or default face chart
        
        // Reset History
        setHistory([]);
        setHistoryStep(-1);
    }
  }, [isOpen, initialImage]);

  // Init Context
  useEffect(() => {
    if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
            context.lineCap = 'round';
            context.lineJoin = 'round';
            setCtx(context);
        }
    }
  }, [isOpen, backgroundImage]);

  // --- Drawing Logic ---

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!ctx || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (activeTool === 'stamp') {
          drawStamp(x, y);
          saveState();
          return;
      }

      if (activeTool === 'text') {
          const text = prompt("Enter annotation text:", "Filler 1cc");
          if (text) {
              ctx.font = "bold 14px sans-serif";
              ctx.fillStyle = color;
              ctx.fillText(text, x, y);
              saveState();
          }
          return;
      }

      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !ctx || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (activeTool === 'pen') {
          ctx.strokeStyle = color;
          ctx.lineWidth = brushSize;
          ctx.globalCompositeOperation = 'source-over';
      } else if (activeTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = brushSize * 5;
      }

      ctx.lineTo(x, y);
      ctx.stroke();
  };

  const stopDrawing = () => {
      if (isDrawing) {
          setIsDrawing(false);
          if (ctx) ctx.closePath();
          saveState();
      }
  };

  const drawStamp = (x: number, y: number) => {
      if (!ctx) return;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color;
      
      // Draw a target/injection symbol
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
  };

  // --- History (Undo/Redo) ---
  const saveState = () => {
      if (!canvasRef.current) return;
      const dataUrl = canvasRef.current.toDataURL();
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(dataUrl);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
      if (historyStep > 0) {
          restoreState(history[historyStep - 1]);
          setHistoryStep(historyStep - 1);
      } else {
          clearCanvas();
          setHistoryStep(-1);
      }
  };

  const handleRedo = () => {
      if (historyStep < history.length - 1) {
          restoreState(history[historyStep + 1]);
          setHistoryStep(historyStep + 1);
      }
  };

  const restoreState = (dataUrl: string) => {
      if (!ctx || !canvasRef.current) return;
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(img, 0, 0);
      };
  };

  const clearCanvas = () => {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // --- Mobile Capture Simulation ---
  const handleMobileCapture = () => {
      setIsMobileModalOpen(true);
      setIsConnecting(true);
      
      // Simulate socket connection and upload
      setTimeout(() => {
          setIsConnecting(false);
          // Mock receiving an image
          setBackgroundImage("https://picsum.photos/800/600?random=" + Math.random()); 
          setTimeout(() => setIsMobileModalOpen(false), 1500);
      }, 3000);
  };

  const handleFinalSave = () => {
      // In a real app, you might want to save background and canvas separately (Layers)
      // For this demo, we'll merge them for the thumbnail
      if (!canvasRef.current) return;
      
      // We return the Canvas Data URL (Annotations only) or a merged image
      // Let's assume we return the annotation layer data URL for overlaying later
      onSave(canvasRef.current.toDataURL()); 
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      
      {/* Main Modal */}
      <div className="bg-[#1e1e1e] w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-200">
        
        {/* Header */}
        <div className="h-16 border-b border-gray-700 flex justify-between items-center px-6 bg-[#252525]">
            <div className="flex items-center gap-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <PenTool size={20} className="text-soft-gold"/> Medical Canvas
                </h2>
                <div className="h-6 w-px bg-gray-600"></div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleMobileCapture}
                        className="flex items-center gap-2 px-3 py-1.5 bg-soft-gold/20 text-soft-gold border border-soft-gold/30 rounded-lg text-xs font-bold hover:bg-soft-gold/30 transition-all"
                    >
                        <Smartphone size={14}/> Mobile Capture
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-xs font-bold hover:bg-gray-600 transition-all">
                        <Camera size={14}/> Webcam
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-xs font-bold hover:bg-gray-600 transition-all">
                        <Upload size={14}/> Upload File
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={handleUndo} disabled={historyStep < 0} className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-30"><Undo size={18}/></button>
                <button onClick={handleRedo} disabled={historyStep >= history.length - 1} className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-30"><Redo size={18}/></button>
                <div className="h-6 w-px bg-gray-600 mx-2"></div>
                <button onClick={onClose} className="px-4 py-2 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleFinalSave} className="px-6 py-2 bg-soft-gold text-white rounded-lg text-sm font-bold hover:bg-[#cbad85] transition-colors shadow-lg flex items-center gap-2">
                    <Save size={16}/> Save Annotation
                </button>
            </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Left Toolbar */}
            <div className="w-16 bg-[#252525] border-r border-gray-700 flex flex-col items-center py-4 gap-4">
                {[
                    { id: 'pen', icon: PenTool, label: 'Marker' },
                    { id: 'stamp', icon: PlusCircle, label: 'Injection' },
                    { id: 'text', icon: Type, label: 'Label' },
                    { id: 'eraser', icon: Eraser, label: 'Eraser' },
                ].map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id as ToolType)}
                        title={tool.label}
                        className={`p-3 rounded-xl transition-all ${
                            activeTool === tool.id 
                            ? 'bg-soft-gold text-white shadow-lg shadow-soft-gold/20' 
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <tool.icon size={20}/>
                    </button>
                ))}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-[#121212] relative flex items-center justify-center overflow-auto p-8">
                <div className="relative shadow-2xl">
                    {/* Layer 1: Background Image (Non-destructive) */}
                    {backgroundImage ? (
                        <img 
                            src={backgroundImage} 
                            alt="Patient Base" 
                            className="max-w-full max-h-[70vh] object-contain pointer-events-none select-none"
                            style={{ display: 'block' }}
                        />
                    ) : (
                        <div className="w-[600px] h-[600px] bg-gray-800 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
                            <div className="text-center">
                                <UserIconLarge />
                                <p className="mt-4 text-sm">No Image Selected</p>
                                <p className="text-xs opacity-50">Please acquire image via Mobile/Webcam</p>
                            </div>
                        </div>
                    )}

                    {/* Layer 2: Annotation Canvas */}
                    {backgroundImage && (
                        <canvas
                            ref={canvasRef}
                            width={800} // Ideally dynamic based on image natural size
                            height={600}
                            className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                        />
                    )}
                </div>
            </div>

            {/* Right Toolbar (Properties) */}
            <div className="w-64 bg-[#252525] border-l border-gray-700 p-4 flex flex-col gap-6">
                
                {/* Colors */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Annotation Color</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {['#ef4444', '#3b82f6', '#10b981', '#fbbf24', '#ffffff', '#000000'].map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                    color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                                }`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                {/* Size */}
                <div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-3">Brush Size</h3>
                    <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-soft-gold"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Fine</span>
                        <span>{brushSize}px</span>
                        <span>Bold</span>
                    </div>
                </div>

                {/* Layer Control Mock */}
                <div className="mt-auto">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-3">Layers</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-soft-gold/10 border border-soft-gold/20 rounded-lg text-xs text-soft-gold font-bold">
                            <PenTool size={14}/> Annotation Layer
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-300">
                            <Smartphone size={14}/> Original Image (Locked)
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Mobile Capture QR Modal */}
      {isMobileModalOpen && (
          <div className="absolute inset-0 z-[70] bg-black/90 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full relative">
                  <button onClick={() => setIsMobileModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
                  
                  <h3 className="text-xl font-bold text-text-dark mb-1">Scan to Capture</h3>
                  <p className="text-sm text-text-muted mb-6">Use your phone to take a high-res photo.</p>
                  
                  <div className="w-48 h-48 bg-gray-100 mx-auto rounded-xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300 relative overflow-hidden">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ESTHIRAE_CAPTURE_SESSION_123" alt="QR" className="opacity-90"/>
                      {isConnecting && (
                          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center">
                              <RefreshCw size={32} className="text-soft-gold animate-spin mb-2"/>
                              <span className="text-xs font-bold text-soft-gold">Syncing...</span>
                          </div>
                      )}
                  </div>

                  {isConnecting ? (
                      <div className="flex items-center justify-center gap-2 text-sage font-bold text-sm bg-sage/10 py-2 rounded-lg">
                          <CheckCircle2 size={16}/> Image Received!
                      </div>
                  ) : (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 animate-pulse">
                          <SmartphoneCharging size={16}/> Waiting for device...
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

const UserIconLarge = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
)

export default MedicalCanvasModal;
