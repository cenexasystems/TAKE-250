"use client";

import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      {/* Top Gold Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8C6D23] via-[#F3E5AB] via-[#D4AF37] to-[#8C6D23]" />

      {/* Header */}
      <header className="border-b border-[#D4AF37]/20 py-4 px-6 sm:px-12 flex justify-center items-center bg-[#0d0d0d]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/40 p-1 flex items-center justify-center shadow-sm">
            <img src="/icon.png" alt="Take250 Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-sm font-black text-white tracking-wider uppercase block">
              Take<span className="text-[#D4AF37]">250</span>
            </span>
            <span className="text-[9px] text-[#D4AF37] font-bold tracking-widest block uppercase -mt-0.5">
              Dress & Footwear
            </span>
          </div>
        </div>
      </header>

      {/* Main Offline Card */}
      <main className="flex-1 max-w-lg mx-auto w-full px-6 flex flex-col justify-center items-center py-16">
        <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-12 shadow-2xl w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B89730]" />

          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <span className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold rounded-full tracking-wider uppercase mb-3">
            Offline Mode
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-2">
            No Internet Connection
          </h1>
          <p className="text-xs text-neutral-400 font-medium leading-relaxed mb-8 max-w-xs mx-auto">
            You are currently offline. Please check your network connection to access live cloud data and synced invoices.
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#B89730] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>

            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-neutral-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Store
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/20 py-6 text-center bg-[#0a0a0a]">
        <p className="text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase">
          Take250shop dress & footwear • Karanthai, Thanjavur
        </p>
        <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider mt-1">
          © {new Date().getFullYear()} Take250. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
