import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, Check, RefreshCw, ScanBarcode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
  onSwitchToBarcode?: () => void;
}

export function CameraView({ onCapture, onClose, onSwitchToBarcode }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please allow permissions.");
    }
  }, []);

  React.useEffect(() => {
    startCamera();
    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const capture = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setImage(canvas.toDataURL('image/jpeg'));
      }
    }
  }, []);

  const retake = () => {
    setImage(null);
    startCamera();
  };

  const confirm = () => {
    if (image) {
      onCapture(image);
    }
  };

  if (error) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onClose} variant="secondary">Close</Button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        {image ? (
          <img src={image} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="h-24 bg-black flex items-center justify-around px-8 pb-safe">
        {image ? (
          <>
            <button onClick={retake} className="p-4 rounded-full bg-zinc-800 text-white">
              <RefreshCw size={24} />
            </button>
            <button onClick={confirm} className="p-4 rounded-full bg-emerald-500 text-white">
              <Check size={24} />
            </button>
          </>
        ) : (
          <button
            onClick={capture}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
          >
            <div className="w-12 h-12 bg-white rounded-full" />
          </button>
        )}

        {!image && onSwitchToBarcode && (
          <button 
            onClick={onSwitchToBarcode}
            className="absolute right-8 p-4 rounded-full bg-zinc-800 text-white"
          >
            <ScanBarcode size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
