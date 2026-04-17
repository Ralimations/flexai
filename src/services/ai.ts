import { GoogleGenAI } from "@google/genai";
import { AppState, FoodItem } from '@/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeFoodImage(base64Image: string): Promise<Partial<FoodItem>> {
  try {
    // Remove header if present
    const base64Data = base64Image.split(',')[1] || base64Image;

    // Resize image if too large (simple client-side check/resize logic would be better in UI, 
    // but here we just send what we get. Assuming the UI handles resizing or we just send it.)
    // For now, let's just send it.

    const prompt = `
      Analyze this food image and identify the main dish.
      Estimate the calories, protein, carbs, and fat.
      Return a JSON object with these fields:
      - name: string (short descriptive name)
      - calories: number
      - protein: number (grams)
      - carbs: number (grams)
      - fat: number (grams)
      
      Return ONLY raw JSON, no markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        }
      ]
    });

    const text = response.text;
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Food analysis failed:", error);
    throw error;
  }
}

export async function analyzeProgress(state: AppState) {
  try {
    const weightHistory = state.measurements
      .filter(m => m.type === 'weight')
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(m => `${m.date}: ${m.value}kg`)
      .join('\n');

    const calorieHistory = state.logs
      .reduce((acc, log) => {
        const date = new Date(log.timestamp).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + log.calories;
        return acc;
      }, {} as Record<string, number>);

    const calorieString = Object.entries(calorieHistory)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, cals]) => `${date}: ${cals} kcal`)
      .join('\n');

    const prompt = `
      Analyze this user's fitness progress and predict when they will reach their goal.
      
      Current Stats:
      - Current Weight: ${state.stats.weight} kg
      - Goal Weight: ${state.stats.goalWeight} kg
      - Daily Calorie Goal: ${state.stats.dailyCalorieGoal}
      
      Weight History:
      ${weightHistory}
      
      Calorie Intake History:
      ${calorieString}
      
      Please provide a JSON response with the following fields:
      1. "estimatedDate": A predicted date (YYYY-MM-DD) for reaching the goal weight based on trends. If no trend, estimate based on a standard 0.5kg/week loss.
      2. "message": A short, encouraging summary of their progress (max 2 sentences).
      3. "tips": An array of 3 specific, actionable tips to reach the goal faster or maintain progress.
      
      Return ONLY raw JSON, no markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;
    // Clean up potential markdown code blocks if Gemini adds them
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      estimatedDate: null,
      message: "Keep logging data to get a prediction!",
      tips: ["Log your weight daily", "Track all your meals", "Stay consistent"]
    };
  }
}
