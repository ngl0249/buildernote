import { X, GripVertical, Plus } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Props {
  card: BoardCard
  onUpdate: (data: Partial<BoardCard>) => void
  onDelete: () => void
  onMouseDown: (e: React.MouseEvent) => void
}

const DEFAULT_HEADERS = ["Column A", "Column B", "Column C"]
const DEFAULT_ROWS    = [["", "", ""], ["", "", ""]]

const TableCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const headers: string[]   = (card as any).headers ?? DEFAULT_HEADERS
  const rows: string[][]    = (card as any).rows    ?? DEFAULT_ROWS

  const save = (h: string[], r: string[][]) => onUpdate({ headers: h, rows: r } as any)

  const updateHeader = (ci: number, val: string) =>
    save(headers.map((h, i) => i === ci ? val : h), rows)

  const updateCell = (ri: number, ci: number, val: string) =>
    save(headers, rows.map((row, i) =>
      i === ri ? row.map((cell, j) => j === ci ? val : cell) : row
    ))

  const addRow = () => save(headers, [...rows, Array(headers.length).fill("")])
  const addCol = () => save([...headers, `Col ${headers.length + 1}`], rows.map(r => [...r, ""]))
  const removeRow = (ri: number) => save(headers, rows.filter((_, i) => i !== ri))
  const removeCol = (ci: number) => save(
    headers.filter((_, i) => i !== ci),
    rows.map(r => r.filter((_, i) => i !== ci))
  )

  return (
    <div
      className="absolute group bg-white rounded-2xl shadow-md overflow-hidden"
      style={{ left: card.x, top: card.y }}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-600">Table</span>
        <div className="flex items-center gap-2">
          <button onMouseDown={e => e.stopPropagation()} onClick={addCol}
            className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            <Plus size={10} /> Col
          </button>
          <button onMouseDown={e => e.stopPropagation()} onClick={addRow}
            className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            <Plus size={10} /> Row
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-[600px]">
        <table className="border-collapse" style={{ minWidth: headers.length * 110 }}>
          <thead>
            <tr>
              {headers.map((h, ci) => (
                <th key={ci} className="border border-gray-100 bg-gray-50 relative group/col" style={{ minWidth: 110 }}>
                  <input value={h} onMouseDown={e => e.stopPropagation()}
                    onChange={e => updateHeader(ci, e.target.value)}
                    className="w-full px-2 py-1.5 text-[11px] font-semibold text-gray-600 bg-transparent outline-none text-center" />
                  {headers.length > 1 && (
                    <button onMouseDown={e => e.stopPropagation()} onClick={() => removeCol(ci)}
                      className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 text-gray-400 flex items-center justify-center opacity-0 group-hover/col:opacity-100 transition-opacity">
                      <X size={7} />
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="group/row">
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-gray-100">
                    <input value={cell} onMouseDown={e => e.stopPropagation()}
                      onChange={e => updateCell(ri, ci, e.target.value)}
                      className="w-full px-2 py-1.5 text-[11px] text-gray-600 bg-transparent outline-none hover:bg-blue-50/40 focus:bg-blue-50 transition-colors" />
                  </td>
                ))}
                <td className="border-0 pl-1">
                  {rows.length > 1 && (
                    <button onMouseDown={e => e.stopPropagation()} onClick={() => removeRow(ri)}
                      className="w-4 h-4 rounded flex items-center justify-center text-gray-300 hover:text-red-400 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <X size={9} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onMouseDown={e => e.stopPropagation()} onClick={onDelete}
        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 text-gray-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <X size={10} />
      </button>
      <div className="absolute top-2.5 right-8 text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab">
        <GripVertical size={12} />
      </div>
    </div>
  )
}

export default TableCard