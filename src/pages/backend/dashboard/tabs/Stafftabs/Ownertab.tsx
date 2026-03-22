import { useEffect, useState, useCallback } from "react"
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from "firebase/firestore"
import { db } from "../../../../../lib/firebase/firebase"
import {
  Power, AlertTriangle, CheckCircle2, Loader2, Globe,
  LayoutDashboard, Zap, RefreshCw, Flame, Cloud,
} from "lucide-react"

const STATUS_DOC   = doc(db, "config", "siteStatus")
const API_URL      = "https://buildernoteapi.onrender.com"
const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string

type ServiceStatus = "checking" | "online" | "offline" | "failed"

interface ServiceState {
  status:      ServiceStatus
  latency:     number | null
  lastChecked: Date | null
}

const defaultService = (): ServiceState => ({
  status:      "checking",
  latency:     null,
  lastChecked: null,
})

const OwnerTab = () => {
  const [frontOnline,     setFrontOnline]     = useState<boolean | null>(null)
  const [dashboardOnline, setDashboardOnline] = useState<boolean | null>(null)
  const [saving,          setSaving]          = useState<"front" | "dashboard" | null>(null)

  const [api,        setApi]        = useState<ServiceState>(defaultService())
  const [firebase,   setFirebase]   = useState<ServiceState>(defaultService())
  const [cloudinary, setCloudinary] = useState<ServiceState>(defaultService())

  useEffect(() => {
    const unsub = onSnapshot(STATUS_DOC, snap => {
      if (snap.exists()) {
        setFrontOnline(snap.data().online ?? true)
        setDashboardOnline(snap.data().dashboardOnline ?? true)
      } else {
        setFrontOnline(true)
        setDashboardOnline(true)
      }
    })
    return () => unsub()
  }, [])

  const checkApi = useCallback(async () => {
    setApi(s => ({ ...s, status: "checking" }))
    const start = Date.now()
    try {
      const res = await fetch(`${API_URL}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(8000),
      })
      setApi({ status: res.ok ? "online" : "failed", latency: Date.now() - start, lastChecked: new Date() })
    } catch {
      setApi({ status: "offline", latency: null, lastChecked: new Date() })
    }
  }, [])

  const checkFirebase = useCallback(async () => {
    setFirebase(s => ({ ...s, status: "checking" }))
    const start = Date.now()
    try {
      await getDoc(doc(db, "config", "siteStatus"))
      setFirebase({ status: "online", latency: Date.now() - start, lastChecked: new Date() })
    } catch {
      setFirebase({ status: "offline", latency: null, lastChecked: new Date() })
    }
  }, [])

  const checkCloudinary = useCallback(async () => {
    setCloudinary(s => ({ ...s, status: "checking" }))
    const start = Date.now()
    try {
      const url = CLOUDINARY_CLOUD
        ? `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/w_1,h_1/sample.jpg`
        : "https://res.cloudinary.com/demo/image/upload/w_1,h_1/sample.jpg"
      const res = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(8000),
        mode:   "no-cors", 
      })
      void res
      setCloudinary({ status: "online", latency: Date.now() - start, lastChecked: new Date() })
    } catch {
      setCloudinary({ status: "offline", latency: null, lastChecked: new Date() })
    }
  }, [])

  const checkAll = useCallback(() => {
    checkApi()
    checkFirebase()
    checkCloudinary()
  }, [checkApi, checkFirebase, checkCloudinary])

  useEffect(() => {
    checkAll()
    const interval = setInterval(checkAll, 30_000)
    return () => clearInterval(interval)
  }, [checkAll])

  const toggleFront = async () => {
    setSaving("front")
    try {
      await updateDoc(STATUS_DOC, { online: !frontOnline })
    } catch {
      await setDoc(STATUS_DOC, { online: !frontOnline, dashboardOnline: dashboardOnline ?? true })
    }
    setSaving(null)
  }

  const toggleDashboard = async () => {
    setSaving("dashboard")
    try {
      await updateDoc(STATUS_DOC, { dashboardOnline: !dashboardOnline })
    } catch {
      await setDoc(STATUS_DOC, { online: frontOnline ?? true, dashboardOnline: !dashboardOnline })
    }
    setSaving(null)
  }

  if (frontOnline === null || dashboardOnline === null) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const statusColors = (status: ServiceStatus) => ({
    checking: { bg: "bg-yellow-500/10", text: "text-yellow-500", badge: "bg-yellow-500/10 text-yellow-600", dot: "bg-yellow-400 animate-pulse", border: "border-stone-200" },
    online:   { bg: "bg-emerald-500/10", text: "text-emerald-500", badge: "bg-emerald-500/10 text-emerald-600", dot: "bg-emerald-500 animate-pulse", border: "border-stone-200" },
    offline:  { bg: "bg-red-500/10",     text: "text-red-500",     badge: "bg-red-500/10 text-red-600",         dot: "bg-red-500",                  border: "border-red-200" },
    failed:   { bg: "bg-orange-500/10",  text: "text-orange-500",  badge: "bg-orange-500/10 text-orange-600",   dot: "bg-orange-500",               border: "border-orange-200" },
  }[status])

  const statusLabel = (status: ServiceStatus) => ({
    checking: "Checking...",
    online:   "Online",
    offline:  "Offline",
    failed:   "Failed",
  }[status])

  const services = [
    {
      key:     "api",
      label:   "API Server",
      url:     API_URL,
      icon:    <Zap size={18} />,
      state:   api,
      refresh: checkApi,
    },
    {
      key:     "firebase",
      label:   "Firebase",
      url:     "firestore.googleapis.com",
      icon:    <Flame size={18} />,
      state:   firebase,
      refresh: checkFirebase,
    },
    {
      key:     "cloudinary",
      label:   "Cloudinary",
      url:     "res.cloudinary.com",
      icon:    <Cloud size={18} />,
      state:   cloudinary,
      refresh: checkCloudinary,
    },
  ]

  const controls = [
    {
      key:    "front",
      label:  "Maintenance Frontpage",
      desc:   "Controls the public landing pages — login, register, guides etc.",
      icon:   <Globe size={18} />,
      online:  frontOnline,
      toggle:  toggleFront,
      saving:  saving === "front",
    },
    {
      key:    "dashboard",
      label:  "Maintenance Dashboard",
      desc:   "Controls access to the dashboard, boards and profile pages.",
      icon:   <LayoutDashboard size={18} />,
      online:  dashboardOnline,
      toggle:  toggleDashboard,
      saving:  saving === "dashboard",
    },
  ]

  const anyServiceDown = services.some(s => s.state.status === "offline" || s.state.status === "failed")

  return (
    <div className="flex flex-col h-full bg-[#eaeaea] font-sans">

      <div className="px-8 py-6 border-b border-stone-200/80 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Power size={15} className="text-orange-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-stone-800 tracking-tight">Site Control</h1>
              <p className="text-sm text-stone-400">Control site availability for all users</p>
            </div>
          </div>
          <button
            onClick={checkAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <RefreshCw size={12} />
            Refresh all
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

        <div>
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">
            Service Status
          </p>
          <div className="space-y-2">
            {services.map(svc => {
              const c = statusColors(svc.state.status)
              return (
                <div key={svc.key} className={`bg-white rounded-xl border shadow-sm p-4 ${c.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                      <span className={c.text}>{svc.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800">{svc.label}</p>
                      <p className="text-[11px] text-stone-400 truncate">{svc.url}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {svc.state.latency !== null && svc.state.status === "online" && (
                        <span className="text-[10px] text-stone-400 font-mono">{svc.state.latency}ms</span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                        {statusLabel(svc.state.status)}
                      </span>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                      <button
                        onClick={svc.refresh}
                        disabled={svc.state.status === "checking"}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-40"
                        title="Refresh"
                      >
                        <RefreshCw size={11} className={svc.state.status === "checking" ? "animate-spin" : ""} />
                      </button>
                    </div>
                  </div>
                  {svc.state.lastChecked && (
                    <p className="text-[10px] text-stone-300 mt-2 pl-12">
                      Last checked: {svc.state.lastChecked.toLocaleTimeString()} · auto-refresh every 30s
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {anyServiceDown && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle size={13} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600">
                One or more services are unavailable. This may affect site functionality.
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">
            Maintenance Mode
          </p>
          <div className="space-y-2">
            {controls.map(c => (
              <div key={c.key} className={`bg-white rounded-xl border shadow-sm p-5 ${!c.online ? "border-red-200" : "border-stone-200"}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.online ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                    <span className={c.online ? "text-emerald-500" : "text-red-500"}>{c.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-800">{c.label}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">{c.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.online ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
                      {c.online ? "Online" : "Offline"}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${c.online ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                  </div>
                </div>
                <button
                  onClick={c.toggle}
                  disabled={c.saving}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                    c.online
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  }`}
                >
                  {c.saving
                    ? <Loader2 size={13} className="animate-spin" />
                    : c.online
                    ? <><AlertTriangle size={13} /> Switch to Offline</>
                    : <><CheckCircle2 size={13} /> Switch to Online</>
                  }
                </button>
              </div>
            ))}
          </div>

          {(!frontOnline || !dashboardOnline) && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600">
                {!frontOnline && !dashboardOnline
                  ? "Both frontpage and dashboard are in maintenance mode."
                  : !frontOnline
                  ? "Frontpage is in maintenance mode — public pages show the maintenance screen."
                  : "Dashboard is in maintenance mode — logged in users cannot access the dashboard."
                }
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default OwnerTab