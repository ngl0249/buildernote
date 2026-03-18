import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Shield, ShieldCheck } from "lucide-react";

type CookiePrefs = {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "cookie_consent";

const defaultPrefs: CookiePrefs = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
};

const cookieDetails: Record<keyof CookiePrefs, { label: string; description: string; required?: boolean }> = {
  necessary: {
    label: "Necessary",
    description: "Required for the website to function. Cannot be disabled.",
    required: true,
  },
  preferences: {
    label: "Preferences",
    description: "Remembers your settings like language and region.",
  },
  statistics: {
    label: "Statistics",
    description: "Helps us understand how visitors interact with the website anonymously.",
  },
  marketing: {
    label: "Marketing",
    description: "Used to show relevant ads and track campaign performance.",
  },
};

const CookieIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
    <path d="M8.5 8.5v.01" />
    <path d="M16 15.5v.01" />
    <path d="M12 12v.01" />
    <path d="M11 17v.01" />
    <path d="M7 14v.01" />
  </svg>
);

const Toggle = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={!disabled ? onChange : undefined}
    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border transition-all duration-200 focus:outline-none
      ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
      ${checked
        ? "bg-white border-white"
        : "bg-transparent border-zinc-600"
      }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 rounded-full my-auto transition-transform duration-200 mx-0.5
        ${checked ? "translate-x-4 bg-[#161b27]" : "translate-x-0 bg-zinc-500"}`}
    />
  </button>
);

export default function Cookies() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(defaultPrefs);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPrefs(JSON.parse(stored));
      setSaved(true);
    } else {
      setOpen(false);
    }
  }, []);

  const toggle = (key: keyof CookiePrefs) => {
    if (key === "necessary") return;
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const acceptAll = () => {
    const all: CookiePrefs = { necessary: true, preferences: true, statistics: true, marketing: true };
    setPrefs(all);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    setSaved(true);
    setOpen(false);
  };

  const saveSelection = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    setOpen(false);
  };

  const withdrawConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPrefs(defaultPrefs);
    setSaved(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Cookie settings"
        className="fixed bottom-5 left-5 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-[#161b27] border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 shadow-xl shadow-black/40 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <CookieIcon size={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => saved && setOpen(false)}
        />
      )}

      {open && (
        <div className="fixed bottom-20 left-5 z-50 w-[320px] rounded-2xl bg-[#161b27] border border-zinc-700/80 shadow-2xl  overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">

          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <CookieIcon size={16} className="text-zinc-400" />
              <span className="text-sm font-semibold text-white tracking-tight">Cookie settings</span>
            </div>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-zinc-200 transition-colors p-0.5 rounded-md hover:bg-zinc-800"
              >
                <X size={15} />
              </button>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs text-zinc-500 mb-3 font-medium uppercase tracking-wider">Your current state</p>

            <div className="space-y-3">
              {(Object.keys(cookieDetails) as (keyof CookiePrefs)[]).map((key) => {
                const { label, required } = cookieDetails[key];
                const active = prefs[key];
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {active ? (
                        <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Shield size={13} className="text-zinc-600 shrink-0" />
                      )}
                      <span className={`text-sm ${active ? "text-zinc-200" : "text-zinc-500"}`}>
                        {label}
                        {required && <span className="ml-1 text-[10px] text-zinc-600">(required)</span>}
                      </span>
                    </div>
                    <Toggle
                      checked={active}
                      onChange={() => toggle(key)}
                      disabled={required}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-5 pb-2">
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showDetails ? "Hide details" : "Show details"}
            </button>

            {showDetails && (
              <div className="mt-3 space-y-3">
                {(Object.keys(cookieDetails) as (keyof CookiePrefs)[]).map((key) => (
                  <div key={key} className="rounded-lg bg-zinc-800/60 px-3 py-2.5 border border-zinc-700/50">
                    <p className="text-xs font-medium text-zinc-300 mb-0.5">{cookieDetails[key].label}</p>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{cookieDetails[key].description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-4 pt-3 flex flex-col gap-2 border-t border-zinc-800 mt-2">
            <button
              onClick={acceptAll}
              className="w-full py-2 rounded-lg bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-100 transition-colors duration-150"
            >
              Accept all
            </button>
            <div className="flex gap-2">
              <button
                onClick={saveSelection}
                className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-medium hover:bg-zinc-700 border border-zinc-700 transition-colors duration-150"
              >
                Save selection
              </button>
              {saved && (
                <button
                  onClick={withdrawConsent}
                  className="flex-1 py-2 rounded-lg bg-transparent text-zinc-500 text-xs font-medium hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors duration-150"
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>

          <div className="px-5 pb-4 flex items-center justify-end gap-1">
            <CookieIcon size={10} className="text-zinc-700" />
            <span className="text-[10px] text-zinc-700">Cookie consent</span>
          </div>
        </div>
      )}
    </>
  );
}