import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CalorieRing } from '@/components/dashboard/CalorieRing';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { SocialToggle } from '@/components/dashboard/SocialToggle';
import { TodoList } from '@/components/widgets/TodoList';
import { FoodLogList } from '@/components/widgets/FoodLogList';
import { MeasurementModal } from '@/components/input/MeasurementModal';
import { format } from 'date-fns';
import { Plus, TrendingUp, Utensils, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const { state, toggleSocialMode, toggleTodoItem, addNewMeasurement } = useApp();
  const [chartMode, setChartMode] = useState<'weight' | 'calories' | 'stomach'>('weight');
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [measurementType, setMeasurementType] = useState<'weight' | 'stomach'>('weight');

  const today = new Date().toISOString().split('T')[0];
  const todaysLogs = state.logs.filter(log => 
    new Date(log.timestamp).toISOString().split('T')[0] === today
  );

  const currentCalories = todaysLogs.reduce((acc, log) => acc + log.calories, 0);
  const currentProtein = todaysLogs.reduce((acc, log) => acc + log.protein, 0);

  // Prepare chart data
  const weightData = state.measurements
    .filter(m => m.type === 'weight')
    .map(m => ({ date: m.date, value: m.value }));

  const stomachData = state.measurements
    .filter(m => m.type === 'stomach')
    .map(m => ({ date: m.date, value: m.value }));

  // Aggregate daily calories for chart
  const calorieDataMap = new Map<string, number>();
  state.logs.forEach(log => {
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    const current = calorieDataMap.get(date) || 0;
    calorieDataMap.set(date, current + log.calories);
  });
  const calorieData = Array.from(calorieDataMap.entries())
    .map(([date, value]) => ({ date, value }));

  const openMeasurementModal = (type: 'weight' | 'stomach') => {
    setMeasurementType(type);
    setShowMeasurementModal(true);
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Today</h1>
          <p className="text-zinc-400">{format(new Date(), 'EEEE, MMMM do')}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-400">{state.stats.weight} <span className="text-sm text-zinc-500">kg</span></p>
          <p className="text-xs text-zinc-500">Goal: {state.stats.goalWeight} kg</p>
        </div>
      </div>

      {/* Main Ring */}
      <div className="flex justify-center">
        <CalorieRing 
          current={currentCalories} 
          goal={state.socialMode ? state.stats.dailyCalorieGoal * 1.2 : state.stats.dailyCalorieGoal} 
          proteinCurrent={currentProtein} 
          proteinGoal={state.stats.dailyProteinGoal} 
        />
      </div>

      {/* Social Toggle */}
      <SocialToggle enabled={state.socialMode} onToggle={toggleSocialMode} />

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 uppercase">Protein</p>
          <p className="text-xl font-bold text-blue-400">{currentProtein}g</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 uppercase">Carbs</p>
          <p className="text-xl font-bold text-yellow-400">{todaysLogs.reduce((acc, log) => acc + log.carbs, 0)}g</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 uppercase">Fat</p>
          <p className="text-xl font-bold text-red-400">{todaysLogs.reduce((acc, log) => acc + log.fat, 0)}g</p>
        </div>
      </div>

      {/* Progress Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Progress</h3>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 w-8 p-0 rounded-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
              onClick={() => openMeasurementModal('weight')}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Chart Tabs */}
        <div className="flex space-x-1 bg-zinc-900 p-1 rounded-lg mb-4">
          <button
            onClick={() => setChartMode('weight')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
              chartMode === 'weight' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <TrendingUp size={12} /> Weight
          </button>
          <button
            onClick={() => setChartMode('calories')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
              chartMode === 'calories' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Utensils size={12} /> Calories
          </button>
          <button
            onClick={() => setChartMode('stomach')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
              chartMode === 'stomach' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Ruler size={12} /> Stomach
          </button>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 min-h-[240px]">
          {chartMode === 'weight' && (
            <TrendChart 
              data={weightData} 
              color="#10b981" 
              unit="kg" 
              title="Weight History" 
            />
          )}
          {chartMode === 'calories' && (
            <TrendChart 
              data={calorieData} 
              color="#f59e0b" 
              unit="kcal" 
              title="Daily Intake" 
            />
          )}
          {chartMode === 'stomach' && (
            <TrendChart 
              data={stomachData} 
              color="#3b82f6" 
              unit="in" 
              title="Stomach Size" 
            />
          )}
        </div>
      </div>

      {/* Todo List */}
      <TodoList todos={state.todos} onToggle={toggleTodoItem} />

      {/* Food Log */}
      <FoodLogList logs={todaysLogs} />

      <MeasurementModal 
        isOpen={showMeasurementModal} 
        onClose={() => setShowMeasurementModal(false)} 
        onSave={addNewMeasurement}
        defaultType={measurementType}
      />
    </div>
  );
}
