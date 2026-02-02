
import React from 'react';
import { SplitRecord } from '../types.ts';

interface HomeScreenProps {
  onScanStart: () => void;
  recentSplits: SplitRecord[];
  onSelectRecent: (split: SplitRecord) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onScanStart, recentSplits, onSelectRecent }) => {
  return (
    <div className="flex-1 flex flex-col px-6 pt-12 pb-8">
      <div className="flex flex-col items-center mb-12">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <span className="text-white text-3xl font-bold italic tracking-tighter">T</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">TABLy</h1>
        <p className="text-slate-500 font-medium mt-1">Split bills instantly with AI</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <button 
          onClick={onScanStart}
          className="group relative w-48 h-48 bg-emerald-500 rounded-full flex flex-col items-center justify-center text-white shadow-2xl hover:bg-emerald-600 transition-all active:scale-95 tap-highlight-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-20 animate-ping rounded-full"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-lg font-bold tracking-wide">SCAN RECEIPT</span>
        </button>
      </div>

      <div className="mt-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Recent Splits</h2>
        {recentSplits.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-6 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">Your splits will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSplits.map((split) => (
              <div 
                key={split.id} 
                onClick={() => onSelectRecent(split)}
                className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm active:bg-slate-50 cursor-pointer"
              >
                <div>
                  <h3 className="font-bold text-slate-800">{split.restaurantName || "Restaurant"}</h3>
                  <p className="text-xs text-slate-400">{split.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">${split.total.toFixed(2)}</p>
                  <p className="text-xs text-emerald-500 font-bold">{split.friends.length} people</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
