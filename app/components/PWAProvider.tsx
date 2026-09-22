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

    const iosHintDismissed = localStorage.getItem("zera_ios_hint_dismissed");
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
    localStorage.setItem("zera_ios_hint_dismissed", "true");
  };

  return (
    <>
      {children}

      {/* Floating Update Notification */}
      {updateAvailable && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-sm bg-[#6B1422] text-white p-4 rounded-2xl shadow-xl border border-white/20 flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <RefreshCw className="w-5 h-5 text-[#f6e097]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Update Available</p>
              <p className="text-[11px] text-white/80">A new version of Zera POS is ready.</p>
            </div>
          </div>
          <button
            onClick={handleUpdateClick}
            className="px-3 py-1.5 bg-white text-[#6B1422] text-xs font-bold rounded-xl shadow-xs hover:bg-[#FAF8F5] transition-colors shrink-0"
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
            className="flex items-center gap-2 bg-[#6B1422] hover:bg-[#852233] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg border border-white/10 transition-all hover:scale-105 active:scale-95"
            title="Install Zera App"
          >
            <Download className="w-4 h-4 text-[#f6e097]" />
            <span>Install App</span>
          </button>
        </div>
      )}

      {/* iOS Safari "Add to Home Screen" Hint Banner */}
      {showIOSHint && !isStandalone && isIOS && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-white border border-black/10 shadow-2xl rounded-2xl p-4 text-[#1A1A1A] animate-slide-up">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] p-1 border border-black/10 shrink-0">
                <img src="/icon-192.png" alt="Zera" className="w-full h-full object-contain" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#6B1422]">Install Zera POS</p>
                <p className="text-black/70 mt-0.5 leading-relaxed">
                  Tap the <Share className="w-3.5 h-3.5 inline-block text-[#6B1422] mx-1 -mt-0.5" /> Share button below and select <span className="font-semibold text-black">"Add to Home Screen"</span> for the best full-screen experience.
                </p>
              </div>
            </div>
            <button
              onClick={dismissIOSHint}
              className="p-1 text-black/40 hover:text-black transition-colors shrink-0"
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
