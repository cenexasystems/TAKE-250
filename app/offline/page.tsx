"use client";

import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] font-sans flex flex-col justify-between selection:bg-[#6B1422] selection:text-white">
      {/* Header */}
      <header className="border-b border-black/10 py-6 px-6 sm:px-12 flex justify-center items-center bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xs p-1 border border-black/10">
            <img src="/icon-192.png" alt="Zera Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-sm font-black text-[#6B1422] tracking-wider uppercase block">
              Zera
            </span>
            <span className="text-[9px] text-[#852233] font-bold tracking-widest block uppercase -mt-0.5">
              Premium Shawls & Apparel
            </span>
          </div>
        </div>
      </header>

      {/* Main Offline Card */}
      <main className="flex-1 max-w-lg mx-auto w-full px-6 flex flex-col justify-center items-center py-16">
        <div className="bg-white border border-black/10 rounded-2xl p-8 sm:p-12 shadow-sm w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#6B1422]" />

          <div className="w-16 h-16 rounded-full bg-[#6B1422]/10 border border-[#6B1422]/20 flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-8 h-8 text-[#6B1422]" />
          </div>

          <span className="inline-block px-3 py-1 bg-[#6B1422]/10 border border-[#6B1422]/20 text-[#6B1422] text-[10px] font-bold rounded-full tracking-wider uppercase mb-3">
            Offline Mode
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-[#6B1422] leading-tight tracking-tight mb-2">
            No Internet Connection
          </h1>
          <p className="text-xs text-black/60 font-medium leading-relaxed mb-8 max-w-xs mx-auto">
            You are currently offline. Please check your network connection to access all live billing data and invoices.
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-[#6B1422] hover:bg-[#852233] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>

            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-black/5 hover:bg-black/10 text-[#1A1A1A] rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 py-6 text-center bg-white">
        <p className="text-[10px] font-bold text-[#6B1422] tracking-widest uppercase">
          Zera • Offline Fallback
        </p>
        <p className="text-[9px] font-semibold text-black/40 uppercase tracking-wider mt-1">
          © {new Date().getFullYear()} All Rights Reserved • Powered by Cenexa Systems
        </p>
      </footer>
    </div>
  );
}
