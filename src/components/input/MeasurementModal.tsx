import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MeasurementLog } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (measurement: MeasurementLog) => void;
  defaultType?: 'weight' | 'stomach' | 'water';
}

export function MeasurementModal({ isOpen, onClose, onSave, defaultType = 'weight' }: MeasurementModalProps) {
  const [type, setType] = useState<'weight' | 'stomach' | 'water'>(defaultType);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  React.useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setValue('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [isOpen, defaultType]);

  const handleSave = () => {
    if (!value) return;
    
    let unit = 'lbs';
    if (type === 'weight') unit = 'kg';
    if (type === 'stomach') unit = 'in';
    if (type === 'water') unit = 'ml';

    const newMeasurement: MeasurementLog = {
      id: uuidv4(),
      type,
      value: Number(value),
      unit,
      date,
      timestamp: new Date(date).getTime(),
    };
    onSave(newMeasurement);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Log Measurement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <div className="col-span-3 flex space-x-2 overflow-x-auto pb-2">
              <Button 
                type="button"
                variant={type === 'weight' ? 'default' : 'outline'}
                onClick={() => setType('weight')}
                className={type === 'weight' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}
              >
                Weight
              </Button>
              <Button 
                type="button"
                variant={type === 'stomach' ? 'default' : 'outline'}
                onClick={() => setType('stomach')}
                className={type === 'stomach' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}
              >
                Stomach
              </Button>
              <Button 
                type="button"
                variant={type === 'water' ? 'default' : 'outline'}
                onClick={() => setType('water')}
                className={type === 'water' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}
              >
                Water
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white pr-12"
                placeholder="0.0"
              />
              <span className="absolute right-3 top-2.5 text-zinc-500 text-sm">
                {type === 'weight' ? 'kg' : type === 'stomach' ? 'in' : 'ml'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
