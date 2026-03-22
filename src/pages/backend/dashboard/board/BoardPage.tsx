import { useState, useRef, useEffect, useCallback } from "react"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import {
  AlignLeft, Link2, CheckSquare, Heading,
  Trash2, ArrowLeft,
  Palette, FileText, Columns, MessageSquare, Table,
  Users, Upload, Image as ImageIcon,
} from "lucide-react"
import type { RefObject } from "react"
import { collection, query, where, getDocs, onSnapshot, doc, getDoc, setDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../../../lib/firebase/firebase"
import { useAuth } from "../../hooks/useAuth"
import { useBoards } from "../../hooks/useBoards"
import { useBoardCards } from "../../hooks/UseBoardCards"
import { useTeam } from "../../hooks/Useteam"
import { useOnlinePresence } from "../../hooks/useOnlinePresence"
import { getIcon } from "../../hooks/BoardIcons"
import { type Board, type BoardCard, type CardType } from "../../types/index"
import TrashPanel from "../components/Trash"
import TeamPanel from "../components/Teampanel"
import NoteCard from "./cards/Notecard"
import TodoCard from "./cards/Todocard"
import LinkCard from "./cards/Linkcard"
import HeadingCard from "./cards/Headingcard"
import ColorCard from "./cards/Colorcard"
import DocumentCard from "./cards/Documentcard"
import ColumnCard from "./cards/Columncard"
import CommentCard from "./cards/Commentcard"
import TableCard from "./cards/Tablecard"
import UploadCard from "./cards/Upload"
import ImageCard from "./cards/Image"

interface PresenceUser {
  uid: string
  x: number
  y: number
  selectedCardId: string | null
  displayName: string
  avatarUrl: string
  color: string
  updatedAt: number
}

const PRESENCE_COLORS = [
  "#3b82f6", "#8b5cf6", "#10b981",
  "#ef4444", "#f59e0b", "#06b6d4", "#ec4899",
]

const BoardPage = () => {
  const { username, boardSlug } = useParams<{ username: string; boardSlug: string }>()
  const navigate = useNavigate()
  const { user, profile, loading: authLoading } = useAuth()

  const initials = (profile?.displayName ?? "B")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)

  const [board, setBoard] = useState<Board | null>(null)
  const [boardId, setBoardId] = useState<string | null>(null)
  const [boardLoading, setBoardLoading] = useState(true)

  const [accessChecked, setAccessChecked] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  const { deletedBoards, restoreBoard, deleteForever } = useBoards(user?.uid)
  const [trashOpen, setTrashOpen] = useState(false)
  const trashButtonRef = useRef<HTMLButtonElement>(null) as RefObject<HTMLButtonElement | null>

  const [teamOpen, setTeamOpen] = useState(false)
  const teamButtonRef = useRef<HTMLButtonElement>(null) as RefObject<HTMLButtonElement | null>

  const viewportRef = useRef<HTMLDivElement>(null)
  const panRef = useRef({ x: 0, y: 0 })
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const panStart = useRef({ mx: 0, my: 0, px: 0, py: 0 })

  const [ownerUid, setOwnerUid] = useState<string | null>(null)
  const [ownerResolved, setOwnerResolved] = useState(false)

  const [othersPresence, setOthersPresence] = useState<PresenceUser[]>([])
  const presenceColor = useRef(PRESENCE_COLORS[Math.floor(Math.random() * PRESENCE_COLORS.length)])
  const presenceDocRef = useRef<ReturnType<typeof doc> | null>(null)
  const lastPresenceUpdate = useRef(0)

  useOnlinePresence(user?.uid)

  useEffect(() => {
    if (!user?.uid || !username) return
    if (authLoading) return
    const myHandle = profile?.username || user.uid
    if (username === myHandle) {
      setOwnerUid(user.uid)
      setOwnerResolved(true)
    } else {
      getDocs(query(collection(db, "users"), where("username", "==", username)))
        .then(snap => { setOwnerUid(!snap.empty ? snap.docs[0].id : null); setOwnerResolved(true) })
        .catch(() => { setOwnerUid(null); setOwnerResolved(true) })
    }
  }, [user?.uid, username, profile?.username, authLoading])

  useEffect(() => {
    if (!ownerUid || !boardSlug) return
    getDocs(query(collection(db, "users", ownerUid, "boards"), where("slug", "==", boardSlug)))
      .then(snap => setBoardId(!snap.empty ? snap.docs[0].id : boardSlug))
  }, [ownerUid, boardSlug])

  useEffect(() => {
    if (!ownerUid || !boardId) return
    const unsub = onSnapshot(doc(db, "users", ownerUid, "boards", boardId), snap => {
      setBoard(snap.exists() ? { id: snap.id, ...snap.data() } as Board : null)
      setBoardLoading(false)
    })
    return () => unsub()
  }, [ownerUid, boardId])

  useEffect(() => {
    if (ownerResolved && ownerUid === null) setBoardLoading(false)
  }, [ownerResolved, ownerUid])

  useEffect(() => {
    if (!ownerUid || !boardId || !user?.uid) return
    if (ownerUid === user.uid) { setHasAccess(true); setAccessChecked(true); return }
    getDoc(doc(db, "users", ownerUid, "boards", boardId, "members", user.uid))
      .then(snap => { setHasAccess(snap.exists()); setAccessChecked(true) })
      .catch(() => { setHasAccess(false); setAccessChecked(true) })
  }, [ownerUid, boardId, user?.uid])

  useEffect(() => {
    if (!ownerUid || !boardId || !user?.uid || !hasAccess) return
    const ref = doc(db, "users", ownerUid, "boards", boardId, "presence", user.uid)
    presenceDocRef.current = ref
    setDoc(ref, {
      uid: user.uid,
      displayName: profile?.displayName ?? user.uid,
      avatarUrl: profile?.avatarUrl ?? "",
      color: presenceColor.current,
      x: 0, y: 0, selectedCardId: null,
      updatedAt: Date.now(),
    }, { merge: true })
    return () => { deleteDoc(ref) }
  }, [ownerUid, boardId, user?.uid, hasAccess, profile?.displayName, profile?.avatarUrl])

  useEffect(() => {
    if (!ownerUid || !boardId || !user?.uid || !hasAccess) return
    const unsub = onSnapshot(collection(db, "users", ownerUid, "boards", boardId, "presence"), snap => {
      const now = Date.now()
      setOthersPresence(
        snap.docs.map(d => d.data() as PresenceUser)
          .filter(p => p.uid !== user.uid && now - p.updatedAt < 30_000)
      )
    })
    return () => unsub()
  }, [ownerUid, boardId, user?.uid, hasAccess])

  const updatePresence = useCallback((data: Partial<{ x: number; y: number; selectedCardId: string | null }>) => {
    if (!presenceDocRef.current) return
    const now = Date.now()
    if (now - lastPresenceUpdate.current < 50) return
    lastPresenceUpdate.current = now
    setDoc(presenceDocRef.current, { ...data, updatedAt: now }, { merge: true })
  }, [])

  const { cards, loading: cardsLoading, addCard, updateCard, moveCard, deleteCard } =
    useBoardCards(ownerUid ?? undefined, boardId ?? undefined)

  const { members } = useTeam(ownerUid ?? undefined, boardId ?? undefined)

  const notifyTeam = useCallback(async (action: string, cardType: string) => {
    if (!ownerUid || !boardId || !user?.uid || !board) return
    const senderName = profile?.displayName ?? profile?.username ?? user.uid

    const membersSnap = await getDocs(collection(db, "users", ownerUid, "boards", boardId, "members"))

    const recipients: string[] = []
    if (user.uid === ownerUid) {
      membersSnap.docs.forEach(d => { if (d.id !== user.uid) recipients.push(d.id) })
    } else {
      recipients.push(ownerUid)
    }

    const presenceSnap = await getDocs(collection(db, "users", ownerUid, "boards", boardId, "presence"))
    const now = Date.now()
    const onBoardUids = new Set(
      presenceSnap.docs
        .map(d => d.data())
        .filter(p => now - (p.updatedAt ?? 0) < 30_000)
        .map(p => p.uid)
    )

    const offlineRecipients = recipients.filter(uid => !onBoardUids.has(uid))

    await Promise.all(offlineRecipients.map(recipientUid =>
      addDoc(collection(db, "users", recipientUid, "notifications"), {
        type:         "board_change",
        title:        board.title,
        body:         `${senderName} ${action} a ${cardType}`,
        read:         false,
        boardId,
        boardOwnerId: ownerUid,
        createdAt:    serverTimestamp(),
      })
    ))
  }, [ownerUid, boardId, user?.uid, board, profile?.displayName, profile?.username])

  const getCanvasBounds = useCallback(() => {
    if (cards.length === 0) return { w: 0, h: 0 }
    const maxX = Math.max(...cards.map(c => c.x + (c.width ?? 280)))
    const maxY = Math.max(...cards.map(c => c.y + (c.height ?? 160)))
    return { w: maxX + 200, h: maxY + 200 }
  }, [cards])

  const clampPan = useCallback((x: number, y: number) => {
    const vp = viewportRef.current
    if (!vp) return { x, y }
    const { w, h } = getCanvasBounds()
    return {
      x: Math.min(0, Math.max(w > vp.clientWidth  ? -(w - vp.clientWidth)  : 0, x)),
      y: Math.min(0, Math.max(h > vp.clientHeight ? -(h - vp.clientHeight) : 0, y)),
    }
  }, [getCanvasBounds])

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 1) return
      e.preventDefault()
      isPanning.current = true
      panStart.current = { mx: e.clientX, my: e.clientY, px: panRef.current.x, py: panRef.current.y }
      if (viewportRef.current) viewportRef.current.style.cursor = "grabbing"
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return
      const clamped = clampPan(panStart.current.px + (e.clientX - panStart.current.mx), panStart.current.py + (e.clientY - panStart.current.my))
      panRef.current = clamped
      setPan({ ...clamped })
    }
    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 1) return
      isPanning.current = false
      if (viewportRef.current) viewportRef.current.style.cursor = ""
    }
    const onContextMenu = (e: MouseEvent) => { if (isPanning.current) e.preventDefault() }
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("contextmenu", onContextMenu)
    return () => {
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("contextmenu", onContextMenu)
    }
  }, [clampPan])

  const draggingCard = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null)
  const [, forceUpdate] = useState(0)

  const onCardMouseDown = (e: React.MouseEvent, card: BoardCard) => {
    if (e.button !== 0) return
    e.stopPropagation()
    updatePresence({ selectedCardId: card.id })
    draggingCard.current = { id: card.id, startX: e.clientX, startY: e.clientY, origX: card.x, origY: card.y }
    const onMove = (ev: MouseEvent) => {
      if (!draggingCard.current) return
      const dx = ev.clientX - draggingCard.current.startX
      const dy = ev.clientY - draggingCard.current.startY
      const idx = cards.findIndex(c => c.id === draggingCard.current!.id)
      if (idx !== -1) {
        cards[idx].x = Math.max(0, draggingCard.current.origX + dx)
        cards[idx].y = Math.max(0, draggingCard.current.origY + dy)
        forceUpdate(n => n + 1)
      }
    }
    const onUp = (ev: MouseEvent) => {
      if (!draggingCard.current) return
      moveCard(draggingCard.current.id,
        Math.max(0, draggingCard.current.origX + (ev.clientX - draggingCard.current.startX)),
        Math.max(0, draggingCard.current.origY + (ev.clientY - draggingCard.current.startY)),
      )
      draggingCard.current = null
      updatePresence({ selectedCardId: null })
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const handleAddCard = (type: CardType) => {
    const offset = cards.length * 20
    addCard(type, 40 + offset, 40 + offset)
    notifyTeam("added", type)
  }

  if (authLoading || !ownerResolved || boardLoading || !accessChecked) {
    return (
      <div className="min-h-screen bg-[#1e2433] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  const handle = profile?.username || user.uid
  if (!ownerUid || !hasAccess) return <Navigate to={`/${handle}/home`} replace />

  const BoardIcon = board ? getIcon(board.iconName) : AlignLeft
  const inviterName = profile?.displayName ?? handle

  return (
    <div className="flex h-screen bg-[#1e2433] overflow-hidden">
      <aside className="w-[72px] bg-[#161b27] border-r border-white/5 flex flex-col items-center py-4 flex-shrink-0">

        <button
          onClick={() => navigate(`/${handle}/home`)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white/5 hover:text-white transition-colors mb-4"
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="h-px bg-white/5 w-10 mb-4" />

        <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-2 font-semibold">Add</p>

        <div className="flex flex-col items-center gap-1 w-full px-2">
          {[
            { Icon: AlignLeft,   label: "Note",    type: "note"     },
            { Icon: Heading,     label: "Heading", type: "heading"  },
            { Icon: CheckSquare, label: "To-do",   type: "todo"     },
            { Icon: Link2,       label: "Link",    type: "link"     },
            { Icon: FileText,    label: "Doc",     type: "document" },
            { Icon: Columns,     label: "Column",  type: "column"   },
            { Icon: Table,       label: "Table",   type: "table"    },
          ].map(({ Icon, label, type }) => (
            <button
              key={type}
              onClick={() => handleAddCard(type as CardType)}
              title={label}
              className="w-full flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-white/5 transition-colors">
                <Icon size={16} />
              </div>
              <span className="text-[9px] leading-none">{label}</span>
            </button>
          ))}
        </div>

        <div className="h-px bg-white/5 w-10 my-3" />

        <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-2 font-semibold">More</p>
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {[
            { Icon: Palette,       label: "Color",   type: "color"   },
            { Icon: MessageSquare, label: "Comment", type: "comment" },
            { Icon: Upload,        label: "Upload",  type: "upload"  },
            { Icon: ImageIcon,     label: "Image",   type: "image"   },
          ].map(({ Icon, label, type }) => (
            <button
              key={type}
              onClick={() => handleAddCard(type as CardType)}
              title={label}
              className="w-full flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-white/5 transition-colors">
                <Icon size={16} />
              </div>
              <span className="text-[9px] leading-none">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <div className="h-px bg-white/5 w-10 mb-3" />

        <button
          ref={trashButtonRef as RefObject<HTMLButtonElement>}
          onClick={() => setTrashOpen(v => !v)}
          title="Trash"
          className={`w-full flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-colors group ${trashOpen ? "text-red-400" : "text-gray-500 hover:text-red-400"}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${trashOpen ? "bg-red-500/10" : "group-hover:bg-red-500/10"}`}>
            <Trash2 size={16} />
          </div>
          <span className="text-[9px] leading-none">Trash</span>
        </button>
      </aside>

      <TrashPanel open={trashOpen} deletedBoards={deletedBoards} onRestore={restoreBoard} onDeleteForever={deleteForever} onClose={() => setTrashOpen(false)} trashButtonRef={trashButtonRef} />

      {boardId && ownerUid && (
        <TeamPanel open={teamOpen} onClose={() => setTeamOpen(false)} ownerUid={ownerUid} boardId={boardId} boardTitle={board?.title ?? ""} boardColor={board?.color ?? "#f97316"} inviterName={inviterName} currentUid={user.uid} anchorRef={teamButtonRef} />
      )}

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
            {othersPresence.length > 0 && (
              <div className="flex items-center -space-x-1.5">
                {othersPresence.map(p => (
                  <div key={p.uid} title={p.displayName}
                    className="w-6 h-6 rounded-full border-2 border-[#1a1f2e] overflow-hidden flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.avatarUrl ? <img src={p.avatarUrl} className="w-full h-full object-cover" /> : p.displayName?.[0]?.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
            <span className="text-xs text-gray-600 bg-white/5 px-2.5 py-1 rounded-lg">
              {cards.length} {cards.length === 1 ? "card" : "cards"}
            </span>
            <button
              ref={teamButtonRef as RefObject<HTMLButtonElement>}
              onClick={() => setTeamOpen(v => !v)}
              title="Team"
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${teamOpen ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"}`}
            >
              <Users size={13} />
              <span className="hidden sm:inline">Team</span>
              {members.length > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 text-[9px] font-bold">
                  {members.length + 1}
                </span>
              )}
            </button>
            <button className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
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
            </button>
          </div>
        </header>

        <div
          ref={viewportRef}
          className="flex-1 relative overflow-hidden select-none"
          style={{
            backgroundColor: "#eaeaea",
            backgroundImage: "radial-gradient(circle, #a8a5a0 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: `${pan.x % 24}px ${pan.y % 24}px`,
          }}
          onMouseMove={(e) => {
            const rect = viewportRef.current?.getBoundingClientRect()
            if (!rect) return
            updatePresence({ x: e.clientX - rect.left - pan.x, y: e.clientY - rect.top - pan.y })
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
              <p className="text-xs text-gray-500 max-w-xs">Use the tools on the left to add notes, headings, to-do lists, links, colors, documents, columns, comments or tables.</p>
            </div>
          ) : null}

          <div style={{
            position: "absolute", top: 0, left: 0,
            width: Math.max(getCanvasBounds().w, viewportRef.current?.clientWidth ?? 0),
            height: Math.max(getCanvasBounds().h, viewportRef.current?.clientHeight ?? 0),
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            willChange: "transform",
          }}>
            {cards.map(card => {
              const sharedProps = {
                card,
                onUpdate: (data: Partial<BoardCard>) => updateCard(card.id, data),
                onDelete: () => { deleteCard(card.id); notifyTeam("deleted", card.type) },
                onMouseDown: (e: React.MouseEvent) => onCardMouseDown(e, card),
                onSelect: () => updatePresence({ selectedCardId: card.id }),
                onDeselect: () => updatePresence({ selectedCardId: null }),
              }
              if (card.type === "note")     return <NoteCard     key={card.id} {...sharedProps} />
              if (card.type === "heading")  return <HeadingCard  key={card.id} {...sharedProps} />
              if (card.type === "todo")     return <TodoCard     key={card.id} {...sharedProps} />
              if (card.type === "link")     return <LinkCard     key={card.id} {...sharedProps} />
              if (card.type === "color")    return <ColorCard    key={card.id} {...sharedProps} />
              if (card.type === "document") return <DocumentCard key={card.id} {...sharedProps} />
              if (card.type === "column")   return <ColumnCard   key={card.id} {...sharedProps} />
              if (card.type === "comment")  return <CommentCard  key={card.id} {...sharedProps} />
              if (card.type === "table")    return <TableCard    key={card.id} {...sharedProps} />
              if (card.type === "upload")   return <UploadCard   key={card.id} {...sharedProps} />
              if (card.type === "image")    return <ImageCard    key={card.id} {...sharedProps} />
              return null
            })}

            {othersPresence.map(p => (
              <div key={p.uid}>
                <div style={{ position: "absolute", left: p.x, top: p.y, pointerEvents: "none", zIndex: 9999 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2L14 7L9 9L7 14L2 2Z" fill={p.color} stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <div style={{ backgroundColor: p.color }} className="flex items-center gap-1 px-1.5 py-0.5 rounded-full shadow-lg whitespace-nowrap w-fit">
                    {p.avatarUrl ? (
                      <img src={p.avatarUrl} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-white/30 flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0">
                        {p.displayName?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-[10px] font-semibold text-white leading-none">{p.displayName}</span>
                  </div>
                </div>

                {p.selectedCardId && (() => {
                  const card = cards.find(c => c.id === p.selectedCardId)
                  if (!card) return null
                  const w = card.width ?? 280
                  const h = card.height ?? 160
                  return (
                    <div style={{ position: "absolute", left: card.x - 4, top: card.y - 4, width: w + 8, height: h + 8, border: `2px solid ${p.color}`, borderRadius: 20, pointerEvents: "none", zIndex: 9998, boxShadow: `0 0 0 1px ${p.color}44` }}>
                      <div style={{ backgroundColor: p.color }} className="absolute -top-5 left-0 flex items-center gap-1 px-1.5 py-0.5 rounded-md shadow">
                        {p.avatarUrl ? (
                          <img src={p.avatarUrl} className="w-3 h-3 rounded-full object-cover" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-white/30 flex items-center justify-center text-[6px] font-bold text-white">
                            {p.displayName?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <span className="text-[9px] font-semibold text-white whitespace-nowrap">{p.displayName}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardPage