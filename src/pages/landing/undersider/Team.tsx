import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"
import Header from "../layout/Header"
import { Crown, Code2, Shield, Users } from "lucide-react"

type TeamMember = {
  uid: string
  username: string
  displayName: string
  photoURL: string | null
  role: "owner" | "developer" | "moderator"
  email: string
  createdAt?: any
}

const ROLE_ORDER: Record<string, number> = { owner: 0, developer: 1, moderator: 2 }

const ROLE_CONFIG = {
  owner: { label: "Founder", gradient: "", border: "border-white/10", badge: "bg-orange-500/10 text-orange-400 border border-orange-500/20", glow: "", ring: "ring-orange-500/30", Icon: Crown, iconColor: "text-orange-400" },
  developer: { label: "Developer", gradient: "", border: "border-white/10", badge: "bg-white/5 text-blue-300 border border-white/10", glow: "", ring: "ring-blue-300/20", Icon: Code2, iconColor: "text-blue-300" },
  moderator: { label: "Moderator", gradient: "", border: "border-white/10", badge: "bg-white/5 text-purple-400 border border-white/10", glow: "", ring: "ring-purple/20", Icon: Shield, iconColor: "text-purple-400" },
}

function Avatar({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false)
  const config = ROLE_CONFIG[member.role]
  if (member.photoURL && !imgError) {
    return <img src={member.photoURL} alt={member.displayName || member.username} className={`w-20 h-20 rounded-full object-cover ring-2 ${config.ring}`} onError={() => setImgError(true)} />
  }
  const initials = (member.displayName || member.username || "?").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
  return <div className={`w-20 h-20 rounded-full flex items-center justify-center ring-2 ${config.ring} bg-[#1a1f2e] text-2xl font-bold text-white`}>{initials}</div>
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const config = ROLE_CONFIG[member.role]
  const { Icon } = config
  return (
    <div className={`group relative rounded-2xl border ${config.border} bg-[#111827]/80 backdrop-blur-sm p-6 flex flex-col items-center gap-4 text-center w-52 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 ease-out cursor-default overflow-hidden`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar member={member} />
          <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0d1117] border ${config.border} flex items-center justify-center`}>
            <Icon size={12} className={config.iconColor} />
          </span>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight">{member.displayName || member.username}</h3>
          <p className="text-gray-400 text-sm mt-0.5">@{member.username}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.badge}`}>
          <Icon size={11} />{config.label}
        </span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#111827]/60 p-6 flex flex-col items-center gap-4 animate-pulse">
      <div className="w-20 h-20 rounded-full bg-white/10" />
      <div className="space-y-2 w-full flex flex-col items-center">
        <div className="h-4 w-32 bg-white/10 rounded" />
        <div className="h-3 w-20 bg-white/5 rounded" />
      </div>
      <div className="h-6 w-24 bg-white/10 rounded-full" />
    </div>
  )
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("role", "in", ["owner", "developer", "moderator", "Owner", "Developer", "Moderator"]))
        const snapshot = await getDocs(q)
        const data: TeamMember[] = snapshot.docs.map((doc) => {
          const d = doc.data()
          return { uid: doc.id, ...d, role: (d.role?.toLowerCase()) as TeamMember["role"], photoURL: d.photoURL ?? d.avatarUrl ?? null } as TeamMember
        })
        data.sort((a, b) => (ROLE_ORDER[a.role] ?? 99) - (ROLE_ORDER[b.role] ?? 99))
        setMembers(data)
      } catch (err) {
        console.error(err)
        setError("Could not load team members.")
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  const owners = members.filter((m) => m.role === "owner")
  const developers = members.filter((m) => m.role === "developer")
  const moderators = members.filter((m) => m.role === "moderator")

  const Section = ({ title, items, start }: { title: string; items: TeamMember[]; start: number }) => {
    if (items.length === 0) return null
    return (
      <div className="mb-12">
        <h2 className="text-gray-400 uppercase tracking-widest text-xs font-semibold mb-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/5" />{title}<span className="h-px flex-1 bg-white/5" />
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((m, i) => <MemberCard key={m.uid} member={m} index={start + i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-4">
            <Users size={12} />Meet the team
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-white">
            Behind <span className="text-white">Builder</span><span className="text-orange-400">note</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">The dedicated people who build and maintain the platform.</p>
        </div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20"><p className="text-red-400 text-sm">{error}</p></div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">No team members found.</div>
        ) : (
          <>
            <Section title="Founder" items={owners} start={0} />
            <Section title="Developers" items={developers} start={owners.length} />
            <Section title="Moderators" items={moderators} start={owners.length + developers.length} />
          </>
        )}
      </main>

      <footer className="border-t border-white/5 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Buildernote. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="/" className="hover:text-gray-300 transition-colors">Back to home</a>
          </div>
        </div>
      </footer>
    </div>
  )
}