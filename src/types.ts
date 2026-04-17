export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
  imageUrl?: string;
}

export interface UserStats {
  weight: number;
  goalWeight: number;
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  deadline: string; // ISO date string
}

export interface TodoItem {
  id: string;
  text: string;
  lastCompleted: string | null; // ISO date string (YYYY-MM-DD) of when it was last done
}

export interface PhysiquePhoto {
  id: string;
  imageUrl: string;
  weight: number;
  timestamp: number;
  notes?: string;
}

export interface MeasurementLog {
  id: string;
  type: 'weight' | 'stomach' | 'water';
  value: number;
  unit: string;
  date: string; // ISO date string YYYY-MM-DD
  timestamp: number;
}

export interface AppState {
  stats: UserStats;
  logs: FoodItem[];
  todos: TodoItem[];
  photos: PhysiquePhoto[];
  measurements: MeasurementLog[];
  socialMode: boolean;
  socialBuffer: number; // Calories saved for the event
}
