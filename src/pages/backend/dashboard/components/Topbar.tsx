import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Bell, PanelLeft, Settings, LogOut, ChevronDown } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "../../../../lib/firebase/firebase"
import { type UserProfile } from "../../types/index"

interface TopbarProps {
  profile:         UserProfile | null
  username:        string
  sidebarOpen:     boolean
  onToggleSidebar: () => void
}

const ROLE_COLORS: Record<string, string> = {
  Owner:      "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Developer:  "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Moderator:  "bg-violet-500/20 text-violet-400 border-violet-500/30",
  BuilderPro: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Default:    "bg-white/10 text-gray-400 border-white/10",
}

const Topbar = ({ profile, username, sidebarOpen, onToggleSidebar }: TopbarProps) => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch]     = useState("")

  const handleSignOut = async () => {
    await signOut(auth)
    navigate("/login")
  }

  const initials = (profile?.displayName ?? "B")
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

  return (
    <header className="h-12 bg-[#1a1f2e] border-b border-white/5 flex items-center px-4 gap-3 flex-shrink-0 z-20">

      <button
        onClick={onToggleSidebar}
        className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0"
        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <PanelLeft size={16} />
      </button>

      <div className="hidden md:flex items-center gap-1.5 text-sm">
        <span className="text-gray-500">@{username}</span>
        <span className="text-gray-700">/</span>
        <span className="text-gray-200 font-medium">home</span>
      </div>

      <div className="flex-1 max-w-xs mx-auto hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20 transition-colors">
        <Search size={13} className="text-gray-500 flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search boards..."
          className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-600 focus:outline-none"
        />
        <span className="text-[10px] text-gray-600 bg-white/5 rounded px-1 hidden lg:block">⌘K</span>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
          <Bell size={16} />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[9px] font-bold">{initials}</span>
              </div>
            )}
            <span className="text-sm text-gray-300 font-medium hidden md:block max-w-[90px] truncate">
              {profile?.displayName ?? "Builder"}
            </span>
            <ChevronDown size={12} className="text-gray-500 hidden md:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-10 w-56 bg-[#1e2433] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5 mb-2">
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{initials}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{profile?.displayName}</p>
                      <p className="text-xs text-gray-500 truncate">@{username}</p>
                    </div>
                  </div>
                  {profile?.role && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[profile.role]}`}>
                      {profile.role}
                    </span>
                  )}
                </div>
                <div className="py-1">
                  <Link
                    to={`/${username}/profile`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Settings size={14} /> Profile settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar