import { ShoppingBag, MapPin, Clock, Phone, Mail, ExternalLink, Sparkles, User, Shirt, Footprints, ShieldCheck } from "lucide-react";
import Link from "next/link";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Home() {
  const instagramUrl = "https://www.instagram.com/take.250shop?stkn=MW1pMHQ2aTdoZzkwZQ==";

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      {/* Top Gold Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8C6D23] via-[#F3E5AB] via-[#D4AF37] to-[#8C6D23]" />

      {/* Header */}
      <header className="border-b border-[#D4AF37]/20 py-4 px-6 sm:px-12 flex justify-between items-center bg-[#0d0d0d]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black border border-[#D4AF37]/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] overflow-hidden">
            <img src="/icon.png" alt="Take250 Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-base font-black text-white tracking-wider uppercase block">
              Take<span className="text-[#D4AF37]">250</span>
            </span>
            <span className="text-[10px] text-[#D4AF37] font-bold tracking-widest block uppercase -mt-0.5">
              Dress & Footwear
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold transition-all"
            title="Follow on Instagram"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <Link
            href="/pos/admin/secure/control-panel/take250"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B89730] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-[0_2px_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>POS Billing</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col items-center">
        
        {/* Hero Card */}
        <div className="relative w-full bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-center">
          
          {/* Subtle gold glow behind logo */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Badge */}
          <div className="relative inline-block mb-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full bg-black border-2 border-[#D4AF37] p-2 shadow-[0_0_30px_rgba(212,175,55,0.25)] flex items-center justify-center">
              <img src="/icon.png" alt="Take250 Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold rounded-full tracking-widest uppercase mb-4">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Official Store Portal
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-2">
            Take<span className="text-[#D4AF37]">250</span>shop
          </h1>
          <p className="text-sm sm:text-base font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-4">
            Dress & Footwear • Style That Fits You
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed mb-8">
            Coimbatore's premium destination for shirts, trendy apparel, and curated footwear.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <a
              href="tel:8883173358"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] text-xs font-bold transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              Call: 8883173358
            </a>
            <a
              href="tel:7339344149"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] text-xs font-bold transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              Shop: 7339344149
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black text-xs font-bold transition-all"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              @take.250shop
            </a>
          </div>

          {/* Store Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left border-t border-[#D4AF37]/20 pt-8">
            
            {/* Proprietor & Contact */}
            <div className="bg-black/60 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Proprietor</p>
                  <p className="text-sm font-bold text-white">M. Ramkumar</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</p>
                  <a href="mailto:take250shop@gmail.com" className="text-sm font-medium text-white hover:text-[#D4AF37] transition-colors">
                    take250shop@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Business Hours</p>
                  <p className="text-sm font-medium text-white">Open Daily: 9:30 AM - 9:30 PM</p>
                </div>
              </div>
            </div>

            {/* Shop Address */}
            <div className="bg-black/60 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Store Address</p>
                  <p className="text-sm font-bold text-white leading-relaxed">
                    Take250shop
                  </p>
                  <p className="text-xs text-neutral-300 leading-relaxed mt-0.5">
                    Coco townn, Kinathukadavu,<br />
                    Pollachi Main road,<br />
                    Coimbatore, Tamil Nadu - 642109
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">Kinathukadavu, Coimbatore</span>
                <a
                  href="https://maps.google.com/?q=Kinathukadavu,+Pollachi+Main+road,+Coimbatore+642109"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] hover:underline"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Product Catalogue Section */}
          <div className="mt-8 pt-8 border-t border-[#D4AF37]/20">
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em] mb-4 text-center">
              Product Catalogue Highlights
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="bg-neutral-950/70 border border-neutral-800/80 p-3.5 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Men's Shirts</p>
                  <p className="text-[10px] text-neutral-400">Casual & Formal</p>
                </div>
              </div>
              <div className="bg-neutral-950/70 border border-neutral-800/80 p-3.5 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Footwear</p>
                  <p className="text-[10px] text-neutral-400">Trendy & Durable</p>
                </div>
              </div>
              <div className="bg-neutral-950/70 border border-neutral-800/80 p-3.5 rounded-xl flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Best Quality</p>
                  <p className="text-[10px] text-neutral-400">Affordable Pricing</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/20 py-6 text-center bg-[#0a0a0a]">
        <p className="text-[11px] font-bold text-[#D4AF37] tracking-widest uppercase">
          Take250shop dress & footwear • Kinathukadavu, Coimbatore
        </p>
        <p className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider mt-1.5">
          Proprietor: M. Ramkumar • Ph: 8883173358 / 7339344149 • © {new Date().getFullYear()} Take250
        </p>
      </footer>
    </div>
  );
}
