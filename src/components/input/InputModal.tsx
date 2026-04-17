import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FoodItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: FoodItem) => void;
  initialData?: Partial<FoodItem>;
  aiFailed?: boolean;
}

export function InputModal({ isOpen, onClose, onSave, initialData, aiFailed }: InputModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [calories, setCalories] = useState(initialData?.calories?.toString() || '');
  const [protein, setProtein] = useState(initialData?.protein?.toString() || '');
  const [carbs, setCarbs] = useState(initialData?.carbs?.toString() || '');
  const [fat, setFat] = useState(initialData?.fat?.toString() || '');

  // Update state when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCalories(initialData.calories?.toString() || '');
      setProtein(initialData.protein?.toString() || '');
      setCarbs(initialData.carbs?.toString() || '');
      setFat(initialData.fat?.toString() || '');
    }
  }, [initialData]);

  const handleSave = () => {
    const newItem: FoodItem = {
      id: initialData?.id || uuidv4(),
      name: name || 'Unknown Food',
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      timestamp: initialData?.timestamp || Date.now(),
      imageUrl: initialData?.imageUrl,
    };
    onSave(newItem);
    onClose();
    // Reset form
    if (!initialData?.id) {
      setName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={aiFailed ? "text-red-400" : ""}>
            {aiFailed ? 'AI Analysis Failed' : (initialData?.id ? 'Edit Food' : 'Log Food')}
          </DialogTitle>
          {aiFailed && (
            <p className="text-sm text-zinc-400 mt-1">
              We couldn't identify the food. Please enter the details manually.
            </p>
          )}
        </DialogHeader>

        {initialData?.imageUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 border border-zinc-800">
            <img 
              src={initialData.imageUrl} 
              alt="Food capture" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="calories" className="text-right">
              Calories
            </Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="protein" className="text-right">
              Protein (g)
            </Label>
            <Input
              id="protein"
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="carbs" className="text-right">
              Carbs (g)
            </Label>
            <Input
              id="carbs"
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fat" className="text-right">
              Fat (g)
            </Label>
            <Input
              id="fat"
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">Save Log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
