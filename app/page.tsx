import { ShoppingBag, MapPin, Clock, Phone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] font-sans flex flex-col justify-between selection:bg-[#6B1422] selection:text-white">
      {/* Header */}
      <header className="border-b border-black/10 py-6 px-6 sm:px-12 flex justify-center items-center bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xs p-1 border border-black/10">
            <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" />
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

      {/* Main Info */}
      <main className="flex-1 max-w-xl mx-auto w-full px-6 flex flex-col justify-center items-center py-16">
        <div className="bg-white border border-black/10 rounded-2xl p-8 sm:p-12 shadow-sm w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#6B1422]" />
          
          <span className="inline-block px-3 py-1 bg-[#6B1422]/10 border border-[#6B1422]/20 text-[#6B1422] text-[10px] font-bold rounded-full tracking-wider uppercase mb-6">
            Store Directory & Contacts
          </span>
          
          <h1 className="text-3xl font-black text-[#6B1422] leading-tight tracking-tight mb-2">
            Zera
          </h1>
          <p className="text-xs text-[#852233] font-black tracking-widest uppercase mb-8">
            Shawls & Apparel
          </p>

          <div className="space-y-6 text-left max-w-sm mx-auto text-sm font-semibold text-[#1A1A1A]/80 border-t border-black/10 pt-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#6B1422] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-black/50 uppercase tracking-wider mb-0.5">Address</p>
                <p className="text-[#1A1A1A] leading-relaxed">
                  Kurinji Nagar, Brindhavan Circle, Kuniyamuthur, Coimbatore.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[#6B1422] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-black/50 uppercase tracking-wider mb-0.5">Phone Number</p>
                <p className="text-[#1A1A1A]">
                  +91 9342489391
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#6B1422] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-black/50 uppercase tracking-wider mb-0.5">Business Hours</p>
                <p className="text-[#1A1A1A]">
                  Open Daily: 10:00 AM - 9:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 py-6 text-center bg-white">
        <p className="text-[10px] font-bold text-[#6B1422] tracking-widest uppercase">
          Zera • Coimbatore
        </p>
        <p className="text-[9px] font-semibold text-black/40 uppercase tracking-wider mt-1">
          © {new Date().getFullYear()} All Rights Reserved • Powered by Cenexa Systems
        </p>
      </footer>
    </div>
  );
}
