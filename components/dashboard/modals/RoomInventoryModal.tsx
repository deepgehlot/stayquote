"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Hash, Layout, Save } from 'lucide-react';

interface RoomInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { category: string; totalRooms: string }) => void;
  onUpdate?: (data: { category: string; totalRooms: string }) => void;
  isEdit?: boolean;
  initialData?: { category: string; totalRooms: string };
}

export default function RoomInventoryModal({ 
  isOpen, 
  onClose, 
  onAdd,
  onUpdate,
  isEdit,
  initialData
}: RoomInventoryModalProps) {
  const [category, setCategory] = useState("");
  const [totalRooms, setTotalRooms] = useState("");

  useEffect(() => {
    if (isOpen && isEdit && initialData) {
      setCategory(initialData.category || "");
      setTotalRooms(initialData.totalRooms || "");
    } else if (isOpen && !isEdit) {
      setCategory("");
      setTotalRooms("");
    }
  }, [isOpen, isEdit, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (category.trim() && totalRooms.trim()) {
      if (isEdit && onUpdate) {
        onUpdate({ category: category.trim(), totalRooms: totalRooms.trim() });
      } else {
        onAdd({ category: category.trim(), totalRooms: totalRooms.trim() });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="bg-gray-900 border border-white/10 rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white">{isEdit ? "Update Room Category" : "Add Room Inventory"}</h3>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-medium">{isEdit ? "Modify category details" : "Define your room categories"}</p>
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
          <div className="space-y-2">
            <label className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] ml-1">
              Room Category / Type
            </label>
            <div className="relative">
              <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Deluxe Room" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-orange-600 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] ml-1">
              Total Number of Rooms
            </label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="number" 
                value={totalRooms}
                onChange={(e) => setTotalRooms(e.target.value)}
                placeholder="e.g. 10" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-orange-600 transition-all text-sm font-bold"
              />
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={!category.trim() || !totalRooms.trim()}
            className="w-full bg-orange-600 py-4 rounded-2xl text-white font-black hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-4 uppercase tracking-widest text-sm"
          >
            {isEdit ? <Save className="w-5 h-5" strokeWidth={3} /> : <Plus className="w-5 h-5" strokeWidth={3} />}
            <span>{isEdit ? "Update Inventory" : "Add to Inventory"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

