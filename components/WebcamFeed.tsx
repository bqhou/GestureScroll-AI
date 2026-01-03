
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface WebcamFeedProps {
  onCameraReady?: () => void;
  onError?: (error: string) => void;
}

export interface WebcamRef {
  captureFrame: () => string | null;
}

const WebcamFeed = forwardRef<WebcamRef, WebcamFeedProps>(({ onCameraReady, onError }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    captureFrame: () => {
      if (!videoRef.current || !canvasRef.current) return null;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return null;

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.6);
    }
  }));

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
             videoRef.current?.play();
             if (onCameraReady) onCameraReady();
          };
        }
      } catch (err) {
        if (onError) onError(err instanceof Error ? err.message : "Failed to access camera");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-black aspect-[4/3]">
      <video
        ref={videoRef}
        className="w-full h-full object-cover transform -scale-x-100 opacity-80"
        muted
        playsInline
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Overlay Zones */}
      <div className="absolute inset-0 pointer-events-none flex flex-col">
        {/* Top Zone - Scroll Up */}
        <div className="h-[35%] w-full border-b border-white/20 bg-green-900/10 flex items-start justify-center pt-2">
          <span className="text-xs uppercase font-bold text-green-400 tracking-wider bg-black/50 px-2 rounded">Scroll Up</span>
        </div>
        
        {/* Middle Zone - Neutral */}
        <div className="flex-1 w-full flex items-center justify-center">
          <span className="text-[10px] text-white/30 tracking-widest uppercase">Neutral Zone</span>
        </div>
        
        {/* Bottom Zone - Scroll Down */}
        <div className="h-[35%] w-full border-t border-white/20 bg-blue-900/10 flex items-end justify-center pb-2">
          <span className="text-xs uppercase font-bold text-blue-400 tracking-wider bg-black/50 px-2 rounded">Scroll Down</span>
        </div>
      </div>
    </div>
  );
});

WebcamFeed.displayName = 'WebcamFeed';

export default WebcamFeed;
