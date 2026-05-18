"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, FileText, Download, AlertCircle } from 'lucide-react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFWrapper from '@/components/dashboard/pdf/PDFWrapper';
import { getApiUrl } from '@/lib/api';

export default function PublicPDFView() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Booking Data
      const bookingRes = await fetch(getApiUrl(`bookings/${id}`));
      if (!bookingRes.ok) throw new Error("Could not find document details.");
      const bookingData = await bookingRes.json();
      
      // Handle the nested structure of the API response
      const actualData = bookingData.booking || bookingData;
      setData(actualData);

      // 2. Fetch Settings for Branding
      const settingsRes = await fetch(getApiUrl("settings"));
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const s = settingsData.settings || (Array.isArray(settingsData) ? settingsData[0] : settingsData);
        setSettings(s);
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Loading Document...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Document Not Found</h1>
        <p className="text-gray-500 max-w-xs mx-auto mb-6">
          The link might be expired or the document is no longer available.
        </p>
      </div>
    );
  }

  const fileName = `${data.bookingId || 'DOC'} - ${data.clientName || 'GUEST'}.pdf`;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">
              {data.type === 'quotation' ? 'Quotation' : 'Reservation'}
            </h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {data.bookingId}
            </p>
          </div>
        </div>

        <PDFDownloadLink
          document={<PDFWrapper data={data} settings={settings} />}
          fileName={fileName}
          className="bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-600/20 active:scale-95 transition-all flex items-center gap-2"
        >
          {({ loading }) => (
            <>
              <Download className="w-4 h-4" />
              <span>{loading ? "..." : "Download"}</span>
            </>
          )}
        </PDFDownloadLink>
      </div>

      {/* PDF Content */}
      <div className="flex-1 relative overflow-hidden bg-slate-800">
        <div className="absolute inset-0 overflow-auto flex justify-center p-4 md:p-8">
          <div className="w-full max-w-4xl bg-white shadow-2xl h-fit">
            {/* On mobile, PDFViewer doesn't always work well, so we show a preview card or the viewer on desktop */}
            <PDFViewer width="100%" height="800px" style={{ border: 'none', minHeight: '80vh' }} showToolbar={false}>
              <PDFWrapper data={data} settings={settings} />
            </PDFViewer>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="bg-white/5 backdrop-blur-md py-4 px-6 text-center text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
        Powered by Avan Homes Dashboard
      </div>
    </div>
  );
}
