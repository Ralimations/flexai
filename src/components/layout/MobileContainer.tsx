import React from 'react';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <div className="min-h-screen w-full bg-black text-white flex justify-center">
      <div className={cn("w-full max-w-md bg-zinc-950 min-h-screen relative shadow-2xl overflow-hidden flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
}
