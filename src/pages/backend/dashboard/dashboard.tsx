import { useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useBoards } from "../hooks/useBoards"
import Topbar from "./components/Topbar"
import Sidebar, { type Tool } from "./components/Sidebar"
import BoardsGrid from "./components/BoardsGrid"
import Todo from "./tabs/ToDo"
import { AdminMembersTab, AdminOverviewTab, DeveloperTab, ModeratorTab, ProTab } from "./tabs/RolesTabs"

const Dashboard = () => {
  const { username } = useParams<{ username: string }>()
  const { user, profile, loading } = useAuth()
  const {
    boards, loading: boardsLoading,
    createBoard, renameBoard, deleteBoard, reorderBoards,
  } = useBoards(user?.uid)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTool, setActiveTool]   = useState<Tool>("boards")

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

  // Guard: if user tries to access a role tab they don't have access to, redirect to boards
  const handleToolChange = (tool: Tool) => {
    // "boards" and "todo" are open to everyone
    // role-specific tabs only if their role matches
    if (tool === "admin-members"  && role !== "Owner")      return
    if (tool === "admin-overview" && role !== "Owner")      return
    if (tool === "developer"      && role !== "Developer")  return
    if (tool === "moderator"      && role !== "Moderator")  return
    if (tool === "pro"            && role !== "BuilderPro") return
    setActiveTool(tool)
  }

  const renderMain = () => {
    switch (activeTool) {
      case "todo":           return <Todo />
      case "admin-members":  return role === "Owner"      ? <AdminMembersTab currentUserUid={user.uid} /> : null
      case "admin-overview": return role === "Owner"      ? <AdminOverviewTab /> : null
      case "developer":      return role === "Developer"  ? <DeveloperTab />  : null
      case "moderator":      return role === "Moderator"  ? <ModeratorTab />  : null
      case "pro":            return role === "BuilderPro" ? <ProTab />        : null
      default:
        return (
          <div className="h-full overflow-y-auto bg-[#f0f0ed] p-6 md:p-10">
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
        boardCount={boards.length}
        username={handle}
        activeTool={activeTool}
        onToolChange={handleToolChange}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          profile={profile}
          username={handle}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
        />
        <main className="flex-1 overflow-hidden">
          {renderMain()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard