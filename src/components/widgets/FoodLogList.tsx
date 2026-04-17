import React, { useState } from 'react';
import { FoodItem } from '@/types';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { InputModal } from '@/components/input/InputModal';

interface FoodLogListProps {
  logs: FoodItem[];
}

export function FoodLogList({ logs }: FoodLogListProps) {
  const { deleteLog, editLog } = useApp();
  const [editingItem, setEditingItem] = useState<FoodItem | undefined>(undefined);

  const handleSaveEdit = async (item: FoodItem) => {
    await editLog(item);
    setEditingItem(undefined);
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm bg-zinc-900/50 rounded-xl border border-zinc-800/50">
        No food logged today.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Today's Meals</h3>
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex gap-3 items-center">
            {/* Image Thumbnail */}
            <div className="h-16 w-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
              {log.imageUrl ? (
                <img src={log.imageUrl} alt={log.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-zinc-600 text-xs">
                  No Img
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-white truncate pr-2">{log.name}</h4>
                  <p className="text-xs text-zinc-500">{format(log.timestamp, 'h:mm a')}</p>
                </div>
                <div className="flex items-center -mr-1">
                  <button 
                    onClick={() => setEditingItem(log)}
                    className="text-zinc-500 hover:text-white p-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteLog(log.id)}
                    className="text-zinc-500 hover:text-red-400 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 mt-2 text-xs">
                <span className="text-emerald-400 font-medium">{log.calories} kcal</span>
                <span className="text-blue-400">P: {log.protein}g</span>
                <span className="text-yellow-400">C: {log.carbs}g</span>
                <span className="text-red-400">F: {log.fat}g</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InputModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(undefined)}
        onSave={handleSaveEdit}
        initialData={editingItem}
      />
    </div>
  );
}
