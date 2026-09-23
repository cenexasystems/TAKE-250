"use client";

import { useEffect, useState, use } from "react";
import { fetchOrderByIdAction } from "@/app/pos/actions";
import { ShoppingBag, MapPin, Phone, Printer, Copy, Check, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

function InstagramIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetchOrderByIdAction(id);
        if (!res || !res.success || !res.data) {
          setError(true);
        } else {
          setOrder(res.data);
          document.title = `Invoice #${res.data.id} - Take250`;
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-black border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <p className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs">Generating Take250 Digital Bill...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-[#D4AF37] font-bold text-xl">Invoice Not Found</p>
        <p className="text-neutral-400 text-xs text-center max-w-sm">The requested invoice ID may be invalid or has not yet synced.</p>
        <Link href="/" className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#F3E5AB] rounded-xl text-black font-extrabold text-xs uppercase tracking-wider transition-colors">
          Return to Store
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-black font-sans py-8 sm:py-12 px-3 sm:px-4 print:p-0 print:bg-white flex flex-col items-center">
      <style>{`
        @media print {
          @page {
            margin: 8mm;
            size: auto;
          }
          body {
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
      
      {/* Top Navigation / Action Bar (Hidden when printing) */}
      <div className="w-full max-w-3xl flex flex-wrap justify-between items-center mb-6 print:hidden gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#262626] text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl border border-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Home</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#262626] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-sm border border-[#D4AF37]/30 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#D4AF37]" /> Copy Link
              </>
            )}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B89730] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2 rounded-xl shadow-[0_2px_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Download / Print Bill
          </button>
        </div>
      </div>

      {/* The Invoice Document */}
      <div className="w-full max-w-3xl bg-white border border-[#D4AF37]/40 rounded-2xl shadow-2xl print:shadow-none print:border print:border-black/20 print:rounded-none overflow-hidden">
        
        {/* Top Gold Border Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-[#8C6D23] via-[#F3E5AB] via-[#D4AF37] to-[#8C6D23]" />

        {/* Header Section */}
        <div className="bg-white border-b border-neutral-200 p-6 sm:p-10 print:p-5 flex flex-col items-center text-center">
          
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black border-2 border-[#D4AF37] p-2 shadow-md flex items-center justify-center mb-3">
            <img src="/icon.png" alt="Take250 Logo" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight uppercase">
            Take<span className="text-[#8C6D23] print:text-black">250</span>shop
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-[#8C6D23] print:text-black tracking-[0.2em] uppercase mt-0.5">
            Dress & Footwear • Style That Fits You
          </p>
          <p className="text-[11px] font-semibold text-neutral-600 mt-0.5">
            Proprietor: <span className="font-bold text-black">M. Ramkumar</span>
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-neutral-700 font-medium max-w-xl">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8C6D23] print:text-black shrink-0" />
              <span>Coco townn, Kinathukadavu, Pollachi Main Rd, Coimbatore - 642109</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-black">
                <Phone className="w-3.5 h-3.5 text-[#8C6D23] print:text-black shrink-0" />
                8883173358 / 7339344149
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1 text-neutral-700">
                <Mail className="w-3.5 h-3.5 text-[#8C6D23] print:text-black shrink-0" />
                take250shop@gmail.com
              </span>
            </div>
          </div>

          <div className="mt-4 px-4 py-1 bg-black text-[#D4AF37] print:bg-neutral-100 print:text-black rounded-full text-xs font-black tracking-widest uppercase border border-[#D4AF37]/50 print:border-black/30">
            TAX INVOICE #{order.id}
          </div>
        </div>

        {/* Invoice Meta Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 sm:p-8 print:p-4 border-b border-neutral-200 bg-[#FAFAFA] print:bg-white">
          <div>
            <h3 className="text-[10px] font-extrabold text-[#8C6D23] print:text-black uppercase tracking-[0.2em] mb-2">Billed To Customer</h3>
            <p className="text-base font-black text-black">{order.customers?.name || "Cash Customer"}</p>
            {order.customers?.phone ? (
              <p className="text-xs font-semibold text-neutral-700 mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#8C6D23] print:text-black" />
                +91 {order.customers.phone.split("_")[0]}
              </p>
            ) : (
              <p className="text-xs text-neutral-500 mt-0.5">Walk-in Customer</p>
            )}
          </div>
          
          <div className="sm:text-right flex flex-col sm:items-end justify-center">
            <h3 className="text-[10px] font-extrabold text-[#8C6D23] print:text-black uppercase tracking-[0.2em] mb-2 self-start sm:self-auto">Order Details</h3>
            <div className="inline-block text-left text-xs space-y-1">
              <div className="flex gap-2">
                <span className="text-neutral-500 font-bold w-14 text-left sm:text-right">Date:</span>
                <span className="text-black font-black">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-neutral-500 font-bold w-14 text-left sm:text-right">Time:</span>
                <span className="text-black font-black">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-neutral-500 font-bold w-14 text-left sm:text-right">Mode:</span>
                <span className="text-black font-black uppercase">{order.source || "STORE"} SALE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6 sm:p-8 print:py-3 print:px-4">
          <div className="w-full overflow-x-auto scrollbar-thin pb-2">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b-2 border-black bg-neutral-900 text-white print:bg-neutral-100 print:text-black">
                  <th className="py-3 px-3 text-[10px] font-black uppercase tracking-wider">#</th>
                  <th className="py-3 px-3 text-[10px] font-black uppercase tracking-wider">Item Description</th>
                  <th className="py-3 px-3 text-[10px] font-black uppercase tracking-wider text-center">Qty</th>
                  <th className="py-3 px-3 text-[10px] font-black uppercase tracking-wider text-right">Price</th>
                  <th className="py-3 px-3 text-[10px] font-black uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.order_items.map((item: any, index: number) => (
                  <tr key={index} className="hover:bg-neutral-50/50">
                    <td className="py-4 px-3 text-xs font-bold text-neutral-500">{index + 1}</td>
                    <td className="py-4 px-3">
                      <p className="text-sm font-bold text-black">{item.snapshot_name}</p>
                    </td>
                    <td className="py-4 px-3 text-center text-sm font-bold text-black">{item.quantity}</td>
                    <td className="py-4 px-3 text-right text-sm font-medium text-neutral-800">₹{item.snapshot_price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-3 text-right text-sm font-black text-black">₹{(item.snapshot_price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section */}
        <div className="bg-[#FAF8F5] print:bg-white border-t-2 border-neutral-200 p-6 sm:p-8 print:p-4 flex justify-end">
          <div className="w-full sm:w-1/2 space-y-2.5">
            {(order.discount_amount > 0 || order.delivery_fee > 0) && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-600 font-bold uppercase tracking-wider">Subtotal</span>
                <span className="font-bold text-black">₹{order.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            )}
            
            {order.discount_amount > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-600 font-bold uppercase tracking-wider">
                  Discount {order.discount_type === 'PERCENT' ? `(${order.discount_value}%)` : ''}
                </span>
                <span className="font-bold text-red-600">-₹{order.discount_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            )}

            {order.delivery_fee > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-600 font-bold uppercase tracking-wider">Delivery / Packaging</span>
                <span className="font-bold text-black">₹{order.delivery_fee.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            )}

            <div className="border-t-2 border-black pt-3 mt-1 flex justify-between items-center bg-black text-[#D4AF37] print:bg-white print:text-black print:border-t-2 px-4 py-3 rounded-xl">
              <div>
                <span className="text-xs font-black uppercase tracking-widest block">Grand Total</span>
                <span className="text-[10px] text-white/70 print:text-neutral-500 font-normal">All taxes included</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-[#F3E5AB] print:text-black">
                ₹{order.grand_total.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </span>
            </div>
          </div>
        </div>

        {/* Bill Footer & Shop Signoff */}
        <div className="border-t border-neutral-200 p-6 print:p-4 text-center bg-black text-white print:bg-white print:text-black flex flex-col items-center justify-center gap-2">
          <p className="text-xs sm:text-sm font-black text-[#D4AF37] print:text-black tracking-wider uppercase">
            Thank you for shopping at Take250shop dress & footwear!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-neutral-300 print:text-neutral-600">
            <span>Proprietor: M. Ramkumar</span>
            <span>•</span>
            <span>Helpline: 8883173358 / 7339344149</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[#D4AF37] print:text-black font-semibold">
              <InstagramIcon className="w-3 h-3" />
              @take.250shop
            </span>
          </div>
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
            Exchange policy: Valid with bill within 7 days • Goods once sold are acknowledged
          </p>
        </div>

      </div>
    </div>
  );
}
