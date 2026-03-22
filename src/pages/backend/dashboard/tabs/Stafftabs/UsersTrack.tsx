import { useEffect, useState } from "react"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../../../../../lib/firebase/firebase"
import { type UserProfile } from "../../../types/index"
import { Crown, Code2, Shield, Sparkles, Clock, Hash } from "lucide-react"

const ROLE_COLORS: Record<string, string> = {
  Owner:      "bg-orange-500/20 text-orange-400",
  Developer:  "bg-sky-500/20 text-sky-400",
  Moderator:  "bg-violet-500/20 text-violet-400",
  BuilderPro: "bg-emerald-500/20 text-emerald-400",
  Default:    "bg-white/10 text-gray-500",
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
  Owner:      <Crown size={10} />,
  Developer:  <Code2 size={10} />,
  Moderator:  <Shield size={10} />,
  BuilderPro: <Sparkles size={10} />,
  Default:    null,
}

function timeAgo(ms?: number) {
  if (!ms) return "Never"
  const diff = Date.now() - ms
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return "Just now"
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const UsersTrack = () => {
  const [users, setUsers]     = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("All")

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, snap => {
      setUsers(snap.docs.map(d => d.data() as UserProfile))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const filtered = users.filter(u => {
    const matchSearch = u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "All" || u.role === roleFilter
    return matchSearch && matchRole
  })

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total users",  value: users.length,               color: "text-[#1e2433]" },
          { label: "BuilderPro",   value: roleCounts.BuilderPro || 0, color: "text-emerald-400" },
          { label: "Default",      value: roleCounts.Default || 0,    color: "text-gray-400" },
          { label: "Staff",        value: (roleCounts.Developer || 0) + (roleCounts.Moderator || 0), color: "text-sky-400" },
        ].map(s => (
          <div key={s.label} className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500/50"
        />
        <div className="flex gap-2 flex-wrap">
          {["All", "Owner", "Developer", "Moderator", "BuilderPro", "Default"].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${roleFilter === r ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-4 py-3 border-b border-white/5 text-[10px] text-gray-500 uppercase tracking-wider">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span className="flex items-center gap-1"><Clock size={10} /> Last login</span>
          <span className="flex items-center gap-1"><Hash size={10} /> Logins</span>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-600 text-sm">No users found</div>
          ) : filtered.map(u => (
            <div key={u.uid} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-4 py-3 items-center hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">{u.displayName[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm text-[#1e2433] font-medium truncate">{u.displayName}</p>
                  <p className="text-[10px] text-gray-600 truncate">@{u.username}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 truncate">{u.email}</p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${ROLE_COLORS[u.role] ?? ROLE_COLORS.Default}`}>
                {ROLE_ICONS[u.role]}{u.role}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(u.lastLogin)}</span>
              <span className="text-xs text-gray-400 text-center">{u.loginCount ?? 0}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-600 text-right">Joined dates shown in local time</p>
    </div>
  )
}

export default UsersTrack