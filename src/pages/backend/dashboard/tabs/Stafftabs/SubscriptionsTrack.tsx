import { useEffect, useState } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../../../../../lib/firebase/firebase"
import { type UserProfile } from "../../../types/index"
import { Sparkles, Calendar, TrendingUp } from "lucide-react"

function formatDate(ms?: number) {
  if (!ms) return "—"
  return new Date(ms).toLocaleDateString("da-DK", { day: "2-digit", month: "short", year: "numeric" })
}

const SubscriptionsTrack = () => {
  const [subs, setSubs]       = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "BuilderPro"))
    const unsub = onSnapshot(q, snap => {
      setSubs(snap.docs.map(d => d.data() as UserProfile))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const mrr = subs.length * 75
  const arr = subs.length * 720

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active subscribers", value: String(subs.length), suffix: "",    color: "text-emerald-600", icon: <Sparkles size={16} /> },
          { label: "MRR",                value: String(mrr),         suffix: " kr", color: "text-orange-500",  icon: <TrendingUp size={16} /> },
          { label: "ARR",                value: String(arr),         suffix: " kr", color: "text-orange-500",  icon: <TrendingUp size={16} /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={s.color}>{s.icon}</span>
              <p className="text-xs text-stone-400 font-medium">{s.label}</p>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>
              {s.value}<span className="text-sm font-normal text-stone-400 ml-1">{s.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-4 py-3 border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
          <span>User</span>
          <span>Email</span>
          <span className="flex items-center gap-1"><Calendar size={10} /> Subscribed</span>
        </div>
        <div className="divide-y divide-stone-100">
          {subs.length === 0 ? (
            <div className="px-4 py-8 text-center text-stone-400 text-sm">No active subscribers</div>
          ) : subs.map(u => (
            <div key={u.uid} className="grid grid-cols-[1fr_1fr_auto] gap-4 px-4 py-3 items-center hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">{u.displayName[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm text-stone-700 font-medium truncate">{u.displayName}</p>
                  <p className="text-[10px] text-stone-400 truncate">@{u.username}</p>
                </div>
              </div>
              <p className="text-xs text-stone-500 truncate">{u.email}</p>
              <span className="text-xs text-stone-400 whitespace-nowrap">{formatDate(u.subscribedAt)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-stone-400 text-right">MRR beregnet på 75 kr/md · ARR på 720 kr/år</p>
    </div>
  )
}

export default SubscriptionsTrack