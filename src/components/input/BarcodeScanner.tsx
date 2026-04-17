import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [error, setError] = useState<string | null>(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
    },
    onError(err) {
      // Ignore frequent scan errors, only show init errors if needed
      // console.error(err);
    },
  });

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        <video ref={ref} className="w-full h-full object-cover" />
        
        {/* Overlay Guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-40 border-2 border-emerald-500/50 rounded-lg relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500"></div>
          </div>
        </div>

        <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
          <p className="text-white font-medium bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur-md">
            Scan a barcode
          </p>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white z-10"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="p-8 bg-black text-center">
        <p className="text-zinc-500 text-sm">
          Point your camera at a food barcode to automatically log it.
        </p>
      </div>
    </div>
  );
}
