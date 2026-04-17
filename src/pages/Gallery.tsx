import React from 'react';
import { useApp } from '@/context/AppContext';
import { PhysiqueGrid } from '@/components/widgets/PhysiqueGrid';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface GalleryProps {
  onAddPhoto: () => void;
}

export function Gallery({ onAddPhoto }: GalleryProps) {
  const { state } = useApp();

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gallery</h1>
        <Button onClick={onAddPhoto} size="icon" className="rounded-full bg-zinc-800 hover:bg-zinc-700">
          <Camera size={20} />
        </Button>
      </div>
      
      <PhysiqueGrid photos={state.photos} />
    </div>
  );
}
