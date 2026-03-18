import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import {
  AlignLeft, Link2, CheckSquare, Heading,
  Trash2, ArrowLeft, MoreHorizontal,
} from "lucide-react"
import { collection, query, where, getDocs, onSnapshot, doc } from "firebase/firestore"
import { db } from "../../../../lib/firebase/firebase"
import { useAuth } from "../../hooks/useAuth"
import { useBoardCards } from "../../hooks/UseBoardCards"
import { getIcon } from "../../hooks/BoardIcons"
import { type Board, type BoardCard, type CardType } from "../../types/index"
import NoteCard    from "./cards/Notecard"
import TodoCard    from "./cards/Todocard"
import LinkCard    from "./cards/Linkcard"
import HeadingCard from "./cards/Headingcard"

const ToolBtn = ({
  Icon, label, onClick,
}: { Icon: React.ElementType; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    title={label}
    className="flex flex-col items-center gap-0.5 w-full px-2 py-2 group hover:bg-white/5 transition-colors rounded-lg"
  >
    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
      <Icon size={16} />
    </div>
    <span className="text-[9px] text-gray-500 group-hover:text-gray-300">{label}</span>
  </button>
)

const BoardPage = () => {
  const { username, boardSlug } = useParams<{ username: string; boardSlug: string }>()
  const navigate = useNavigate()
  const { user, profile, loading: authLoading } = useAuth()

  const [board, setBoard]               = useState<Board | null>(null)
  const [boardId, setBoardId]           = useState<string | null>(null)
  const [boardLoading, setBoardLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid || !boardSlug) return
    const colRef    = collection(db, "users", user.uid, "boards")
    const slugQuery = query(colRef, where("slug", "==", boardSlug))

    getDocs(slugQuery).then(snap => {
      setBoardId(!snap.empty ? snap.docs[0].id : boardSlug)
    })
  }, [user?.uid, boardSlug])

  useEffect(() => {
    if (!user?.uid || !boardId) return
    const ref = doc(db, "users", user.uid, "boards", boardId)
    const unsub = onSnapshot(ref, snap => {
      setBoard(snap.exists() ? { id: snap.id, ...snap.data() } as Board : null)
      setBoardLoading(false)
    })
    return () => unsub()
  }, [user?.uid, boardId])

  const { cards, loading: cardsLoading, addCard, updateCard, moveCard, deleteCard } =
    useBoardCards(user?.uid, boardId ?? undefined)

  const draggingCard = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null)
  const [, forceUpdate] = useState(0)

  const onCardMouseDown = (e: React.MouseEvent, card: BoardCard) => {
    e.stopPropagation()
    draggingCard.current = { id: card.id, startX: e.clientX, startY: e.clientY, origX: card.x, origY: card.y }
    const onMove = (ev: MouseEvent) => {
      if (!draggingCard.current) return
      const dx  = ev.clientX - draggingCard.current.startX
      const dy  = ev.clientY - draggingCard.current.startY
      const idx = cards.findIndex(c => c.id === draggingCard.current!.id)
      if (idx !== -1) {
        cards[idx].x = Math.max(0, draggingCard.current.origX + dx)
        cards[idx].y = Math.max(0, draggingCard.current.origY + dy)
        forceUpdate(n => n + 1)
      }
    }
    const onUp = (ev: MouseEvent) => {
      if (!draggingCard.current) return
      moveCard(
        draggingCard.current.id,
        Math.max(0, draggingCard.current.origX + (ev.clientX - draggingCard.current.startX)),
        Math.max(0, draggingCard.current.origY + (ev.clientY - draggingCard.current.startY)),
      )
      draggingCard.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const handleAddCard = (type: CardType) => {
    const offset = cards.length * 20
    addCard(type, 40 + offset, 40 + offset)
  }

  if (authLoading || boardLoading) {
    return (
      <div className="min-h-screen bg-[#1e2433] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const handle = profile?.username || user.uid
  if (username && username !== handle) return <Navigate to={`/${handle}/home`} replace />

  const BoardIcon = board ? getIcon(board.iconName) : AlignLeft

  return (
    <div className="flex h-screen bg-[#1e2433] overflow-hidden">

      <aside className="w-[60px] bg-[#161b27] border-r border-white/5 flex flex-col items-center py-3 flex-shrink-0">
        <button
          onClick={() => navigate(`/${handle}/home`)}
          title="Back"
          className="flex flex-col items-center gap-0.5 w-full px-2 py-2 group hover:bg-white/5 transition-colors rounded-lg mb-2"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[9px] text-gray-500 group-hover:text-gray-300">Back</span>
        </button>

        <div className="h-px bg-white/5 w-8 mb-2" />

        <ToolBtn Icon={AlignLeft}   label="Note"    onClick={() => handleAddCard("note")} />
        <ToolBtn Icon={Heading}     label="Heading" onClick={() => handleAddCard("heading")} />
        <ToolBtn Icon={CheckSquare} label="To-do"   onClick={() => handleAddCard("todo")} />
        <ToolBtn Icon={Link2}       label="Link"    onClick={() => handleAddCard("link")} />

        <div className="flex-1" />

        <button title="Trash" className="flex flex-col items-center gap-0.5 w-full px-2 py-2 group hover:bg-red-500/10 transition-colors rounded-lg">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-red-400 transition-colors">
            <Trash2 size={16} />
          </div>
          <span className="text-[9px] text-gray-500 group-hover:text-red-400">Trash</span>
        </button>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">

        <header className="h-12 bg-[#1a1f2e] border-b border-white/5 flex items-center px-4 gap-3 flex-shrink-0 z-10">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {board && (
              <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: board.color + "33" }}>
                <BoardIcon size={14} style={{ color: board.color }} />
              </div>
            )}
            <span className="text-sm font-semibold text-white">{board?.title ?? "..."}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-xs ml-1">
            <button onClick={() => navigate(`/${handle}/home`)} className="text-gray-500 hover:text-gray-300 transition-colors">@{handle}</button>
            <span className="text-gray-700">/</span>
            <button onClick={() => navigate(`/${handle}/home`)} className="text-gray-500 hover:text-gray-300 transition-colors">home</button>
            <span className="text-gray-700">/</span>
            <span className="text-gray-300 font-medium">{board?.title ?? "..."}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-600 bg-white/5 px-2.5 py-1 rounded-lg">
              {cards.length} {cards.length === 1 ? "card" : "cards"}
            </span>
            <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </header>

        <div
          className="flex-1 relative overflow-auto bg-[#d8d5cf]"
          style={{
            backgroundImage: "radial-gradient(circle, #a8a5a0 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {cardsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cards.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              {board && (
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm border bg-white/60" style={{ borderColor: board.color + "33" }}>
                  <BoardIcon size={24} style={{ color: board.color }} />
                </div>
              )}
              <p className="text-sm font-semibold text-gray-600 mb-1">{board?.title ?? ""}</p>
              <p className="text-xs text-gray-500 max-w-xs">
                Use the tools on the left to add notes, headings, to-do lists or links.
              </p>
            </div>
          ) : null}

          {cards.map(card => {
            const sharedProps = {
              key: card.id, card,
              onUpdate:    (data: Partial<BoardCard>) => updateCard(card.id, data),
              onDelete:    () => deleteCard(card.id),
              onMouseDown: (e: React.MouseEvent) => onCardMouseDown(e, card),
            }
            if (card.type === "note")    return <NoteCard    {...sharedProps} />
            if (card.type === "heading") return <HeadingCard {...sharedProps} />
            if (card.type === "todo")    return <TodoCard    {...sharedProps} />
            if (card.type === "link")    return <LinkCard    {...sharedProps} />
            return null
          })}
        </div>
      </div>
    </div>
  )
}

export default BoardPage