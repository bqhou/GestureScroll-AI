
import React, { useState, useRef, useEffect, useCallback } from 'react';
import WebcamFeed, { WebcamRef } from './components/WebcamFeed';
import GestureStatus from './components/GestureStatus';
import ArticleContent from './components/ArticleContent';
import { analyzeGesture } from './services/geminiService';

const App: React.FC = () => {
  const [handDetected, setHandDetected] = useState<boolean>(false);
  const [verticalPosition, setVerticalPosition] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Sensitivity Control
  const [sensitivity, setSensitivity] = useState<number>(15);

  const webcamRef = useRef<WebcamRef>(null);
  const requestRef = useRef<number>(0);
  const scrollSpeed = useRef<number>(0);
  
  // Settings
  const DETECTION_INTERVAL_MS = 600; 
  
  // Zone Definitions (Percentage of height 0-100)
  const ZONE_TOP_EDGE = 35; // Position < 35 triggers Scroll Up
  const ZONE_BOTTOM_EDGE = 65; // Position > 65 triggers Scroll Down
  // 35-65 is Neutral

  // -------------------------------------------------------------------------
  // Smooth Scrolling Logic
  // -------------------------------------------------------------------------
  const animateScroll = useCallback(() => {
    if (Math.abs(scrollSpeed.current) > 0.5) {
      window.scrollBy({
        top: scrollSpeed.current,
        behavior: 'auto' 
      });
    }
    requestRef.current = requestAnimationFrame(animateScroll);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animateScroll]);

  // -------------------------------------------------------------------------
  // Calculate Speed from Position
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!handDetected) {
      scrollSpeed.current = 0;
      return;
    }

    let targetSpeed = 0;

    if (verticalPosition < ZONE_TOP_EDGE) {
      // Scroll Up (Negative Speed)
      // Calculate intensity (0 to 1) based on how close to top edge
      const distance = ZONE_TOP_EDGE - verticalPosition;
      const intensity = distance / ZONE_TOP_EDGE; // 0 at edge, 1 at very top
      targetSpeed = -1 * intensity * sensitivity; 
    } else if (verticalPosition > ZONE_BOTTOM_EDGE) {
      // Scroll Down (Positive Speed)
      const distance = verticalPosition - ZONE_BOTTOM_EDGE;
      const range = 100 - ZONE_BOTTOM_EDGE;
      const intensity = distance / range; // 0 at edge, 1 at very bottom
      targetSpeed = intensity * sensitivity;
    } else {
      // Neutral Zone
      targetSpeed = 0;
    }

    scrollSpeed.current = targetSpeed;
  }, [verticalPosition, handDetected, sensitivity]);

  // -------------------------------------------------------------------------
  // Gesture Detection Loop
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isCameraActive) return;

    const intervalId = setInterval(async () => {
      if (isProcessing) return;
      
      const frame = webcamRef.current?.captureFrame();
      if (frame) {
        setIsProcessing(true);
        try {
          const result = await analyzeGesture(frame);
          setHandDetected(result.handDetected);
          if (result.handDetected) {
            // Smoothly update position (simple average could be added here if needed)
            setVerticalPosition(result.verticalPosition);
          }
        } catch (err) {
          console.error("Detection loop error", err);
        } finally {
          setIsProcessing(false);
        }
      }
    }, DETECTION_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isCameraActive, isProcessing]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleCameraReady = () => {
    setIsCameraActive(true);
    setError(null);
  };

  const handleCameraError = (err: string) => {
    setIsCameraActive(false);
    setError(err);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Sidebar / Floating Control Panel */}
      <div className="fixed top-4 right-4 z-50 w-72 flex flex-col gap-4">
        
        {/* Camera Feed */}
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700 ring-1 ring-white/10 relative group">
           <WebcamFeed 
             ref={webcamRef} 
             onCameraReady={handleCameraReady}
             onError={handleCameraError}
           />
           <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-green-400 border border-white/10 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              ACTIVE
           </div>
        </div>

        {/* Controls & Status */}
        <div className="flex flex-col gap-3">
          <GestureStatus 
            handDetected={handDetected}
            verticalPosition={verticalPosition}
            isProcessing={isProcessing}
            scrollSpeed={scrollSpeed.current}
          />

          {/* Sensitivity Slider */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
               Scroll Sensitivity
             </label>
             <div className="flex items-center gap-3">
               <span className="text-xs text-gray-500">Slow</span>
               <input 
                 type="range" 
                 min="5" 
                 max="30" 
                 value={sensitivity} 
                 onChange={(e) => setSensitivity(Number(e.target.value))}
                 className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
               <span className="text-xs text-gray-500">Fast</span>
             </div>
             <div className="text-center mt-1 text-xs text-indigo-400 font-mono">
               {sensitivity}
             </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-200 p-3 rounded-lg text-sm">
            <strong>Error:</strong> {error}
            <p className="text-xs mt-1 text-red-300">Please check camera permissions.</p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <ArticleContent />
      </main>

      <div className="fixed bottom-4 left-4 z-40 text-gray-500 text-xs pointer-events-none opacity-50">
        Google Gemini 2.5 Flash • Hand Tracking
      </div>

    </div>
  );
};

export default App;
