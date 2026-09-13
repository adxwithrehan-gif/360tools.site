import React, { useState } from 'react';
import { 
  X, Monitor, Smartphone, Apple, Check, Download, ExternalLink, 
  Sparkles, ArrowRight, Laptop, Share2, PlusSquare
} from 'lucide-react';

interface InstallShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall: () => Promise<boolean>;
  isInstallable: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
}

export const InstallShortcutModal: React.FC<InstallShortcutModalProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  isInstallable,
  isIOS,
  isAndroid,
  isDesktop
}) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'android' | 'ios'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'desktop'
  );
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await onNativeInstall();
      if (accepted) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Brand Logo */}
        <div className="px-6 py-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e5322d] text-white font-black text-xl flex items-center justify-center shadow-md">
              360
            </div>
            <div>
              <h3 className="font-black text-base leading-tight flex items-center gap-1.5">
                Install 360tools App
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/30 text-red-200 px-2 py-0.5 rounded-full">
                  Shortcut
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                1-Click desktop & mobile shortcut for instant access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Native Install Banner if Supported */}
        {isInstallable && !installSuccess && (
          <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e5322d] text-white flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Direct 1-Click Install Ready</p>
                <p className="text-slate-600">Your browser supports instant installation</p>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-[#e5322d] hover:bg-[#c92622] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Now</span>
            </button>
          </div>
        )}

        {installSuccess && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2.5 text-emerald-800 text-xs font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>360tools shortcut installed successfully! Check your desktop/home screen.</span>
          </div>
        )}

        {/* Tab Selector: Desktop PC vs Android vs iOS */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'desktop'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-blue-600" />
            <span>PC / Desktop</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'android'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ios'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-slate-900" />
            <span>iPhone / iPad</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4 text-xs text-slate-600 leading-relaxed">
          {activeTab === 'desktop' && (
            <div className="space-y-3.5">
              <p className="font-semibold text-slate-800">
                Install <strong>360tools</strong> as a standalone desktop application on Windows, Mac, or Linux:
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold block">Method 1: Address Bar Install Icon</strong>
                    <p className="text-slate-500 mt-0.5">
                      In Chrome, Edge, or Brave, look at the right side of your browser URL/address bar and click the <strong>Install / Computer Icon</strong> (or press the direct "Install Now" button above).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold block">Method 2: Browser Menu (Three Dots ⋮)</strong>
                    <p className="text-slate-500 mt-0.5">
                      Click the <strong>Menu (⋮)</strong> top-right in your browser → select <strong>"Save and share"</strong> (or <strong>"More Tools"</strong>) → click <strong>"Create shortcut..."</strong> or <strong>"Install 360tools"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold block">Desktop Shortcut Ready</strong>
                    <p className="text-slate-500 mt-0.5">
                      360tools will now open in a dedicated, ultra-fast distraction-free window without browser tabs, pinned directly to your Desktop and Taskbar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-3.5">
              <p className="font-semibold text-slate-800">
                Add <strong>360tools</strong> directly to your Android mobile home screen:
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold block">Tap the Chrome Menu (⋮)</strong>
                    <p className="text-slate-500 mt-0.5">
                      Open 360tools in Chrome, then tap the three dots <strong>(⋮)</strong> in the top-right corner.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold block">Select "Install app" or "Add to Home screen"</strong>
                    <p className="text-slate-500 mt-0.5">
                      Tap <strong>"Install app"</strong> (or <strong>"Add to Home screen"</strong>) from the dropdown options.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold block">Instant App Icon on Phone</strong>
                    <p className="text-slate-500 mt-0.5">
                      Tap <strong>Install</strong> to confirm. The 360tools app icon will appear on your phone alongside your other mobile apps!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-3.5">
              <p className="font-semibold text-slate-800">
                Add <strong>360tools</strong> to your iPhone or iPad Home Screen:
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                      Tap the Share Button <Share2 className="w-3.5 h-3.5 text-blue-600 inline" />
                    </strong>
                    <p className="text-slate-500 mt-0.5">
                      In Safari, tap the <strong>Share</strong> button (the square with an arrow pointing upward) located at the bottom of the screen.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                      Tap "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 text-slate-700 inline" />
                    </strong>
                    <p className="text-slate-500 mt-0.5">
                      Scroll down the share sheet menu and select <strong>"Add to Home Screen"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold block">Tap "Add" in Top-Right</strong>
                    <p className="text-slate-500 mt-0.5">
                      Tap <strong>"Add"</strong> in the top right corner. The 360tools icon will now be on your iOS home screen!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits summary */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] text-slate-500 text-center">
            <div className="p-2 rounded-xl bg-slate-50">
              <strong className="text-slate-800 block font-bold">⚡ Zero Lag</strong>
              Instant loading
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <strong className="text-slate-800 block font-bold">🔒 100% Private</strong>
              Runs in browser
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <strong className="text-slate-800 block font-bold">📶 Works Offline</strong>
              Cached utilities
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
