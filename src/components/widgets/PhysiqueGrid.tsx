import React from 'react';
import { PhysiquePhoto } from '@/types';
import { format } from 'date-fns';

interface PhysiqueGridProps {
  photos: PhysiquePhoto[];
}

export function PhysiqueGrid({ photos }: PhysiqueGridProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <p>No photos yet.</p>
        <p className="text-xs mt-2">Track your progress weekly!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
          <img
            src={photo.imageUrl}
            alt={`Physique on ${format(photo.timestamp, 'MMM d')}`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <p className="text-white font-medium text-sm">{format(photo.timestamp, 'MMM d, yyyy')}</p>
            <p className="text-zinc-400 text-xs">{photo.weight} kg</p>
          </div>
        </div>
      ))}
    </div>
  );
}
