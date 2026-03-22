import { X, GripVertical, Plus } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Column {
  id: string
  title: string
  items: string[]
}

interface Props {
  card: BoardCard
  onUpdate: (data: Partial<BoardCard>) => void
  onDelete: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onSelect: () => void
  onDeselect: () => void
}

const defaultColumns = (): Column[] => [
  { id: "c1", title: "To Do",       items: [] },
  { id: "c2", title: "In Progress", items: [] },
  { id: "c3", title: "Done",        items: [] },
]

const COLUMN_COLORS = [
  "border-t-gray-400",
  "border-t-orange-400",
  "border-t-emerald-400",
  "border-t-sky-400",
  "border-t-violet-400",
]

const ColumnCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const columns: Column[] = (card as any).columns ?? defaultColumns()

  const save = (next: Column[]) => onUpdate({ columns: next } as any)

  const updateColTitle = (idx: number, title: string) =>
    save(columns.map((c, i) => i === idx ? { ...c, title } : c))

  const addItem = (idx: number) =>
    save(columns.map((c, i) => i === idx ? { ...c, items: [...c.items, ""] } : c))

  const updateItem = (colIdx: number, itemIdx: number, val: string) =>
    save(columns.map((c, i) =>
      i === colIdx ? { ...c, items: c.items.map((it, j) => j === itemIdx ? val : it) } : c
    ))

  const removeItem = (colIdx: number, itemIdx: number) =>
    save(columns.map((c, i) =>
      i === colIdx ? { ...c, items: c.items.filter((_, j) => j !== itemIdx) } : c
    ))

  const addColumn = () =>
    save([...columns, { id: Date.now().toString(), title: "New column", items: [] }])

  const removeColumn = (idx: number) =>
    save(columns.filter((_, i) => i !== idx))

  return (
    <div
      className="absolute group bg-[#252d3d] rounded-2xl shadow-lg overflow-hidden border border-white/10"
      style={{ left: card.x, top: card.y, minWidth: 180 + columns.length * 160, maxWidth: 900 }}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <GripVertical size={12} className="text-gray-600 cursor-grab" />
          <span className="text-xs font-semibold text-gray-300">Columns</span>
          <span className="text-[10px] text-gray-600 bg-white/5 rounded-full px-1.5 py-0.5">{columns.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={addColumn}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-orange-400 transition-colors"
          >
            <Plus size={11} /> Column
          </button>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="flex gap-px bg-white/5">
        {columns.map((col, ci) => (
          <div key={col.id} className={`flex-1 bg-[#252d3d] min-w-[150px] border-t-2 ${COLUMN_COLORS[ci % COLUMN_COLORS.length]}`}>
            <div className="flex items-center gap-1 px-3 pt-3 pb-2">
              <input
                value={col.title}
                onMouseDown={e => e.stopPropagation()}
                onChange={e => updateColTitle(ci, e.target.value)}
                className="flex-1 text-[11px] font-semibold text-gray-300 bg-transparent outline-none"
              />
              {columns.length > 1 && (
                <button
                  onMouseDown={e => e.stopPropagation()}
                  onClick={() => removeColumn(ci)}
                  className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={10} />
                </button>
              )}
            </div>

            <div className="px-2 pb-3 flex flex-col gap-1.5">
              {col.items.map((item, ii) => (
                <div key={ii} className="flex items-start gap-1 group/item">
                  <textarea
                    value={item}
                    onMouseDown={e => e.stopPropagation()}
                    onChange={e => updateItem(ci, ii, e.target.value)}
                    rows={1}
                    className="flex-1 text-[11px] text-gray-300 bg-white/5 rounded-lg px-2 py-1.5 outline-none resize-none leading-tight border border-white/5 focus:border-orange-500/30 transition-colors placeholder:text-gray-600"
                    placeholder="Item..."
                  />
                  <button
                    onMouseDown={e => e.stopPropagation()}
                    onClick={() => removeItem(ci, ii)}
                    className="mt-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <X size={9} />
                  </button>
                </div>
              ))}
              <button
                onMouseDown={e => e.stopPropagation()}
                onClick={() => addItem(ci)}
                className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-orange-400 transition-colors py-0.5 mt-0.5"
              >
                <Plus size={10} /> Add item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ColumnCard