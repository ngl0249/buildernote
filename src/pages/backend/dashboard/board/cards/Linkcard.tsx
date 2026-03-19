import { useState } from "react"
import { X, GripHorizontal, ExternalLink, Link2 } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Props {
  card:        BoardCard
  onUpdate:    (data: Partial<BoardCard>) => void
  onDelete:    () => void
  onMouseDown: (e: React.MouseEvent) => void
}

const LinkCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const [editing, setEditing] = useState(!card.content)
  const [urlInput, setUrlInput] = useState(card.content)
  const [titleInput, setTitleInput] = useState(card.title ?? "")

  const save = () => {
    onUpdate({ content: urlInput, title: titleInput || urlInput })
    setEditing(false)
  }

  const isValid = urlInput.startsWith("http://") || urlInput.startsWith("https://")

  return (
    <div
      className="absolute group"
      style={{ left: card.x, top: card.y, width: card.width }}
    >
      <div className="bg-[#252d3d] rounded-2xl shadow-sm border border-gray-200 hover:border-gray-300 transition-all">
        <div
          onMouseDown={onMouseDown}
          className="flex items-center justify-between px-3 pt-2.5 pb-1 cursor-grab active:cursor-grabbing"
        >
          <GripHorizontal size={13} className="text-gray-300 group-hover:text-gray-400" />
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
          >
            <X size={13} />
          </button>
        </div>

        <div className="px-3 pb-3" onMouseDown={e => e.stopPropagation()}>
          {editing ? (
            <div className="space-y-2">
              <input
                autoFocus
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://..."
                onKeyDown={e => e.key === "Enter" && save()}
                className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-300"
              />
              <input
                type="text"
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                placeholder="Label (optional)"
                onKeyDown={e => e.key === "Enter" && save()}
                className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-300"
              />
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex-1 text-xs text-gray-400 hover:text-gray-600 py-1.5 transition-colors">Cancel</button>
                <button
                  onClick={save}
                  disabled={!isValid}
                  className="flex-1 text-xs bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-lg py-1.5 transition-colors font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-2.5 cursor-pointer group/link"
              onClick={() => isValid && window.open(card.content, "_blank", "noopener")}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <Link2 size={14} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate group-hover/link:text-blue-500 transition-colors">
                  {card.title || card.content}
                </p>
                <p className="text-xs text-gray-400 truncate">{card.content}</p>
              </div>
              <ExternalLink size={13} className="text-gray-300 group-hover/link:text-blue-400 transition-colors flex-shrink-0" />
            </div>
          )}

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="mt-2 w-full text-xs text-gray-400 hover:text-orange-500 transition-colors text-left"
            >
              Edit link
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LinkCard