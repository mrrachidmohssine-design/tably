
import React, { useState, useMemo } from 'react';
import { ReceiptItem, Friend, SplitRecord } from '../types.ts';

interface ResultScreenProps {
  items: ReceiptItem[];
  friends: Friend[];
  initialTax: number;
  initialTip: number;
  onBack: () => void;
  onFinish: (record: SplitRecord) => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ items, friends, initialTax, initialTip, onBack, onFinish }) => {
  const [taxInput, setTaxInput] = useState(initialTax.toString());
  const [tipInput, setTipInput] = useState(initialTip.toString());
  const [isTipPercent, setIsTipPercent] = useState(true);

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price, 0), [items]);
  
  const tax = parseFloat(taxInput) || 0;
  const tipAmount = isTipPercent ? (subtotal * (parseFloat(tipInput) || 0) / 100) : (parseFloat(tipInput) || 0);
  const total = subtotal + tax + tipAmount;

  const friendsBreakdown = useMemo(() => {
    return friends.map(friend => {
      let friendSubtotal = 0;
      const friendItems: { name: string, price: number }[] = [];

      items.forEach(item => {
        if (item.assignedTo.includes(friend.id)) {
          const splitPrice = item.price / item.assignedTo.length;
          friendSubtotal += splitPrice;
          friendItems.push({ name: item.name, price: splitPrice });
        }
      });

      const proportion = subtotal > 0 ? (friendSubtotal / subtotal) : 0;
      const friendTax = tax * proportion;
      const friendTip = tipAmount * proportion;
      const friendTotal = friendSubtotal + friendTax + friendTip;

      return {
        ...friend,
        subtotal: friendSubtotal,
        tax: friendTax,
        tip: friendTip,
        total: friendTotal,
        items: friendItems
      };
    }).filter(f => f.total > 0);
  }, [friends, items, tax, tipAmount, subtotal]);

  const handleFinish = () => {
    const record: SplitRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      total,
      restaurantName: "Note",
      items,
      friends,
      tax,
      tip: tipAmount
    };
    onFinish(record);
  };

  const shareResult = () => {
    const summary = friendsBreakdown.map(f => {
      return `${f.name}: $${f.total.toFixed(2)} (Sous-total: $${f.subtotal.toFixed(2)})`;
    }).join('\n');
    const text = `Split avec TABLy\nTotal: $${total.toFixed(2)}\n\n${summary}`;
    
    if (navigator.share) {
      navigator.share({ title: 'TABLy Bill Split', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copié dans le presse-papier !');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-slate-50 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight">Final Split</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Subtotal Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Global</span>
            <span className="text-3xl font-black text-slate-900">${total.toFixed(2)}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">Sous-total</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">Taxe</span>
              <div className="flex items-center bg-slate-100 rounded-xl px-3 py-1">
                <span className="text-slate-400 mr-1">$</span>
                <input 
                  type="number"
                  className="bg-transparent w-16 text-right font-black outline-none"
                  value={taxInput}
                  onChange={(e) => setTaxInput(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-slate-600">Pourboire</span>
                <button 
                  onClick={() => setIsTipPercent(!isTipPercent)}
                  className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter text-left"
                >
                  {isTipPercent ? 'Changer en $' : 'Changer en %'}
                </button>
              </div>
              <div className="flex items-center bg-slate-100 rounded-xl px-3 py-1">
                <input 
                  type="number"
                  className="bg-transparent w-16 text-right font-black outline-none"
                  value={tipInput}
                  onChange={(e) => setTipInput(e.target.value)}
                />
                <span className="text-slate-400 ml-1">{isTipPercent ? '%' : '$'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Breakdowns */}
        <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest px-1">Par personne</h3>
        <div className="space-y-4">
          {friendsBreakdown.map(f => (
            <div key={f.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: f.color }}></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{f.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {f.items.length} articles
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900">${f.total.toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">Avec taxes & tips</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 flex space-x-4">
        <button 
          onClick={shareResult}
          className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all"
        >
          <span>Partager</span>
        </button>
        <button 
          onClick={handleFinish}
          className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all hover:bg-emerald-600"
        >
          Terminer & Sauver
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
