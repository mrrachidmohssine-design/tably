
import React, { useState } from 'react';
import { ReceiptItem, Friend } from '../types';

interface AssignScreenProps {
  items: ReceiptItem[];
  setItems: React.Dispatch<React.SetStateAction<ReceiptItem[]>>;
  friends: Friend[];
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  onBack: () => void;
  onNext: () => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const AssignScreen: React.FC<AssignScreenProps> = ({ items, setItems, friends, setFriends, onBack, onNext }) => {
  const [activeFriendId, setActiveFriendId] = useState<string>(friends[0].id);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');

  const toggleAssignment = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const isAssigned = item.assignedTo.includes(activeFriendId);
      const updated = isAssigned 
        ? item.assignedTo.filter(id => id !== activeFriendId)
        : [...item.assignedTo, activeFriendId];
      return { ...item, assignedTo: updated };
    }));
  };

  const addFriend = () => {
    if (!newFriendName.trim()) return;
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: newFriendName.trim(),
      color: COLORS[friends.length % COLORS.length]
    };
    setFriends([...friends, newFriend]);
    setActiveFriendId(newFriend.id);
    setNewFriendName('');
    setShowAddFriend(false);
  };

  const allAssigned = items.every(item => item.assignedTo.length > 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight">Assign Items</h2>
        <div className="w-10"></div>
      </div>

      {/* Friends Horizontal Scroll */}
      <div className="px-6 py-4 flex items-center space-x-4 overflow-x-auto no-scrollbar border-b border-slate-50 bg-slate-50/50">
        {friends.map(friend => (
          <button 
            key={friend.id}
            onClick={() => setActiveFriendId(friend.id)}
            className={`flex flex-col items-center flex-shrink-0 transition-all ${activeFriendId === friend.id ? 'scale-110' : 'opacity-60 grayscale'}`}
          >
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl mb-1 shadow-md border-2 border-white"
              style={{ backgroundColor: friend.color }}
            >
              {friend.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-bold text-slate-900 truncate max-w-[60px]">{friend.name}</span>
          </button>
        ))}
        <button 
          onClick={() => setShowAddFriend(true)}
          className="flex flex-col items-center flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Add</span>
        </button>
      </div>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        {items.map(item => {
          const isAssignedToActive = item.assignedTo.includes(activeFriendId);
          return (
            <div 
              key={item.id}
              onClick={() => toggleAssignment(item.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                isAssignedToActive 
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-100' 
                  : 'bg-white border-slate-100 opacity-80'
              }`}
            >
              <div className="flex-1 mr-4">
                <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                <div className="flex flex-wrap mt-2 gap-1">
                  {item.assignedTo.length === 0 ? (
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Unassigned</span>
                  ) : (
                    item.assignedTo.map(fid => {
                      const f = friends.find(fr => fr.id === fid);
                      return (
                        <div 
                          key={fid} 
                          className="w-4 h-4 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] text-white font-bold"
                          style={{ backgroundColor: f?.color }}
                        >
                          {f?.name.charAt(0)}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-lg font-black text-slate-900">${item.price.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-slate-400">Qty: {item.quantity}</span>
                {item.assignedTo.length > 1 && (
                  <span className="text-[9px] font-bold text-emerald-500 uppercase mt-1">
                    Split ${(item.price / item.assignedTo.length).toFixed(2)} ea
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0">
        <button 
          onClick={onNext}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 ${
            allAssigned ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {allAssigned ? 'Review Totals' : 'Assign All Items'}
        </button>
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
          <div className="bg-white w-full rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-4">Add Friend</h3>
            <input 
              autoFocus
              type="text" 
              placeholder="Name" 
              className="w-full bg-slate-100 border-none rounded-2xl p-4 text-slate-900 font-bold text-lg mb-6 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFriend()}
            />
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowAddFriend(false)}
                className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
              <button 
                onClick={addFriend}
                className="flex-2 bg-emerald-500 text-white py-4 px-8 rounded-2xl font-bold hover:bg-emerald-600 active:scale-95 transition-all"
              >
                Add Friend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignScreen;
