import { useState } from "react"
import { X, GripVertical, MessageSquare, Send } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Comment {
  id: string
  author: string
  text: string
  ts: number
}

interface Props {
  card: BoardCard
  onUpdate: (data: Partial<BoardCard>) => void
  onDelete: () => void
  onMouseDown: (e: React.MouseEvent) => void
}

const CommentCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const comments: Comment[] = (card as any).comments ?? []
  const [draft, setDraft]   = useState("")
  const [author, ] = useState("You")

  const addComment = () => {
    if (!draft.trim()) return
    const next = [
      ...comments,
      { id: Date.now().toString(), author, text: draft.trim(), ts: Date.now() },
    ]
    onUpdate({ comments: next } as any)
    setDraft("")
  }

  const removeComment = (id: string) => {
    onUpdate({ comments: comments.filter(c => c.id !== id) } as any)
  }

  const fmt = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <div
      className="absolute group bg-white rounded-2xl shadow-md overflow-hidden"
      style={{ left: card.x, top: card.y, width: 240 }}
      onMouseDown={onMouseDown}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-yellow-50 border-b border-yellow-100">
        <MessageSquare size={13} className="text-yellow-500 flex-shrink-0" />
        <span className="text-xs font-semibold text-yellow-700">Comments</span>
        <span className="ml-auto text-[10px] text-yellow-500 bg-yellow-100 rounded-full px-1.5 py-0.5">
          {comments.length}
        </span>
      </div>

      {/* Thread */}
      <div className="px-3 py-2 flex flex-col gap-2 max-h-52 overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-[11px] text-gray-400 italic text-center py-2">No comments yet</p>
        )}
        {comments.map(c => (
          <div key={c.id} className="group/item flex gap-2">
            {/* Avatar */}
            <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-yellow-600">
              {c.author[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-[10px] font-semibold text-gray-600 truncate">{c.author}</span>
                <span className="text-[9px] text-gray-300 flex-shrink-0">{fmt(c.ts)}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug break-words">{c.text}</p>
            </div>
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => removeComment(c.id)}
              className="text-gray-200 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0 self-start mt-0.5"
            >
              <X size={9} />
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-3 py-2 flex gap-1.5 items-end">
        <textarea
          value={draft}
          onMouseDown={e => e.stopPropagation()}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment() } }}
          rows={2}
          placeholder="Add a comment…"
          className="flex-1 text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1.5 outline-none resize-none leading-snug placeholder:text-gray-400"
        />
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={addComment}
          disabled={!draft.trim()}
          className="w-7 h-7 rounded-lg bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send size={11} className="text-white" />
        </button>
      </div>

      {/* Delete */}
      <button
        onMouseDown={e => e.stopPropagation()}
        onClick={onDelete}
        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-yellow-100 hover:bg-red-100 hover:text-red-500 text-yellow-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={10} />
      </button>

      <div className="absolute top-2.5 right-8 text-yellow-300 opacity-0 group-hover:opacity-100 cursor-grab">
        <GripVertical size={12} />
      </div>
    </div>
  )
}

export default CommentCard