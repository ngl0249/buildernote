import { useState } from "react"
import { X, GripVertical, Send, MessageSquare } from "lucide-react"
import { type BoardCard } from "../../../types/index"
import { useAuth } from "../../../hooks/useAuth"

interface Comment {
  id: string
  author: string
  avatarUrl: string
  text: string
  ts: number
}

interface Props {
  card: BoardCard
  onUpdate: (data: Partial<BoardCard>) => void
  onDelete: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onSelect: () => void
  onDeselect: () => void
}

const CommentCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const { profile } = useAuth()
  const comments: Comment[] = (card as any).comments ?? []
  const [draft, setDraft] = useState("")

  const addComment = () => {
    if (!draft.trim()) return
    const next = [
      ...comments,
      {
        id: Date.now().toString(),
        author: profile?.displayName ?? "You",
        avatarUrl: profile?.avatarUrl ?? "",
        text: draft.trim(),
        ts: Date.now(),
      },
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
      className="absolute group bg-[#252d3d] rounded-2xl shadow-lg overflow-hidden border border-white/10"
      style={{ left: card.x, top: card.y, width: 260 }}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5">
        <GripVertical size={12} className="text-gray-600 cursor-grab" />
        <MessageSquare size={12} className="text-orange-400" />
        <span className="text-xs font-semibold text-gray-300">Comments</span>
        <span className="ml-auto text-[10px] text-gray-500 bg-white/5 rounded-full px-1.5 py-0.5">{comments.length}</span>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
        >
          <X size={12} />
        </button>
      </div>

      <div className="px-3 py-2 flex flex-col gap-3 max-h-56 overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-[11px] text-gray-600 italic text-center py-3">No comments yet</p>
        )}
        {comments.map(c => (
          <div key={c.id} className="flex gap-2 group/item">
            {c.avatarUrl ? (
              <img src={c.avatarUrl} className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[9px] font-bold">{c.author[0]?.toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-1 mb-0.5">
                <span className="text-[10px] font-semibold text-gray-300 truncate">{c.author}</span>
                <span className="text-[9px] text-gray-600 flex-shrink-0">{fmt(c.ts)}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-snug break-words">{c.text}</p>
            </div>
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => removeComment(c.id)}
              className="text-gray-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0 self-start mt-1"
            >
              <X size={9} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 px-3 py-2 flex gap-2 items-end">
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} className="w-5 h-5 rounded-full object-cover flex-shrink-0 mb-1" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mb-1">
            <span className="text-white text-[8px] font-bold">{(profile?.displayName ?? "Y")[0]?.toUpperCase()}</span>
          </div>
        )}
        <textarea
          value={draft}
          onMouseDown={e => e.stopPropagation()}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment() } }}
          rows={2}
          placeholder="Add a comment…"
          className="flex-1 text-xs text-gray-300 bg-white/5 rounded-lg px-2 py-1.5 outline-none resize-none leading-snug placeholder:text-gray-600 border border-white/5 focus:border-orange-500/30 transition-colors"
        />
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={addComment}
          disabled={!draft.trim()}
          className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-30 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send size={11} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default CommentCard