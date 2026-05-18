"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, FileText, Download, AlertCircle } from 'lucide-react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFWrapper from '@/components/dashboard/pdf/PDFWrapper';
import { getApiUrl } from '@/lib/api';

function MagicPDFContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const encodedData = searchParams.get('d');
    if (encodedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(window.atob(encodedData))));
        setData(decoded);
        fetchSettings();
      } catch (err) {
        console.error("Decode Error:", err);
        setError("Invalid link format.");
        setLoading(false);
      }
    } else {
      setError("No document data found in link.");
      setLoading(false);
    }
  }, [searchParams]);

  const fetchSettings = async () => {
    try {
      // Fetch Settings for Branding
      const settingsRes = await fetch(getApiUrl("settings"));
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const s = settingsData.settings || (Array.isArray(settingsData) ? settingsData[0] : settingsData);
        setSettings(s);
      }
    } catch (err) {
      console.error("Settings Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Generating Document...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-4 text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Link Invalid</h1>
        <p className="text-gray-500 max-w-xs mx-auto mb-6">{error}</p>
      </div>
    );
  }

  const fileName = `${data.bookingId || 'DOC'} - ${data.clientName || 'GUEST'}.pdf`;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm z-10">
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
          className="bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-600/20 active:scale-95 cursor-pointer transition-all flex items-center gap-2"
        >
          {({ loading }) => (
            <>
              <Download className="w-4 h-4" />
              <span>{loading ? "..." : "Download PDF"}</span>
            </>
          )}
        </PDFDownloadLink>
      </div>

      {/* PDF Content */}
      <div className="flex-1 relative overflow-hidden bg-slate-800">
        <div className="absolute inset-0 overflow-auto flex justify-center p-0 md:p-8">
          <div className="w-full max-w-4xl bg-white shadow-2xl h-fit">
            <PDFViewer width="100%" height="800px" style={{ border: 'none', minHeight: '85vh' }} showToolbar={false}>
              <PDFWrapper data={data} settings={settings} />
            </PDFViewer>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="bg-white/5 backdrop-blur-md py-4 px-6 text-center text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
        Managed by Avan Homes Dashboard
      </div>
    </div>
  );
}

export default function MagicPDFView() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Initializing...</p>
      </div>
    }>
      <MagicPDFContent />
    </Suspense>
  );
}

