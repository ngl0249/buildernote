import { useEffect, useState, useRef } from "react"
import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDocs,
  onSnapshot, query, orderBy, serverTimestamp, writeBatch,
} from "firebase/firestore"
import { db } from "../../../../lib/firebase/firebase"
import { useAuth } from "../../hooks/useAuth"
import {
  Plus, Trash2, ArrowLeft, Circle,
  Clock, AlertCircle, CheckCircle2,
  X, Calendar, ChevronRight, Grip,
} from "lucide-react"


type Priority = "low" | "medium" | "high"
type Status   = "todo" | "waiting" | "processing" | "done"
type View     = "boards" | "board-detail"

type Board = {
  id: string
  name: string
  color: string
  createdAt: any
}

type TodoItem = {
  id: string
  boardId: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  dueDate: string | null
  createdAt: any
}


const STATUSES: {
  key: Status; label: string
  color: string; bg: string; border: string; headerBg: string
  icon: React.ReactNode
}[] = [
  {
    key: "todo",       label: "To Do",
    color: "text-stone-500",   bg: "bg-stone-100",    border: "border-stone-200",  headerBg: "bg-stone-50",
    icon: <Circle size={11} />,
  },
  {
    key: "waiting",    label: "Waiting",
    color: "text-amber-600",   bg: "bg-amber-50",     border: "border-amber-200",  headerBg: "bg-amber-50/60",
    icon: <Clock size={11} />,
  },
  {
    key: "processing", label: "Processing",
    color: "text-orange-500",  bg: "bg-orange-50",    border: "border-orange-200", headerBg: "bg-orange-50/60",
    icon: <AlertCircle size={11} />,
  },
  {
    key: "done",       label: "Done",
    color: "text-emerald-600", bg: "bg-emerald-50",   border: "border-emerald-200", headerBg: "bg-emerald-50/60",
    icon: <CheckCircle2 size={11} />,
  },
]

const PRIORITIES: { key: Priority; label: string; color: string; dot: string }[] = [
  { key: "low",    label: "Low",    color: "text-stone-400", dot: "bg-stone-300"  },
  { key: "medium", label: "Medium", color: "text-amber-500", dot: "bg-amber-400"  },
  { key: "high",   label: "High",   color: "text-red-500",   dot: "bg-red-400"    },
]

const BOARD_COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ec4899",
  "#8b5cf6", "#06b6d4", "#f97316", "#ef4444",
]


const statusOf   = (s: Status)   => STATUSES.find(x => x.key === s)   ?? STATUSES[0]
const priorityOf = (p: Priority) => PRIORITIES.find(x => x.key === p) ?? PRIORITIES[1]

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}
function isOverdue(d: string | null) {
  if (!d) return false
  return new Date(d) < new Date()
}


const boardsRef = (uid: string) =>
  collection(db, "users", uid, "todoBoards")

const todosRef = (uid: string, boardId: string) =>
  collection(db, "users", uid, "todoBoards", boardId, "todos")

const todoDocRef = (uid: string, boardId: string, todoId: string) =>
  doc(db, "users", uid, "todoBoards", boardId, "todos", todoId)


function BoardCard({ board, todos, onClick, onDelete }: {
  board: Board
  todos: TodoItem[]
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}) {
  const total   = todos.length
  const done    = todos.filter(t => t.status === "done").length
  const pct     = total ? Math.round((done / total) * 100) : 0
  const preview = todos.slice(0, 4)

  const counts = Object.fromEntries(
    STATUSES.map(s => [s.key, todos.filter(t => t.status === s.key).length])
  ) as Record<Status, number>

  return (
    <div
      onClick={onClick}
      className="group relative rounded-xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div className="h-[3px] w-full" style={{ backgroundColor: board.color }} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: board.color }} />
              <h3 className="text-sm font-semibold text-stone-800 tracking-tight">{board.name}</h3>
            </div>
            <p className="text-[11px] text-stone-400 pl-4">{total} task{total !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 size={12} />
            </button>
            <div className="p-1.5 text-stone-300">
              <ChevronRight size={12} />
            </div>
          </div>
        </div>

        {total > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-stone-400">Progress</span>
              <span className="text-[10px] text-stone-500 font-medium">{pct}%</span>
            </div>
            <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: board.color }}
              />
            </div>
          </div>
        )}

        {preview.length > 0 ? (
          <div className="space-y-1.5">
            {preview.map(t => {
              const st = statusOf(t.status)
              return (
                <div key={t.id} className="flex items-center gap-2">
                  <span className={`${st.color} shrink-0`}>{st.icon}</span>
                  <span className={`text-[11px] truncate ${t.status === "done" ? "line-through text-stone-300" : "text-stone-500"}`}>
                    {t.title}
                  </span>
                </div>
              )
            })}
            {total > 4 && <p className="text-[10px] text-stone-300 pl-5">+{total - 4} more</p>}
          </div>
        ) : (
          <p className="text-[11px] text-stone-300 italic">No tasks yet</p>
        )}

        <div className="flex gap-1.5 mt-3 flex-wrap">
          {STATUSES.map(s => counts[s.key] > 0 && (
            <div key={s.key} className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${s.bg} border ${s.border}`}>
              <span className={s.color}>{s.icon}</span>
              <span className={`text-[9px] font-medium ${s.color}`}>{counts[s.key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


function KanbanColumn({
  col, todos, boardColor,
  onAddTodo, onUpdateTodo, onDeleteTodo,
  onDragStart, onDragOver, onDrop,
}: {
  col: typeof STATUSES[number]
  todos: TodoItem[]
  boardColor: string
  onAddTodo: (status: Status, title: string, desc: string, priority: Priority, due: string) => Promise<void>
  onUpdateTodo: (id: string, patch: Partial<TodoItem>) => Promise<void>
  onDeleteTodo: (id: string) => Promise<void>
  onDragStart: (id: string, from: Status) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (to: Status) => void
}) {
  const [showNew, setShowNew]         = useState(false)
  const [newTitle, setNewTitle]       = useState("")
  const [newDesc, setNewDesc]         = useState("")
  const [newPriority, setNewPriority] = useState<Priority>("medium")
  const [newDue, setNewDue]           = useState("")
  const [expanded, setExpanded]       = useState<string | null>(null)
  const [isDragOver, setIsDragOver]   = useState(false)
  const [saving, setSaving]           = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (showNew) inputRef.current?.focus() }, [showNew])

  const handleAdd = async () => {
    if (!newTitle.trim() || saving) return
    setSaving(true)
    await onAddTodo(col.key, newTitle, newDesc, newPriority, newDue)
    setNewTitle(""); setNewDesc(""); setNewPriority("medium"); setNewDue("")
    setShowNew(false); setSaving(false)
  }

  return (
    <div
      className={`flex flex-col w-[280px] shrink-0 rounded-xl border transition-all duration-200 ${
        isDragOver ? `${col.border} ring-2 ring-inset ring-stone-200` : `${col.border} bg-white/70`
      }`}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); onDragOver(e) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => { setIsDragOver(false); onDrop(col.key) }}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b ${col.border} ${col.headerBg} rounded-t-xl`}>
        <div className="flex items-center gap-2">
          <span className={col.color}>{col.icon}</span>
          <span className={`text-xs font-semibold tracking-wide uppercase ${col.color}`}>{col.label}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${col.bg} ${col.color} ${col.border}`}>
            {todos.length}
          </span>
        </div>
        <button
          onClick={() => setShowNew(v => !v)}
          className={`p-1.5 rounded-lg transition-all ${
            showNew ? `${col.bg} ${col.color}` : `text-stone-400 hover:${col.color} hover:${col.bg}`
          }`}
        >
          <Plus size={13} />
        </button>
      </div>

      {showNew && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2">
          <input
            ref={inputRef}
            placeholder="Task title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowNew(false) }}
            className="w-full bg-transparent text-sm text-stone-800 placeholder-stone-300 outline-none"
          />
          <textarea
            placeholder="Description (optional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            rows={2}
            className="w-full bg-transparent text-xs text-stone-500 placeholder-stone-300 outline-none resize-none"
          />
          <div className="flex gap-2">
            <select
              value={newPriority}
              onChange={e => setNewPriority(e.target.value as Priority)}
              className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 outline-none"
            >
              {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
            <input
              type="date"
              value={newDue}
              onChange={e => setNewDue(e.target.value)}
              className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex-1 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors disabled:opacity-50"
              style={{ backgroundColor: boardColor }}
            >
              {saving ? "Saving…" : "Add task"}
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-500 text-xs hover:bg-stone-200 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {todos.length === 0 && !showNew && (
          <div className="text-center py-8 text-stone-300 text-xs">Drop here</div>
        )}

        {todos.map(todo => {
          const pri     = priorityOf(todo.priority)
          const overdue = isOverdue(todo.dueDate) && todo.status !== "done"
          const isExp   = expanded === todo.id

          return (
            <div
              key={todo.id}
              draggable
              onDragStart={() => onDragStart(todo.id, col.key)}
              className={`group rounded-xl border transition-all duration-150 cursor-pointer bg-[#252d3d] ${

                isExp
                  ? "border-stone-300 shadow-sm"
                  : "border-stone-200 hover:border-stone-300 hover:shadow-sm"
              }`}
              onClick={() => setExpanded(isExp ? null : todo.id)}
            >
              <div className="p-3">
                <div className="flex items-start gap-2">
                  <Grip size={12} className="text-stone-300 mt-0.5 shrink-0 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${todo.status === "done" ? "line-through text-white" : "text-white"}`}>
                      {todo.title}
                    </p>
                    {todo.description && !isExp && (
                      <p className="text-[11px] text-white mt-0.5 line-clamp-1">{todo.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
                        <span className={`text-[10px] ${pri.color}`}>{pri.label}</span>
                      </div>
                      {todo.dueDate && (
                        <div className={`flex items-center gap-1 text-[10px] ${overdue ? "text-red-400" : "text-stone-400"}`}>
                          <Calendar size={9} />
                          {formatDate(todo.dueDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isExp && (
                <div
                  className="border-t border-stone-100 px-3 pb-3 pt-3 space-y-3"
                  onClick={e => e.stopPropagation()}
                >
                  {todo.description && (
                    <p className="text-xs text-white leading-relaxed">{todo.description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Status</p>
                      <select
                        value={todo.status}
                        onChange={e => onUpdateTodo(todo.id, { status: e.target.value as Status })}
                        className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-700 outline-none"
                      >
                        {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Priority</p>
                      <select
                        value={todo.priority}
                        onChange={e => onUpdateTodo(todo.id, { priority: e.target.value as Priority })}
                        className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-700 outline-none"
                      >
                        {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Due date</p>
                    <input
                      type="date"
                      value={todo.dueDate ?? ""}
                      onChange={e => onUpdateTodo(todo.id, { dueDate: e.target.value || null })}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-700 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={11} /> Delete task
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


export default function Todo() {
  const { user } = useAuth()
  const uid = user?.uid

  const [boards, setBoards]               = useState<Board[]>([])
  const [todos, setTodos]                 = useState<Record<string, TodoItem[]>>({})
  const [view, setView]                   = useState<View>("boards")
  const [activeBoard, setActiveBoard]     = useState<string | null>(null)
  const [loading, setLoading]             = useState(true)
  const [showNewBoard, setShowNewBoard]   = useState(false)
  const [newBoardName, setNewBoardName]   = useState("")
  const [newBoardColor, setNewBoardColor] = useState(BOARD_COLORS[0])
  const [saving, setSaving]               = useState(false)

  const dragging   = useRef<{ id: string; from: Status } | null>(null)
  const todoUnsubs = useRef<Record<string, () => void>>({})

  useEffect(() => {
    if (!uid) return

    const q = query(boardsRef(uid), orderBy("createdAt", "asc"))
    const unsubBoards = onSnapshot(q, snap => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as Board))
      setBoards(fetched)
      setLoading(false)

      fetched.forEach(board => {
        if (todoUnsubs.current[board.id]) return
        const tq = query(todosRef(uid, board.id), orderBy("createdAt", "desc"))
        todoUnsubs.current[board.id] = onSnapshot(tq, tSnap => {
          const items = tSnap.docs.map(d => ({
            id: d.id, boardId: board.id, ...d.data(),
          } as TodoItem))
          setTodos(prev => ({ ...prev, [board.id]: items }))
        })
      })

      const ids = new Set(fetched.map(b => b.id))
      Object.keys(todoUnsubs.current).forEach(id => {
        if (!ids.has(id)) {
          todoUnsubs.current[id]()
          delete todoUnsubs.current[id]
        }
      })
    })

    return () => {
      unsubBoards()
      Object.values(todoUnsubs.current).forEach(u => u())
      todoUnsubs.current = {}
    }
  }, [uid])

  async function addBoard() {
    if (!uid || !newBoardName.trim() || saving) return
    setSaving(true)
    const docRef = await addDoc(boardsRef(uid), {
      name: newBoardName.trim(),
      color: newBoardColor,
      createdAt: serverTimestamp(),
    })
    setActiveBoard(docRef.id)
    setNewBoardName(""); setShowNewBoard(false); setSaving(false)
  }

  async function deleteBoard(boardId: string) {
    if (!uid) return
    const batch = writeBatch(db)
    const tSnap = await getDocs(todosRef(uid, boardId))
    tSnap.forEach(d => batch.delete(d.ref))
    batch.delete(doc(db, "users", uid, "todoBoards", boardId))
    await batch.commit()
    if (activeBoard === boardId) { setView("boards"); setActiveBoard(null) }
  }

  async function addTodo(
    status: Status, title: string,
    description: string, priority: Priority, dueDate: string,
  ) {
    if (!uid || !activeBoard || !title.trim()) return
    await addDoc(todosRef(uid, activeBoard), {
      title: title.trim(),
      description: description.trim() || null,
      status, priority,
      dueDate: dueDate || null,
      createdAt: serverTimestamp(),
    })
  }

  async function updateTodo(id: string, patch: Partial<TodoItem>) {
    if (!uid || !activeBoard) return
    setTodos(prev => ({
      ...prev,
      [activeBoard]: (prev[activeBoard] ?? []).map(t => t.id === id ? { ...t, ...patch } : t),
    }))
    await updateDoc(todoDocRef(uid, activeBoard, id), patch as Record<string, any>)
  }

  async function deleteTodo(id: string) {
    if (!uid || !activeBoard) return
    setTodos(prev => ({
      ...prev,
      [activeBoard]: (prev[activeBoard] ?? []).filter(t => t.id !== id),
    }))
    await deleteDoc(todoDocRef(uid, activeBoard, id))
  }

  function handleDragStart(id: string, from: Status) {
    dragging.current = { id, from }
  }
  function handleDrop(toStatus: Status) {
    if (!dragging.current) return
    updateTodo(dragging.current.id, { status: toStatus })
    dragging.current = null
  }

  const board      = boards.find(b => b.id === activeBoard)
  const boardTodos = activeBoard ? (todos[activeBoard] ?? []) : []
  const grouped    = Object.fromEntries(
    STATUSES.map(s => [s.key, boardTodos.filter(t => t.status === s.key)])
  ) as Record<Status, TodoItem[]>

  if (view === "boards") {
    return (
      <div className="flex flex-col h-full bg-[#eaeaea] font-sans">
        <div className="px-8 py-6 border-b border-stone-200/80 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-800">Boards</h1>
            <span className="text-xs text-stone-400 bg-white border border-stone-200 px-2 py-0.5 rounded-md">
              {boards.length}
            </span>
          </div>
          <p className="text-sm text-stone-400 mt-1">Click a board to open the task view</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map(b => (
                <BoardCard
                  key={b.id}
                  board={b}
                  todos={todos[b.id] ?? []}
                  onClick={() => { setActiveBoard(b.id); setView("board-detail") }}
                  onDelete={e => { e.stopPropagation(); deleteBoard(b.id) }}
                />
              ))}

              {showNewBoard ? (
                <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-3 shadow-sm">
                  <input
                    autoFocus
                    placeholder="Board name"
                    value={newBoardName}
                    onChange={e => setNewBoardName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addBoard(); if (e.key === "Escape") setShowNewBoard(false) }}
                    className="w-full bg-transparent text-sm text-stone-800 placeholder-stone-300 outline-none"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {BOARD_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setNewBoardColor(c)}
                        className={`w-5 h-5 rounded-full transition-all ${
                          newBoardColor === c
                            ? "ring-2 ring-stone-800 ring-offset-1 ring-offset-white"
                            : "opacity-60 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addBoard}
                      disabled={saving}
                      className="flex-1 py-1.5 rounded-xl text-white text-xs font-semibold transition-colors disabled:opacity-50"
                      style={{ backgroundColor: newBoardColor }}
                    >
                      {saving ? "Creating…" : "Create"}
                    </button>
                    <button
                      onClick={() => setShowNewBoard(false)}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-500 text-xs hover:bg-stone-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewBoard(true)}
                  className="rounded-xl border border-dashed border-stone-200 bg-transparent hover:border-stone-300 hover:bg-white/60 transition-all duration-200 p-5 flex flex-col items-center justify-center gap-2 text-stone-300 hover:text-stone-400 min-h-[160px]"
                >
                  <div className="w-8 h-8 rounded-xl border border-stone-200 flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <span className="text-xs">New board</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (view === "board-detail" && board) {
    return (
      <div className="flex flex-col h-full bg-[#eaeaea] font-sans">
        <div className="px-8 py-5 border-b border-stone-200/80 shrink-0 flex items-center gap-4">
          <button
            onClick={() => setView("boards")}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-200 transition-all"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: board.color }} />
          <h1 className="text-lg font-semibold text-stone-800 tracking-tight">{board.name}</h1>
          <span className="text-xs text-stone-400">{boardTodos.length} tasks</span>

          <div className="flex gap-2 ml-auto flex-wrap">
            {STATUSES.map(s => {
              const count = grouped[s.key].length
              if (!count) return null
              return (
                <span
                  key={s.key}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${s.bg} ${s.color} ${s.border}`}
                >
                  {s.icon} {count}
                </span>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div
            className="flex gap-4 px-8 py-6 h-full"
            style={{ minWidth: `${STATUSES.length * 300 + 100}px` }}
          >
            {STATUSES.map(col => (
              <KanbanColumn
                key={col.key}
                col={col}
                todos={grouped[col.key]}
                boardColor={board.color}
                onAddTodo={addTodo}
                onUpdateTodo={updateTodo}
                onDeleteTodo={deleteTodo}
                onDragStart={handleDragStart}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}