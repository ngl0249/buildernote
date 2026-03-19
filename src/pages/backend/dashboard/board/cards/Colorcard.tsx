import { useState } from "react"
import { X, GripVertical } from "lucide-react"
import { type BoardCard } from "../../../types/index"

const SWATCHES = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
  "#f8fafc", "#1e293b",
]

interface Props {
  card: BoardCard
  onUpdate: (data: Partial<BoardCard>) => void
  onDelete: () => void
  onMouseDown: (e: React.MouseEvent) => void
}

const ColorCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const color = (card as any).color ?? "#3b82f6"
  const label = (card as any).label ?? ""
  const [editing, setEditing] = useState(false)

  return (
    <div
      className="absolute group rounded-2xl shadow-lg overflow-hidden"
      style={{ left: card.x, top: card.y, width: 180 }}
      onMouseDown={onMouseDown}
    >
      {/* Colour swatch */}
      <div
        className="w-full h-20 flex items-end pb-2 px-3"
        style={{ backgroundColor: color }}
      >
        <span className="text-[10px] font-mono text-white/60 select-all">{color}</span>
      </div>

      {/* Palette row */}
      <div className="bg-white px-3 py-2 flex flex-wrap gap-1.5 items-center">
        {SWATCHES.map(sw => (
          <button
            key={sw}
            onMouseDown={e => e.stopPropagation()}
            onClick={() => onUpdate({ color: sw } as any)}
            className="w-4 h-4 rounded-full border-[1.5px] transition-transform hover:scale-125"
            style={{
              backgroundColor: sw,
              borderColor: sw === color ? "#374151" : "#e5e7eb",
              boxShadow: sw === "#f8fafc" ? "inset 0 0 0 1px #e2e8f0" : undefined,
            }}
          />
        ))}
        {/* Custom colour picker */}
        <input
          type="color"
          value={color}
          onMouseDown={e => e.stopPropagation()}
          onChange={e => onUpdate({ color: e.target.value } as any)}
          className="w-4 h-4 rounded-full cursor-pointer border-0 p-0 opacity-60 hover:opacity-100 transition-opacity"
          title="Custom colour"
        />
      </div>

      {/* Label */}
      <div className="bg-white border-t border-gray-100 px-3 pb-2.5 pt-1.5">
        {editing ? (
          <input
            autoFocus
            value={label}
            onMouseDown={e => e.stopPropagation()}
            onChange={e => onUpdate({ label: e.target.value } as any)}
            onBlur={() => setEditing(false)}
            className="w-full text-xs text-gray-700 outline-none bg-transparent"
            placeholder="Label…"
          />
        ) : (
          <p
            className="text-xs text-gray-400 cursor-text min-h-[14px]"
            onMouseDown={e => e.stopPropagation()}
            onClick={() => setEditing(true)}
          >
            {label || <span className="italic">Label…</span>}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        onMouseDown={e => e.stopPropagation()}
        onClick={onDelete}
        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/25 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={10} />
      </button>

      <div className="absolute top-2 left-2 text-white/40 opacity-0 group-hover:opacity-100 cursor-grab">
        <GripVertical size={12} />
      </div>
    </div>
  )
}

export default ColorCard