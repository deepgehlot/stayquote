"use client";

import React from "react";
import {
  ListChecks,
  Plus,
  Bed,
  Edit2,
  Trash2,
  Sparkles,
  Hash,
} from "lucide-react";

interface MasterInventoryProps {
  roomList: any[];
  serviceList: any[];
  setIsRoomModalOpen: (val: boolean) => void;
  setIsServiceModalOpen: (val: boolean) => void;
  setSelectedRoomForEdit: (room: any) => void;
  setSelectedServiceForEdit: (service: any) => void;
  handleRoomDelete: (room: any) => void;
  handleServiceDelete: (service: any) => void;
}

export default function MasterInventory({
  roomList,
  serviceList,
  setIsRoomModalOpen,
  setIsServiceModalOpen,
  setSelectedRoomForEdit,
  setSelectedServiceForEdit,
  handleRoomDelete,
  handleServiceDelete,
}: MasterInventoryProps) {
  return (
    <section id="inventory">
      <div className="bg-white border border-slate-100 rounded-[2rem] p-5 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 border-b border-slate-50 text-center md:text-left">
            <ListChecks className="w-10 h-10 text-orange-600 shrink-0" />
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Master Inventory
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Manage the available room types and extra services for your
                bookings.
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {/* Vertical Breaker (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-900 -translate-x-1/2 opacity-20" />

            {/* Room Categories */}
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <Bed className="w-8 h-8 text-orange-600 shrink-0" />
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Room Categories
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {roomList.length} Active Types
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsRoomModalOpen(true)}
                  className="flex items-center justify-center lg:gap-2 p-3 lg:px-5 lg:py-2.5 bg-gray-900 hover:bg-orange-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-orange-600/20 text-xs font-black uppercase tracking-widest active:scale-95 group shrink-0"
                >
                  <Plus className="w-5 h-5 lg:w-4 lg:h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden lg:inline">Add Room</span>
                </button>
              </div>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-3 custom-scrollbar scrollbar-hide lg:scrollbar-default">
                {roomList.map((room, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between py-2.5 px-4 bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-orange-500/30 border-r-4 border-r-orange-600 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-50 transition-colors duration-300">
                        <Bed className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                          {typeof room === "string" ? room : room.name}
                        </span>
                        {typeof room !== "string" && (
                          <div className="flex items-center gap-2 mt-0.5">
                            <Hash className="w-2.5 h-2.5 text-slate-300" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {room.totalRooms} Units
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all translate-x-0 lg:translate-x-2 lg:group-hover:translate-x-0">
                      <button
                        onClick={() => {
                          setSelectedRoomForEdit(room);
                          setIsRoomModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRoomDelete(room)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-red-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {roomList.length === 0 && (
                  <div className="py-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                    <Bed className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                    <p className="text-xs text-slate-400 font-medium">
                      No room types configured yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Extra Services */}
            <div className="space-y-8 pt-12 md:pt-0 border-t border-gray-900/10 md:border-t-0">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-8 h-8 text-orange-600 shrink-0" />
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Service Inventory
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {serviceList.length} Active Services
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedServiceForEdit(null);
                    setIsServiceModalOpen(true);
                  }}
                  className="flex items-center justify-center lg:gap-2 p-3 lg:px-5 lg:py-2.5 bg-gray-900 hover:bg-orange-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-orange-600/20 text-xs font-black uppercase tracking-widest active:scale-95 group shrink-0"
                >
                  <Plus className="w-5 h-5 lg:w-4 lg:h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden lg:inline">Add Service</span>
                </button>
              </div>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar scrollbar-hide lg:scrollbar-default">
                {serviceList.map((service, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between py-2.5 px-4 bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-orange-500/30 border-r-4 border-r-orange-600 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-50 transition-colors duration-300">
                        <Sparkles className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                          {typeof service === "string" ? service : service.name}
                        </span>
                        {typeof service !== "string" && service.price > 0 && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-orange-600 font-black">
                              ₹{service.price}
                            </span>
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                              / unit
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all translate-x-0 lg:translate-x-2 lg:group-hover:translate-x-0">
                      <button
                        onClick={() => {
                          setSelectedServiceForEdit(service);
                          setIsServiceModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleServiceDelete(service)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-red-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {serviceList.length === 0 && (
                  <div className="py-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                    <Sparkles className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                    <p className="text-xs text-slate-400 font-medium">
                      No services added yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
