import React from 'react';
import { motion } from 'framer-motion';

interface CalorieRingProps {
  current: number;
  goal: number;
  proteinCurrent: number;
  proteinGoal: number;
}

export function CalorieRing({ current, goal, proteinCurrent, proteinGoal }: CalorieRingProps) {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (current / goal) * circumference;

  const proteinRadius = 60;
  const proteinNormalizedRadius = proteinRadius - stroke * 2;
  const proteinCircumference = proteinNormalizedRadius * 2 * Math.PI;
  const proteinStrokeDashoffset = proteinCircumference - (proteinCurrent / proteinGoal) * proteinCircumference;

  return (
    <div className="relative flex items-center justify-center py-8">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg]"
      >
        {/* Calorie Background */}
        <circle
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Calorie Progress */}
        <motion.circle
          stroke="#10b981" // emerald-500
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        
        {/* Protein Background */}
        <circle
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
          fill="transparent"
          r={proteinNormalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Protein Progress */}
        <motion.circle
          stroke="#3b82f6" // blue-500
          strokeWidth={stroke}
          strokeDasharray={proteinCircumference + ' ' + proteinCircumference}
          initial={{ strokeDashoffset: proteinCircumference }}
          animate={{ strokeDashoffset: proteinStrokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          strokeLinecap="round"
          fill="transparent"
          r={proteinNormalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-white">{goal - current}</span>
        <span className="text-xs text-zinc-400 uppercase tracking-wider">Cals Left</span>
      </div>
    </div>
  );
}
