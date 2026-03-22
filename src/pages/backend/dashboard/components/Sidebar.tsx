import { Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import {
  LayoutGrid, CheckSquare, Settings, LogOut,
  ChevronRight, Trash2, Shield, Code2,
  MessageSquareWarning, Sparkles, Users,
  Calendar, Pencil, Eye, ExternalLink, Power,
} from "lucide-react"
import { type RefObject } from "react"
import { auth } from "../../../../lib/firebase/firebase"
import { type UserProfile } from "../../types/index"
import { useSharedBoards } from "../../hooks/Usesharedboards"
import { getIcon } from "../../hooks/BoardIcons"
import logo from "/landingimg/navbar/navlogo.webp"

type Role = "Owner" | "Developer" | "Moderator" | "BuilderPro" | "Default"
type Tool =
  | "boards" | "todo" | "calendar" | "admin-members" | "developer"
  | "moderator" | "pro" | "activity" | "billing" | "team" | "owner-control" | "projekt"

interface SidebarProps {
  open: boolean
  profile: UserProfile | null
  uid?: string
  boardCount: number
  trashCount: number
  trashOpen: boolean
  username: string
  activeTool: Tool
  onToolChange: (tool: Tool) => void
  onTrashOpen: () => void
  trashButtonRef: RefObject<HTMLButtonElement | null>
}

const ROLE_COLORS: Record<string, string> = {
  Owner:      "bg-orange-500/20 text-orange-400",
  Developer:  "bg-sky-500/20 text-sky-400",
  Moderator:  "bg-violet-500/20 text-violet-400",
  BuilderPro: "bg-emerald-500/20 text-emerald-400",
  Default:    "bg-white/10 text-gray-500",
}

const ROLE_TAB: Partial<Record<Role, {
  label: string; accent: string
  tools: { tool: Tool; label: string; icon: React.ReactNode }[]
}>> = {
  Owner: {
    label: "Admin", accent: "text-orange-400", tools: [
      { tool: "admin-members", label: "Members",      icon: <Users size={14} /> },
      { tool: "owner-control", label: "Site Control", icon: <Power size={14} /> },
    ]
  },
  Developer:  { label: "Developer", accent: "text-sky-400",     tools: [{ tool: "developer", label: "Developer",    icon: <Code2 size={14} /> }] },
  Moderator:  { label: "Moderator", accent: "text-violet-400",  tools: [{ tool: "moderator", label: "Moderator",    icon: <MessageSquareWarning size={14} /> }] },
  BuilderPro: { label: "Builderpro", accent: "text-emerald-400", tools: [{ tool: "pro",      label: "Pro Features", icon: <Sparkles size={14} /> }] },
}

function NavButton({ active, onClick, icon, label, activeClass = "bg-white/10 text-white" }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; activeClass?: string
}) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${active ? `${activeClass} font-medium` : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
      {icon}{label}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 mb-2">{children}</p>
}

type SharedBoard = ReturnType<typeof useSharedBoards>["sharedBoards"][number]

function SharedBoardRow({ board }: { board: SharedBoard }) {
  const BoardIcon = getIcon(board.iconName)
  const isEditor = board.role === "editor"

  return (
    <Link
      to={`/${board.ownerName}/board/${board.slug}`}
      className="group flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
    >
      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: board.color + "22" }}>
        <BoardIcon size={12} style={{ color: board.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-gray-300 group-hover:text-white truncate leading-none mb-0.5 transition-colors">{board.title}</p>
        <p className="text-[10px] text-gray-600 truncate leading-none">@{board.ownerName}</p>
      </div>
      <span className={`flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${isEditor ? "text-sky-500 bg-sky-500/10" : "text-gray-600 bg-white/5"}`}>
        {isEditor ? <Pencil size={8} /> : <Eye size={8} />}
        {isEditor ? "Editor" : "Viewer"}
      </span>
      <ExternalLink size={10} className="text-gray-700 group-hover:text-gray-500 transition-colors flex-shrink-0" />
    </Link>
  )
}

const Sidebar = ({
  open, profile, uid, boardCount, trashCount, trashOpen,
  username, activeTool, onToolChange, onTrashOpen, trashButtonRef,
}: SidebarProps) => {
  const navigate = useNavigate()
  const { sharedBoards, loading: sharedLoading } = useSharedBoards(uid)

  const handleSignOut = async () => { await signOut(auth); navigate("/login") }

  const initials = (profile?.displayName ?? "B").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  const role = (profile?.role ?? "Default") as Role
  const roleTab = ROLE_TAB[role] ?? null

  if (!open) return null

  return (
    <aside className="w-64 bg-[#161b27] flex flex-col flex-shrink-0 border-r border-white/5 h-full overflow-y-auto">

      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 flex-shrink-0">
        <img className="w-12 h-12" src={logo} alt="logo" />
        <span className="text-white font-bold text-xl tracking-tight">
          Builder<span className="text-orange-400">note</span>
        </span>
      </div>

      <Link to={`/${username}/profile`}
        className="flex items-center gap-3 px-4 py-3 mx-3 mt-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group flex-shrink-0">
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

      {profile?.role && (
        <div className="px-4 mt-2 mb-1 text-center">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[profile.role] ?? ROLE_COLORS.Default}`}>
            {profile.role}
          </span>
        </div>
      )}

      <div className="h-px bg-white/5 mx-4 my-3" />

      <div className="px-3 flex-shrink-0">
        <div className="flex items-center justify-between px-2 mb-2">
          <SectionLabel>Boards</SectionLabel>
          <span className="text-[10px] text-gray-600 bg-white/5 rounded-md px-1.5 py-0.5 -mt-2">{boardCount}</span>
        </div>
        <NavButton active={activeTool === "boards"} onClick={() => onToolChange("boards")}
          activeClass="bg-orange-500/10 text-orange-400" icon={<LayoutGrid size={15} />} label="Boards" />
      </div>

      <div className="h-px bg-white/5 mx-4 my-4" />

      <div className="px-3 flex-shrink-0">
        <SectionLabel>Tools</SectionLabel>
        <NavButton active={activeTool === "todo"} onClick={() => onToolChange("todo")}
          icon={<CheckSquare size={15} className={activeTool === "todo" ? "text-orange-400" : ""} />} label="To-do" />
        <NavButton active={activeTool === "calendar"} onClick={() => onToolChange("calendar")}
          icon={<Calendar size={15} className={activeTool === "calendar" ? "text-orange-400" : ""} />} label="Calendar" />
        <NavButton active={activeTool === "projekt"} onClick={() => onToolChange("projekt")}
          icon={<CheckSquare size={15} className={activeTool === "projekt" ? "text-orange-400" : ""} />} label="Projects" />
      </div>

      <div className="h-px bg-white/5 mx-4 my-4" />

      <div className="px-3 flex-shrink-0">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Users size={10} className="text-gray-500" />
            <SectionLabel>Team boards</SectionLabel>
          </div>
        </div>
        {sharedLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-3.5 h-3.5 border border-orange-500/50 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : sharedBoards.length === 0 ? (
          <div className="px-2 py-3 text-[11px] text-gray-500 italic">
            You are not part of a team
          </div>
        ) : (
          <div className="space-y-0.5">
            {sharedBoards.map(b => (
              <SharedBoardRow key={`${b.ownerUid}-${b.boardId}`} board={b} />
            ))}
          </div>
        )}
      </div>

      {roleTab && (
        <>
          <div className="h-px bg-white/5 mx-4 my-4" />
          <div className="px-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-2 mb-2">
              <Shield size={11} className={roleTab.accent} />
              <SectionLabel>{roleTab.label}</SectionLabel>
            </div>
            {roleTab.tools.map(t => (
              <NavButton key={t.tool} active={activeTool === t.tool} onClick={() => onToolChange(t.tool)}
                icon={<span className={activeTool === t.tool ? roleTab.accent : ""}>{t.icon}</span>} label={t.label} />
            ))}
          </div>
        </>
      )}

      <div className="flex-1" />
      <div className="h-px bg-white/5 mx-4 mb-3" />

      <div className="px-3 pb-4 space-y-0.5 flex-shrink-0">
        <button ref={trashButtonRef} onMouseDown={e => { e.preventDefault(); onTrashOpen() }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${trashOpen ? "bg-white/10 text-white font-medium" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
          <Trash2 size={15} className={trashOpen ? "text-orange-400" : ""} />
          <span className="flex-1 text-left">Trash</span>
          {trashCount > 0 && (
            <span className="text-[10px] bg-white/10 text-gray-400 rounded-md px-1.5 py-0.5">{trashCount}</span>
          )}
        </button>

        <Link to={`/${username}/profile`}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors">
          <Settings size={15} />Settings
        </Link>

        <button onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500/70 hover:bg-red-500/10 hover:text-red-400 transition-colors">
          <LogOut size={15} />Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
export type { Tool, Role }