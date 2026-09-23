"use client";

import { useEffect, useState, use } from "react";
import { fetchOrderByIdAction } from "@/app/pos/actions";
import { ShoppingBag, Printer, Copy, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

function formatReceiptDate(dateStr: string | Date | undefined) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = hours.toString().padStart(2, "0");
    return `${day} ${month} ${year}, ${hoursStr}:${minutes} ${ampm}`;
  } catch {
    return String(dateStr);
  }
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

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetchOrderByIdAction(id);
        if (!res || !res.success || !res.data) {
          setError(true);
        } else {
          setOrder(res.data);
          document.title = `Invoice #${res.data.id} - Take 250 Shirt Shop`;
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

  useEffect(() => {
    if (order && typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("print") === "true" || window.location.hash === "#print") {
        const timer = setTimeout(() => {
          window.print();
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-black border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <p className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs">Generating Take 250 Bill...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-[#D4AF37] font-bold text-xl">Invoice Not Found</p>
        <p className="text-neutral-400 text-xs text-center max-w-sm">The requested invoice #{id} may be invalid or has not yet synced.</p>
        <Link href="/" className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#F3E5AB] rounded-xl text-black font-extrabold text-xs uppercase tracking-wider transition-colors">
          Return to Store
        </Link>
      </div>
    );
  }

  const rawItems = order.order_items || [];
  const normalItems = rawItems.filter((i: any) => !i.snapshot_name?.startsWith("GST"));
  const gstItem = rawItems.find((i: any) => i.snapshot_name?.startsWith("GST"));
  const gstAmount = gstItem ? (gstItem.snapshot_price * gstItem.quantity) : 0;
  const gstLabel = gstItem ? gstItem.snapshot_name : "GST";

  const hasDiscount = (order.discount_amount || 0) > 0;
  const hasDelivery = (order.delivery_fee || 0) > 0;
  const hasGst = gstAmount > 0;

  const customerName = order.customers?.name || "Cash Customer";
  const rawPhone = order.customers?.phone ? order.customers.phone.split("_")[0] : "";
  const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);
  const displayPhone = cleanPhone ? `+91 ${cleanPhone}` : "Walk-in";

  const handleWhatsAppShare = () => {
    const domain = window.location.origin;
    const invoiceUrl = `${domain}/invoice/${order.id}`;
    let message = `✨ *Take250shop dress & footwear* ✨\n*Proprietor:* M.Ramkumar\n*take250shop, Thanjavur main road, Karanthai, Pincode: 613002*\n*Contact:* 8883173358 / 7339344149\n*Email:* take250shop@gmail.com\n\n`;
    message += `✅ Here are your invoice details!\n\n`;
    message += `*Invoice #:* ${order.id}\n`;
    message += `*Total Amount:* ₹${order.grand_total.toFixed(2)}\n\n`;
    message += `📦 View and download your detailed digital receipt here:\n${invoiceUrl}`;
    const encoded = encodeURIComponent(message);
    const url = cleanPhone
      ? `https://api.whatsapp.com/send/?phone=91${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send/?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-black font-mono py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center print:bg-white print:p-0 print:m-0">
      <style>{`
        @media print {
          @page {
            margin: 2mm;
            size: auto;
          }
          html, body {
            background-color: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-hide {
            display: none !important;
          }
          .thermal-bill {
            width: 100% !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            padding: 2mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Top Action Bar (Hidden on print) */}
      <div className="print-hide w-full max-w-[420px] flex flex-wrap justify-between items-center mb-4 gap-2">
        <Link
          href="/pos/admin/secure/control-panel/zera"
          className="flex items-center gap-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-lg border border-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>POS</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyLink}
            title="Copy invoice link"
            className="flex items-center gap-1 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-neutral-300 hover:text-white font-semibold text-xs px-2.5 py-2 rounded-lg border border-neutral-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppShare}
            title="Share via WhatsApp"
            className="flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-extrabold text-xs uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Bill</span>
          </button>
        </div>
      </div>

      {/* Thermal Receipt Bill Card */}
      <div className="thermal-bill w-full max-w-[420px] bg-white text-black p-5 sm:p-7 rounded-sm shadow-xl border border-neutral-300 print:shadow-none print:border-none print:p-0 print:max-w-[80mm]">
        
        {/* Header & Logo */}
        <div className="text-center flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Take 250 Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-1.5"
          />
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-tight text-black">
            Take250shop dress & footwear
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-black">
            M.Ramkumar
          </p>
          <p className="text-[10px] leading-tight text-neutral-800 max-w-[320px] mx-auto mt-0.5">
            take250shop,
            <br />
            Thanjavur main road, Karanthai,
            <br />
            Pincode: 613002
          </p>
          <p className="text-[10px] font-medium text-black mt-0.5">
            Ph: 8883173358 / 7339344149
          </p>
          <p className="text-[10px] text-neutral-800">
            Email: take250shop@gmail.com
          </p>
        </div>

        {/* Dashed Separator */}
        <div className="border-b border-dashed border-black/80 my-2" />

        {/* Invoice Info */}
        <div className="text-[11px] leading-relaxed">
          <div className="flex justify-between">
            <span>Inv: #{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Date: {formatReceiptDate(order.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span>Name: {customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Tel: {displayPhone}</span>
          </div>
        </div>

        {/* Dashed Separator */}
        <div className="border-b border-dashed border-black/80 my-2" />

        {/* Items Table Header */}
        <div className="flex justify-between text-[11px] font-bold pb-0.5">
          <span className="flex-1 text-left">Item</span>
          <span className="w-12 text-center">Qty</span>
          <span className="w-20 text-right">Total</span>
        </div>

        {/* Dashed Separator */}
        <div className="border-b border-dashed border-black/80 mb-2" />

        {/* Items Rows */}
        <div className="space-y-1.5 text-[11px]">
          {normalItems.map((item: any, idx: number) => {
            const itemTotal = item.snapshot_price * item.quantity;
            return (
              <div key={idx}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="uppercase flex-1 text-left break-words">
                    {item.snapshot_name}
                  </span>
                  <span className="w-12 text-center shrink-0">
                    {item.quantity}
                  </span>
                  <span className="text-right shrink-0 w-20">
                    ₹{itemTotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-700 pl-0.5">
                  ₹{item.snapshot_price.toFixed(2)}
                  {item.quantity > 1 ? ` x ${item.quantity}` : ""}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashed Separator */}
        <div className="border-b border-dashed border-black/80 my-2" />

        {/* Calculations / Breakdown */}
        <div className="text-[11px] space-y-1">
          {(hasDiscount || hasDelivery || hasGst) && (
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
          )}

          {hasDiscount && (
            <div className="flex justify-between text-neutral-800">
              <span>Discount {order.discount_type === "PERCENT" ? `(${order.discount_value}%)` : ""}</span>
              <span>-₹{order.discount_amount.toFixed(2)}</span>
            </div>
          )}

          {hasDelivery && (
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{order.delivery_fee.toFixed(2)}</span>
            </div>
          )}

          {hasGst && (
            <div className="flex justify-between">
              <span>{gstLabel}</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
          )}

          {(hasDiscount || hasDelivery || hasGst) && (
            <div className="border-b border-dashed border-black/60 my-1" />
          )}

          <div className="flex justify-between text-xs font-bold pt-0.5">
            <span>Total</span>
            <span>₹{order.grand_total.toFixed(2)}</span>
          </div>

          {order.cash_received > 0 && (
            <>
              <div className="border-b border-dashed border-black/40 my-1" />
              <div className="flex justify-between text-[10px] text-neutral-800">
                <span>Amount Received</span>
                <span>₹{order.cash_received.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-black">
                <span>Balance Returned</span>
                <span>₹{Math.max(0, order.cash_received - order.grand_total).toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Dashed Separator */}
        <div className="border-b border-dashed border-black/80 my-2.5" />

        {/* Receipt Footer */}
        <div className="text-center text-[10px] space-y-0.5 text-neutral-800 pt-1">
          <p className="font-bold">Thank you for visiting!</p>
          <p>Visit again</p>
          <p className="text-[9px] text-neutral-600 mt-1">@take.250shop • Style That Fits You</p>
        </div>

      </div>
    </div>
  );
}
