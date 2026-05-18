"use client";

import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface ListManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  onAdd: (name: string) => void;
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

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim());
      setNewItemName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-[95vw] sm:max-w-md p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
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

          <div className="max-h-[40vh] sm:max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
            {items.length === 0 ? (
              <div className="text-center py-10 opacity-50 space-y-2">
                <p className="text-white text-sm font-medium">No items found</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Add your first entry above</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-4 group hover:border-white/10 transition-all"
                >
                  <span className="text-white text-sm font-medium">{item}</span>
                  <button 
                    onClick={() => onRemove(index)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
