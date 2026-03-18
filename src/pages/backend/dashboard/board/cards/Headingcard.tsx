import { useState } from "react"
import { X, GripHorizontal } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Props {
  card:        BoardCard
  onUpdate:    (data: Partial<BoardCard>) => void
  onDelete:    () => void
  onMouseDown: (e: React.MouseEvent) => void
}

const HeadingCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const [editing, setEditing] = useState(false)

  return (
    <div
      className="absolute group"
      style={{ left: card.x, top: card.y, width: card.width }}
    >
      <div className="flex items-center gap-2">
        <div
          onMouseDown={onMouseDown}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <GripHorizontal size={13} className="text-gray-400" />
        </div>

        {editing ? (
          <input
            autoFocus
            value={card.content}
            onChange={e => onUpdate({ content: e.target.value })}
            onBlur={() => setEditing(false)}
            onKeyDown={e => e.key === "Enter" && setEditing(false)}
            onMouseDown={e => e.stopPropagation()}
            className="flex-1 text-xl font-bold text-gray-800 bg-transparent border-b-2 border-orange-400 focus:outline-none pb-0.5"
          />
        ) : (
          <h2
            onClick={() => setEditing(true)}
            onMouseDown={e => e.stopPropagation()}
            className="flex-1 text-xl font-bold text-gray-800 cursor-text hover:text-orange-500 transition-colors truncate"
          >
            {card.content || "Heading"}
          </h2>
        )}

        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

export default HeadingCard