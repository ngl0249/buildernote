import { useState, useRef } from "react"
import { X, GripHorizontal } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Props {
  card:        BoardCard
  onUpdate:    (data: Partial<BoardCard>) => void
  onDelete:    () => void
  onMouseDown: (e: React.MouseEvent) => void
}

const NoteCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const [focused, setFocused] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div
      className="absolute group"
      style={{ left: card.x, top: card.y, width: card.width }}
    >
      <div className={`bg-white rounded-2xl shadow-sm border transition-all ${focused ? "border-orange-300 shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
        <div
          onMouseDown={onMouseDown}
          className="flex items-center justify-between px-3 pt-2.5 pb-1 cursor-grab active:cursor-grabbing"
        >
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
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onUpdate({ content: card.content }) }}
          onChange={e => onUpdate({ content: e.target.value })}
          onMouseDown={e => e.stopPropagation()}
          rows={4}
          className="w-full px-3 pb-3 text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none rounded-b-2xl bg-transparent leading-relaxed"
        />
      </div>
    </div>
  )
}

export default NoteCard