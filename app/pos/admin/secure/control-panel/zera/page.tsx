"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Receipt,
  Search,
  ChevronDown,
  X,
  PackagePlus,
  ShoppingBag,
  Trash2,
  Plus,
  TrendingUp,
  Trophy,
  IndianRupee,
  BarChart2,
  Package,
  List,
  Globe,
  Zap,
  Smartphone,
  CheckCircle2,
  Wallet,
  Menu,
  Printer,
  History,
  ChevronLeft,
  ChevronRight,
  Percent,
  Calendar,
  Download,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  Shield,
  Lock,
  Pencil,
} from "lucide-react";
import {
  verifyPasscode,
  fetchProductsAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
  createOrderAction,
  fetchOrdersAction,
  checkOrderIdExistsAction,
  deleteOrderAction,
} from "@/app/pos/actions";

type CatalogItem = {
  id: string;
  name: string;
  desc?: string;
  price?: number;
};

type OrderItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  qty: number;
};

type CompletedOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  source: "ONLINE" | "OFFLINE";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountType?: "PERCENT" | "FIXED";
  discountValue?: number;
  deliveryFee: number;
  grandTotal: number;
  cashReceived: number;
  paymentMethod: "cash" | "gpay" | "split";
  cashAmount: number;
  gpayAmount: number;
  date: string;
  status: "Completed" | "Pending";
};

const SearchableItemInput = ({
  item,
  catalog,
  updateItem,
}: {
  item: OrderItem;
  catalog: CatalogItem[];
  updateItem: (id: string, field: keyof OrderItem, value: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCatalog = catalog.filter(
    (c) =>
      c.name.toLowerCase().includes(internalSearch.toLowerCase()) ||
      (c.desc && c.desc.toLowerCase().includes(internalSearch.toLowerCase())),
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [internalSearch, isOpen]);

  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      const activeItem = listRef.current.children[selectedIndex] as HTMLElement;
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== "Escape") {
      setIsOpen(true);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCatalog.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCatalog[selectedIndex]) {
        const catItem = filteredCatalog[selectedIndex];
        updateItem(item.id, "name", catItem.name);
        updateItem(item.id, "desc", catItem.desc || "");
        if (catItem.price !== undefined) {
          updateItem(item.id, "price", catItem.price);
        }
        setIsOpen(false);
        setTimeout(() => {
          const priceInput = document.getElementById(`price-${item.id}`);
          if (priceInput) priceInput.focus();
        }, 50);
      } else if (internalSearch.trim()) {
        updateItem(item.id, "name", internalSearch.trim());
        updateItem(item.id, "desc", "");
        setIsOpen(false);
        setTimeout(() => {
          const priceInput = document.getElementById(`price-${item.id}`);
          if (priceInput) priceInput.focus();
        }, 50);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className={`relative cursor-pointer bg-[#FFFFFF] border ${isOpen ? "border-black/10 bg-white" : "border-black/10"} hover:border-black/10 rounded-lg px-4 py-2.5 transition-colors flex justify-between items-center group`}
        onClick={() => {
          setIsOpen(!isOpen);
          setInternalSearch("");
        }}
      >
        <div className="flex-1">
          <div className="font-semibold text-[#000000] text-sm">
            {item.name || (
              <span className="text-[#000000] font-normal">
                Select an item...
              </span>
            )}
          </div>
          {item.desc && !isOpen && (
            <div className="text-[10px] text-[#000000] mt-0.5">{item.desc}</div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#000000] group-hover:text-[#B89730] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#FFFFFF] border border-black/10 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-black/10 bg-[#FFFFFF]">
            <div className="bg-[#FFFFFF] flex items-center px-3 py-2 rounded-md">
              <Search className="w-4 h-4 text-[#000000] mr-2" />
              <input
                type="text"
                placeholder="Search shirts & footwear..."
                className="w-full bg-transparent text-[#000000] text-sm focus:outline-none placeholder:text-[#000000]"
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCatalog.length > 0 ? (
              <ul className="py-1" ref={listRef}>
                {filteredCatalog.map((catItem, idx) => (
                  <li
                    key={catItem.id}
                    className={`px-5 py-3 cursor-pointer border-b border-transparent last:border-0 transition-colors ${idx === selectedIndex ? "bg-[#FFFFFF] border-l-4 border-l-[#8C6D23]" : "hover:bg-[#FFFFFF] border-l-4 border-l-transparent"}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      updateItem(item.id, "name", catItem.name);
                      updateItem(item.id, "desc", catItem.desc || "");
                      if (catItem.price !== undefined) {
                        updateItem(item.id, "price", catItem.price);
                      }
                      setIsOpen(false);
                      setTimeout(() => {
                        const priceInput = document.getElementById(
                          `price-${item.id}`,
                        );
                        if (priceInput) priceInput.focus();
                      }, 50);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      updateItem(item.id, "name", catItem.name);
                      updateItem(item.id, "desc", catItem.desc || "");
                      if (catItem.price !== undefined) {
                        updateItem(item.id, "price", catItem.price);
                      }
                      setIsOpen(false);
                      setTimeout(() => {
                        const priceInput = document.getElementById(
                          `price-${item.id}`,
                        );
                        if (priceInput) priceInput.focus();
                      }, 50);
                    }}
                    onClick={() => {
                      updateItem(item.id, "name", catItem.name);
                      updateItem(item.id, "desc", catItem.desc || "");
                      if (catItem.price !== undefined) {
                        updateItem(item.id, "price", catItem.price);
                      }
                      setIsOpen(false);
                      setTimeout(() => {
                        const priceInput = document.getElementById(
                          `price-${item.id}`,
                        );
                        if (priceInput) priceInput.focus();
                      }, 50);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="text-sm font-bold text-[#000000]">
                      {catItem.name}
                    </div>
                    {catItem.desc && (
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#000000] mt-1">
                        {catItem.desc}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-6 text-sm text-[#000000] text-center font-semibold">
                Press Enter to use "{internalSearch}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function POSBilling() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [role, setRole] = useState<'staff' | 'admin' | null>(null);
  const [passcode, setPasscode] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string>("");
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<
    "billing" | "orders" | "analytics"
  >("billing");
  const [isOnline, setIsOnline] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { id: "1", name: "", desc: "", price: 0, qty: 1 },
  ]);
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"fixed" | "percent">(
    "fixed",
  );
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gpay" | "split">("cash");
  const [splitCashAmount, setSplitCashAmount] = useState<number | "">("");
  const [splitGpayAmount, setSplitGpayAmount] = useState<number | "">("");
  const [applyGST, setApplyGST] = useState<boolean>(false);
  const [gstPercentage, setGstPercentage] = useState<number>(18);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [showBillGenerated, setShowBillGenerated] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<CompletedOrder | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const isSubmittingOrderRef = useRef(false);

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Analytics filter/navigation states
  const [analyticsPeriod, setAnalyticsPeriod] = useState<
    "all" | "today" | "week" | "month" | "year" | "custom"
  >("all");
  const [analyticsStartDate, setAnalyticsStartDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [analyticsEndDate, setAnalyticsEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [analyticsSubTab, setAnalyticsSubTab] = useState<
    "revenue" | "today" | "products" | "coupons"
  >("revenue");
  const [analyticsSearchPhone, setAnalyticsSearchPhone] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [couponSearchQuery, setCouponSearchQuery] = useState("");

  useEffect(() => {
    const auth =
      sessionStorage.getItem("pos_authorized") ||
      localStorage.getItem("pos_authorized");
    const storedRole = 
      sessionStorage.getItem("pos_role") ||
      localStorage.getItem("pos_role");
      
    if (auth === "true") {
      sessionStorage.setItem("pos_authorized", "true");
      if (storedRole) {
        sessionStorage.setItem("pos_role", storedRole);
        setRole(storedRole as 'staff' | 'admin');
        if (storedRole === 'staff') {
          setActiveTab('billing');
        }
      } else {
        setRole('admin');
      }
      setIsAuthorized(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleVerifyPasscode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = await verifyPasscode(passcode);
    if (result && result.success) {
      sessionStorage.setItem("pos_authorized", "true");
      sessionStorage.setItem("pos_role", result.role || "admin");
      setRole(result.role as 'staff' | 'admin');
      if (result.role === 'staff') {
        setActiveTab('billing');
      }
      setIsAuthorized(true);
      setPasscode("");
      setPasscodeError("");
    } else {
      setPasscodeError("Incorrect passcode. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("pos_authorized");
    localStorage.removeItem("pos_authorized");
    sessionStorage.removeItem("pos_role");
    localStorage.removeItem("pos_role");
    setRole(null);
    setPasscode("");
    setPasscodeError("");
    setIsAuthorized(false);
  };

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const prodRes = await fetchProductsAction();
      const productsData = prodRes.success && prodRes.data ? prodRes.data : [];
      const defaultCategories: any[] = [];

      if (productsData.length > 0) {
        setCatalog([
          ...defaultCategories,
          ...productsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            desc: p.description,
            price: p.default_price || undefined,
          }))
        ]);
      } else {
        setCatalog(defaultCategories);
      }

      const ordersRes = await fetchOrdersAction();
      const ordersData = ordersRes.success && ordersRes.data ? ordersRes.data : [];

      if (ordersData.length > 0) {
        setOrders(
          ordersData.map((o: any) => ({
            id: o.id,
            customerName: o.customers?.name || "Guest",
            customerPhone: (o.customers?.phone || "").split("_")[0],
            source: o.source,
            items: (o.order_items || []).map((i: any) => ({
              id: i.id,
              name: i.snapshot_name,
              desc:
                i.snapshot_name === "Custom Item" || !i.product_id
                  ? "Custom"
                  : "",
              price: i.snapshot_price,
              qty: i.quantity,
            })),
            subtotal: o.subtotal,
            discount: o.discount_amount,
            discountType: o.discount_type,
            discountValue: o.discount_value,
            deliveryFee: o.delivery_fee,
            grandTotal: o.grand_total,
            cashReceived: o.cash_received,
            paymentMethod: (o.payment_method as "cash" | "gpay" | "split") || "cash",
            cashAmount: typeof o.cash_amount === "number" ? o.cash_amount : (o.payment_method === "gpay" ? 0 : o.grand_total),
            gpayAmount: typeof o.gpay_amount === "number" ? o.gpay_amount : (o.payment_method === "gpay" ? o.grand_total : 0),
            date: o.created_at,
            status: o.status === "COMPLETED" ? "Completed" : "Pending",
          })),
        );
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Modal State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(
    null,
  );
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatPrice, setNewCatPrice] = useState<number | "">("");

  const [activeCatalogRowId, setActiveCatalogRowId] = useState<string | null>(
    null,
  );
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogTargetRowId, setCatalogTargetRowId] = useState<string | null>(
    null,
  );

  // Order search/filters state
  const [orderSearchId, setOrderSearchId] = useState("");
  const [orderSearchName, setOrderSearchName] = useState("");
  const [orderSearchPhone, setOrderSearchPhone] = useState("");
  const [orderFilterSource, setOrderFilterSource] = useState("ALL");
  const [orderFilterStatus, setOrderFilterStatus] = useState("ALL");
  const [historyPeriod, setHistoryPeriod] = useState<
    "all" | "today" | "week" | "month" | "year" | "custom"
  >("all");
  const [historyStartDate, setHistoryStartDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [historyEndDate, setHistoryEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const [selectedCoupon, setSelectedCoupon] = useState<string>("none");
  const coupons = [
    { code: "none", label: "No Coupon", type: "fixed", value: 0 },
    {
      code: "WELCOME10",
      label: "WELCOME10 (10% Off)",
      type: "percent",
      value: 10,
    },
    {
      code: "SUPERPOS",
      label: "SUPERPOS (₹100 Off)",
      type: "fixed",
      value: 100,
    },
    {
      code: "FESTIVE15",
      label: "FESTIVE15 (15% Off)",
      type: "percent",
      value: 15,
    },
  ];

  const handleCouponChange = (code: string) => {
    setSelectedCoupon(code);
    const coupon = coupons.find((c) => c.code === code);
    if (coupon) {
      setDiscountType(coupon.type as "fixed" | "percent");
      setDiscountValue(coupon.value);
    }
  };

  const getCouponCodeForOrder = (order: CompletedOrder) => {
    if (order.discount === 0) return "NONE";
    const matched = coupons.find((c) => {
      if (c.code === "none") return false;
      if (order.discountType && order.discountValue) {
        const typeMatches =
          c.type === (order.discountType === "PERCENT" ? "percent" : "fixed");
        const valMatches = c.value === order.discountValue;
        return typeMatches && valMatches;
      }
      if (c.type === "fixed") {
        return c.value === order.discount;
      } else {
        const calculated = order.subtotal * (c.value / 100);
        return Math.abs(calculated - order.discount) < 2;
      }
    });
    return matched ? matched.code.toUpperCase() : "PROMO";
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(), name: "", desc: "", price: 0, qty: 1 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const clearOrder = () => {
    setItems([
      { id: Math.random().toString(), name: "", desc: "", price: 0, qty: 1 },
    ]);
  };

  const addToCatalog = async () => {
    if (!newCatName.trim()) return;

    const priceNum = Number(newCatPrice);
    if (priceNum > 99999999.99) {
      alert("The price exceeds the maximum allowable system limit of ₹99,999,999.99.");
      return;
    }

    if (editingCatalogId) {
      const res = await updateProductAction(editingCatalogId, {
        name: newCatName,
        description: newCatDesc,
        default_price: newCatPrice ? Number(newCatPrice) : 0,
      });

      if (!res.success || !res.data) {
        console.error("Error updating catalog item:", res.error);
        alert("Failed to update item in catalog.");
        return;
      }

      const data = res.data;
      if (data) {
        setCatalog((prev) =>
          prev.map((c) =>
            c.id === editingCatalogId
              ? {
                  ...c,
                  name: data.name,
                  desc: data.description,
                  price: data.default_price || undefined,
                }
              : c
          )
        );

        if (catalogTargetRowId) {
          updateItem(catalogTargetRowId, "name", data.name);
          if (data.default_price !== undefined) {
            updateItem(catalogTargetRowId, "price", data.default_price || 0);
          }
          setCatalogTargetRowId(null);
        }

        setNewCatName("");
        setNewCatDesc("");
        setNewCatPrice("");
        setEditingCatalogId(null);
        setShowCatalogModal(false);
      }
    } else {
      const res = await createProductAction({
        name: newCatName,
        description: newCatDesc,
        default_price: newCatPrice ? Number(newCatPrice) : 0,
        category: "Custom",
      });

      if (!res.success || !res.data) {
        console.error("Error adding to catalog:", res.error);
        alert("Failed to add item to catalog.");
        return;
      }

      const data = res.data;
      if (data) {
        const newItem: CatalogItem = {
          id: data.id,
          name: data.name,
          desc: data.description,
          price: data.default_price || undefined,
        };
        setCatalog([...catalog, newItem]);

        if (catalogTargetRowId) {
          updateItem(catalogTargetRowId, "name", data.name);
          if (data.default_price !== undefined) {
            updateItem(catalogTargetRowId, "price", data.default_price || 0);
          }
          setCatalogTargetRowId(null);
        }

        setNewCatName("");
        setNewCatDesc("");
        setNewCatPrice("");
        setShowCatalogModal(false);
      }
    }
  };

  const deleteFromCatalog = async (id: string) => {
    if (!id.startsWith("default-")) {
      const res = await deleteProductAction(id);
      if (!res.success) {
        console.error("Error deleting from catalog:", res.error);
        alert("Failed to delete item from catalog.");
        return;
      }
    }

    setCatalog((prev) => prev.filter((c) => c.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const calculatedDiscount =
    discountType === "percent"
      ? subtotal * (discountValue / 100)
      : discountValue;
  const gstAmount = applyGST ? (subtotal - calculatedDiscount) * (gstPercentage / 100) : 0;
  const grandTotal = Math.max(0, subtotal - calculatedDiscount) + deliveryFee + gstAmount;

  const sendWhatsAppMessage = (
    phone: string,
    orderId: string,
    localSubtotal: number,
    localCalculatedDiscount: number,
    localGrandTotal: number,
    localGstAmount: number,
    applyGSTFlag: boolean,
    gstPct: number,
    delivFee: number,
    appType: 'personal' | 'business' = 'personal',
    payMethod: 'cash' | 'gpay' | 'split' = 'cash',
    cashAmt: number = 0,
    gpayAmt: number = 0,
  ) => {
    const domain = window.location.origin;
    const invoiceUrl = `${domain}/invoice/${orderId}`;
    const shopEmoji = String.fromCodePoint(0x2728);
    const checkEmoji = String.fromCodePoint(0x2705);
    const moneyEmoji = String.fromCodePoint(0x1F4B0);
    const receiptEmoji = String.fromCodePoint(0x1F4E6);
    let message = `${shopEmoji} *Take250shop dress & footwear* ${shopEmoji}\n*Proprietor:* M.Ramkumar\n*take250shop, Thanjavur main road, Karanthai, Pincode: 613002*\n*Contact:* 8883173358 / 7339344149\n*Email:* take250shop@gmail.com\n\n`;
    message += `${checkEmoji} Here are your invoice details!\n\n`;
    message += `Subtotal: ₹${localSubtotal.toFixed(2)}\n`;
    if (localCalculatedDiscount > 0) message += `Discount Applied: -₹${localCalculatedDiscount.toFixed(2)}\n`;
    if (applyGSTFlag && localGstAmount > 0) message += `GST (${gstPct}%): ₹${localGstAmount.toFixed(2)}\n`;
    if (delivFee > 0) message += `Delivery Fee: ₹${delivFee.toFixed(2)}\n`;

    const paymentDesc = payMethod === 'split'
      ? `Split — Cash ₹${(cashAmt || 0).toFixed(2)} + GPay ₹${(gpayAmt || 0).toFixed(2)}`
      : payMethod === 'gpay'
      ? `GPay — ₹${localGrandTotal.toFixed(2)}`
      : `Cash — ₹${localGrandTotal.toFixed(2)}`;
    message += `Payment: ${paymentDesc}\n`;
    message += `\n${moneyEmoji} *Total Amount: ₹${localGrandTotal.toFixed(2)}*\n\n`;
    message += `${receiptEmoji} View and download your detailed digital receipt here:\n${invoiceUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = phone ? phone.split('_')[0].replace(/\D/g, '').slice(-10) : '';
    const whatsappUrl = cleanPhone
      ? `https://api.whatsapp.com/send/?phone=91${cleanPhone}&text=${encodedMessage}`
      : `https://api.whatsapp.com/send/?text=${encodedMessage}`;
    const win = window.open(whatsappUrl, "_blank");
    if (!win) {
      window.location.href = whatsappUrl;
    }
  };

  const handleCompleteSale = async (appType: 'personal' | 'business' = 'personal') => {
    // 0. Synchronous Guard: prevent multiple concurrent clicks or taps
    if (isSubmittingOrderRef.current) {
      console.warn("Sale completion already in progress, ignoring duplicate trigger.");
      return;
    }
    isSubmittingOrderRef.current = true;
    setIsSubmittingOrder(true);

    try {
      if (!customerPhone || customerPhone.length !== 10) {
        alert(
          "Please enter a valid 10-digit mobile contact number to send the bill.",
        );
        return;
      }
      // Note: appType param kept for backward compatibility

      // Strict validation: every single row must have a name and a price > 0
      const hasInvalidItem = items.some(i => !i.name || i.name.trim() === "" || i.price === undefined || i.price <= 0);
      
      if (hasInvalidItem || items.length === 0) {
        alert("Please ensure all items have a valid name and a price greater than 0. Remove any empty rows before proceeding.");
        return;
      }
      const itemsToSave = items;

      // Recalculate values locally to avoid React state lag issues
      const localSubtotal = itemsToSave.reduce((acc, item) => acc + item.price * item.qty, 0);
      const localCalculatedDiscount =
        discountType === "percent"
          ? localSubtotal * (discountValue / 100)
          : discountValue;
      const localGstAmount = applyGST ? (localSubtotal - localCalculatedDiscount) * (gstPercentage / 100) : 0;
      const localGrandTotal = Math.max(0, localSubtotal - localCalculatedDiscount) + deliveryFee + localGstAmount;

      // Validate totals against PostgreSQL numeric(10,2) overflow limit (99,999,999.99)
      const MAX_LIMIT = 99999999.99;
      if (localSubtotal > MAX_LIMIT || localGrandTotal > MAX_LIMIT || cashReceived > MAX_LIMIT || deliveryFee > MAX_LIMIT) {
        alert("The order totals exceed the maximum allowable system limit of ₹99,999,999.99. Please adjust the item prices, delivery fee, or cash received.");
        return;
      }

      // Validate individual item prices
      const hasTooExpensiveItem = itemsToSave.some((i) => i.price > MAX_LIMIT || (i.price * i.qty) > MAX_LIMIT);
      if (hasTooExpensiveItem) {
        alert("One or more item prices exceed the maximum system limit of ₹99,999,999.99. Please correct the item prices.");
        return;
      }

      // Payment method breakdown & validation
      let finalCashAmount = 0;
      let finalGpayAmount = 0;
      let finalCashReceived = cashReceived;

      if (paymentMethod === "cash") {
        finalCashAmount = localGrandTotal;
        finalGpayAmount = 0;
        finalCashReceived = cashReceived > 0 ? cashReceived : localGrandTotal;
      } else if (paymentMethod === "gpay") {
        finalCashAmount = 0;
        finalGpayAmount = localGrandTotal;
        finalCashReceived = cashReceived > 0 ? cashReceived : localGrandTotal;
      } else if (paymentMethod === "split") {
        const cAmt = typeof splitCashAmount === "number" ? splitCashAmount : 0;
        const gAmt = typeof splitGpayAmount === "number" ? splitGpayAmount : 0;

        if (cAmt < 0 || gAmt < 0) {
          alert("Payment amounts cannot be negative.");
          return;
        }

        if (Math.abs((cAmt + gAmt) - localGrandTotal) > 0.01) {
          const diff = (localGrandTotal - (cAmt + gAmt)).toFixed(2);
          alert(
            `Cannot complete sale: Cash Amount (₹${cAmt.toFixed(2)}) + GPay Amount (₹${gAmt.toFixed(2)}) must equal Grand Total (₹${localGrandTotal.toFixed(2)}).\nRemaining to allocate: ₹${diff}.`
          );
          return;
        }

        finalCashAmount = cAmt;
        finalGpayAmount = gAmt;
        finalCashReceived = cashReceived > 0 ? cashReceived : cAmt;
      }

      const currentYear = new Date().getFullYear();
      let newOrderId = "";
      let isUnique = false;
      let attempts = 0;

      try {
        while (!isUnique && attempts < 10) {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          let randStr = "";
          for (let i = 0; i < 5; i++) {
            randStr += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          const tempId = `INV-${currentYear}-${randStr}`;
          const existsLocally = orders.some((o) => o.id === tempId);
          if (!existsLocally) {
            const { exists } = await checkOrderIdExistsAction(tempId);
            if (!exists) {
              newOrderId = tempId;
              isUnique = true;
            }
          }
          attempts++;
        }
      } catch (err) {
        console.error("Error generating secure random invoice number:", err);
      }

      if (!newOrderId) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randStr = "";
        for (let i = 0; i < 5; i++) {
          randStr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        newOrderId = `INV-${currentYear}-${randStr}`;
      }

      // Format unique phone: phone_name_timestamp to bypass unique constraint
      const dbPhone = `${customerPhone}_${customerName || "Guest"}_${Date.now()}`;

      const dbItems = [
        ...itemsToSave.map((i) => ({
          snapshot_name: i.name,
          snapshot_price: i.price,
          quantity: i.qty,
        })),
      ];

      if (applyGST && localGstAmount > 0) {
        dbItems.push({
          snapshot_name: `GST (${gstPercentage}%)`,
          snapshot_price: localGstAmount,
          quantity: 1,
        });
      }

      const saveRes = await createOrderAction({
        id: newOrderId,
        customerName: customerName || "Guest",
        customerPhone: dbPhone,
        source: isOnline ? "ONLINE" : "OFFLINE",
        status: "COMPLETED",
        subtotal: localSubtotal,
        discountType: discountType === "percent" ? "PERCENT" : "FIXED",
        discountValue: discountValue,
        discountAmount: localCalculatedDiscount,
        deliveryFee: deliveryFee,
        grandTotal: localGrandTotal,
        cashReceived: finalCashReceived,
        paymentMethod: paymentMethod,
        cashAmount: finalCashAmount,
        gpayAmount: finalGpayAmount,
        items: dbItems,
      });

      if (!saveRes.success) {
        console.error("Error creating order:", saveRes.error);
        alert(`Failed to save order: ${saveRes.error || "Network error"}. Please try again.`);
        return;
      }

      const effectiveOrderId = saveRes.orderId || newOrderId;

      const newOrder: CompletedOrder = {
        id: effectiveOrderId,
        customerName: customerName || "Guest",
        customerPhone,
        source: isOnline ? "ONLINE" : "OFFLINE",
        items: [
          ...itemsToSave,
          ...(applyGST && localGstAmount > 0 ? [{ id: Math.random().toString(), name: `GST (${gstPercentage}%)`, desc: "", price: localGstAmount, qty: 1 }] : [])
        ],
        subtotal: localSubtotal,
        discount: localCalculatedDiscount,
        discountType: discountType === "percent" ? "PERCENT" : "FIXED",
        discountValue: discountValue,
        deliveryFee,
        grandTotal: localGrandTotal,
        cashReceived: finalCashReceived,
        paymentMethod: paymentMethod,
        cashAmount: finalCashAmount,
        gpayAmount: finalGpayAmount,
        date: new Date().toISOString(),
        status: "Completed",
      };

      setOrders((prev) => {
        if (prev.some((o) => o.id === effectiveOrderId)) {
          return prev;
        }
        return [newOrder, ...prev];
      });

      // Show Bill Generated modal
      setLastCompletedOrder(newOrder);
      setShowBillGenerated(true);

      // Cleanly clear billing form inputs so stale items cannot be accidentally re-submitted
      setCustomerName("");
      setCustomerPhone("");
      setItems([{ id: "1", name: "", desc: "", price: 0, qty: 1 }]);
      setDiscountValue(0);
      setDeliveryFee(0);
      setCashReceived(0);
      setPaymentMethod("cash");
      setSplitCashAmount("");
      setSplitGpayAmount("");
      setApplyGST(false);
      setGstPercentage(18);
    } catch (err: any) {
      console.error("Unexpected error completing sale:", err);
      alert("An unexpected error occurred while completing the sale. Please try again.");
    } finally {
      isSubmittingOrderRef.current = false;
      setIsSubmittingOrder(false);
    }
  };

  const resetBillingForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setItems([{ id: "1", name: "", desc: "", price: 0, qty: 1 }]);
    setDiscountValue(0);
    setDeliveryFee(0);
    setCashReceived(0);
    setPaymentMethod("cash");
    setSplitCashAmount("");
    setSplitGpayAmount("");
    setApplyGST(false);
    setGstPercentage(18);
    setLastCompletedOrder(null);
    setShowBillGenerated(false);
    isSubmittingOrderRef.current = false;
    setIsSubmittingOrder(false);
  };

  const resendWhatsApp = (order: CompletedOrder) => {
    if (!order.customerPhone || order.customerPhone.length < 10) {
      alert("Invalid customer phone number for this order.");
      return;
    }
    const domain = window.location.origin;
    const invoiceUrl = `${domain}/invoice/${order.id}`;
    const shopEmoji = String.fromCodePoint(0x2728);
    const checkEmoji = String.fromCodePoint(0x2705);
    const moneyEmoji = String.fromCodePoint(0x1F4B0);
    const receiptEmoji = String.fromCodePoint(0x1F4E6);
    let message = `${shopEmoji} *Take250shop dress & footwear* ${shopEmoji}\n*Proprietor:* M.Ramkumar\n*take250shop, Thanjavur main road, Karanthai, Pincode: 613002*\n*Contact:* 8883173358 / 7339344149\n*Email:* take250shop@gmail.com\n\n`;
    message += `${checkEmoji} Here are your invoice details!\n\n`;
    
    message += `*Subtotal:* ₹${order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n`;
    if (order.discount > 0) {
      message += `*Discount Applied:* -₹${order.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n`;
    }
    
    // Bulletproof mathematical GST calculation
    const gstItem = order.items.find(i => i.name && i.name.startsWith("GST"));
    const calculatedGst = order.grandTotal - (order.subtotal - order.discount + order.deliveryFee);
    
    if (calculatedGst > 0.1) {
      const gstLabel = gstItem ? gstItem.name : "GST";
      message += `*${gstLabel}:* ₹${calculatedGst.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n`;
    }

    const paymentDesc = order.paymentMethod === 'split'
      ? `Split — Cash ₹${(order.cashAmount || 0).toFixed(2)} + GPay ₹${(order.gpayAmount || 0).toFixed(2)}`
      : order.paymentMethod === 'gpay'
      ? `GPay — ₹${order.grandTotal.toFixed(2)}`
      : `Cash — ₹${order.grandTotal.toFixed(2)}`;
    message += `*Payment:* ${paymentDesc}\n`;
    
    message += `\n${moneyEmoji} *Total Amount:* ₹${order.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n\n`;
    message += `${receiptEmoji} View and download your detailed digital receipt here:\n${invoiceUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = order.customerPhone.split('_')[0].replace(/\D/g, '').slice(-10);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=91${cleanPhone}&text=${encodedMessage}`;
    const win = window.open(whatsappUrl, "_blank");
    if (!win) {
      window.location.href = whatsappUrl;
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Delete order ${orderId}? This action cannot be undone.`)) return;
    const res = await deleteOrderAction(orderId);
    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } else {
      alert(`Failed to delete order: ${res.error}`);
    }
  };

  // Real-time analytics derived from orders with period filtering
  const now = new Date();

  const analyticsFilteredOrders = orders.filter((o) => {
    if (
      analyticsSearchPhone &&
      !o.customerPhone.includes(analyticsSearchPhone)
    ) {
      return false;
    }
    const orderDate = new Date(o.date);
    if (analyticsPeriod === "today") {
      return (
        orderDate.getDate() === now.getDate() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    if (analyticsPeriod === "week") {
      const startOfWeek = new Date(now);
      const dayOfWeek = startOfWeek.getDay();
      const distToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startOfWeek.setDate(startOfWeek.getDate() + distToMonday); // Monday start of week
      startOfWeek.setHours(0, 0, 0, 0);
      return orderDate >= startOfWeek;
    }
    if (analyticsPeriod === "month") {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    if (analyticsPeriod === "year") {
      return orderDate.getFullYear() === now.getFullYear();
    }
    if (analyticsPeriod === "custom") {
      const orderTime = orderDate.getTime();
      const start = analyticsStartDate ? new Date(analyticsStartDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      const end = analyticsEndDate ? new Date(analyticsEndDate) : null;
      if (end) end.setHours(23, 59, 59, 999);

      if (start && end) {
        return orderTime >= start.getTime() && orderTime <= end.getTime();
      } else if (start) {
        return orderTime >= start.getTime();
      } else if (end) {
        return orderTime <= end.getTime();
      }
      return true;
    }
    return true; // "all"
  });

  const totalOrdersCount = analyticsFilteredOrders.length;
  const totalRevenueAmount = analyticsFilteredOrders.reduce(
    (acc, o) => acc + o.grandTotal,
    0,
  );
  const avgOrderValue =
    totalOrdersCount > 0 ? totalRevenueAmount / totalOrdersCount : 0;

  // Split channels
  const onlineOrders = analyticsFilteredOrders.filter(
    (o) => o.source === "ONLINE",
  ).length;
  const offlineOrders = analyticsFilteredOrders.filter(
    (o) => o.source === "OFFLINE",
  ).length;

  // Split revenues
  const onlineRevenue = analyticsFilteredOrders
    .filter((o) => o.source === "ONLINE")
    .reduce((acc, o) => acc + o.grandTotal, 0);
  const offlineRevenue = analyticsFilteredOrders
    .filter((o) => o.source === "OFFLINE")
    .reduce((acc, o) => acc + o.grandTotal, 0);

  // Payment method revenues across all bills in the selected period (including split orders)
  const cashRevenue = analyticsFilteredOrders.reduce(
    (acc, o) => acc + (o.cashAmount !== undefined ? o.cashAmount : (o.paymentMethod === "gpay" ? 0 : o.grandTotal)),
    0,
  );
  const gpayRevenue = analyticsFilteredOrders.reduce(
    (acc, o) => acc + (o.gpayAmount !== undefined ? o.gpayAmount : (o.paymentMethod === "gpay" ? o.grandTotal : 0)),
    0,
  );

  // Top items by revenue in analyticsFilteredOrders
  const itemSales: Record<
    string,
    { name: string; revenue: number; qty: number }
  > = {};
  analyticsFilteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!item.name || item.name.startsWith("GST (")) return;
      if (!itemSales[item.name])
        itemSales[item.name] = { name: item.name, revenue: 0, qty: 0 };
      itemSales[item.name].revenue += item.price * item.qty;
      itemSales[item.name].qty += item.qty;
    });
  });
  const topItems = Object.values(itemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Helper to get ISO week number of the year
  const getWeekOfYear = (d: Date) => {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    target.setDate(target.getDate() - dayNr + 3); // Nearest Thursday
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };
  const currentWeekNumber = getWeekOfYear(now);

  // Revenue per day of current week (Mon–Sun) - CONSTANT (independent of analyticsPeriod filters)
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekRevenue = [0, 0, 0, 0, 0, 0, 0];
  
  // Find Monday to Sunday of current calendar week
  const currentDayOfWeek = now.getDay();
  const distToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const mondayOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + distToMon);
  mondayOfThisWeek.setHours(0, 0, 0, 0);
  
  const sundayOfThisWeek = new Date(mondayOfThisWeek);
  sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
  sundayOfThisWeek.setHours(23, 59, 59, 999);

  orders.forEach((order) => {
    if (analyticsSearchPhone) {
      const q = analyticsSearchPhone.toLowerCase();
      const matchPhone = order.customerPhone.includes(q);
      const matchInvoice = order.id.toLowerCase().includes(q);
      if (!matchPhone && !matchInvoice) {
        return;
      }
    }
    const orderDate = new Date(order.date);
    const orderTime = orderDate.getTime();
    if (orderTime >= mondayOfThisWeek.getTime() && orderTime <= sundayOfThisWeek.getTime()) {
      const day = (orderDate.getDay() + 6) % 7;
      weekRevenue[day] += order.grandTotal;
    }
  });
  const maxWeekRevenue = Math.max(...weekRevenue, 1);

  // Revenue per month of current year - CONSTANT (independent of analyticsPeriod filters)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthRevenue = Array(12).fill(0);
  orders.forEach((order) => {
    if (analyticsSearchPhone) {
      const q = analyticsSearchPhone.toLowerCase();
      const matchPhone = order.customerPhone.includes(q);
      const matchInvoice = order.id.toLowerCase().includes(q);
      if (!matchPhone && !matchInvoice) {
        return;
      }
    }
    const d = new Date(order.date);
    if (d.getFullYear() === now.getFullYear()) {
      monthRevenue[d.getMonth()] += order.grandTotal;
    }
  });
  const maxMonthRevenue = Math.max(...monthRevenue, 1);
  const totalYearRevenue = monthRevenue.reduce((a, b) => a + b, 0);
  const avgMonthRevenue = totalYearRevenue / 12;

  // New Detailed KPI Computations based on analyticsFilteredOrders
  const todayOrders = orders.filter((o) => {
    if (analyticsSearchPhone) {
      const q = analyticsSearchPhone.toLowerCase();
      const matchPhone = o.customerPhone.includes(q);
      const matchInvoice = o.id.toLowerCase().includes(q);
      if (!matchPhone && !matchInvoice) {
        return false;
      }
    }
    const d = new Date(o.date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const todayRevenue = todayOrders.reduce((acc, o) => acc + o.grandTotal, 0);

  const todayOrdersCount = todayOrders.length;
  const todayOnlineOrdersCount = todayOrders.filter(
    (o) => o.source === "ONLINE",
  ).length;
  const todayOfflineOrdersCount = todayOrders.filter(
    (o) => o.source === "OFFLINE",
  ).length;

  const todayOnlineRevenue = todayOrders
    .filter((o) => o.source === "ONLINE")
    .reduce((acc, o) => acc + o.grandTotal, 0);
  const todayOfflineRevenue = todayOrders
    .filter((o) => o.source === "OFFLINE")
    .reduce((acc, o) => acc + o.grandTotal, 0);

  const todayCashRevenue = todayOrders.reduce(
    (acc, o) => acc + (o.cashAmount !== undefined ? o.cashAmount : (o.paymentMethod === "gpay" ? 0 : o.grandTotal)),
    0,
  );
  const todayGpayRevenue = todayOrders.reduce(
    (acc, o) => acc + (o.gpayAmount !== undefined ? o.gpayAmount : (o.paymentMethod === "gpay" ? o.grandTotal : 0)),
    0,
  );

  const todayItemsSold = todayOrders.reduce(
    (acc, o) => acc + o.items.reduce((sum, item) => {
      const isGST = item.name && item.name.startsWith("GST (");
      return sum + (isGST ? 0 : item.qty);
    }, 0),
    0,
  );

  // Today's top items
  const todayItemSales: Record<
    string,
    { name: string; revenue: number; qty: number }
  > = {};
  todayOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!item.name || item.name.startsWith("GST (")) return;
      if (!todayItemSales[item.name])
        todayItemSales[item.name] = { name: item.name, revenue: 0, qty: 0 };
      todayItemSales[item.name].revenue += item.price * item.qty;
      todayItemSales[item.name].qty += item.qty;
    });
  });
  const todayTopItems = Object.values(todayItemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const monthlyRevenue = orders
    .filter((o) => {
      const d = new Date(o.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, o) => acc + o.grandTotal, 0);

  const totalItemsSold = analyticsFilteredOrders.reduce(
    (acc, o) => acc + o.items.reduce((sum, item) => {
      const isGST = item.name && item.name.startsWith("GST (");
      return sum + (isGST ? 0 : item.qty);
    }, 0),
    0,
  );

  const categorySales: Record<string, number> = {};
  analyticsFilteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.name && item.name.startsWith("GST (")) return;
      const cat = item.desc || "Uncategorized";
      if (!categorySales[cat]) categorySales[cat] = 0;
      categorySales[cat] += item.price * item.qty;
    });
  });
  const topCategory =
    Object.keys(categorySales).length > 0
      ? Object.entries(categorySales).sort((a, b) => b[1] - a[1])[0][0]
      : "None";
  const topProduct = topItems[0]?.name || "None";

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FCD814]"></div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8C6D23]"></div>
          <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Custom luxury grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8C6D23/0.015_1px,transparent_1px),linear-gradient(to_bottom,#8C6D23/0.015_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Abstract Background Orbs */}
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[#8C6D23]/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-[#8C6D23]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Main Card Container */}
        <div className="relative z-10 w-full max-w-md bg-white border border-[#D4AF37]/20 rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_70px_rgba(107,20,34,0.06)] overflow-hidden group flex flex-col items-center text-center">
          
          {/* Card top border gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#8C6D23] to-[#D4AF37]" />
          
          {/* Logo with Gradient Hover Glow */}
          <div className="relative group mb-6">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF37] to-[#8C6D23] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-20 h-20 bg-white rounded-2xl p-3.5 border border-[#D4AF37]/20 shadow-lg flex items-center justify-center">
              <img src="/icon.png" alt="Logo" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight uppercase mb-1">
            Take 250 <span className="text-[#8C6D23]">Shirt Shop</span>
          </h1>
          <p className="text-[#8C6D23] text-xs font-black uppercase tracking-[0.2em] mb-8">
            Style That Fits You • POS Terminal
          </p>

          {/* Form */}
          <form onSubmit={handleVerifyPasscode} className="w-full space-y-6 text-left">
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-[#8C6D23] uppercase tracking-[0.25em] ml-1">
                Security Passcode
              </label>
              <div className="relative group/input">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] group-focus-within/input:text-[#8C6D23] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPasscode ? "text" : "password"}
                  name="update-pos-passcode"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F5] border border-black/10 hover:border-[#D4AF37]/50 focus:border-[#8C6D23] focus:bg-white rounded-2xl pl-13 pr-13 py-3.5 text-[#8C6D23] font-mono tracking-widest text-lg focus:outline-none transition-all placeholder:text-black/20"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (passcodeError) setPasscodeError("");
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-black/30 hover:text-[#8C6D23] transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passcodeError && (
                <p className="text-xs text-[#8C6D23] font-bold mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                  {passcodeError}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-4 bg-[#8C6D23] hover:bg-[#000000] active:scale-[0.98] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(107,20,34,0.1)] hover:shadow-[0_12px_35px_rgba(107,20,34,0.2)] flex items-center justify-center gap-3 mt-4 group cursor-pointer border border-[#D4AF37]/20"
            >
              Authenticate
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
            </button>
          </form>

          {/* Status Badge */}
          <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 bg-[#8C6D23]/5 border border-[#D4AF37]/20 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D23] animate-pulse" />
            <span className="text-[8px] font-bold text-[#8C6D23] tracking-[0.15em] uppercase">SYSTEM ONLINE • ENCRYPTED</span>
          </div>

        </div>
        
        {/* Footnote */}
        <div className="mt-6 text-[#1C1917]/30 text-[9px] font-bold tracking-widest uppercase">
          Take 250 Shirt Shop Management Terminal v2.1 • Coimbatore
        </div>
      </div>
    );
  }

  // Filtered orders for Order History tab
  const historyFilteredOrders = orders.filter((order) => {
    const matchId = order.id
      .toLowerCase()
      .includes(orderSearchId.toLowerCase());
    const matchName = order.customerName
      .toLowerCase()
      .includes(orderSearchName.toLowerCase());
    const matchPhone = (order.customerPhone || "").includes(orderSearchPhone);
    const matchSource =
      orderFilterSource === "ALL" || order.source === orderFilterSource;
    const matchStatus =
      orderFilterStatus === "ALL" ||
      order.status.toUpperCase() === orderFilterStatus.toUpperCase();

    // Period match
    let matchPeriod = true;
    if (historyPeriod !== "all") {
      const orderDate = new Date(order.date);
      const orderTime = orderDate.getTime();
      const now = new Date();

      if (historyPeriod === "today") {
        matchPeriod = orderDate.toDateString() === now.toDateString();
      } else if (historyPeriod === "week") {
        const currentDay = now.getDay();
        const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
        const startOfWeek = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + distanceToMon,
        );
        startOfWeek.setHours(0, 0, 0, 0);
        matchPeriod = orderTime >= startOfWeek.getTime();
      } else if (historyPeriod === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        matchPeriod = orderTime >= startOfMonth.getTime();
      } else if (historyPeriod === "year") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        matchPeriod = orderTime >= startOfYear.getTime();
      } else if (historyPeriod === "custom") {
        const start = historyStartDate ? new Date(historyStartDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        const end = historyEndDate ? new Date(historyEndDate) : null;
        if (end) end.setHours(23, 59, 59, 999);

        if (start && end) {
          matchPeriod =
            orderTime >= start.getTime() && orderTime <= end.getTime();
        } else if (start) {
          matchPeriod = orderTime >= start.getTime();
        } else if (end) {
          matchPeriod = orderTime <= end.getTime();
        }
      }
    }

    return (
      matchId &&
      matchName &&
      matchPhone &&
      matchSource &&
      matchStatus &&
      matchPeriod
    );
  });

  const handleExportCSV = () => {
    if (historyFilteredOrders.length === 0) {
      alert("No orders available to export.");
      return;
    }

    // CSV Headers padded with spaces to ensure columns default to a readable width in Excel
    const headers = [
      "Order ID          ",
      "Date                   ",
      "Customer Name           ",
      "Customer Phone          ",
      "Source        ",
      "Payment Method",
      "Cash Amount   ",
      "GPay Amount   ",
      "Subtotal      ",
      "Discount      ",
      "Delivery Fee  ",
      "Grand Total   ",
      "Status        ",
      "Items                                                                               ",
    ];

    // CSV Rows
    const rows = historyFilteredOrders.map((o) => {
      const itemsStr = o.items.map((i) => `${i.name} (x${i.qty})`).join("; ");

      // Formatting date: MM/DD/YYYY HH:MM AM/PM as an Excel text formula to prevent ### errors
      const dateObj = new Date(o.date);
      const dateStr = dateObj.toLocaleDateString();
      const timeStr = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedDate = `"=""${dateStr} ${timeStr}"""`;

      // Formatting phone number as an Excel text formula to prevent scientific notation
      const formattedPhone = o.customerPhone
        ? `"=""${o.customerPhone}"""`
        : `"N/A"`;

      return [
        o.id,
        formattedDate,
        o.customerName,
        formattedPhone,
        o.source,
        o.paymentMethod || "cash",
        o.cashAmount !== undefined ? o.cashAmount : (o.paymentMethod === "gpay" ? 0 : o.grandTotal),
        o.gpayAmount !== undefined ? o.gpayAmount : (o.paymentMethod === "gpay" ? o.grandTotal : 0),
        o.subtotal,
        o.discount,
        o.deliveryFee,
        o.grandTotal,
        o.status,
        `"${itemsStr.replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((val) => {
            if (typeof val === "string" && !val.startsWith('"')) {
              return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Order_History_${historyPeriod}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#000000] flex flex-row font-sans overflow-hidden">
      {/* Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-full max-w-md overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 flex justify-between items-center bg-[#FFFFFF]">
              <h3 className="font-bold text-lg text-[#000000] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8C6D23]/10 rounded-lg flex items-center justify-center">
                  <PackagePlus className="w-5 h-5 text-[#8C6D23]" />
                </div>
                {editingCatalogId ? "Edit Catalog Item" : "Add New Item"}
              </h3>
              <button
                onClick={() => {
                  setNewCatName("");
                  setNewCatDesc("");
                  setNewCatPrice("");
                  setEditingCatalogId(null);
                  setShowCatalogModal(false);
                }}
                className="w-8 h-8 flex items-center justify-center bg-[#000000] text-[#FFFFFF] hover:bg-black/80 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-8 py-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Slim Fit Cotton Shirt"
                  className="minimal-input font-bold text-sm"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Size 40 / Pure Linen"
                  className="minimal-input text-sm"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                  Default Price (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 250"
                  className="minimal-input text-sm font-semibold"
                  value={newCatPrice}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) =>
                    setNewCatPrice(
                      e.target.value === "" ? "" : parseFloat(e.target.value),
                    )
                  }
                />
              </div>
              <button
                onClick={addToCatalog}
                className="w-full py-4 mt-4 bg-[#000000] hover:bg-[#8C6D23] text-[#FFFFFF] rounded-lg font-bold text-xs uppercase tracking-[0.15em] transition-colors"
              >
                {editingCatalogId ? "Save Changes" : "Save to Catalog"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile/Tablet Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Collapsible Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 bg-[#8C6D23] text-[#FFFFFF] flex flex-col justify-between h-screen shrink-0 shadow-xl z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64 border-r border-white/10 translate-x-0" : "w-0 min-w-0 border-r-0 -translate-x-64 overflow-hidden"}`}
      >
        <div className="w-64 flex flex-col justify-between h-full shrink-0 overflow-hidden relative">
          <div className="flex flex-col">
            {/* Header branding */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFFFFF] rounded-xl flex items-center justify-center shadow-inner overflow-hidden shrink-0">
                  <img
                    src="/icon.png"
                    alt="Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div>
                  <span className="font-black text-sm tracking-tight text-[#FFFFFF] block uppercase">
                    Take<span className="text-[#D4AF37]">250</span>
                  </span>
                  <span className="text-[9px] text-[#D4AF37] font-bold tracking-widest block uppercase -mt-0.5">
                    Dress & Footwear
                  </span>
                </div>
              </div>

              {/* Close Button Inside Sidebar */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white font-bold hover:text-white transition-all cursor-pointer"
                title="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="px-4 py-6 space-y-2">
              <button
                onClick={() => setActiveTab("billing")}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "billing"
                    ? "bg-[#D4AF37] text-black shadow-lg scale-102 font-black"
                    : "text-white font-bold hover:bg-white/10 hover:text-white"
                }`}
              >
                <Receipt className="w-5 h-5" />
                Billing Panel
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[#D4AF37] text-black shadow-lg scale-102 font-black"
                    : "text-white font-bold hover:bg-white/10 hover:text-white"
                }`}
              >
                <History className="w-5 h-5" />
                Order History
              </button>
              {role === 'admin' && (
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === "analytics"
                      ? "bg-[#D4AF37] text-black shadow-lg scale-102 font-black"
                      : "text-white font-bold hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <BarChart2 className="w-5 h-5" />
                  Analytics Dashboard
                </button>
              )}

              <div className="pt-4 border-t border-white/10 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-black/20 hover:bg-[#FF6B6B]/10 transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </nav>
          </div>

          {/* Footer branding */}
          <div className="p-6 border-t border-white/10 flex items-center justify-start gap-4">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-black shrink-0">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <p className="text-[10px] text-[#FCD814] mt-1 font-semibold uppercase tracking-wider">
              V2.1.0 • PREMIUM POS
            </p>
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto px-3 sm:px-8 lg:px-12 pt-3 pb-8 relative flex flex-col animate-in fade-in duration-300">
        {/* Global Top Navbar */}
        <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-black/10 w-full mb-6 gap-4">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-9 h-9 bg-white border border-black/10 hover:bg-[#FFFFFF]/40 rounded-lg flex items-center justify-center transition-all shadow-sm cursor-pointer"
                title="Open Menu"
              >
                <Menu className="w-4.5 h-4.5 text-[#8C6D23]" />
              </button>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#000000] tracking-tight uppercase">
                Take<span className="text-[#8C6D23]">250</span>shop <span className="text-xs text-neutral-500 font-bold lowercase">dress & footwear</span>
              </h1>
            </div>
          </div>

          {/* OFFLINE / ONLINE Toggle (only shown when billing tab is active) */}
          {activeTab === "billing" && (
            <div className="flex items-center bg-[#FFFFFF]/60 border border-black/10 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setIsOnline(false)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all uppercase cursor-pointer ${!isOnline ? "bg-[#E11D48] text-[#FFFFFF] shadow-sm" : "text-[#000000] hover:text-[#000000]"}`}
              >
                <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
                OFFLINE (POS)
              </button>
              <button
                onClick={() => setIsOnline(true)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all uppercase cursor-pointer ${isOnline ? "bg-[#00A86B] text-[#FFFFFF] shadow-sm" : "text-[#000000] hover:text-[#000000]"}`}
              >
                <span className="w-2 h-2 rounded-full bg-[#00A86B]"></span>
                ONLINE ORDER
              </button>
            </div>
          )}
        </header>

        {activeTab === "billing" && (
          <div className="flex-1 flex flex-col gap-6 max-w-[1400px] min-w-0 mx-auto w-full">
            {/* Subheader Accent Bar and Title */}
            <div className="flex justify-between items-center py-2 border-b border-black/10 w-full">
              <div className="flex items-center gap-4">
                <span className="w-1.5 h-8 bg-[#8C6D23] rounded-full"></span>
                <div>
                  <h2 className="text-xl font-black text-[#000000] tracking-tight">
                    POS Billing Panel
                  </h2>
                  <p className="text-[11px] text-[#000000] font-semibold mt-0.5">
                    Quick Invoice generator & database synced checkout
                  </p>
                </div>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              {/* Left Column */}
              <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col gap-6 h-auto lg:h-full">
                {/* Customer Details */}
                <div className="flex-shrink-0 bg-white border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
                  <h2 className="text-base font-black flex items-center gap-3 text-[#000000] mb-6 tracking-tight">
                    <User className="w-4 h-4 text-[#8C6D23]" />
                    Customer Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Walk-in Customer"
                        className="w-full bg-[#FFFFFF]/40 border border-black/10 hover:border-black/10 focus:border-[#8C6D23] focus:bg-white rounded-lg px-4 py-2.5 text-[#000000] text-sm font-semibold focus:outline-none transition-colors placeholder:text-[#000000] placeholder:font-normal shadow-sm"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                        Mobile Number (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        maxLength={10}
                        className="w-full bg-[#FFFFFF]/40 border border-black/10 hover:border-black/10 focus:border-[#8C6D23] focus:bg-white rounded-lg px-4 py-2.5 text-[#000000] text-sm font-semibold focus:outline-none transition-colors placeholder:text-[#000000] placeholder:font-normal shadow-sm"
                        value={customerPhone}
                        onChange={(e) =>
                          setCustomerPhone(
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                      />
                    </div>
                  </div>
                </div>


                {/* Order Items Ledger */}
                <div className="flex-1 bg-white border border-black/10 rounded-xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col overflow-visible">
                  <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-transparent gap-4">
                    <h2 className="text-base font-black flex items-center gap-3 text-[#000000] tracking-tight">
                      <Receipt className="w-4 h-4 text-[#8C6D23]" />
                      Order Items
                    </h2>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                      <button
                        onClick={clearOrder}
                        className="text-[10px] font-bold text-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border border-black/10 px-4 py-2 rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear Order
                      </button>
                      <button
                        onClick={() => {
                          setNewCatName("");
                          setNewCatDesc("");
                          setNewCatPrice("");
                          setCatalogTargetRowId(null);
                          setShowCatalogModal(true);
                        }}
                        className="text-[10px] font-bold text-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border border-black/10 px-4 py-2 rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PackagePlus className="w-3.5 h-3.5 text-[#8C6D23]" />{" "}
                        Add To Catalog
                      </button>
                      <button
                        onClick={addItem}
                        className="text-[10px] font-bold text-[#8C6D23] bg-[#8C6D23]/5 hover:bg-[#8C6D23]/10 border border-[#8C6D23]/20 px-4 py-2 rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Custom Item
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 overflow-visible">
                    {/* Table Header */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-black/10 text-[9px] font-black text-[#000000] uppercase tracking-[0.15em] mt-4 mb-2">
                      <div className="col-span-7 pl-2">
                        Item Name / Description
                      </div>
                      <div className="col-span-2 text-center">Price (₹)</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-4 pt-2 overflow-visible">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-stretch sm:items-center group border-b border-transparent pb-4 pt-1 overflow-visible relative"
                        >
                          {/* Item Name / Description Input + Catalog Button */}
                          <div className="col-span-7 relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                            <input
                              type="text"
                              placeholder="e.g., Formal Check Shirt (Size 42)..."
                              className="flex-1 bg-white border border-black/10 focus:border-[#8C6D23] rounded-lg px-4 py-2 text-xs font-semibold text-[#000000] focus:outline-none transition-colors placeholder:text-[#000000] min-w-0"
                              value={item.name}
                              onChange={(e) =>
                                updateItem(item.id, "name", e.target.value)
                              }
                            />
                            <button
                              onClick={() => {
                                setActiveCatalogRowId(
                                  activeCatalogRowId === item.id
                                    ? null
                                    : item.id,
                                );
                                setCatalogSearch("");
                              }}
                              className="flex items-center justify-center gap-1.5 border border-[#8C6D23]/30 bg-[#8C6D23]/5 text-[#8C6D23] hover:bg-[#8C6D23]/10 px-3 py-2 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-wider shrink-0 cursor-pointer w-full sm:w-auto"
                            >
                              <List className="w-3.5 h-3.5" />
                              Catalog
                            </button>

                            {/* Catalog Dropdown Popover */}
                            {activeCatalogRowId === item.id && (
                              <div className="absolute z-[80] top-full left-0 mt-1 w-full sm:w-80 max-w-[calc(100vw-2.5rem)] bg-[#FFFFFF] border-2 border-black/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="p-2 border-b border-black/10 bg-[#FFFFFF] flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    placeholder="Search shirts, footwear..."
                                    className="w-full bg-white border border-black/10 focus:border-[#8C6D23] rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none transition-colors"
                                    value={catalogSearch}
                                    onChange={(e) =>
                                      setCatalogSearch(e.target.value)
                                    }
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => setActiveCatalogRowId(null)}
                                    className="text-[#000000] hover:text-[#B89730] cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                  {catalog.filter((c) =>
                                    c.name
                                      .toLowerCase()
                                      .includes(catalogSearch.toLowerCase()),
                                  ).length > 0 ? (
                                    catalog
                                      .filter((c) =>
                                        c.name
                                          .toLowerCase()
                                          .includes(
                                            catalogSearch.toLowerCase(),
                                          ),
                                      )
                                      .map((catItem) => (
                                        <div
                                          key={catItem.id}
                                          className="w-full flex items-center border-b border-transparent last:border-0 hover:bg-[#FFFFFF] transition-colors"
                                        >
                                          <button
                                            className="flex-1 text-left px-4 py-2.5 flex flex-col cursor-pointer"
                                            onClick={() => {
                                              updateItem(
                                                item.id,
                                                "name",
                                                catItem.name,
                                              );
                                              if (catItem.price !== undefined) {
                                                updateItem(
                                                  item.id,
                                                  "price",
                                                  catItem.price,
                                                );
                                              }
                                              setActiveCatalogRowId(null);
                                            }}
                                          >
                                            <span className="text-xs font-bold text-[#000000]">
                                              {catItem.name}
                                            </span>
                                            {catItem.desc && (
                                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#000000] mt-0.5">
                                                {catItem.desc}
                                              </span>
                                            )}
                                            {catItem.price !== undefined && (
                                              <span className="text-[10px] font-bold text-[#8C6D23] mt-0.5">
                                                ₹{catItem.price}
                                              </span>
                                            )}
                                          </button>
                                          <div className="flex shrink-0">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCatalogId(catItem.id);
                                                setNewCatName(catItem.name);
                                                setNewCatDesc(catItem.desc || "");
                                                setNewCatPrice(catItem.price || "");
                                                setCatalogTargetRowId(item.id);
                                                setShowCatalogModal(true);
                                                setActiveCatalogRowId(null);
                                              }}
                                              className="px-3 py-2.5 text-[#000000] hover:text-[#8C6D23] transition-colors cursor-pointer"
                                              title="Edit item"
                                            >
                                              <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm("Are you sure you want to delete this item from the catalog?")) {
                                                  deleteFromCatalog(catItem.id);
                                                }
                                              }}
                                              className="px-3 py-2.5 text-[#000000] hover:text-[#B89730] transition-colors cursor-pointer"
                                              title="Delete item"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                      ))
                                  ) : (
                                    <div className="px-4 py-4 text-center">
                                      <div className="text-xs text-[#000000] font-semibold mb-2">
                                        No items match "{catalogSearch}"
                                      </div>
                                      <button
                                        onClick={() => {
                                          setNewCatName(catalogSearch);
                                          setCatalogTargetRowId(item.id);
                                          setShowCatalogModal(true);
                                          setActiveCatalogRowId(null);
                                        }}
                                        className="text-[10px] font-bold text-[#8C6D23] bg-[#8C6D23]/10 hover:bg-[#8C6D23]/20 px-3 py-1.5 rounded uppercase tracking-wider transition-colors cursor-pointer"
                                      >
                                        + Add to Catalog
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Price, Qty, and Trash (Grid on mobile to prevent overflow, grid on desktop) */}
                          <div className="col-span-5 grid grid-cols-[minmax(0,1fr)_auto_auto] sm:grid-cols-5 gap-2 sm:gap-4 w-full items-center">
                            {/* Price Input */}
                            <div className="sm:col-span-2 flex items-center gap-1.5 sm:gap-2 sm:block min-w-0 w-full">
                              <span className="text-[10px] font-bold text-[#000000] uppercase sm:hidden shrink-0">
                                Price:
                              </span>
                              <input
                                type="number"
                                className="w-full min-w-0 text-center bg-white border border-black/10 focus:border-[#8C6D23] rounded-lg px-2 sm:px-3 py-2 text-xs font-semibold text-[#000000] focus:outline-none transition-colors"
                                value={item.price || ""}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "price",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                onWheel={(e) => e.currentTarget.blur()}
                                placeholder="0"
                              />
                            </div>

                            {/* Quantity Counter */}
                            <div className="sm:col-span-2 flex items-center justify-end gap-1.5 sm:gap-2 sm:block shrink-0">
                              <span className="text-[10px] font-bold text-[#000000] uppercase sm:hidden shrink-0">
                                Qty:
                              </span>
                              <div className="flex items-center border border-black/10 bg-white rounded-lg overflow-hidden h-[36px] max-w-[90px] shrink-0">
                                <button
                                  className="w-7 h-full flex items-center justify-center text-[#000000] hover:bg-[#FFFFFF] hover:text-[#B89730] font-bold text-xs transition-colors cursor-pointer"
                                  onClick={() =>
                                    updateItem(
                                      item.id,
                                      "qty",
                                      Math.max(1, item.qty - 1),
                                    )
                                  }
                                >
                                  −
                                </button>
                                <span className="flex-1 text-center font-bold text-xs text-[#000000] min-w-[18px]">
                                  {item.qty}
                                </span>
                                <button
                                  className="w-7 h-full flex items-center justify-center text-[#000000] hover:bg-[#FFFFFF] hover:text-[#B89730] font-bold text-xs transition-colors cursor-pointer"
                                  onClick={() =>
                                    updateItem(item.id, "qty", item.qty + 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Trash Button */}
                            <div className="sm:col-span-1 flex justify-end shrink-0">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-[#000000] hover:text-[#E11D48] hover:bg-[#FEE2E2] p-2 rounded-lg border border-black/10 hover:border-transparent transition-colors flex items-center justify-center cursor-pointer"
                                title="Remove Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>{" "}
              {/* Right Column - Premium Light Order Panel */}
              <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col shrink-0 bg-white text-[#000000] border border-black/10 rounded-2xl shadow-sm lg:sticky lg:top-28 lg:self-start transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 overflow-hidden group">
                <div className="p-4 sm:p-6 pb-4 border-b border-black/10 flex justify-between items-center bg-[#FFFFFF]">
                  <h2 className="text-base font-black flex items-center gap-3 text-[#000000] tracking-tight">
                    <ShoppingBag className="w-4 h-4 text-[#8C6D23]" />
                    Current Order
                  </h2>
                  <span
                    className={`flex items-center gap-2 bg-white border border-black/10 px-3 py-1 rounded-full font-bold text-[9px] ${isOnline ? "text-[#00A86B]" : "text-[#E11D48]"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#00A86B]" : "bg-[#E11D48]"}`}
                    ></span>
                    {isOnline ? "ONLINE ORDER" : "OFFLINE (POS)"}
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-5">
                  {/* Customer Details Box */}
                  <div className="bg-[#FFFFFF]/40 border border-black/10 rounded-xl p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#000000] font-semibold">
                        SOURCE
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border ${isOnline ? "border-[#00A86B] text-[#00A86B] bg-[#00A86B]/10" : "border-[#E11D48] text-[#E11D48] bg-[#E11D48]/10"}`}
                      >
                        {isOnline ? "ONLINE" : "OFFLINE"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#000000] font-semibold">
                        CUSTOMER
                      </span>
                      <span className="font-bold text-[#000000] truncate max-w-[65%] text-right">
                        {customerName || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#000000] font-semibold">
                        PHONE
                      </span>
                      <span className="font-bold text-[#000000]">
                        {customerPhone || "-"}
                      </span>
                    </div>

                    {/* Items summary list inside customer details box */}
                    <div className="border-t border-black/10 pt-2.5 mt-2.5">
                      {items.filter((i) => i.name).length === 0 ? (
                        <div className="text-center py-2 text-[10px] text-[#000000] font-semibold italic">
                          No items added yet
                        </div>
                      ) : (
                        <div className="max-h-24 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
                          {items
                            .filter((i) => i.name)
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center text-[10px]"
                              >
                                <span className="text-[#000000] font-semibold">
                                  {item.qty}x {item.name}
                                </span>
                                <span className="font-bold text-[#8C6D23]">
                                  ₹
                                  {(item.price * item.qty).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 },
                                  )}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Discounts section */}
                  <div className="space-y-4 pt-1">
                    {/* Manual Discount */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.1em] mb-1.5">
                        Manual Discount
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={discountType}
                          onChange={(e) => {
                            setDiscountType(
                              e.target.value as "fixed" | "percent",
                            );
                            setSelectedCoupon("none");
                          }}
                          className="bg-white border border-black/10 text-[#000000] rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#8C6D23] cursor-pointer"
                        >
                          <option value="fixed">₹</option>
                          <option value="percent">%</option>
                        </select>
                        <input
                          type="number"
                          className="flex-1 text-right bg-white border border-black/10 rounded-lg px-3 py-2 text-xs font-bold text-[#000000] placeholder:text-[#000000] focus:outline-none focus:border-[#8C6D23] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
                          value={discountValue || ""}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) => {
                            setDiscountValue(parseFloat(e.target.value) || 0);
                            setSelectedCoupon("none");
                          }}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Subtotal & Delivery Breakdown */}
                    <div className="space-y-2.5 pt-2 border-t border-black/10">
                       <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-[#000000]">
                          Subtotal (
                          {items
                            .filter((i) => i.name)
                            .reduce((sum, i) => sum + i.qty, 0)}{" "}
                          items)
                        </span>
                        <span className="font-bold text-[#000000]">
                          ₹
                          {subtotal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-[#000000]">Delivery</span>
                        <input
                          type="number"
                          className="w-20 text-right bg-white border border-black/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#000000] placeholder:text-[#000000] focus:outline-none focus:border-[#8C6D23]"
                          value={deliveryFee || ""}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            setDeliveryFee(parseFloat(e.target.value) || 0)
                          }
                          placeholder="0"
                        />
                      </div>

                      {/* GST Section (Below Delivery, Above Grand Total) */}
                      <div className="pt-2">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${applyGST ? 'bg-[#8C6D23]' : 'bg-gray-300'}`}>
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${applyGST ? 'translate-x-4' : 'translate-x-1'}`} />
                            </div>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={applyGST}
                              onChange={(e) => setApplyGST(e.target.checked)}
                            />
                            <span className="text-xs font-bold text-[#000000] uppercase tracking-wider">
                              Apply GST
                            </span>
                          </label>
                          {applyGST && (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  className="w-14 text-right bg-white border border-black/10 rounded-lg px-2 py-1 text-xs font-bold text-[#000000] focus:outline-none focus:border-[#8C6D23] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  value={gstPercentage || ""}
                                  onChange={(e) => setGstPercentage(parseFloat(e.target.value) || 0)}
                                  placeholder="%"
                                />
                                <span className="text-xs font-bold text-[#000000]">%</span>
                              </div>
                              <span className="text-xs font-bold text-[#8C6D23] w-16 text-right">
                                ₹{gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between items-center text-sm font-bold pt-4 border-t border-black/10">
                      <span className="text-[#000000] uppercase tracking-wider">
                        Grand Total
                      </span>
                      <span className="text-xl text-[#8C6D23] font-black">
                        ₹
                        {grandTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Payment Method Selector & Inputs */}
                    <div className="bg-[#FFFFFF]/40 border border-black/10 rounded-xl p-4 mt-2 space-y-3">
                      <div>
                        <span className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-2">
                          Payment Method
                        </span>
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/5 rounded-xl border border-black/10">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("cash")}
                            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              paymentMethod === "cash"
                                ? "bg-black text-[#D4AF37] shadow-sm font-extrabold"
                                : "bg-transparent text-neutral-600 hover:text-black"
                            }`}
                          >
                            <IndianRupee className="w-3.5 h-3.5" />
                            Cash
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("gpay")}
                            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              paymentMethod === "gpay"
                                ? "bg-black text-[#D4AF37] shadow-sm font-extrabold"
                                : "bg-transparent text-neutral-600 hover:text-black"
                            }`}
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            GPay
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod("split");
                              if (splitCashAmount === "" && splitGpayAmount === "") {
                                const half = +(grandTotal / 2).toFixed(2);
                                setSplitCashAmount(half);
                                setSplitGpayAmount(+(grandTotal - half).toFixed(2));
                              }
                            }}
                            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              paymentMethod === "split"
                                ? "bg-black text-[#D4AF37] shadow-sm font-extrabold"
                                : "bg-transparent text-neutral-600 hover:text-black"
                            }`}
                          >
                            <Percent className="w-3.5 h-3.5" />
                            Split
                          </button>
                        </div>
                      </div>

                      {/* Cash Payment Mode */}
                      {paymentMethod === "cash" && (
                        <div>
                          <label className="block text-[10px] font-bold text-[#000000] mb-1.5">
                            Amount Received (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full bg-white border border-black/10 focus:border-[#8C6D23] rounded-lg px-3 py-2 text-base font-bold text-[#000000] placeholder:text-[#000000] focus:outline-none transition-colors"
                            value={cashReceived || ""}
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={(e) =>
                              setCashReceived(Math.max(0, parseFloat(e.target.value) || 0))
                            }
                            placeholder="0.00"
                          />
                        </div>
                      )}

                      {/* GPay Payment Mode */}
                      {paymentMethod === "gpay" && (
                        <div>
                          <label className="block text-[10px] font-bold text-[#000000] mb-1.5">
                            Amount Received (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full bg-white border border-black/10 focus:border-[#8C6D23] rounded-lg px-3 py-2 text-base font-bold text-[#000000] placeholder:text-[#000000] focus:outline-none transition-colors"
                            value={cashReceived || ""}
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={(e) =>
                              setCashReceived(Math.max(0, parseFloat(e.target.value) || 0))
                            }
                            placeholder={grandTotal > 0 ? grandTotal.toFixed(2) : "0.00"}
                          />
                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5 font-bold">
                            <span className="flex items-center gap-1">
                              <Smartphone className="w-3 h-3" />
                              Full UPI / GPay payment: ₹{grandTotal.toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCashReceived(grandTotal)}
                              className="underline hover:text-blue-900 cursor-pointer text-[9px] uppercase"
                            >
                              Auto-Fill
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Split Payment Mode */}
                      {paymentMethod === "split" && (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-[#000000] mb-1">
                                Cash Amount (₹)
                              </label>
                              <input
                                type="number"
                                min="0"
                                className="w-full bg-white border border-black/10 focus:border-[#8C6D23] rounded-lg px-3 py-2 text-sm font-bold text-[#000000] placeholder:text-neutral-400 focus:outline-none transition-colors"
                                value={splitCashAmount === "" ? "" : splitCashAmount}
                                onWheel={(e) => e.currentTarget.blur()}
                                onChange={(e) => {
                                  if (e.target.value === "") {
                                    setSplitCashAmount("");
                                    return;
                                  }
                                  const val = parseFloat(e.target.value);
                                  if (isNaN(val) || val < 0) return;
                                  setSplitCashAmount(val);
                                  const autoGpay = Math.max(0, +(grandTotal - val).toFixed(2));
                                  setSplitGpayAmount(autoGpay);
                                }}
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-[#000000] mb-1">
                                GPay Amount (₹)
                              </label>
                              <input
                                type="number"
                                min="0"
                                className="w-full bg-white border border-black/10 focus:border-[#8C6D23] rounded-lg px-3 py-2 text-sm font-bold text-[#000000] placeholder:text-neutral-400 focus:outline-none transition-colors"
                                value={splitGpayAmount === "" ? "" : splitGpayAmount}
                                onWheel={(e) => e.currentTarget.blur()}
                                onChange={(e) => {
                                  if (e.target.value === "") {
                                    setSplitGpayAmount("");
                                    return;
                                  }
                                  const val = parseFloat(e.target.value);
                                  if (isNaN(val) || val < 0) return;
                                  setSplitGpayAmount(val);
                                  const autoCash = Math.max(0, +(grandTotal - val).toFixed(2));
                                  setSplitCashAmount(autoCash);
                                }}
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          {/* Split Allocation Status Badge */}
                          {(() => {
                            const cVal = typeof splitCashAmount === "number" ? splitCashAmount : 0;
                            const gVal = typeof splitGpayAmount === "number" ? splitGpayAmount : 0;
                            const totalAlloc = +(cVal + gVal).toFixed(2);
                            const remaining = +(grandTotal - totalAlloc).toFixed(2);

                            if (Math.abs(remaining) <= 0.01 && grandTotal > 0) {
                              return (
                                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5 text-[10px] text-emerald-800 font-bold">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    Split balanced to ₹{grandTotal.toFixed(2)}
                                  </span>
                                  <span className="font-mono">
                                    ₹{cVal.toFixed(2)} + ₹{gVal.toFixed(2)}
                                  </span>
                                </div>
                              );
                            } else if (remaining > 0.01) {
                              return (
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 text-[10px] text-amber-900 font-bold">
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                      Remaining to allocate:
                                    </span>
                                    <span className="font-black text-amber-950 font-mono text-xs">
                                      ₹{remaining.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const half = +(grandTotal / 2).toFixed(2);
                                        setSplitCashAmount(half);
                                        setSplitGpayAmount(+(grandTotal - half).toFixed(2));
                                      }}
                                      className="flex-1 py-1 text-[9px] font-bold bg-white border border-black/15 hover:border-[#8C6D23] rounded-md text-[#000000] cursor-pointer"
                                    >
                                      Split 50/50
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSplitGpayAmount(Math.max(0, +(grandTotal - cVal).toFixed(2)));
                                      }}
                                      className="flex-1 py-1 text-[9px] font-bold bg-white border border-black/15 hover:border-[#8C6D23] rounded-md text-[#000000] cursor-pointer"
                                    >
                                      + Remaining to GPay
                                    </button>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div className="flex items-center justify-between bg-red-50 border border-red-300 rounded-lg px-2.5 py-1.5 text-[10px] text-red-900 font-bold">
                                  <span>Over-allocated by:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-black font-mono text-xs text-red-950">
                                      ₹{(-remaining).toFixed(2)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const half = +(grandTotal / 2).toFixed(2);
                                        setSplitCashAmount(half);
                                        setSplitGpayAmount(+(grandTotal - half).toFixed(2));
                                      }}
                                      className="px-2 py-0.5 text-[9px] font-bold bg-white border border-red-300 text-red-800 rounded cursor-pointer"
                                    >
                                      Auto-Balance
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                          })()}

                          {/* Cash Tendered for Change Return in Split Mode */}
                          {typeof splitCashAmount === "number" && splitCashAmount > 0 && (
                            <div className="pt-1 border-t border-black/5">
                              <label className="block text-[9px] font-bold text-neutral-600 mb-1">
                                Cash Tendered by Customer (for change return)
                              </label>
                              <input
                                type="number"
                                min="0"
                                className="w-full bg-white border border-black/10 focus:border-[#8C6D23] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#000000] placeholder:text-neutral-400 focus:outline-none transition-colors"
                                value={cashReceived || ""}
                                onWheel={(e) => e.currentTarget.blur()}
                                onChange={(e) =>
                                  setCashReceived(Math.max(0, parseFloat(e.target.value) || 0))
                                }
                                placeholder={splitCashAmount.toFixed(2)}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Change Return (For Cash, GPay, or Split cash portion) */}
                    {(() => {
                      const relevantDue = paymentMethod === "split"
                        ? (typeof splitCashAmount === "number" ? splitCashAmount : 0)
                        : grandTotal;
                      if (cashReceived > relevantDue && relevantDue > 0) {
                        return (
                          <div className="flex justify-between items-center bg-white border border-black/10 rounded-lg p-3 text-xs">
                            <span className="font-bold text-[#000000] uppercase tracking-[0.05em]">
                              Change Return
                            </span>
                            <span className="font-black text-sm text-[#00A86B]">
                              ₹
                              {(cashReceived - relevantDue).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Complete Sale Button */}
                    {(() => {
                      const numCash = typeof splitCashAmount === "number" ? splitCashAmount : 0;
                      const numGpay = typeof splitGpayAmount === "number" ? splitGpayAmount : 0;
                      const isSplitUnbalanced =
                        paymentMethod === "split" &&
                        (Math.abs(grandTotal - (numCash + numGpay)) > 0.01 || grandTotal <= 0);
                      const isButtonDisabled = isSplitUnbalanced || isSubmittingOrder;

                      return (
                        <button
                          type="button"
                          onClick={() => handleCompleteSale('business')}
                          disabled={isButtonDisabled}
                          className={`w-full mt-2 py-3.5 rounded-lg font-bold text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(16,185,129,0.4)] ${
                            isButtonDisabled
                              ? "bg-neutral-400 text-neutral-100 cursor-not-allowed opacity-60 shadow-none pointer-events-none"
                              : "bg-[#10B981] hover:bg-[#059669] text-white cursor-pointer"
                          }`}
                        >
                          {isSubmittingOrder ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing Sale...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                              {isSplitUnbalanced
                                ? `Allocate Full Total (₹${Math.abs(grandTotal - (numCash + numGpay)).toFixed(2)} diff)`
                                : "Complete Sale"}
                            </>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bill Generated Modal */}
        {showBillGenerated && lastCompletedOrder && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-[#000000] tracking-tight">Bill Generated</h2>
                  <p className="text-xs font-bold text-[#10B981] mt-1 tracking-wider">#{lastCompletedOrder.id}</p>
                </div>
                <button
                  onClick={resetBillingForm}
                  className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#8C6D23] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Sale
                </button>
              </div>

              {/* Payment Receipt Card */}
              <div className="mx-5 bg-[#F9FAFB] border border-black/10 rounded-xl p-4 mb-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] mb-3">Payment Receipt</p>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-[#374151] font-semibold">Grand Total</span>
                  <span className="font-bold text-[#000000]">₹{lastCompletedOrder.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-[#374151] font-semibold">Payment</span>
                  <span className="font-bold text-[#000000]">
                    {lastCompletedOrder.paymentMethod === 'split'
                      ? `Split — Cash ₹${lastCompletedOrder.cashAmount.toFixed(2)} + GPay ₹${lastCompletedOrder.gpayAmount.toFixed(2)}`
                      : (lastCompletedOrder.paymentMethod === 'gpay' ? `GPay — ₹${lastCompletedOrder.grandTotal.toFixed(2)}` : `Cash — ₹${lastCompletedOrder.grandTotal.toFixed(2)}`)}
                  </span>
                </div>

                {lastCompletedOrder.paymentMethod === 'split' && (
                  <div className="bg-white border border-black/10 rounded-lg p-2.5 mb-2.5 text-xs space-y-1">
                    <div className="flex justify-between text-[#374151]">
                      <span className="font-semibold">Cash Portion:</span>
                      <span className="font-bold text-[#000000]">₹{lastCompletedOrder.cashAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#374151]">
                      <span className="font-semibold">GPay / UPI Portion:</span>
                      <span className="font-bold text-[#000000]">₹{lastCompletedOrder.gpayAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {lastCompletedOrder.cashReceived > 0 && lastCompletedOrder.paymentMethod !== 'gpay' && (
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-[#374151] font-semibold">Cash Received</span>
                    <span className="font-bold text-[#000000]">₹{lastCompletedOrder.cashReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {(() => {
                  const targetDue = lastCompletedOrder.paymentMethod === 'split' ? lastCompletedOrder.cashAmount : lastCompletedOrder.grandTotal;
                  if (lastCompletedOrder.cashReceived > targetDue && targetDue > 0) {
                    return (
                      <div className="flex justify-between items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-4 py-3 mt-1">
                        <span className="text-[#1D4ED8] font-bold text-sm">Balance Returned</span>
                        <span className="text-[#1D4ED8] font-black text-base">
                          ₹{(lastCompletedOrder.cashReceived - targetDue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Action Buttons */}
              <div className="px-5 mb-4 flex gap-3">
                <button
                  onClick={() => {
                    const printUrl = `/invoice/${lastCompletedOrder!.id}?print=true`;
                    const printWindow = window.open(printUrl, '_blank');
                    if (printWindow) {
                      printWindow.focus();
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-black/20 bg-white text-[#000000] hover:border-[#8C6D23] hover:text-[#8C6D23] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#8C6D23]" />
                  Print Bill
                </button>
                <button
                  onClick={() => {
                    const o = lastCompletedOrder!;
                    const localDisc = o.discount;
                    const localGst = o.grandTotal - (o.subtotal - o.discount + o.deliveryFee);
                    const applyGSTFlag = localGst > 0.1;
                    sendWhatsAppMessage(
                      o.customerPhone,
                      o.id,
                      o.subtotal,
                      localDisc,
                      o.grandTotal,
                      applyGSTFlag ? localGst : 0,
                      applyGSTFlag,
                      0,
                      o.deliveryFee,
                      'business',
                      o.paymentMethod,
                      o.cashAmount,
                      o.gpayAmount,
                    );
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-[0_2px_8px_rgba(16,185,129,0.35)]"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  WhatsApp Invoice
                </button>
                <button
                  onClick={resetBillingForm}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white hover:bg-[#8C6D23] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Sale
                </button>
              </div>

              {/* Items Sold */}
              <div className="px-5 pb-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] mb-3 border-t border-black/10 pt-4">Items Sold</p>
                <div className="space-y-2">
                  {lastCompletedOrder.items.filter(i => !i.name.startsWith('GST')).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-[#374151] font-semibold">{item.name} <span className="text-[#9CA3AF] font-normal">x {item.qty} piece{item.qty > 1 ? 's' : ''}</span></span>
                      <span className="font-bold text-[#000000]">₹{(item.price * item.qty).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(role === "admin" || role === "staff") && activeTab === "orders" && (
          <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full pb-8 pr-2 animate-in fade-in duration-300">
            {/* Header Panel */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h2 className="text-[28px] font-black text-[#000000] tracking-tight">
                  Order History
                </h2>
                <p className="text-xs text-[#000000] font-semibold mt-1">
                  Manage and track past invoices
                </p>
              </div>

              {orders.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex flex-wrap items-center bg-[#FFFFFF] border border-black/10 rounded-xl p-1 gap-1 max-w-full">
                    <span className="text-[9px] font-bold text-[#000000] uppercase tracking-wider px-2">
                      Period:
                    </span>
                    {(["all", "today", "week", "month", "year"] as const).map(
                      (p) => {
                        const displayLabel =
                          p === "all"
                            ? "All Time"
                            : p === "today"
                              ? "Today"
                              : p === "week"
                                ? "This Week"
                                : p === "month"
                                  ? "This Month"
                                  : "This Year";
                        const isActive = historyPeriod === p;
                        return (
                          <button
                            key={p}
                            onClick={() => {
                              setHistoryPeriod(p);
                              setHistoryStartDate("");
                              setHistoryEndDate("");
                            }}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#8C6D23] text-[#FFFFFF] shadow-sm"
                                : "text-[#000000] hover:bg-[#000000]/50"
                            }`}
                          >
                            {displayLabel}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <div className="flex flex-wrap items-center border rounded-xl px-3 py-1.5 gap-2 shadow-sm bg-white border-black/10 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#000000]">
                        From:
                      </span>
                      <input
                        type="date"
                        value={historyStartDate}
                        onChange={(e) => {
                          setHistoryPeriod("custom");
                          setHistoryStartDate(e.target.value);
                        }}
                        className="text-xs font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-[#000000] w-[115px]"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#000000]">
                        To:
                      </span>
                      <input
                        type="date"
                        value={historyEndDate}
                        onChange={(e) => {
                          setHistoryPeriod("custom");
                          setHistoryEndDate(e.target.value);
                        }}
                        className="text-xs font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-[#000000] w-[115px]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#8C6D23] bg-transparent text-[#8C6D23] hover:bg-[#8C6D23] hover:text-[#FFFFFF] rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-xl bg-[#FFFFFF] py-12">
                <p className="text-[#000000] font-medium">
                  No past transactions yet.
                </p>
              </div>
            ) : (
              <>
                {/* Search and Filters Bar */}
                <div className="bg-white border-2 border-black/10 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
                    <div>
                      <label className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                        Search Order ID
                      </label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#000000] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. INV-..."
                          className="w-full bg-[#FFFFFF]/30 border border-black/10 focus:border-[#8C6D23] rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold text-[#000000] focus:outline-none"
                          value={orderSearchId}
                          onChange={(e) => setOrderSearchId(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Search name..."
                        className="w-full bg-[#FFFFFF]/30 border border-black/10 focus:border-[#8C6D23] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#000000] focus:outline-none"
                        value={orderSearchName}
                        onChange={(e) => setOrderSearchName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                        Customer Phone
                      </label>
                      <input
                        type="text"
                        placeholder="Search phone..."
                        className="w-full bg-[#FFFFFF]/30 border border-black/10 focus:border-[#8C6D23] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#000000] focus:outline-none"
                        value={orderSearchPhone}
                        onChange={(e) => setOrderSearchPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                        Order Source
                      </label>
                      <select
                        className="w-full bg-[#FFFFFF]/30 border border-black/10 focus:border-[#8C6D23] rounded-lg px-3 py-1.5 text-xs font-bold text-[#000000] focus:outline-none cursor-pointer"
                        value={orderFilterSource}
                        onChange={(e) => setOrderFilterSource(e.target.value)}
                      >
                        <option value="ALL">All Sources</option>
                        <option value="ONLINE">Online Orders</option>
                        <option value="OFFLINE">Offline (POS)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {(() => {
                  const filteredOrders = historyFilteredOrders;

                  if (filteredOrders.length === 0) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-xl bg-[#FFFFFF] py-12">
                        <p className="text-[#000000] font-semibold">
                          No transactions match your search filters.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="bg-[#FFFFFF] border-2 border-black/10 rounded-xl shadow-sm overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FFFFFF] border-b border-black/10">
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Order ID
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Customer Name
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Mobile Number
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Source
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Payment / Total
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest text-right">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => (
                            <tr
                              key={order.id}
                              className="border-b border-transparent hover:bg-[#FFFFFF] transition-colors"
                            >
                              <td className="p-4 text-xs font-semibold text-[#000000]">
                                {order.id}
                              </td>
                              <td className="p-4 text-xs font-bold text-[#000000]">
                                {order.customerName}
                              </td>
                              <td className="p-4 text-xs font-mono font-bold text-[#000000]">
                                {order.customerPhone || "-"}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border ${order.source === "ONLINE" ? "border-[#00A86B] text-[#00A86B] bg-[#00A86B]/10" : "border-[#E11D48] text-[#E11D48] bg-[#E11D48]/10"}`}
                                >
                                  {order.source}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="text-sm font-black text-[#8C6D23]">
                                  ₹{order.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                                <div className="mt-1">
                                  {order.paymentMethod === 'split' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#D4AF37]/15 text-[#8C6D23] border border-[#D4AF37]/30 whitespace-nowrap">
                                      Split: ₹{order.cashAmount.toFixed(0)} Cash + ₹{order.gpayAmount.toFixed(0)} GPay
                                    </span>
                                  ) : order.paymentMethod === 'gpay' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                      GPay
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Cash
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2 sm:gap-3">
                                  <span className="px-3 py-1 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                                    {order.status}
                                  </span>
                                  <button
                                    onClick={() => resendWhatsApp(order)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer"
                                  >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                      </svg>
                                    WhatsApp
                                  </button>
                                  <button
                                    onClick={() => setActiveInvoiceId(order.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8C6D23] hover:bg-[#000000] text-white rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Invoice
                                  </button>
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-[10px] font-bold text-[#000000] hover:text-[#B89730] uppercase tracking-wider underline underline-offset-2"
                                  >
                                    Details
                                  </button>
                                  {role === 'admin' && (
                                    <button
                                      onClick={() => handleDeleteOrder(order.id)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-[#E11D48]/10 hover:bg-[#E11D48] text-[#E11D48] hover:text-white border border-[#E11D48]/30 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {role === "admin" && activeTab === "analytics" && (
          <div className="flex-1 flex flex-col max-w-[1400px] min-w-0 mx-auto w-full pb-8 pr-2">
            {/* Header Panel */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h2 className="text-[28px] font-black text-[#000000] tracking-tight">
                  POS Analytics
                </h2>
                <p className="text-xs text-[#000000] font-semibold mt-1">
                  Real-time store & channel insights
                </p>
              </div>

              {/* Period Filters & Refresh Button */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {analyticsSubTab !== "today" && (
                  <>
                    <div className="flex flex-wrap items-center bg-[#FFFFFF] border border-black/10 rounded-xl p-1 gap-1 max-w-full">
                      <span className="text-[9px] font-bold text-[#000000] uppercase tracking-wider px-2">
                        Period:
                      </span>
                      {(["all", "today", "week", "month", "year"] as const).map(
                        (p) => {
                          const displayLabel =
                            p === "all"
                              ? "All Time"
                              : p === "today"
                                ? "Today"
                                : p === "week"
                                  ? "This Week"
                                  : p === "month"
                                    ? "This Month"
                                    : "This Year";
                          const isActive = analyticsPeriod === p;
                          return (
                            <button
                              key={p}
                              onClick={() => {
                                setAnalyticsPeriod(p);
                                setAnalyticsStartDate("");
                                setAnalyticsEndDate("");
                              }}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                isActive
                                  ? "bg-[#8C6D23] text-[#FFFFFF] shadow-sm"
                                  : "text-[#000000] hover:bg-[#000000]/50"
                              }`}
                            >
                              {displayLabel}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <div className="flex flex-wrap items-center border rounded-xl px-3 py-1.5 gap-2 shadow-sm bg-white border-black/10 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#000000]">
                          From:
                        </span>
                        <input
                          type="date"
                          value={analyticsStartDate}
                          onChange={(e) => {
                            setAnalyticsPeriod("custom");
                            setAnalyticsStartDate(e.target.value);
                          }}
                          className="text-xs font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-[#000000] w-[115px]"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#000000]">
                          To:
                        </span>
                        <input
                          type="date"
                          value={analyticsEndDate}
                          onChange={(e) => {
                            setAnalyticsPeriod("custom");
                            setAnalyticsEndDate(e.target.value);
                          }}
                          className="text-xs font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-[#000000] w-[115px]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sub Navigation Tabs */}
            <div className="flex border-b border-black/10 mb-6 gap-6 overflow-x-auto scrollbar-none pb-0.5 w-full shrink-0">
              {(["revenue", "today", "products", "coupons"] as const).map(
                (tab) => {
                  const isActive = analyticsSubTab === tab;
                  const displayLabel =
                    tab === "today"
                      ? "Today's Sales"
                      : tab === "revenue"
                        ? "Revenue"
                        : tab === "products"
                          ? "Products"
                          : "Coupons";
                  return (
                    <button
                      key={tab}
                      onClick={() => setAnalyticsSubTab(tab)}
                      className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer shrink-0 ${
                        isActive
                          ? "text-[#8C6D23]"
                          : "text-[#000000] hover:text-[#000000]"
                      }`}
                    >
                      {displayLabel}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C6D23] rounded-full" />
                      )}
                    </button>
                  );
                },
              )}
            </div>

            {/* Tab Contents */}
            {analyticsSubTab === "today" && (
              <>
                {/* Today's KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Today's Revenue
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3 text-[#10B981] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{todayRevenue.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Completed today
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Today's Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-[#3B82F6] animate-swing" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {todayOrdersCount}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Completed today
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Today's Items Sold
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                        <Package className="w-3 h-3 text-[#8B5CF6] animate-pop" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {todayItemsSold} pcs
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Quantity sold today
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Today's Avg Order Value
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-[#F97316] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹
                      {Math.round(
                        todayOrdersCount > 0
                          ? todayRevenue / todayOrdersCount
                          : 0,
                      ).toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Per invoice today
                    </div>
                  </div>
                </div>

                {/* Today's Detailed Split */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 mb-8">
                  {/* Left Side: Today's Order Source & Leaderboard */}
                  <div className="col-span-8 w-full flex flex-col gap-6">
                    {/* Today's Transactions Table */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h3 className="font-bold text-[#000000] text-sm">
                          Today's Transactions
                        </h3>

                        {/* Contact Search Input */}
                        <div className="flex items-center border border-black/10 bg-[#FFFFFF] rounded-lg px-3 py-1.5 gap-2 shadow-xs w-full sm:w-auto animate-in fade-in duration-200">
                          <Search className="w-3.5 h-3.5 text-[#000000]" />
                          <input
                            type="text"
                            placeholder="Search contact/invoice..."
                            className="text-xs font-semibold bg-transparent border-none outline-none focus:ring-0 text-[#000000] placeholder:text-[#000000]/50 w-full sm:w-[170px]"
                            value={analyticsSearchPhone}
                            onChange={(e) =>
                              setAnalyticsSearchPhone(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      {todayOrders.length === 0 ? (
                        <div className="text-center text-[#000000] text-xs font-semibold py-12">
                          {analyticsSearchPhone
                            ? "No matching transactions found."
                            : "No orders placed today."}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#FFFFFF] border-b border-black/10">
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                                  Invoice ID
                                </th>
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                                  Customer No
                                </th>
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                                  Source
                                </th>
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                                  Items
                                </th>
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                                  Grand Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {todayOrders.map((order) => (
                                <tr
                                  key={order.id}
                                  className="border-b border-transparent hover:bg-[#FFFFFF]/50 transition-colors"
                                >
                                  <td className="p-3 text-xs font-semibold text-[#000000]">
                                    {order.id}
                                  </td>
                                  <td className="p-3 text-xs font-mono font-bold text-[#000000]">
                                    {order.customerPhone || "-"}
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border ${order.source === "ONLINE" ? "border-[#00A86B] text-[#00A86B] bg-[#00A86B]/10" : "border-[#E11D48] text-[#E11D48] bg-[#E11D48]/10"}`}
                                    >
                                      {order.source}
                                    </span>
                                  </td>
                                  <td className="p-3 text-xs font-semibold text-[#000000] text-right">
                                    {order.items.reduce(
                                      (sum, i) => sum + ((i.name && !i.name.startsWith("GST (")) ? i.qty : 0),
                                      0,
                                    )}{" "}
                                    pcs
                                  </td>
                                  <td className="p-3 text-xs font-black text-[#8C6D23] text-right">
                                    ₹{order.grandTotal.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Channel Split & Top items */}
                  <div className="col-span-4 w-full flex flex-col gap-6">
                    {/* Today's Channel Split Card */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
                      <h3 className="font-bold text-[#000000] mb-4 text-sm">
                        Today's Channel Split
                      </h3>
                      {todayOrdersCount === 0 ? (
                        <div className="text-center text-[#000000] text-xs font-semibold py-6">
                          No sales today.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-wider w-14">
                              Offline
                            </span>
                            <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#E11D48] rounded-full transition-all duration-700"
                                style={{
                                  width: `${(todayOfflineOrdersCount / todayOrdersCount) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-[#000000] w-12 text-right">
                              ₹{todayOfflineRevenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#00A86B] uppercase tracking-wider w-14">
                              Online
                            </span>
                            <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#00A86B] rounded-full transition-all duration-700"
                                style={{
                                  width: `${(todayOnlineOrdersCount / todayOrdersCount) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-[#000000] w-12 text-right">
                              ₹{todayOnlineRevenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Today's Top Products Sold Card */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex-1">
                      <h3 className="font-bold text-[#000000] text-sm mb-4">
                        Today's Top Items
                      </h3>
                      {todayTopItems.length === 0 ? (
                        <div className="text-center text-[#000000] text-xs font-semibold py-6">
                          No items sold today.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {todayTopItems.map((item, idx) => (
                            <div
                              key={item.name}
                              className="flex items-center gap-3"
                            >
                              <span className="text-[11px] font-black text-[#000000] w-4">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-[#000000]">
                                    {item.name}
                                  </span>
                                  <span className="text-xs font-black text-[#8C6D23]">
                                    ₹{item.revenue.toLocaleString()}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#8C6D23] rounded-full transition-all duration-700"
                                    style={{
                                      width: `${(item.revenue / todayTopItems[0].revenue) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <span className="text-[10px] text-[#000000] font-semibold w-10 text-right">
                                {item.qty} pcs
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {analyticsSubTab === "revenue" && (
              <>
                {/* Top 6 KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
                  {/* Row 1 */}
                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Revenue
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3 text-[#10B981] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{totalRevenueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      POS + manual combined
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Completed Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-[#10B981] animate-swing" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {totalOrdersCount}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      POS + manual bills
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Offline Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#06B6D4]/10 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3 text-[#06B6D4] animate-bounce" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{offlineRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Walk-in POS sales
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Online Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3 text-[#6366F1] animate-float" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{onlineRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Online POS sales
                    </div>
                  </div>

                  {/* Cash Revenue Metric */}
                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Cash Revenue
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#8C6D23]/10 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3 text-[#8C6D23]" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{cashRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Cash & split cash
                    </div>
                  </div>

                  {/* GPay Revenue Metric */}
                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        GPay Revenue
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
                        <Smartphone className="w-3 h-3 text-[#3B82F6]" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{gpayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      GPay/UPI & split UPI
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {/* Row 2 */}
                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Offline Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#E11D48]/10 flex items-center justify-center">
                        <ShoppingBag className="w-3 h-3 text-[#E11D48] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {offlineOrders}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Walk-in POS orders
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Online Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                        <Globe className="w-3 h-3 text-[#6366F1] animate-float" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {onlineOrders}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Online channel orders
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Items Sold
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                        <Package className="w-3 h-3 text-[#8B5CF6] animate-pop" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {totalItemsSold}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      From completed bills
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Avg Order Value
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-[#F97316] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{Math.round(avgOrderValue).toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Per completed order
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Top Product
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#EC4899]/10 flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-[#EC4899] animate-pop" />
                      </div>
                    </div>
                    <div
                      className="text-xl font-black text-[#000000] mb-1 truncate"
                      title={topProduct}
                    >
                      {topProduct}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Most sold item
                    </div>
                  </div>
                </div>

                {/* Main Charts & Breakdowns */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
                  {/* Left Chart Column */}
                  <div className="col-span-8 w-full flex flex-col gap-6">
                    {/* Monthly Revenue Trend Chart */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[300px]">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="font-bold text-[#000000] text-sm mb-2 flex items-center">
                            Revenue Trend This Year <span className="text-[#8C6D23] font-black ml-1.5">{now.getFullYear()}</span>
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-[#000000]">
                              ₹{totalYearRevenue.toLocaleString()}
                            </span>
                            {avgMonthRevenue > 0 && (
                              <span className="bg-[#FFFFFF] border border-black/10 text-[#8C6D23] px-2 py-0.5 rounded text-[10px] font-bold">
                                Avg ₹
                                {Math.round(avgMonthRevenue).toLocaleString()}
                                /mo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {orders.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-[#000000] text-sm font-semibold">
                          Process orders to see yearly revenue trend.
                        </div>
                      ) : (
                        <div className="flex-1 overflow-x-auto scrollbar-thin pb-2">
                          <div className="flex items-end justify-between px-2 gap-1 relative mt-4 min-w-[500px] h-[170px] pt-10">
                            {monthNames.map((month, i) => (
                              <div
                                key={month}
                                className="flex flex-col items-center gap-1.5 w-full group/bar relative outline-none"
                                tabIndex={0}
                              >
                                {/* Monthly sales text on top for mobile/visibility */}
                                <span className="text-[8px] font-black text-[#8C6D23] h-3 flex items-end">
                                  {monthRevenue[i] > 0
                                    ? monthRevenue[i] >= 1000
                                      ? `₹${(monthRevenue[i] / 1000).toFixed(1)}k`
                                      : `₹${monthRevenue[i]}`
                                    : ""}
                                </span>

                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#000000] text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 group-focus/bar:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                                  <div className="text-[9px] text-white/70 font-semibold mb-0.5">
                                    {monthNames[i]}
                                  </div>
                                  ₹{(monthRevenue[i] || 0).toLocaleString()}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#000000]"></div>
                                </div>
                                <div
                                  className="w-full max-w-[24px] bg-[#8C6D23] rounded-t-sm transition-all duration-1000 group-hover/bar:bg-[#B89730] cursor-pointer min-h-[4px]"
                                  style={{
                                    height: `${Math.max(4, (monthRevenue[i] / maxMonthRevenue) * 100)}px`,
                                  }}
                                />
                                <span className="text-[10px] font-bold text-[#000000] uppercase">
                                  {month}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Weekly Revenue Bar Chart */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[250px]">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="font-bold text-[#000000] text-sm flex items-center">
                            Revenue This Week <span className="text-[#8C6D23] font-black ml-1.5">(Week {currentWeekNumber} of {now.getFullYear()})</span>
                          </h3>
                          <p className="text-[10px] text-[#000000] font-semibold mt-1">
                            ₹
                            {weekRevenue
                              .reduce((a, b) => a + b, 0)
                              .toLocaleString()}{" "}
                            total
                          </p>
                        </div>
                      </div>

                      {orders.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-[#000000] text-sm font-semibold">
                          Process orders to see weekly revenue.
                        </div>
                      ) : (
                        <div className="flex-1 flex items-end justify-between px-2 gap-2">
                          {dayNames.map((day, i) => (
                            <div
                              key={day}
                              className="flex flex-col items-center gap-3 w-full group/bar relative outline-none"
                              tabIndex={0}
                            >
                              <span className="text-[9px] font-black text-[#8C6D23]">
                                {weekRevenue[i] > 0
                                  ? `₹${weekRevenue[i] >= 1000 ? (weekRevenue[i] / 1000).toFixed(1) + "k" : weekRevenue[i]}`
                                  : ""}
                              </span>

                              {/* Tooltip for exact weekly revenue */}
                              <div className="absolute bottom-[52px] mb-2 left-1/2 -translate-x-1/2 bg-[#000000] text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 group-focus/bar:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                                <div className="text-[9px] text-white/70 font-semibold mb-0.5">
                                  {dayNames[i]}
                                </div>
                                ₹{(weekRevenue[i] || 0).toLocaleString()}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#000000]"></div>
                              </div>

                              <div className="w-full max-w-[20px] h-32 bg-[#F3F4F6] rounded-full relative overflow-hidden cursor-pointer">
                                <div
                                  className="absolute bottom-0 w-full bg-[#8C6D23] rounded-full transition-all duration-1000 group-hover/bar:bg-[#B89730]"
                                  style={{
                                    height: `${(weekRevenue[i] / maxWeekRevenue) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-[#000000] uppercase">
                                {day}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Breakdowns) */}
                  <div className="col-span-4 w-full flex flex-col gap-6">
                    {/* Order Source Breakdown */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                      <h3 className="font-bold text-[#000000] mb-4 text-sm">
                        Order Source
                      </h3>
                      {totalOrdersCount === 0 ? (
                        <div className="text-center text-[#000000] text-sm font-semibold py-6">
                          No orders yet.
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-wider w-14">
                              Offline
                            </span>
                            <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#E11D48] rounded-full transition-all duration-700"
                                style={{
                                  width: `${(offlineOrders / totalOrdersCount) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-[#000000] w-8 text-right">
                              {offlineOrders}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#00A86B] uppercase tracking-wider w-14">
                              Online
                            </span>
                            <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#00A86B] rounded-full transition-all duration-700"
                                style={{
                                  width: `${(onlineOrders / totalOrdersCount) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-[#000000] w-8 text-right">
                              {onlineOrders}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Top Items by Revenue */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex-1">
                      <h3 className="font-bold text-[#000000] text-sm mb-4">
                        Top Items by Revenue
                      </h3>
                      {topItems.length === 0 ? (
                        <div className="text-center text-[#000000] text-sm font-semibold py-6">
                          No items sold yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {topItems.map((item, idx) => (
                            <div
                              key={item.name}
                              className="flex items-center gap-3"
                            >
                              <span className="text-[11px] font-black text-[#000000] w-4">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-xs font-bold text-[#000000]">
                                    {item.name}
                                  </span>
                                  <span className="text-xs font-black text-[#8C6D23]">
                                    ₹{item.revenue.toLocaleString()}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#8C6D23] rounded-full transition-all duration-700"
                                    style={{
                                      width: `${(item.revenue / topItems[0].revenue) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <span className="text-[10px] text-[#000000] font-semibold w-10 text-right">
                                {item.qty} pcs
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {analyticsSubTab === "products" && (
              <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h3 className="font-bold text-[#000000] text-sm">
                    Product Sales Leaderboard
                  </h3>

                  {/* Product Search Input */}
                  <div className="flex items-center border border-black/10 bg-[#FFFFFF] rounded-lg px-3 py-1.5 gap-2 shadow-xs w-full sm:w-auto animate-in fade-in duration-200">
                    <Search className="w-3.5 h-3.5 text-[#000000]" />
                    <input
                      type="text"
                      placeholder="Search shirts / products..."
                      className="text-xs font-semibold bg-transparent border-none outline-none focus:ring-0 text-[#000000] placeholder:text-[#000000]/50 w-full sm:w-[180px]"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {Object.keys(itemSales).length === 0 ? (
                  <div className="text-center text-[#000000] text-sm font-semibold py-12">
                    No products sold in this period.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FFFFFF] border-b border-black/10">
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                            Qty Sold
                          </th>
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                            Revenue
                          </th>
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                            Market Share
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(itemSales).filter((item) =>
                          item.name
                            .toLowerCase()
                            .includes(productSearchQuery.toLowerCase()),
                        ).length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center py-12 text-sm font-semibold text-[#000000]"
                            >
                              No matching products found.
                            </td>
                          </tr>
                        ) : (
                          Object.values(itemSales)
                            .filter((item) =>
                              item.name
                                .toLowerCase()
                                .includes(productSearchQuery.toLowerCase()),
                            )
                            .sort((a, b) => b.revenue - a.revenue)
                            .map((item, idx) => {
                              const share =
                                totalRevenueAmount > 0
                                  ? (item.revenue / totalRevenueAmount) * 100
                                  : 0;
                              return (
                                <tr
                                  key={item.name}
                                  className="border-b border-transparent hover:bg-[#FFFFFF]/50 transition-colors"
                                >
                                  <td className="p-3 text-xs font-black text-[#000000]">
                                    {idx + 1}
                                  </td>
                                  <td className="p-3 text-xs font-bold text-[#000000]">
                                    {item.name}
                                  </td>
                                  <td className="p-3 text-xs font-bold text-[#000000] text-right">
                                    {item.qty} pcs
                                  </td>
                                  <td className="p-3 text-xs font-black text-[#8C6D23] text-right">
                                    ₹{item.revenue.toLocaleString()}
                                  </td>
                                  <td className="p-3 w-1/4">
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-[#8C6D23] rounded-full"
                                          style={{ width: `${share}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] font-bold text-[#000000] w-8">
                                        {share.toFixed(1)}%
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {analyticsSubTab === "coupons" && (
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
                <div className="col-span-1 w-full bg-white border border-black/10 rounded-xl p-6 shadow-sm flex flex-col gap-6">
                  <h3 className="font-bold text-[#000000] text-sm">
                    Discount Summary
                  </h3>

                  <div className="p-4 bg-[#FFFFFF] border border-black/10 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Discounts Given
                      </span>
                      <Percent className="w-4 h-4 text-[#8C6D23]" />
                    </div>
                    <span className="text-2xl font-black text-[#8C6D23]">
                      ₹
                      {analyticsFilteredOrders
                        .reduce((acc, o) => acc + o.discount, 0)
                        .toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 bg-[#FFFFFF] border border-black/10 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Discounted Orders
                      </span>
                      <Calendar className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <span className="text-2xl font-black text-[#000000]">
                      {
                        analyticsFilteredOrders.filter((o) => o.discount > 0)
                          .length
                      }
                    </span>
                  </div>

                  <div className="p-4 bg-[#FFFFFF] border border-black/10 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Avg Discount Per Order
                      </span>
                      <IndianRupee className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <span className="text-2xl font-black text-[#000000]">
                      ₹
                      {Math.round(
                        analyticsFilteredOrders.filter((o) => o.discount > 0)
                          .length > 0
                          ? analyticsFilteredOrders.reduce(
                              (acc, o) => acc + o.discount,
                              0,
                            ) /
                              analyticsFilteredOrders.filter(
                                (o) => o.discount > 0,
                              ).length
                          : 0,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 w-full bg-white border border-black/10 rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="font-bold text-[#000000] text-sm">
                      Promo Campaign Performance
                    </h3>

                    {/* Coupons Search Input */}
                    <div className="flex items-center border border-black/10 bg-[#FFFFFF] rounded-lg px-3 py-1.5 gap-2 shadow-xs w-full sm:w-auto animate-in fade-in duration-200">
                      <Search className="w-3.5 h-3.5 text-[#000000]" />
                      <input
                        type="text"
                        placeholder="Search code/mobile/amount..."
                        className="text-xs font-semibold bg-transparent border-none outline-none focus:ring-0 text-[#000000] placeholder:text-[#000000]/50 w-full sm:w-[220px]"
                        value={couponSearchQuery}
                        onChange={(e) => setCouponSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {analyticsFilteredOrders.filter((o) => o.discount > 0).length ===
                  0 ? (
                    <div className="text-center text-[#000000] text-sm font-semibold py-12">
                      No promotional discounts given in this period.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FFFFFF] border-b border-black/10">
                            <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                              Transaction ID
                            </th>
                            <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                              Customer Mobile
                            </th>
                            <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                              Order Total
                            </th>
                            <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                              Discount Applied
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsFilteredOrders
                            .filter((o) => o.discount > 0)
                            .filter((o) => {
                              const q = couponSearchQuery.toLowerCase();
                              const couponCode = getCouponCodeForOrder(o).toLowerCase();
                              return (
                                o.id.toLowerCase().includes(q) ||
                                couponCode.includes(q) ||
                                (o.customerPhone || "").includes(q) ||
                                o.discount.toString().includes(q) ||
                                o.grandTotal.toString().includes(q)
                              );
                            }).length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                className="text-center py-12 text-sm font-semibold text-[#000000]"
                              >
                                No matching coupon performance records found.
                              </td>
                            </tr>
                          ) : (
                            analyticsFilteredOrders
                              .filter((o) => o.discount > 0)
                              .filter((o) => {
                                const q = couponSearchQuery.toLowerCase();
                                const couponCode = getCouponCodeForOrder(o).toLowerCase();
                                return (
                                  o.id.toLowerCase().includes(q) ||
                                  couponCode.includes(q) ||
                                  (o.customerPhone || "").includes(q) ||
                                  o.discount.toString().includes(q) ||
                                  o.grandTotal.toString().includes(q)
                                );
                              })
                              .map((order) => (
                                <tr
                                  key={order.id}
                                  className="border-b border-transparent hover:bg-[#FFFFFF]/50 transition-colors"
                                >
                                  <td className="p-3 text-xs font-semibold text-[#000000]">
                                    {order.id}
                                  </td>
                                  <td className="p-3 text-xs font-mono font-bold text-[#000000]">
                                    {order.customerPhone || "-"}
                                  </td>
                                  <td className="p-3 text-xs font-bold text-right text-[#000000]">
                                    ₹{order.grandTotal.toLocaleString()}
                                  </td>
                                  <td className="p-3 text-xs font-black text-[#E11D48] text-right">
                                    -₹{order.discount.toLocaleString()}
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-black/10 flex justify-between items-center bg-[#FFFFFF]">
                <div>
                  <h3 className="text-xl font-bold text-[#000000]">
                    Order Details
                  </h3>
                  <p className="text-sm text-[#000000] font-medium mt-1">
                    {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-black/10 rounded-full transition-colors group cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#000000] group-hover:text-[#B89730] transition-colors" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-[10px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                      Customer Name
                    </div>
                    <div className="text-sm font-semibold text-[#000000]">
                      {selectedOrder.customerName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                      Contact Number
                    </div>
                    <div className="text-sm font-semibold text-[#000000]">
                      {selectedOrder.customerPhone || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                      Order Source
                    </div>
                    <div className="text-sm font-semibold text-[#000000]">
                      {selectedOrder.source}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                      Date & Time
                    </div>
                    <div className="text-sm font-semibold text-[#000000]">
                      {new Date(selectedOrder.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mb-4 text-[11px] font-bold text-[#000000] uppercase tracking-[0.1em] border-b border-black/10 pb-2">
                  Order Items
                </div>
                <div className="space-y-3 mb-8">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <div className="text-sm font-bold text-[#000000]">
                          {item.name}
                        </div>
                        {item.desc && (
                          <div className="text-[10px] text-[#000000] font-medium">
                            {item.desc}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#000000]">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#000000] font-medium">
                          {item.qty} x ₹{item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#000000] font-semibold">
                      Subtotal
                    </span>
                    <span className="text-[#000000] font-bold">
                      ₹{selectedOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#000000] font-semibold">
                        Discount
                      </span>
                      <span className="text-[#E11D48] font-bold">
                        -₹{selectedOrder.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedOrder.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#000000] font-semibold">
                        Delivery Fee
                      </span>
                      <span className="text-[#000000] font-bold">
                        ₹{selectedOrder.deliveryFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg pt-2 mt-2 border-t border-transparent">
                    <span className="text-[#000000] font-black uppercase tracking-tight">
                      Total{" "}
                    </span>
                    <span className="text-[#8C6D23] font-black">
                      ₹{selectedOrder.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="border-t border-black/10 pt-3 mt-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#000000] font-bold uppercase tracking-wider text-xs">
                        Payment Method
                      </span>
                      <span className="font-extrabold text-[#000000]">
                        {selectedOrder.paymentMethod === "split"
                          ? `Split — Cash ₹${selectedOrder.cashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} + GPay ₹${selectedOrder.gpayAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : selectedOrder.paymentMethod === "gpay"
                          ? `GPay — ₹${selectedOrder.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : `Cash — ₹${selectedOrder.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>

                    {selectedOrder.paymentMethod === "split" && (
                      <div className="bg-[#FAF8F5] border border-black/10 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex justify-between text-[#000000]">
                          <span className="font-semibold">Cash Portion:</span>
                          <span className="font-bold">₹{selectedOrder.cashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-[#000000]">
                          <span className="font-semibold">GPay / UPI Portion:</span>
                          <span className="font-bold">₹{selectedOrder.gpayAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {activeInvoiceId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-[#FAF8F5] rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
              <div className="px-4 py-3 flex justify-between items-center bg-white border-b border-black/10 shrink-0">
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-[#000000]">
                  <Printer className="w-4 h-4 text-[#8C6D23]" />
                  Invoice #{activeInvoiceId}
                </h3>
                <button
                  onClick={() => setActiveInvoiceId(null)}
                  className="w-8 h-8 flex items-center justify-center bg-black hover:bg-black/80 text-white rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 w-full bg-gray-50 overflow-hidden relative">
                <iframe 
                  src={`/invoice/${activeInvoiceId}`} 
                  className="w-full h-full border-none absolute inset-0"
                  title={`Invoice ${activeInvoiceId}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Classy Footer */}
        <footer className="mt-auto pt-10 pb-2 border-t border-black/10 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#000000] font-semibold uppercase tracking-wider gap-4">
          <div className="text-[#000000]">
            © 2026 All Rights Reserved. Take 250 Shirt Shop.
          </div>
          <div>
            Powered By{" "}
            <a
              href="https://www.cenexasystems.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C6D23] hover:underline font-bold transition-all"
            >
              Cenexa Systems
            </a>{" "}
            @2026
          </div>
          <div className="italic text-[#4B5563] font-bold tracking-[0.15em] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#8C6D23] rounded-full"></span>
            Fashions. Shawls. Accessories.
          </div>
        </footer>
      </main>
    </div>
  );
}


