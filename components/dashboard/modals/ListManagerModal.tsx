"use client";

import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface ListManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  onAdd: (name: string, extra?: string) => void;
  onRemove: (index: number) => void;
}

export default function ListManagerModal({ 
  isOpen, 
  onClose, 
  title, 
  items, 
  onAdd, 
  onRemove 
}: ListManagerModalProps) {
  const [newItemName, setNewItemName] = useState("");
  const [totalRooms, setTotalRooms] = useState("1");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newItemName.trim()) {
      if (title.includes("Rooms")) {
        onAdd(newItemName.trim(), totalRooms.trim() || "1");
        setNewItemName("");
        setTotalRooms("1");
      } else {
        onAdd(newItemName.trim());
        setNewItemName("");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="bg-gray-900 border border-white/10 rounded-[32px] w-full max-w-[95vw] sm:max-w-md p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-medium">
              {title.includes("Rooms") ? "Manage inventory categories & sizes" : "Manage inventory category list"}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {title.includes("Rooms") ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Deluxe Room" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-orange-600 transition-all text-sm font-medium"
                />
                <input 
                  type="number" 
                  value={totalRooms}
                  onChange={(e) => setTotalRooms(e.target.value)}
                  placeholder="Qty" 
                  className="w-20 bg-white/5 border border-white/10 rounded-2xl px-3 py-3 text-white outline-none focus:border-orange-600 transition-all text-sm font-bold text-center"
                />
              </div>
              <button 
                type="button" 
                onClick={handleAdd}
                className="w-full bg-orange-600 py-3 rounded-2xl text-white font-black hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 active:scale-[0.98] uppercase tracking-widest text-xs"
              >
                <Plus className="w-4 h-4" strokeWidth={3} />
                <span>Add Category</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter name..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-600 transition-all text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button 
                type="button" 
                onClick={handleAdd}
                className="bg-orange-600 px-4 py-3 rounded-xl text-white font-bold hover:bg-orange-700 transition-all flex items-center justify-center shadow-lg shadow-orange-600/20"
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
          )}

          <div className="max-h-[40vh] sm:max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
            {items.length === 0 ? (
              <div className="text-center py-10 opacity-50 space-y-2">
                <p className="text-white text-sm font-medium">No items found</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Add your first entry above</p>
              </div>
            ) : (
              items.map((item, index) => {
                const hasDelimiter = typeof item === 'string' && item.includes("::");
                const displayName = hasDelimiter ? item.split("::")[0] : item;
                const count = hasDelimiter ? item.split("::")[1] : null;

                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-4 group hover:border-white/10 transition-all animate-in fade-in"
                  >
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="text-white text-sm font-semibold">{displayName}</span>
                      {count !== null && (
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">
                          {count} {Number(count) === 1 ? 'Room' : 'Rooms'} Inventory
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => onRemove(index)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
