import { useState, useRef, useEffect } from "react"
import { Navigate, useParams } from "react-router-dom"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"
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
import OwnerTab from "./tabs/Stafftabs/Ownertab"
import MaintenancePage from "../../landing/undersider/MaintenancePage"
import Projekt from "./tabs/Projekt"

const Dashboard = () => {
  const { username } = useParams<{ username: string }>()
  const { user, profile, loading } = useAuth()
  const {
    boards, deletedBoards, loading: boardsLoading,
    createBoard, renameBoard, deleteBoard,
    restoreBoard, deleteForever, reorderBoards,
  } = useBoards(user?.uid)

  const [dashboardOnline, setDashboardOnline] = useState<boolean | null>(null)
  const [siteOnline, setSiteOnline]   = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTool, setActiveTool]   = useState<Tool>("boards")
  const [trashOpen, setTrashOpen]     = useState(false)
  const trashButtonRef                = useRef<HTMLButtonElement>(null)

  useOnlinePresence(user?.uid)

  useEffect(() => {
    if (!user) return 

    const unsub = onSnapshot(doc(db, "config", "siteStatus"), snap => {
      setSiteOnline(snap.exists() ? (snap.data().online ?? true) : true)
      setDashboardOnline(snap.exists() ? (snap.data().dashboardOnline ?? true) : true)
    })
    return () => unsub()
  }, [user])

  if (loading || siteOnline === null) {
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

  if (!dashboardOnline && role !== "Owner") return <MaintenancePage />

  const handleToolChange = (tool: Tool) => {
    if (tool === "admin-members"  && role !== "Owner")      return
    if (tool === "owner-control"  && role !== "Owner")      return
    if (tool === "developer"      && role !== "Developer")  return
    if (tool === "moderator"      && role !== "Moderator")  return
    if (tool === "pro"            && role !== "BuilderPro") return
    setTrashOpen(false)
    setActiveTool(tool)
  }

  const renderMain = () => {
    switch (activeTool) {
      case "todo":           return <Todo />
      case "projekt": return <Projekt />
      case "calendar":       return <Calendar />
      case "admin-members":  return role === "Owner"      ? <AdminMembersTab currentUserUid={user.uid} /> : null
      case "owner-control":  return role === "Owner"      ? <OwnerTab />      : null
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
              role={profile?.role}
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
          boards={boards}
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