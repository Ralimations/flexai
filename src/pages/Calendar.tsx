import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Droplets, Utensils, Ruler, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { analyzeProgress } from '@/services/ai';
import { Loader2, Sparkles } from 'lucide-react';

export function CalendarPage() {
  const { state } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [analysis, setAnalysis] = useState<{ estimatedDate: string | null, message: string, tips: string[] } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getDayData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const logs = state.logs.filter(l => 
      new Date(l.timestamp).toISOString().split('T')[0] === dateStr
    );
    
    const calories = logs.reduce((acc, l) => acc + l.calories, 0);
    
    const weight = state.measurements.find(m => 
      m.type === 'weight' && m.date === dateStr
    );
    
    const stomach = state.measurements.find(m => 
      m.type === 'stomach' && m.date === dateStr
    );

    const water = state.measurements
      .filter(m => m.type === 'water' && m.date === dateStr)
      .reduce((acc, m) => acc + m.value, 0);

    return { logs, calories, weight, stomach, water };
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const result = await analyzeProgress(state);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Progress Plan</h1>
        <Button 
          size="sm" 
          onClick={handleAnalyze} 
          disabled={analyzing}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {analyzing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Analyze
        </Button>
      </div>

      {/* AI Prediction Card */}
      {analysis && (
        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">Estimated Goal Date</p>
              <p className="text-2xl font-bold text-white">
                {analysis.estimatedDate ? format(parseISO(analysis.estimatedDate), 'MMMM d, yyyy') : 'Calculating...'}
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-300">{analysis.message}</p>
          <div className="space-y-1">
            {analysis.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-t-xl border border-zinc-800 border-b-0">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-zinc-800 rounded">
          <ChevronLeft className="text-zinc-400" />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-zinc-800 rounded">
          <ChevronRight className="text-zinc-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-b-xl p-4 min-h-[300px]">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-xs text-zinc-500 font-medium">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const { calories, weight } = getDayData(day);
            const isToday = isSameDay(day, new Date());
            const hasData = calories > 0 || weight;
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center relative
                  ${isToday ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' : 'hover:bg-zinc-800 text-zinc-300'}
                  ${hasData ? 'bg-zinc-800/50' : ''}
                `}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                {calories > 0 && (
                  <div className="w-1 h-1 rounded-full bg-orange-500 mt-1" />
                )}
                {weight && (
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Details Modal */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, 'EEEE, MMMM do')}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDate && (() => {
            const data = getDayData(selectedDate);
            return (
              <div className="space-y-6 py-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                      <Utensils size={14} />
                      <span className="text-xs uppercase">Calories</span>
                    </div>
                    <p className="text-xl font-bold text-white">{data.calories}</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                      <Droplets size={14} />
                      <span className="text-xs uppercase">Water</span>
                    </div>
                    <p className="text-xl font-bold text-blue-400">{data.water} ml</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                      <Ruler size={14} />
                      <span className="text-xs uppercase">Weight</span>
                    </div>
                    <p className="text-xl font-bold text-emerald-400">
                      {data.weight ? `${data.weight.value} kg` : '--'}
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                      <Info size={14} />
                      <span className="text-xs uppercase">Stomach</span>
                    </div>
                    <p className="text-xl font-bold text-purple-400">
                      {data.stomach ? `${data.stomach.value} in` : '--'}
                    </p>
                  </div>
                </div>

                {/* Meals List */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-3">Meals</h4>
                  {data.logs.length > 0 ? (
                    <div className="space-y-2">
                      {data.logs.map(log => (
                        <div key={log.id} className="flex justify-between items-center p-2 bg-zinc-800/50 rounded-lg">
                          <span className="text-sm text-zinc-200">{log.name}</span>
                          <span className="text-xs text-zinc-500">{log.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-600 italic">No meals logged.</p>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
