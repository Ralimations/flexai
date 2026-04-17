import { get, set, update } from 'idb-keyval';
import { AppState, FoodItem, PhysiquePhoto, TodoItem, UserStats, MeasurementLog } from '../types';

const STORE_KEY = 'flexai-data';

const DEFAULT_STATE: AppState = {
  stats: {
    weight: 80, // kg
    goalWeight: 75, // kg
    dailyCalorieGoal: 2200,
    dailyProteinGoal: 180,
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  logs: [],
  todos: [
    { id: '1', text: 'Morning Fast (16h)', lastCompleted: null },
    { id: '2', text: 'Creatine (5g)', lastCompleted: null },
    { id: '3', text: 'Gym Session', lastCompleted: null },
  ],
  photos: [],
  measurements: [],
  socialMode: false,
  socialBuffer: 0,
};

export async function loadState(): Promise<AppState> {
  const data = await get<AppState>(STORE_KEY);
  if (!data) {
    await set(STORE_KEY, DEFAULT_STATE);
    return DEFAULT_STATE;
  }
  
  // Migration for old todo format if necessary (simple check)
  const migratedTodos = (data.todos || []).map((t: any) => {
    if ('completed' in t) {
      return {
        id: t.id,
        text: t.text,
        lastCompleted: t.completed ? t.date : null
      };
    }
    return t;
  });

  return { ...DEFAULT_STATE, ...data, todos: migratedTodos };
}

export async function saveState(state: AppState): Promise<void> {
  await set(STORE_KEY, state);
}

export async function addFoodLog(item: FoodItem): Promise<void> {
  await update(STORE_KEY, (state: AppState | undefined) => {
    const s = state || DEFAULT_STATE;
    return { ...s, logs: [item, ...s.logs] };
  });
}

export async function removeFoodLog(id: string): Promise<void> {
  await update(STORE_KEY, (state: AppState | undefined) => {
    const s = state || DEFAULT_STATE;
    return { ...s, logs: s.logs.filter(l => l.id !== id) };
  });
}

export async function updateFoodLog(item: FoodItem): Promise<void> {
  await update(STORE_KEY, (state: AppState | undefined) => {
    const s = state || DEFAULT_STATE;
    return { 
      ...s, 
      logs: s.logs.map(l => l.id === item.id ? item : l) 
    };
  });
}

export async function addPhoto(photo: PhysiquePhoto): Promise<void> {
  await update(STORE_KEY, (state: AppState | undefined) => {
    const s = state || DEFAULT_STATE;
    return { ...s, photos: [photo, ...s.photos] };
  });
}

export async function addMeasurement(measurement: MeasurementLog): Promise<void> {
  await update(STORE_KEY, (state: AppState | undefined) => {
    const s = state || DEFAULT_STATE;
    // If it's a weight measurement, also update the current stats
    let newStats = s.stats;
    if (measurement.type === 'weight') {
      newStats = { ...s.stats, weight: measurement.value };
    }
    
    return { 
      ...s, 
      measurements: [measurement, ...s.measurements].sort((a, b) => b.timestamp - a.timestamp),
      stats: newStats
    };
  });
}

export async function toggleTodo(id: string): Promise<void> {
  await update(STORE_KEY, (state: AppState | undefined) => {
    const s = state || DEFAULT_STATE;
    const today = new Date().toISOString().split('T')[0];
    
    return {
      ...s,
      todos: s.todos.map((t) => {
        if (t.id === id) {
          // If already completed today, toggle off (null). Otherwise toggle on (today).
          const isCompletedToday = t.lastCompleted === today;
          return { ...t, lastCompleted: isCompletedToday ? null : today };
        }
        return t;
      }),
    };
  });
}

export async function addTodo(text: string): Promise<void> {
  await update(STORE_KEY, (state: AppState | undefined) => {
    const s = state || DEFAULT_STATE;
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      lastCompleted: null
    };
    return { ...s, todos: [...s.todos, newTodo] };
  });
}

export async function removeTodo(id: string): Promise<void> {
  await update(STORE_KEY, (state: AppState | undefined) => {
    const s = state || DEFAULT_STATE;
    return { ...s, todos: s.todos.filter(t => t.id !== id) };
  });
}

export async function updateTodoText(id: string, text: string): Promise<void> {
  await update(STORE_KEY, (state: AppState | undefined) => {
    const s = state || DEFAULT_STATE;
    return { 
      ...s, 
      todos: s.todos.map(t => t.id === id ? { ...t, text } : t) 
    };
  });
}
