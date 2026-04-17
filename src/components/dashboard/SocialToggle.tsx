import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PartyPopper } from 'lucide-react';

interface SocialToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SocialToggle({ enabled, onToggle }: SocialToggleProps) {
  return (
    <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${enabled ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-500'}`}>
          <PartyPopper size={20} />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="social-mode" className="text-white font-medium">Social Event Mode</Label>
          <span className="text-xs text-zinc-400">Buffer calories for the weekend</span>
        </div>
      </div>
      <Switch id="social-mode" checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}
