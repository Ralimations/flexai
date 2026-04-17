import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { Dashboard } from '@/pages/Dashboard';
import { Gallery } from '@/pages/Gallery';
import { Settings } from '@/pages/Settings';
import { CalendarPage } from '@/pages/Calendar';
import { CameraView } from '@/components/input/CameraView';
import { InputModal } from '@/components/input/InputModal';
import { analyzeFoodImage } from '@/services/ai';
import { FoodItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';

import { BarcodeScanner } from '@/components/input/BarcodeScanner';
import { ScanBarcode } from 'lucide-react';

function AppContent() {
  const { addLog, addPhysiquePhoto } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'camera' | 'gallery' | 'settings' | 'calendar'>('dashboard');
  const [showCamera, setShowCamera] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiData, setAiData] = useState<Partial<FoodItem> | undefined>(undefined);
  const [aiFailed, setAiFailed] = useState(false);

  const handleTabChange = (tab: 'dashboard' | 'camera' | 'gallery' | 'settings' | 'calendar') => {
    if (tab === 'camera') {
      setShowCamera(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    setShowBarcode(false);
    setAnalyzing(true);
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1) {
        const product = data.product;
        setAiData({
          name: product.product_name || 'Unknown Product',
          calories: product.nutriments?.['energy-kcal_100g'] || 0,
          protein: product.nutriments?.protein_100g || 0,
          carbs: product.nutriments?.carbohydrates_100g || 0,
          fat: product.nutriments?.fat_100g || 0,
          imageUrl: product.image_url
        });
        setShowInputModal(true);
      } else {
        alert('Product not found');
      }
    } catch (error) {
      console.error("Barcode lookup failed", error);
      alert('Failed to lookup barcode');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCameraCapture = async (imageSrc: string) => {
    setShowCamera(false);
    setAiFailed(false);
    
    // If we are in gallery mode, just save the photo
    if (activeTab === 'gallery') {
      await addPhysiquePhoto({
        id: uuidv4(),
        imageUrl: imageSrc,
        weight: 0, // Should prompt for weight
        timestamp: Date.now(),
      });
      return;
    }

    // Otherwise, analyze food
    setAnalyzing(true);
    try {
      const data = await analyzeFoodImage(imageSrc);
      setAiData({
        ...data,
        imageUrl: imageSrc,
      });
      setShowInputModal(true);
    } catch (error) {
      console.error("AI Analysis failed", error);
      // Fallback to manual entry with image
      setAiData({ imageUrl: imageSrc });
      setAiFailed(true);
      setShowInputModal(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveLog = async (item: FoodItem) => {
    await addLog(item);
    setShowInputModal(false);
    setAiData(undefined);
    setAiFailed(false);
    setActiveTab('dashboard');
  };

  return (
    <MobileContainer>
      <div className="flex-1 overflow-y-auto bg-black">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'calendar' && <CalendarPage />}
        {activeTab === 'gallery' && <Gallery onAddPhoto={() => setShowCamera(true)} />}
        {activeTab === 'settings' && <Settings />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Floating Barcode Button (visible on dashboard) */}
      {activeTab === 'dashboard' && (
        <button
          onClick={() => setShowBarcode(true)}
          className="fixed bottom-24 right-6 p-4 bg-zinc-800 text-white rounded-full shadow-lg border border-zinc-700 z-[60]"
        >
          <ScanBarcode size={24} />
        </button>
      )}

      {showCamera && (
        <CameraView 
          onCapture={handleCameraCapture} 
          onClose={() => setShowCamera(false)} 
          onSwitchToBarcode={() => {
            setShowCamera(false);
            setShowBarcode(true);
          }}
        />
      )}

      {showBarcode && (
        <BarcodeScanner 
          onScan={handleBarcodeScan}
          onClose={() => setShowBarcode(false)}
        />
      )}

      {analyzing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-white font-medium">Processing...</p>
        </div>
      )}

      <InputModal 
        isOpen={showInputModal} 
        onClose={() => setShowInputModal(false)} 
        onSave={handleSaveLog}
        initialData={aiData}
        aiFailed={aiFailed}
      />
    </MobileContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
