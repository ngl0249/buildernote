import { useParams, Navigate } from "react-router-dom"
import CreateFirstBoard from "./undersider/CreateFirstBoard"
import InviteTeam from "./undersider/InviteTeam"
import UnderstandingRoles from "./undersider/UnderstandingRoles"
import NotesAndLinks from "./undersider/NotesAndLinks"
import DragDrop from "./undersider/DragDrop"
import CardTypes from "./undersider/CardTypes"
import TodoList from "./undersider/TodoList"
import CalendarGuide from "./undersider/CalendarGuide"
import RealtimePresence from "./undersider/RealtimePresence"
import Notifications from "./undersider/Notifications"
import TeamBoards from "./undersider/TeamBoards"

const GUIDE_MAP: Record<string, React.ComponentType> = {
  "create-first-board":  CreateFirstBoard,
  "invite-team":         InviteTeam,
  "understanding-roles": UnderstandingRoles,
  "notes-and-links":     NotesAndLinks,
  "drag-drop":           DragDrop,
  "card-types":          CardTypes,
  "todo-list":           TodoList,
  "calendar":            CalendarGuide,
  "realtime-presence":   RealtimePresence,
  "notifications":       Notifications,
  "team-boards":         TeamBoards,
}

const GuideRouter = () => {
  const { slug } = useParams<{ slug: string }>()
  const Component = slug ? GUIDE_MAP[slug] : undefined
  if (!Component) return <Navigate to="/guides" replace />
  return <Component />
}

export default GuideRouter