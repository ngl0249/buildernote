import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react"
import { type Board } from "../../types/index"
import { getIcon } from "../../hooks/BoardIcons"

interface BoardCardProps {
  board:       Board
  username:    string
  onRename:    (id: string, title: string) => void
  onDelete:    (id: string) => void
  onDragStart: (id: string) => void
  onDragOver:  (e: React.DragEvent, id: string) => void
  onDrop:      (targetId: string) => void
  isDragging:  boolean
  isDragOver:  boolean
}

const BoardCard = ({
  board, username, onRename, onDelete,
  onDragStart, onDragOver, onDrop,
  isDragging, isDragOver,
}: BoardCardProps) => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing]   = useState(false)
  const [title, setTitle]       = useState(board.title)
  const inputRef = useRef<HTMLInputElement>(null)

  const BoardIcon = getIcon(board.iconName)

  const boardUrl = `/${username}/board/${board.slug || board.id}`

  const commitRename = () => {
    const t = title.trim()
    if (t && t !== board.title) onRename(board.id, t)
    else setTitle(board.title)
    setEditing(false)
  }

  return (
    <div
      draggable
      onDragStart={() => onDragStart(board.id)}
      onDragOver={e => { e.preventDefault(); onDragOver(e, board.id) }}
      onDrop={() => onDrop(board.id)}
      className={`relative flex flex-col cursor-pointer select-none group transition-all duration-150 ${
        isDragging ? "opacity-40 scale-95" : ""
      } ${isDragOver ? "scale-105" : ""}`}
      onClick={() => !editing && !menuOpen && navigate(boardUrl)}
    >
      <div
        className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center mb-3 relative overflow-hidden transition-all group-hover:shadow-lg"
        style={{ backgroundColor: board.color + "22", border: `1.5px solid ${board.color}44` }}
      >
        <BoardIcon size={36} style={{ color: board.color }} strokeWidth={1.5} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      <div className="px-1">
        {editing ? (
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <input
              ref={inputRef}
              value={title}
              autoFocus
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") commitRename()
                if (e.key === "Escape") { setTitle(board.title); setEditing(false) }
              }}
              className="flex-1 text-sm font-semibold text-gray-800 bg-white border border-orange-400 rounded-lg px-2 py-0.5 focus:outline-none shadow-sm"
            />
            <button onClick={commitRename} className="text-emerald-500 hover:text-emerald-600 transition-colors">
              <Check size={14} />
            </button>
            <button onClick={() => { setTitle(board.title); setEditing(false) }} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold text-gray-800 truncate">{board.title}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">{board.cardCount} cards</p>
      </div>

      {!editing && (
        <button
          onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
        >
          <MoreHorizontal size={14} />
        </button>
      )}

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
          <div
            onClick={e => e.stopPropagation()}
            className="absolute top-10 right-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-40 overflow-hidden"
          >
            <button
              onClick={() => { setEditing(true); setMenuOpen(false); setTimeout(() => inputRef.current?.focus(), 50) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Pencil size={13} /> Rename
            </button>
            <button
              onClick={() => { onDelete(board.id); setMenuOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default BoardCard