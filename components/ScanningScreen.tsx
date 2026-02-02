
import React, { useState, useRef } from 'react';
import { scanReceipt } from '../services/geminiService';

interface ScanningScreenProps {
  onComplete: (items: any[]) => void;
  onCancel: () => void;
}

const ScanningScreen: React.FC<ScanningScreenProps> = ({ onComplete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const result = await scanReceipt(base64String);
        onComplete(result);
      } catch (err) {
        setError("Couldn't read the receipt. Try again.");
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white px-8 items-center justify-center text-center">
      {!loading ? (
        <div className="animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8 mx-auto shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload Receipt</h2>
          <p className="text-slate-400 mb-8 max-w-xs mx-auto">Upload a clear photo of your receipt to begin splitting.</p>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          
          <div className="space-y-4 w-full">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 active:scale-95 transition-all shadow-xl"
            >
              Choose Photo
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-4 text-slate-400 font-bold hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>

          {error && <p className="mt-4 text-red-400 text-sm font-medium">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 tracking-tight">Scanning...</h2>
          <p className="text-slate-400 animate-pulse">Our AI is reading your items</p>
        </div>
      )}
    </div>
  );
};

export default ScanningScreen;
