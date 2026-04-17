import React from 'react';
import { Home, Camera, Settings, Image as ImageIcon, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: 'dashboard' | 'camera' | 'gallery' | 'settings' | 'calendar';
  onTabChange: (tab: 'dashboard' | 'camera' | 'gallery' | 'settings' | 'calendar') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Plan' },
    { id: 'camera', icon: Camera, label: 'Log' },
    { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="w-full max-w-md bg-zinc-900/90 backdrop-blur-lg border-t border-white/10 pb-safe pointer-events-auto">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
