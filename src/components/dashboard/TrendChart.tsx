import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TrendChartProps {
  data: { date: string; value: number }[];
  color?: string;
  unit?: string;
  title?: string;
}

export function TrendChart({ data, color = "#10b981", unit = "", title }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-zinc-500 text-sm bg-zinc-900/50 rounded-xl border border-zinc-800/50">
        <p>No data available</p>
        <p className="text-xs mt-1">Log your first entry to see trends</p>
      </div>
    );
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full mt-4">
      {title && <h4 className="text-sm font-medium text-zinc-400 mb-4">{title}</h4>}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              minTickGap={30}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              domain={['auto', 'auto']}
              width={30}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: color }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              formatter={(value: number) => [`${value} ${unit}`, '']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2} 
              dot={{ r: 3, fill: color, strokeWidth: 0 }} 
              activeDot={{ r: 6, strokeWidth: 0 }} 
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
