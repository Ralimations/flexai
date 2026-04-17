import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, FoodItem, PhysiquePhoto, TodoItem, UserStats, MeasurementLog } from '../types';
import { loadState, saveState, addFoodLog, removeFoodLog, updateFoodLog, addPhoto, toggleTodo, addMeasurement, addTodo, removeTodo, updateTodoText } from '../services/storage';

interface AppContextType {
  state: AppState;
  loading: boolean;
  addLog: (item: FoodItem) => Promise<void>;
  editLog: (item: FoodItem) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  addPhysiquePhoto: (photo: PhysiquePhoto) => Promise<void>;
  addNewMeasurement: (measurement: MeasurementLog) => Promise<void>;
  toggleTodoItem: (id: string) => Promise<void>;
  addNewTodo: (text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  editTodo: (id: string, text: string) => Promise<void>;
  toggleSocialMode: () => void;
  updateStats: (stats: Partial<UserStats>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadState().then((data) => {
      setState(data);
      setLoading(false);
    });
  }, []);

  const handleAddLog = async (item: FoodItem) => {
    if (!state) return;
    const newState = { ...state, logs: [item, ...state.logs] };
    setState(newState);
    await addFoodLog(item);
  };

  const handleEditLog = async (item: FoodItem) => {
    if (!state) return;
    const newState = { 
      ...state, 
      logs: state.logs.map(l => l.id === item.id ? item : l) 
    };
    setState(newState);
    await updateFoodLog(item);
  };

  const handleDeleteLog = async (id: string) => {
    if (!state) return;
    const newState = { ...state, logs: state.logs.filter(l => l.id !== id) };
    setState(newState);
    await removeFoodLog(id);
  };

  const handleAddPhoto = async (photo: PhysiquePhoto) => {
    if (!state) return;
    const newState = { ...state, photos: [photo, ...state.photos] };
    setState(newState);
    await addPhoto(photo);
  };

  const handleAddMeasurement = async (measurement: MeasurementLog) => {
    if (!state) return;
    
    let newStats = state.stats;
    if (measurement.type === 'weight') {
      newStats = { ...state.stats, weight: measurement.value };
    }

    const newState = { 
      ...state, 
      measurements: [measurement, ...state.measurements].sort((a, b) => b.timestamp - a.timestamp),
      stats: newStats
    };
    setState(newState);
    await addMeasurement(measurement);
  };

  const handleToggleTodo = async (id: string) => {
    if (!state) return;
    const today = new Date().toISOString().split('T')[0];
    const newTodos = state.todos.map((t) => {
      if (t.id === id) {
        const isCompletedToday = t.lastCompleted === today;
        return { ...t, lastCompleted: isCompletedToday ? null : today };
      }
      return t;
    });
    const newState = { ...state, todos: newTodos };
    setState(newState);
    await toggleTodo(id);
  };

  const handleAddTodo = async (text: string) => {
    if (!state) return;
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      lastCompleted: null
    };
    const newState = { ...state, todos: [...state.todos, newTodo] };
    setState(newState);
    await addTodo(text);
  };

  const handleDeleteTodo = async (id: string) => {
    if (!state) return;
    const newState = { ...state, todos: state.todos.filter(t => t.id !== id) };
    setState(newState);
    await removeTodo(id);
  };

  const handleEditTodo = async (id: string, text: string) => {
    if (!state) return;
    const newState = { 
      ...state, 
      todos: state.todos.map(t => t.id === id ? { ...t, text } : t) 
    };
    setState(newState);
    await updateTodoText(id, text);
  };

  const handleToggleSocialMode = async () => {
    if (!state) return;
    const newState = { ...state, socialMode: !state.socialMode };
    setState(newState);
    await saveState(newState);
  };

  const handleUpdateStats = async (newStats: Partial<UserStats>) => {
    if (!state) return;
    const newState = { ...state, stats: { ...state.stats, ...newStats } };
    setState(newState);
    await saveState(newState);
  };

  if (loading || !state) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading FlexAI...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        state,
        loading,
        addLog: handleAddLog,
        editLog: handleEditLog,
        deleteLog: handleDeleteLog,
        addPhysiquePhoto: handleAddPhoto,
        addNewMeasurement: handleAddMeasurement,
        toggleTodoItem: handleToggleTodo,
        addNewTodo: handleAddTodo,
        deleteTodo: handleDeleteTodo,
        editTodo: handleEditTodo,
        toggleSocialMode: handleToggleSocialMode,
        updateStats: handleUpdateStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
