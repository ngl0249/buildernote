import { X, GripVertical, Plus, } from "lucide-react"
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
}

const defaultColumns = (): Column[] => [
  { id: "c1", title: "To Do",       items: [] },
  { id: "c2", title: "In Progress", items: [] },
  { id: "c3", title: "Done",        items: [] },
]

const ColumnCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const columns: Column[] = (card as any).columns ?? defaultColumns()

  const save = (next: Column[]) => onUpdate({ columns: next } as any)

  const updateColTitle = (idx: number, title: string) => {
    const next = columns.map((c, i) => i === idx ? { ...c, title } : c)
    save(next)
  }

  const addItem = (idx: number) => {
    const next = columns.map((c, i) =>
      i === idx ? { ...c, items: [...c.items, ""] } : c
    )
    save(next)
  }

  const updateItem = (colIdx: number, itemIdx: number, val: string) => {
    const next = columns.map((c, i) =>
      i === colIdx
        ? { ...c, items: c.items.map((it, j) => j === itemIdx ? val : it) }
        : c
    )
    save(next)
  }

  const removeItem = (colIdx: number, itemIdx: number) => {
    const next = columns.map((c, i) =>
      i === colIdx ? { ...c, items: c.items.filter((_, j) => j !== itemIdx) } : c
    )
    save(next)
  }

  const addColumn = () => {
    save([...columns, { id: Date.now().toString(), title: "Column", items: [] }])
  }

  const removeColumn = (idx: number) => {
    save(columns.filter((_, i) => i !== idx))
  }

  return (
    <div
      className="absolute group bg-white rounded-2xl shadow-md overflow-hidden"
      style={{ left: card.x, top: card.y, minWidth: 220 + columns.length * 160, maxWidth: 900 }}
      onMouseDown={onMouseDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-600">Columns</span>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={addColumn}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Columns row */}
      <div className="flex gap-px bg-gray-100">
        {columns.map((col, ci) => (
          <div key={col.id} className="flex-1 bg-white min-w-[140px]">
            {/* Column title */}
            <div className="flex items-center gap-1 px-2.5 pt-2.5 pb-1.5">
              <input
                value={col.title}
                onMouseDown={e => e.stopPropagation()}
                onChange={e => updateColTitle(ci, e.target.value)}
                className="flex-1 text-[11px] font-semibold text-gray-600 bg-transparent outline-none"
              />
              {columns.length > 1 && (
                <button
                  onMouseDown={e => e.stopPropagation()}
                  onClick={() => removeColumn(ci)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <X size={10} />
                </button>
              )}
            </div>

            {/* Items */}
            <div className="px-2 pb-2 flex flex-col gap-1">
              {col.items.map((item, ii) => (
                <div key={ii} className="flex items-start gap-1 group/item">
                  <textarea
                    value={item}
                    onMouseDown={e => e.stopPropagation()}
                    onChange={e => updateItem(ci, ii, e.target.value)}
                    rows={1}
                    className="flex-1 text-[11px] text-gray-600 bg-gray-50 rounded-lg px-2 py-1 outline-none resize-none leading-tight"
                  />
                  <button
                    onMouseDown={e => e.stopPropagation()}
                    onClick={() => removeItem(ci, ii)}
                    className="mt-1 text-gray-300 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <X size={9} />
                  </button>
                </div>
              ))}

              <button
                onMouseDown={e => e.stopPropagation()}
                onClick={() => addItem(ci)}
                className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors py-0.5"
              >
                <Plus size={10} /> Add item
              </button>
            </div>
          </div>
        ))}
      </div>

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

export default ColumnCard