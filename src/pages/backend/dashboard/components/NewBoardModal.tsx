import { useState, useEffect } from "react"
import { X, Plus, Check } from "lucide-react"
import { BOARD_ICONS, BOARD_COLORS, DEFAULT_COLOR } from "../../hooks/BoardIcons"

interface NewBoardModalProps {
  onClose:  () => void
  onCreate: (title: string, iconName: string, color: string) => void
}

const NewBoardModal = ({ onClose, onCreate }: NewBoardModalProps) => {
  const [title,    setTitle]    = useState("")
  const [iconName, setIconName] = useState(BOARD_ICONS[0].name)
  const [color,    setColor]    = useState(DEFAULT_COLOR)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  const handleCreate = () => {
    const t = title.trim()
    if (!t) return
    onCreate(t, iconName, color)
    onClose()
  }

  const SelectedIcon = BOARD_ICONS.find(i => i.name === iconName)?.Icon ?? BOARD_ICONS[0].Icon

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">New board</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-center mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-all duration-200"
            style={{ backgroundColor: color + "22", border: `2px solid ${color}55` }}
          >
            <SelectedIcon size={28} style={{ color }} />
          </div>
        </div>

        <label className="block text-xs font-medium text-gray-600 mb-1.5">Board name</label>
        <input
          autoFocus
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleCreate()}
          placeholder="My new board"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-colors mb-4"
        />

        <label className="block text-xs font-medium text-gray-600 mb-2">Icon</label>
        <div className="grid grid-cols-8 gap-1.5 mb-4 max-h-28 overflow-y-auto pr-1">
          {BOARD_ICONS.map(({ name, Icon }) => (
            <button
              key={name}
              onClick={() => setIconName(name)}
              title={name}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                iconName === name
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>

        <label className="block text-xs font-medium text-gray-600 mb-2">Color</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {BOARD_COLORS.map(({ hex, label }) => (
            <button
              key={hex}
              onClick={() => setColor(hex)}
              title={label}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: hex }}
            >
              {color === hex && <Check size={12} className="text-white drop-shadow" />}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={15} /> Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewBoardModal