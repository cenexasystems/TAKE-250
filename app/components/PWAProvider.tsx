"use client";

import React, { useEffect, useState } from "react";
import { Download, RefreshCw, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // 1. Detect if running standalone
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isRunningStandalone);

    // 2. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios|edgios/.test(ua);
    setIsIOS(isIosDevice && isSafari);

    const iosHintDismissed = localStorage.getItem("take250_ios_hint_dismissed");
    if (isIosDevice && isSafari && !isRunningStandalone && !iosHintDismissed) {
      setShowIOSHint(true);
    }

    // 3. Listen for Android / Chrome / Desktop beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsStandalone(true);
      setShowIOSHint(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 4. Register Service Worker in production
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check if there is already a waiting worker
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setUpdateAvailable(true);
          }

          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setWaitingWorker(newWorker);
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("Service worker registration failed:", err);
        });

      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const handleUpdateClick = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
  };

  const dismissIOSHint = () => {
    setShowIOSHint(false);
    localStorage.setItem("take250_ios_hint_dismissed", "true");
  };

  return (
    <>
      {children}

      {/* Floating Update Notification */}
      {updateAvailable && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-sm bg-black text-white p-4 rounded-2xl shadow-2xl border border-[#D4AF37]/40 flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl">
              <RefreshCw className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Update Available</p>
              <p className="text-[11px] text-white/80">A new version of Take250 POS is ready.</p>
            </div>
          </div>
          <button
            onClick={handleUpdateClick}
            className="px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-bold rounded-xl shadow-xs hover:bg-[#F3E5AB] transition-colors shrink-0"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Install App Prompt Button (Android / Desktop) */}
      {installPrompt && !isStandalone && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 bg-black hover:bg-neutral-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg border border-[#D4AF37]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Install Take250 App"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-white">Install App</span>
          </button>
        </div>
      )}

      {/* iOS Safari "Add to Home Screen" Hint Banner */}
      {showIOSHint && !isStandalone && isIOS && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-black text-white border border-[#D4AF37]/30 shadow-2xl rounded-2xl p-4 animate-slide-up">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 p-1 border border-[#D4AF37]/30 shrink-0">
                <img src="/icon-192.png" alt="Take250" className="w-full h-full object-contain" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#D4AF37]">Install Take250 POS</p>
                <p className="text-white/80 mt-0.5 leading-relaxed">
                  Tap the <Share className="w-3.5 h-3.5 inline-block text-[#D4AF37] mx-1 -mt-0.5" /> Share button below and select <span className="font-semibold text-white">"Add to Home Screen"</span> for the best full-screen experience.
                </p>
              </div>
            </div>
            <button
              onClick={dismissIOSHint}
              className="p-1 text-white/50 hover:text-white transition-colors shrink-0 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
