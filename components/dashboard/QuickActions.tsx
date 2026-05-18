import React from 'react';
import { FilePlus, CalendarPlus } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="max-w-[1600px] mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        
        {/* Quotation Action */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/50 rounded-xl p-6 flex flex-col justify-between group shadow-sm hover:shadow-md cursor-pointer transition-all duration-300">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <FilePlus className="w-32 h-32 text-orange-500" />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 transition-colors duration-300 border border-orange-100">
              <FilePlus className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1.5">Quotations</h2>
            <p className="text-slate-600 text-xs mb-6 max-w-[85%] font-medium leading-relaxed">
              Generate professional stay summaries and pricing for your clients.
            </p>
          </div>

          <Link 
            href="/dashboard/quotations?create=1"
            className="relative z-10 w-fit bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
          >
            <FilePlus className="w-4 h-4" /> 
            Create New Quotation
          </Link>
        </div>

        {/* Reservation Action */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-500 border border-orange-500 rounded-xl p-6 flex flex-col justify-between group shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <CalendarPlus className="w-32 h-32 text-white" />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm mb-4 border border-white/10">
              <CalendarPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1.5">Reservations</h2>
            <p className="text-orange-50 text-xs mb-6 max-w-[85%] font-medium leading-relaxed">
              Book rooms and manage guest stay periods across your property.
            </p>
          </div>

          <Link 
            href="/dashboard/reservations?create=1"
            className="relative z-10 w-fit bg-white hover:bg-orange-50 text-orange-600 px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
          >
            <CalendarPlus className="w-4 h-4" /> 
            Create New Reservation
          </Link>
        </div>

      </div>
    </div>
  );
}
