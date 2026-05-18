"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Save } from 'lucide-react';

interface ServiceInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string }) => void;
  onUpdate?: (data: { name: string }) => void;
  isEdit?: boolean;
  initialData?: { name: string };
}

export default function ServiceInventoryModal({ 
  isOpen, 
  onClose, 
  onAdd,
  onUpdate,
  isEdit,
  initialData
}: ServiceInventoryModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen && isEdit && initialData) {
      setName(initialData.name || "");
    } else if (isOpen && !isEdit) {
      setName("");
    }
  }, [isOpen, isEdit, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (name.trim()) {
      if (isEdit && onUpdate) {
        onUpdate({ name: name.trim() });
      } else {
        onAdd({ name: name.trim() });
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
            <h3 className="text-2xl font-bold text-white">{isEdit ? "Update Service" : "Add New Service"}</h3>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-medium">{isEdit ? "Modify service name" : "Add extra services for guests"}</p>
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
              Service Name
            </label>
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Airport Pickup" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-orange-600 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full bg-orange-600 py-4 rounded-2xl text-white font-black hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-4 uppercase tracking-widest text-sm"
          >
            {isEdit ? <Save className="w-5 h-5" strokeWidth={3} /> : <Plus className="w-5 h-5" strokeWidth={3} />}
            <span>{isEdit ? "Update Service" : "Add Service"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

