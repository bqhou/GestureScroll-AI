
import React from 'react';

interface GestureStatusProps {
  handDetected: boolean;
  verticalPosition: number; // 0-100
  isProcessing: boolean;
  scrollSpeed: number; // For visualization
}

const GestureStatus: React.FC<GestureStatusProps> = ({ handDetected, verticalPosition, isProcessing, scrollSpeed }) => {
  
  const getStatusText = () => {
    if (!handDetected) return "NO HAND DETECTED";
    if (scrollSpeed < 0) return "SCROLLING UP";
    if (scrollSpeed > 0) return "SCROLLING DOWN";
    return "NEUTRAL / HOLD";
  };

  const getStatusColor = () => {
    if (!handDetected) return "text-gray-500";
    if (scrollSpeed < 0) return "text-green-400";
    if (scrollSpeed > 0) return "text-blue-400";
    return "text-white";
  };

  // Calculate indicator position (inverted because 0 is top)
  const topPercent = verticalPosition; 

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700 w-full transition-all duration-300">
      
      <div className="flex justify-between items-center mb-3">
        <h2 className={`text-sm font-bold tracking-wider ${getStatusColor()}`}>{getStatusText()}</h2>
        <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
      </div>

      {/* Vertical Position Gauge */}
      <div className="relative w-full h-32 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 right-0 h-[35%] bg-gradient-to-b from-green-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-blue-500/20 to-transparent"></div>
        
        {/* Neutral Center Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2"></div>

        {/* Hand Position Indicator */}
        {handDetected && (
          <div 
            className="absolute left-0 right-0 h-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-500 ease-out flex items-center"
            style={{ top: `${topPercent}%` }}
          >
             <div className="w-full text-right pr-2 -mt-5">
               <span className="text-[10px] text-white/70 font-mono">{Math.round(verticalPosition)}%</span>
             </div>
          </div>
        )}

        {/* Missing Hand Message */}
        {!handDetected && (
           <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">
             Show Hand
           </div>
        )}
      </div>

      <div className="mt-3 flex justify-between text-[10px] text-gray-400 uppercase font-mono">
        <span>Top (0%)</span>
        <span>Bottom (100%)</span>
      </div>
    </div>
  );
};

export default GestureStatus;
