import { X, GripVertical, FileText } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Props {
  card: BoardCard
  onUpdate: (data: Partial<BoardCard>) => void
  onDelete: () => void
  onMouseDown: (e: React.MouseEvent) => void
}

const DocumentCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const title   = (card as any).title   ?? ""
  const content = (card as any).content ?? ""

  return (
    <div
      className="absolute group bg-white rounded-2xl shadow-md overflow-hidden"
      style={{ left: card.x, top: card.y, width: 260, minHeight: 180 }}
      onMouseDown={onMouseDown}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-b border-gray-100">
        <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FileText size={13} className="text-blue-500" />
        </div>
        <input
          value={title}
          onMouseDown={e => e.stopPropagation()}
          onChange={e => onUpdate({ title: e.target.value } as any)}
          placeholder="Document title…"
          className="flex-1 text-xs font-semibold text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        <textarea
          value={content}
          onMouseDown={e => e.stopPropagation()}
          onChange={e => onUpdate({ content: e.target.value } as any)}
          placeholder="Start writing…"
          rows={5}
          className="w-full text-xs text-gray-600 leading-relaxed bg-transparent outline-none resize-none placeholder:text-gray-400"
        />
      </div>

      {/* Footer with char count */}
      <div className="px-3 pb-2 flex justify-end">
        <span className="text-[9px] text-gray-300">{content.length} chars</span>
      </div>

      {/* Controls */}
      <button
        onMouseDown={e => e.stopPropagation()}
        onClick={onDelete}
        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 text-gray-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={10} />
      </button>

      <div className="absolute top-2.5 right-8 text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab">
        <GripVertical size={12} />
      </div>
    </div>
  )
}

export default DocumentCard