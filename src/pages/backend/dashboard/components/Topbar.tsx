import { useState, useRef } from "react"
import type { RefObject } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Bell, PanelLeft, Settings, LogOut, ChevronDown, Zap, Crown, Code2, Shield, Sparkles } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "../../../../lib/firebase/firebase"
import { type UserProfile } from "../../types/index"
import { useNotifications, type Notification } from "../../hooks/useNotifications"
import NotificationPanel from "./NotificationPanel"

interface TopbarProps {
  profile:         UserProfile | null
  username:        string
  sidebarOpen:     boolean
  onToggleSidebar: () => void
  boardCount?:     number
  uid?:            string
}

const FREE_LIMIT = 100

const ROLE_COLORS: Record<string, string> = {
  Owner:      "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Developer:  "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Moderator:  "bg-violet-500/20 text-violet-400 border-violet-500/30",
  BuilderPro: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Default:    "bg-white/10 text-gray-400 border-white/10",
}

const Topbar = ({
  profile, username, sidebarOpen, onToggleSidebar, boardCount = 0, uid,
}: TopbarProps) => {
  const navigate  = useNavigate()
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [search,    setSearch]    = useState("")

  const bellRef = useRef<HTMLButtonElement>(null) as RefObject<HTMLButtonElement | null>

  const {
    notifications, unreadCount, loading: notifLoading,
    markRead, markAllRead, dismiss, acceptInvite, declineInvite,
  } = useNotifications(uid)

  const handleSignOut = async () => { await signOut(auth); navigate("/login") }

  const handleAccept = async (notif: Notification) => {
    const result = await acceptInvite(notif)
    if (result) navigate(`/${result.ownerUsername}/board/${result.boardSlug}`)
  }

  const initials = (profile?.displayName ?? "B")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)

  const role        = profile?.role ?? "Default"
  const pct         = Math.min((boardCount / FREE_LIMIT) * 100, 100)
  const isNearLimit = pct >= 80
  const isAtLimit   = boardCount >= FREE_LIMIT
  const barColor    = isAtLimit ? "bg-red-500" : "bg-orange-500"

  const renderRoleSection = () => {
    if (role === "Owner") {
      return (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Crown size={12} className="text-orange-400" />
            </div>
            <span className="text-xs font-semibold text-orange-400">Owner Dashboard</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-white/5 rounded-lg px-2.5 py-2">
              <p className="text-[10px] text-gray-500 mb-0.5">Boards</p>
              <p className="text-sm font-semibold text-white">{boardCount}</p>
            </div>
            <div className="bg-white/5 rounded-lg px-2.5 py-2">
              <p className="text-[10px] text-gray-500 mb-0.5">Plan</p>
              <p className="text-sm font-semibold text-orange-400">Owner</p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${Math.min((boardCount / Math.max(boardCount, 10)) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600">Unlimited access · Full control</p>
        </div>
      )
    }

    if (role === "Developer") {
      return (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <Code2 size={12} className="text-sky-400" />
            </div>
            <span className="text-xs font-semibold text-sky-400">Developer Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-white/5 rounded-lg px-2.5 py-2">
              <p className="text-[10px] text-gray-500 mb-0.5">Boards</p>
              <p className="text-sm font-semibold text-white">{boardCount}</p>
            </div>
            <div className="bg-white/5 rounded-lg px-2.5 py-2">
              <p className="text-[10px] text-gray-500 mb-0.5">API</p>
              <p className="text-sm font-semibold text-sky-400">Enabled</p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-500"
              style={{ width: `${Math.min((boardCount / Math.max(boardCount, 10)) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600">Dev tools enabled · Unlimited boards</p>
        </div>
      )
    }

    if (role === "Moderator") {
      return (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Shield size={12} className="text-violet-400" />
            </div>
            <span className="text-xs font-semibold text-violet-400">Moderator Panel</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-white/5 rounded-lg px-2.5 py-2">
              <p className="text-[10px] text-gray-500 mb-0.5">Boards</p>
              <p className="text-sm font-semibold text-white">{boardCount}</p>
            </div>
            <div className="bg-white/5 rounded-lg px-2.5 py-2">
              <p className="text-[10px] text-gray-500 mb-0.5">Status</p>
              <p className="text-sm font-semibold text-violet-400">Active</p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-500"
              style={{ width: `${Math.min((boardCount / Math.max(boardCount, 10)) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600">Moderation tools · Unlimited boards</p>
        </div>
      )
    }

    if (role === "BuilderPro") {
      return (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Sparkles size={12} className="text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-emerald-400">BuilderPro</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-white/5 rounded-lg px-2.5 py-2">
              <p className="text-[10px] text-gray-500 mb-0.5">Boards</p>
              <p className="text-sm font-semibold text-white">{boardCount}</p>
            </div>
            <div className="bg-white/5 rounded-lg px-2.5 py-2">
              <p className="text-[10px] text-gray-500 mb-0.5">Limit</p>
              <p className="text-sm font-semibold text-emerald-400">∞</p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min((boardCount / Math.max(boardCount, 10)) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600">Unlimited boards · All pro features</p>
        </div>
      )
    }

    return (
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">
            {isAtLimit ? "Board limit reached" : "Free plan"}
          </span>
          <span className={`text-[10px] font-semibold ${isAtLimit ? "text-red-400" : isNearLimit ? "text-orange-400" : "text-gray-500"}`}>
            {boardCount} / {FREE_LIMIT}
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[10px] text-gray-600 mb-2.5">
          {isAtLimit ? "Delete boards or upgrade to create more." : `${boardCount} used · ${FREE_LIMIT - boardCount} remaining`}
        </p>
        <button
          onClick={() => { setMenuOpen(false); navigate(`/${username}/upgrade`) }}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${isAtLimit ? "bg-red-500 hover:bg-red-400 text-white" : "bg-orange-500 hover:bg-orange-400 text-white"}`}
        >
          <Zap size={11} />Upgrade for unlimited boards
        </button>
      </div>
    )
  }

  return (
    <>
      <header className="h-12 bg-[#1a1f2e] border-b border-white/5 flex items-center px-4 gap-3 flex-shrink-0 z-20 relative">
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
          <button
            ref={bellRef as RefObject<HTMLButtonElement>}
            onClick={() => { setNotifOpen(v => !v); setMenuOpen(false) }}
            className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${notifOpen ? "bg-white/10 text-white" : "hover:bg-white/10 text-gray-500 hover:text-white"}`}
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => { setMenuOpen(v => !v); setNotifOpen(false) }}
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
                <div className="absolute right-0 top-10 w-64 bg-[#1e2433] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
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

                  {renderRoleSection()}

                  <div className="py-1">
                    <Link
                      to={`/${username}/profile`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Settings size={14} />Profile settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <LogOut size={14} />Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <NotificationPanel
        open={notifOpen}
        notifications={notifications}
        unreadCount={unreadCount}
        loading={notifLoading}
        onClose={() => setNotifOpen(false)}
        onRead={markRead}
        onMarkAllRead={markAllRead}
        onDismiss={dismiss}
        onAccept={handleAccept}
        onDecline={declineInvite}
        anchorRef={bellRef}
      />
    </>
  )
}

export default Topbar