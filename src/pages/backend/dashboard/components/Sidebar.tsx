import { Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import {
  LayoutGrid, CheckSquare, Settings, LogOut,
  ChevronRight, Trash2, Shield, Code2,
  MessageSquareWarning, Sparkles,
  Users, BarChart2,
} from "lucide-react"
import { auth } from "../../../../lib/firebase/firebase"
import { type UserProfile } from "../../types/index"
import logo from "/landingimg/navbar/navlogo.webp"

type Role = "Owner" | "Developer" | "Moderator" | "BuilderPro" | "Default"
type Tool =
  | "boards"
  | "todo"
  | "admin-members"
  | "admin-overview"
  | "developer"
  | "moderator"
  | "pro"

interface SidebarProps {
  open:         boolean
  profile:      UserProfile | null
  boardCount:   number
  username:     string
  activeTool:   Tool
  onToolChange: (tool: Tool) => void
}

const ROLE_COLORS: Record<string, string> = {
  Owner:      "bg-orange-500/20 text-orange-400",
  Developer:  "bg-sky-500/20 text-sky-400",
  Moderator:  "bg-violet-500/20 text-violet-400",
  BuilderPro: "bg-emerald-500/20 text-emerald-400",
  Default:    "bg-white/10 text-gray-500",
}

const ROLE_TAB: Partial<Record<Role, {
  label:   string
  accent:  string
  tools:   { tool: Tool; label: string; icon: React.ReactNode }[]
}>> = {
  Owner: {
    label:  "Admin",
    accent: "text-orange-400",
    tools: [
      { tool: "admin-members",  label: "Members",  icon: <Users size={14} /> },
      { tool: "admin-overview", label: "Overview", icon: <BarChart2 size={14} /> },
    ],
  },
  Developer: {
    label:  "Developer",
    accent: "text-sky-400",
    tools: [
      { tool: "developer", label: "Developer", icon: <Code2 size={14} /> },
    ],
  },
  Moderator: {
    label:  "Moderator",
    accent: "text-violet-400",
    tools: [
      { tool: "moderator", label: "Moderator", icon: <MessageSquareWarning size={14} /> },
    ],
  },
  BuilderPro: {
    label:  "Pro",
    accent: "text-emerald-400",
    tools: [
      { tool: "pro", label: "Pro Features", icon: <Sparkles size={14} /> },
    ],
  },
}

function NavButton({ active, onClick, icon, label, activeClass = "bg-white/10 text-white" }: {
  active:       boolean
  onClick:      () => void
  icon:         React.ReactNode
  label:        string
  activeClass?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
        active
          ? `${activeClass} font-medium`
          : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 mb-2">
      {children}
    </p>
  )
}

const Sidebar = ({ open, profile, boardCount, username, activeTool, onToolChange }: SidebarProps) => {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut(auth)
    navigate("/login")
  }

  const initials = (profile?.displayName ?? "B")
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

  const role    = (profile?.role ?? "Default") as Role
  const roleTab = ROLE_TAB[role] ?? null

  if (!open) return null

  return (
    <aside className="w-64 bg-[#161b27] flex flex-col flex-shrink-0 border-r border-white/5 h-full">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <img className="w-12 h-12" src={logo} alt="logo" />
        <span className="text-white font-bold text-xl tracking-tight">
          Builder<span className="text-orange-400">note</span>
        </span>
      </div>

      {/* Profile */}
      <Link
        to={`/${username}/profile`}
        className="flex items-center gap-3 px-4 py-3 mx-3 mt-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
      >
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-white/10" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{profile?.displayName ?? "Builder"}</p>
          <p className="text-xs text-gray-500 truncate">@{username}</p>
        </div>
        <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
      </Link>

      {/* Role badge */}
      {profile?.role && (
        <div className="px-4 mt-2 mb-1 text-center">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[profile.role] ?? ROLE_COLORS.Default}`}>
            {profile.role}
          </span>
        </div>
      )}

      <div className="h-px bg-white/5 mx-4 my-3" />

      {/* Boards */}
      <div className="px-3">
        <div className="flex items-center justify-between px-2 mb-2">
          <SectionLabel>Boards</SectionLabel>
          <span className="text-[10px] text-gray-600 bg-white/5 rounded-md px-1.5 py-0.5 -mt-2">{boardCount}</span>
        </div>
        <NavButton
          active={activeTool === "boards"}
          onClick={() => onToolChange("boards")}
          activeClass="bg-orange-500/10 text-orange-400"
          icon={<LayoutGrid size={15} />}
          label="Boards"
        />
      </div>

      <div className="h-px bg-white/5 mx-4 my-4" />

      {/* Tools */}
      <div className="px-3">
        <SectionLabel>Tools</SectionLabel>
        <NavButton
          active={activeTool === "todo"}
          onClick={() => onToolChange("todo")}
          icon={<CheckSquare size={15} className={activeTool === "todo" ? "text-orange-400" : ""} />}
          label="To-do"
        />
      </div>

      {/* Role section */}
      {roleTab && (
        <>
          <div className="h-px bg-white/5 mx-4 my-4" />
          <div className="px-3">
            <div className="flex items-center gap-2 px-2 mb-2">
              <Shield size={11} className={roleTab.accent} />
              <SectionLabel>{roleTab.label}</SectionLabel>
            </div>
            <div className="space-y-0.5">
              {roleTab.tools.map(t => (
                <NavButton
                  key={t.tool}
                  active={activeTool === t.tool}
                  onClick={() => onToolChange(t.tool)}
                  icon={
                    <span className={activeTool === t.tool ? roleTab.accent : ""}>
                      {t.icon}
                    </span>
                  }
                  label={t.label}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex-1" />

      <div className="h-px bg-white/5 mx-4 mb-3" />

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors">
          <Trash2 size={15} />
          Trash
        </button>
        <Link
          to={`/${username}/profile`}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors"
        >
          <Settings size={15} />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
export type { Tool, Role }