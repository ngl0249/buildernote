import { useEffect, useState } from "react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "../../../../../lib/firebase/firebase"
import { Search, ChevronDown, Shield } from "lucide-react"


type Role = "Default" | "Developer" | "Moderator" | "BuilderPro" | "Owner"

type Member = {
  uid:         string
  displayName: string
  username:    string
  email:       string
  avatarUrl:   string
  role:        Role
  createdAt:   any
}


const ROLES: Role[] = ["Default", "Developer", "Moderator", "BuilderPro", "Owner"]

const ROLE_STYLE: Record<Role, { pill: string; dot: string }> = {
  Default:    { pill: "bg-white/5 text-gray-400 border-white/10",            dot: "bg-gray-500"    },
  Developer:  { pill: "bg-sky-500/10 text-sky-400 border-sky-500/20",        dot: "bg-sky-400"     },
  Moderator:  { pill: "bg-violet-500/10 text-violet-400 border-violet-500/20", dot: "bg-violet-400" },
  BuilderPro: { pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  Owner:      { pill: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-400" },
}

const FILTER_OPTIONS: { label: string; value: Role | "all" }[] = [
  { label: "All members", value: "all" },
  { label: "Default",     value: "Default" },
  { label: "Developer",   value: "Developer" },
  { label: "Moderator",   value: "Moderator" },
  { label: "BuilderPro",  value: "BuilderPro" },
  { label: "Owner",       value: "Owner" },
]


function RoleDropdown({ member, onRoleChange, disabled }: {
  member: Member
  onRoleChange: (uid: string, role: Role) => Promise<void>
  disabled: boolean
}) {
  const [open, setOpen]       = useState(false)
  const [saving, setSaving]   = useState(false)
  const style = ROLE_STYLE[member.role]

  const handleSelect = async (role: Role) => {
    if (role === member.role) { setOpen(false); return }
    setSaving(true)
    await onRoleChange(member.uid, role)
    setSaving(false)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled || saving}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${style.pill} ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
        {saving ? "Saving…" : member.role}
        {!disabled && <ChevronDown size={10} className="opacity-60" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-36 bg-[#1e2433] border border-white/10 rounded-xl shadow-xl">
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => handleSelect(r)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                  r === member.role
                    ? "bg-white/10 text-white font-medium"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ROLE_STYLE[r].dot}`} />
                {r}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


  export default function Members({ currentUserUid, readOnly = false }: { currentUserUid: string; readOnly?: boolean }) {
  const [members, setMembers]     = useState<Member[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [filter, setFilter]       = useState<Role | "all">("all")
  

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const snap = await getDocs(collection(db, "users"))
      const data = snap.docs.map(d => ({ uid: d.id, ...d.data() } as Member))
      setMembers(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const handleRoleChange = async (uid: string, role: Role) => {
    await updateDoc(doc(db, "users", uid), { role })
    setMembers(prev => prev.map(m => m.uid === uid ? { ...m, role } : m))
  }

  const filtered = members.filter(m => {
    const matchRole   = filter === "all" || m.role === filter
    const matchSearch = search === "" ||
      m.displayName.toLowerCase().includes(search.toLowerCase()) ||
      m.username.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  return (
    <div className="flex flex-col h-full bg-[#eaeaea] font-sans">

      <div className="px-8 py-6 border-b border-stone-200/80 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Shield size={15} className="text-orange-500" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-stone-800">Members</h1>
          <span className="text-xs text-stone-400 bg-white border border-stone-200 px-2 py-0.5 rounded-md">
            {members.length}
          </span>
        </div>
        <p className="text-sm text-stone-400 pl-11">Manage roles and view all members</p>
      </div>

      <div className="px-8 py-4 border-b border-stone-200/80 shrink-0 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search members…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-xl text-stone-700 placeholder-stone-300 outline-none focus:border-stone-300"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === opt.value
                  ? "bg-stone-800 text-white"
                  : "bg-white border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1  px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-stone-300">
            <p className="text-sm">No members found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 ">
            <div className="grid grid-cols-[48px_1fr_1fr_120px] gap-4 px-5 py-3 border-b border-stone-100 bg-stone-50">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider w-8" />
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Member</span>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Email</span>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Role</span>
            </div>

            {filtered.map((member, i) => {
              const isYou = member.uid === currentUserUid
              return (
                <div
                  key={member.uid}
                  className={`grid grid-cols-[48px_1fr_1fr_120px] gap-4 px-5 py-3.5 items-center ${
                    i !== filtered.length - 1 ? "border-b border-stone-100" : ""
                  } hover:bg-stone-50/60 transition-colors`}
                >
                  <div className="w-8 h-8 shrink-0">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">
                          {(member.displayName ?? "B").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-stone-700 truncate">{member.displayName}</p>
                      {isYou && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-400 border border-stone-200">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 truncate">@{member.username}</p>
                  </div>

                  <p className="text-xs text-stone-400 truncate">{member.email}</p>

                  <RoleDropdown
                    member={member}
                    onRoleChange={handleRoleChange}
                    disabled={isYou}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}