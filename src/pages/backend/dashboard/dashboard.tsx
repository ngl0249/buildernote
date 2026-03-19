import { useState, useRef } from "react"
import { Navigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useBoards } from "../hooks/useBoards"
import { useOnlinePresence } from "../hooks/useOnlinePresence"
import Topbar from "./components/Topbar"
import Sidebar, { type Tool } from "./components/Sidebar"
import TrashPanel from "./components/Trash"
import BoardsGrid from "./components/BoardsGrid"
import Todo from "./tabs/ToDo"
import Calendar from "./tabs/Calender"
import { AdminMembersTab, DeveloperTab, ModeratorTab, ProTab } from "./tabs/RolesTabs"

const Dashboard = () => {
  const { username } = useParams<{ username: string }>()
  const { user, profile, loading } = useAuth()
  const {
    boards, deletedBoards, loading: boardsLoading,
    createBoard, renameBoard, deleteBoard,
    restoreBoard, deleteForever, reorderBoards,
  } = useBoards(user?.uid)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTool, setActiveTool]   = useState<Tool>("boards")
  const [trashOpen, setTrashOpen]     = useState(false)
  const trashButtonRef                = useRef<HTMLButtonElement>(null)

  useOnlinePresence(user?.uid)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e2433] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const handle = profile?.username || user.uid
  if (username && username !== handle) {
    return <Navigate to={`/${handle}/home`} replace />
  }

  const role = profile?.role ?? "Default"

  const handleToolChange = (tool: Tool) => {
    if (tool === "admin-members"  && role !== "Owner")      return
    if (tool === "developer"      && role !== "Developer")  return
    if (tool === "moderator"      && role !== "Moderator")  return
    if (tool === "pro"            && role !== "BuilderPro") return
    setTrashOpen(false)
    setActiveTool(tool)
  }

  const renderMain = () => {
    switch (activeTool) {
      case "todo":           return <Todo />
      case "calendar": return <Calendar />
      case "admin-members":  return role === "Owner"      ? <AdminMembersTab currentUserUid={user.uid} /> : null
      case "developer":      return role === "Developer"  ? <DeveloperTab />  : null
      case "moderator":      return role === "Moderator"  ? <ModeratorTab />  : null
      case "pro":            return role === "BuilderPro" ? <ProTab />        : null
      default:
        return (
          <div className="h-full overflow-y-auto bg-[#eaeaea] p-6 md:p-10">
            <BoardsGrid
              boards={boards}
              loading={boardsLoading}
              username={handle}
              onCreate={(title, iconName, color) => createBoard(title, iconName, color)}
              onRename={renameBoard}
              onDelete={deleteBoard}
              onReorder={reorderBoards}
            />
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-[#1e2433] overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        profile={profile}
        uid={user.uid}
        boardCount={boards.length}
        trashCount={deletedBoards.length}
        trashOpen={trashOpen}
        username={handle}
        activeTool={activeTool}
        onToolChange={handleToolChange}
        onTrashOpen={() => setTrashOpen(v => !v)}
        trashButtonRef={trashButtonRef}
      />

      <TrashPanel
        open={trashOpen}
        deletedBoards={deletedBoards}
        onRestore={restoreBoard}
        onDeleteForever={deleteForever}
        onClose={() => setTrashOpen(false)}
        trashButtonRef={trashButtonRef}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          profile={profile}
          username={handle}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          boardCount={boards.length}
          uid={user.uid}
        />
        <main className="flex-1 overflow-hidden">
          {renderMain()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard