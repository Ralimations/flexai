import React, { useState } from 'react';
import { Check, Circle, Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { TodoItem } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';

interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
}

export function TodoList({ todos, onToggle }: TodoListProps) {
  const { addNewTodo, deleteTodo, editTodo } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleAdd = async () => {
    if (newTodoText.trim()) {
      await addNewTodo(newTodoText.trim());
      setNewTodoText('');
      setIsAdding(false);
    }
  };

  const startEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = async () => {
    if (editingId && editText.trim()) {
      await editTodo(editingId, editText.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Daily Goals</h3>
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-4">
          <Input
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="New daily habit..."
            className="bg-zinc-900 border-zinc-800 text-white"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button size="icon" onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-600">
            <Check size={16} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
            <X size={16} />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {todos.map((todo) => {
          const isCompleted = todo.lastCompleted === today;
          const isEditing = editingId === todo.id;

          if (isEditing) {
            return (
              <div key={todo.id} className="flex gap-2 p-2 bg-zinc-900 rounded-xl border border-zinc-800">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white h-9"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                />
                <Button size="icon" onClick={saveEdit} className="bg-emerald-500 h-9 w-9">
                  <Save size={14} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-9 w-9">
                  <X size={14} />
                </Button>
              </div>
            );
          }

          return (
            <div
              key={todo.id}
              className={cn(
                "group w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                isCompleted
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              )}
            >
              <button
                onClick={() => onToggle(todo.id)}
                className="flex-1 flex items-center text-left"
              >
                <span className={cn("font-medium flex-1", isCompleted ? "text-emerald-400 line-through opacity-70" : "text-zinc-300")}>
                  {todo.text}
                </span>
                {isCompleted ? (
                  <div className="p-1 bg-emerald-500 rounded-full text-black ml-3">
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : (
                  <Circle size={20} className="text-zinc-500 ml-3" />
                )}
              </button>
              
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-2 border-l border-zinc-700 pl-2">
                <button 
                  onClick={() => startEdit(todo)}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        
        {todos.length === 0 && !isAdding && (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No daily goals set. Add one to start building habits!
          </div>
        )}
      </div>
    </div>
  );
}
