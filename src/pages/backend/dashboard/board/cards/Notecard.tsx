import { useState, useRef, useEffect } from "react"
import { X, GripHorizontal } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Props {
  card:        BoardCard
  onUpdate:    (data: Partial<BoardCard>) => void
  onDelete:    () => void
  onMouseDown: (e: React.MouseEvent) => void
  onSelect?:   () => void
  onDeselect?: () => void
}

const NoteCard = ({ card, onUpdate, onDelete, onMouseDown, onSelect, onDeselect }: Props) => {
  const [focused, setFocused] = useState(false)
  const textRef  = useRef<HTMLTextAreaElement>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const h = wrapRef.current.offsetHeight
    if (h && h !== card.height) onUpdate({ height: h })
  })

  return (
      <div
        ref={wrapRef}
        className="absolute group"
        style={{ left: card.x, top: card.y, width: card.width ?? 280 }}
        onMouseDown={onMouseDown}
        onClick={onSelect}
      >
      <div className={`bg-[#252d3d] rounded-2xl shadow-sm border transition-all cursor-grab active:cursor-grabbing ${focused ? "border-orange-300 shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
          <GripHorizontal size={13} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
          >
            <X size={13} />
          </button>
        </div>
        <textarea
          ref={textRef}
          value={card.content}
          placeholder="Write a note..."
          onFocus={() => { setFocused(true); onSelect?.() }}
          onBlur={() => { setFocused(false); onUpdate({ content: card.content }); onDeselect?.() }}
          onChange={e => onUpdate({ content: e.target.value })}
          onMouseDown={e => e.stopPropagation()}
          rows={4}
          className="w-full px-3 pb-3 text-sm text-white placeholder-gray-300 resize-none focus:outline-none rounded-b-2xl bg-transparent leading-relaxed cursor-text"
        />
      </div>
    </div>
  )
}

export default NoteCard