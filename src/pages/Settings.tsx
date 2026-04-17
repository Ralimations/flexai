import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Settings() {
  const { state, updateStats } = useApp();
  const [weight, setWeight] = useState(state.stats.weight.toString());
  const [goalWeight, setGoalWeight] = useState(state.stats.goalWeight.toString());
  const [calories, setCalories] = useState(state.stats.dailyCalorieGoal.toString());
  const [protein, setProtein] = useState(state.stats.dailyProteinGoal.toString());

  const handleSave = () => {
    updateStats({
      weight: Number(weight),
      goalWeight: Number(goalWeight),
      dailyCalorieGoal: Number(calories),
      dailyProteinGoal: Number(protein),
    });
  };

  return (
    <div className="p-6 space-y-6 pb-24 text-white">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>My Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Current Weight (kg)</Label>
            <Input 
              id="weight" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Goal Weight (kg)</Label>
            <Input 
              id="goal" 
              value={goalWeight} 
              onChange={(e) => setGoalWeight(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Daily Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calories">Calorie Target</Label>
            <Input 
              id="calories" 
              value={calories} 
              onChange={(e) => setCalories(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Protein Target (g)</Label>
            <Input 
              id="protein" 
              value={protein} 
              onChange={(e) => setProtein(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
        Save Changes
      </Button>

      <div className="text-center pt-8 pb-4">
        <p className="text-zinc-600 text-xs">Developed by Ral Angelo Lluisma</p>
      </div>
    </div>
  );
}
