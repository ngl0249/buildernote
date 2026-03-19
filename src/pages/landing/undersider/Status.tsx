import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"
import Header from "../layout/Header"

type ServiceStatus = "operational" | "degraded" | "outage"

interface Service {
  id: string
  name: string
  status: ServiceStatus
  uptime: number
}

interface Incident {
  id: string
  service: string
  title: string
  message: string
  severity: "minor" | "major" | "critical"
  status: "investigating" | "identified" | "monitoring" | "resolved"
  createdAt: any
  resolvedAt?: any
}

const FIREBASE_SERVICES: Service[] = [
  { id: "firestore", name: "Firestore Database", status: "operational", uptime: 99.98 },
  { id: "auth", name: "Firebase Auth", status: "operational", uptime: 99.99 },
  { id: "storage", name: "Firebase Storage", status: "operational", uptime: 99.95 },
]

const BUILDERNOTE_SERVICES: Service[] = [
  { id: "app", name: "Buildernote App", status: "operational", uptime: 99.9 },
  { id: "realtime", name: "Realtime sync", status: "operational", uptime: 99.85 },
  { id: "uploads", name: "File upload", status: "operational", uptime: 99.7 },
  { id: "support", name: "Customer support", status: "operational", uptime: 100 },
]

const statusColor: Record<ServiceStatus, string> = {
  operational: "text-green-400",
  degraded: "text-yellow-400",
  outage: "text-red-400",
}

const statusLabel: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
}

const severityColor: Record<string, string> = {
  minor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  major: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
}

const incidentStatusColor: Record<string, string> = {
  investigating: "text-red-400",
  identified: "text-orange-400",
  monitoring: "text-yellow-400",
  resolved: "text-green-400",
}

const UptimeBar = ({ uptime }: { uptime: number }) => {
  const bars = 90
  const greenBars = Math.round((uptime / 100) * bars)
  return (
    <div>
      <div className="flex gap-0.5 my-2">
        {Array.from({ length: bars }).map((_, i) => (
          <div key={i} className={`flex-1 h-8 rounded-sm ${i < greenBars ? "bg-green-500" : "bg-red-500/60"}`} />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>90 days ago</span>
        <span>{uptime}% uptime</span>
        <span>Today</span>
      </div>
    </div>
  )
}

const ServiceRow = ({ service }: { service: Service }) => (
  <div className="border-b border-white/10 last:border-0 py-4">
    <div className="flex items-center justify-between mb-1">
      <span className="text-sm font-medium text-white">{service.name}</span>
      <span className={`text-xs font-semibold ${statusColor[service.status]}`}>{statusLabel[service.status]}</span>
    </div>
    <UptimeBar uptime={service.uptime} />
  </div>
)

const ReportModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({ service: "app", title: "", message: "", severity: "minor" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async () => {
    if (!form.title || !form.message) return
    setSending(true)
    try {
      await addDoc(collection(db, "incidents"), { ...form, status: "investigating", createdAt: serverTimestamp() })
      setSent(true)
    } catch (e) {
      console.error(e)
    }
    setSending(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-[#1e2433] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 text-xl">✓</span>
            </div>
            <p className="text-white font-semibold mb-2">Report received</p>
            <p className="text-gray-400 text-sm mb-6">We are investigating the issue as soon as possible.</p>
            <button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold">Report an issue</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Service</label>
                <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50">
                  <option value="app">Buildernote App</option>
                  <option value="realtime">Realtime sync</option>
                  <option value="uploads">File upload</option>
                  <option value="firestore">Firestore Database</option>
                  <option value="auth">Firebase Auth</option>
                  <option value="storage">Firebase Storage</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Severity</label>
                <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50">
                  <option value="minor">Minor — Small disruption</option>
                  <option value="major">Major — Significant impact</option>
                  <option value="critical">Critical — Service down</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Title</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Short description of the issue" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Description</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe what is happening, when it started and what you tried..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={onClose} className="flex-1 border border-white/20 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={submit} disabled={sending || !form.title || !form.message} className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                {sending ? "Sending..." : "Send report"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const Status = () => {
  const [tab, setTab] = useState<"buildernote" | "firebase">("buildernote")
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, snap => {
      setIncidents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Incident)))
    })
    return () => unsub()
  }, [])

  const activeIncidents = incidents.filter(i => i.status !== "resolved")
  const resolvedIncidents = incidents.filter(i => i.status === "resolved").slice(0, 5)
  const allOperational = activeIncidents.length === 0
  const services = tab === "buildernote" ? BUILDERNOTE_SERVICES : FIREBASE_SERVICES

  return (
    <div className="min-h-screen bg-[#1e2433]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className={`rounded-2xl px-6 py-5 mb-10 ${allOperational ? "bg-green-500/15 border border-green-500/30" : "bg-red-500/15 border border-red-500/30"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${allOperational ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"}`} />
            <span className={`text-lg font-bold ${allOperational ? "text-green-400" : "text-red-400"}`}>
              {allOperational ? "All systems operational" : `${activeIncidents.length} active incident${activeIncidents.length > 1 ? "s" : ""}`}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1 ml-6">
            Updated {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit">
          <button onClick={() => setTab("buildernote")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "buildernote" ? "bg-[#1e2433] text-white shadow" : "text-gray-400 hover:text-white"}`}>Buildernote</button>
          <button onClick={() => setTab("firebase")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "firebase" ? "bg-[#1e2433] text-white shadow" : "text-gray-400 hover:text-white"}`}>Firebase</button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 mb-10">
          <p className="text-xs text-gray-500 text-right pt-4 pb-1">Uptime last 90 days</p>
          {services.map(s => <ServiceRow key={s.id} service={s} />)}
        </div>

        {activeIncidents.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white mb-4">Active Incidents</h2>
            <div className="space-y-4">
              {activeIncidents.map(inc => (
                <div key={inc.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${severityColor[inc.severity]}`}>{inc.severity.toUpperCase()}</span>
                      <span className="text-xs text-gray-500">{inc.service}</span>
                    </div>
                    <span className={`text-xs font-semibold capitalize ${incidentStatusColor[inc.status]}`}>{inc.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{inc.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{inc.message}</p>
                  {inc.createdAt && <p className="text-[10px] text-gray-600 mt-3">{inc.createdAt.toDate?.().toLocaleString("en-US") ?? ""}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-white mb-4">Past Incidents</h2>
          {resolvedIncidents.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-8 text-center">
              <p className="text-gray-500 text-sm">No incidents in the last 30 days.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resolvedIncidents.map(inc => (
                <div key={inc.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <span className="text-sm font-semibold text-gray-300">{inc.title}</span>
                    <span className="text-xs text-green-400 font-semibold flex-shrink-0">Resolved</span>
                  </div>
                  <p className="text-xs text-gray-500">{inc.service} · {inc.severity}</p>
                  {inc.createdAt && <p className="text-[10px] text-gray-600 mt-2">{inc.createdAt.toDate?.().toLocaleString("en-US") ?? ""}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 Buildernote</p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-gray-500 hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-orange-400 transition-colors">Terms of Service</Link>
            <Link to="/" className="text-gray-500 hover:text-orange-400 transition-colors">Back to home</Link>
          </div>
        </div>
      </div>

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </div>
  )
}

export default Status