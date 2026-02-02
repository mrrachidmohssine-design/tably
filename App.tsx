
import React, { useState, useEffect } from 'react';
import { AppState, ReceiptItem, Friend, SplitRecord } from './types';
import HomeScreen from './components/HomeScreen';
import ScanningScreen from './components/ScanningScreen';
import AssignScreen from './components/AssignScreen';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>(AppState.HOME);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Me', color: '#10b981' },
  ]);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);
  const [recentSplits, setRecentSplits] = useState<SplitRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tably_splits');
    if (saved) {
      setRecentSplits(JSON.parse(saved));
    }
  }, []);

  const resetSession = () => {
    setItems([]);
    setFriends([{ id: '1', name: 'Me', color: '#10b981' }]);
    setTax(0);
    setTip(0);
    setCurrentScreen(AppState.HOME);
  };

  const saveSplit = (record: SplitRecord) => {
    const updated = [record, ...recentSplits].slice(0, 10);
    setRecentSplits(updated);
    localStorage.setItem('tably_splits', JSON.stringify(updated));
  };

  const handleScanComplete = (parsedItems: any[]) => {
    const formatted: ReceiptItem[] = parsedItems.map((item, idx) => ({
      id: `item-${idx}`,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      assignedTo: [],
    }));
    setItems(formatted);
    setCurrentScreen(AppState.ASSIGN);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden flex flex-col">
      {currentScreen === AppState.HOME && (
        <HomeScreen 
          onScanStart={() => setCurrentScreen(AppState.SCANNING)} 
          recentSplits={recentSplits}
          onSelectRecent={(split) => {
            setItems(split.items);
            setFriends(split.friends);
            setTax(split.tax);
            setTip(split.tip);
            setCurrentScreen(AppState.RESULTS);
          }}
        />
      )}
      
      {currentScreen === AppState.SCANNING && (
        <ScanningScreen onComplete={handleScanComplete} onCancel={() => setCurrentScreen(AppState.HOME)} />
      )}

      {currentScreen === AppState.ASSIGN && (
        <AssignScreen 
          items={items} 
          setItems={setItems}
          friends={friends}
          setFriends={setFriends}
          onBack={() => setCurrentScreen(AppState.HOME)}
          onNext={() => setCurrentScreen(AppState.RESULTS)}
        />
      )}

      {currentScreen === AppState.RESULTS && (
        <ResultScreen 
          items={items} 
          friends={friends} 
          initialTax={tax} 
          initialTip={tip} 
          onBack={() => setCurrentScreen(AppState.ASSIGN)}
          onFinish={(record) => {
            saveSplit(record);
            resetSession();
          }}
        />
      )}
    </div>
  );
};

export default App;
