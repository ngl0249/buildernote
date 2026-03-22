import { X, GripVertical, Plus } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Props {
  card: BoardCard
  onUpdate: (data: Partial<BoardCard>) => void
  onDelete: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onSelect: () => void
  onDeselect: () => void
}

const DEFAULT_HEADERS = ["Column A", "Column B", "Column C"]
const DEFAULT_ROWS    = [["", "", ""], ["", "", ""]]

const TableCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const headers: string[] = (card as any).headers ?? DEFAULT_HEADERS
  const rawRows = (card as any).rows ?? DEFAULT_ROWS
  const rows: string[][] = rawRows.map((row: any) =>
    typeof row === "string" ? row.split("|||") : row
  )

  const save = (h: string[], r: string[][]) => onUpdate({ 
      headers: h, 
      rows: r.map(row => row.join("|||"))
    } as any)

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
      className="absolute group bg-[#252d3d] rounded-2xl shadow-lg overflow-hidden border border-white/10"
      style={{ left: card.x, top: card.y }}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <GripVertical size={12} className="text-gray-600 cursor-grab" />
          <span className="text-xs font-semibold text-gray-300">Table</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onMouseDown={e => e.stopPropagation()} onClick={addCol}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-orange-400 transition-colors"
          >
            <Plus size={10} /> Col
          </button>
          <button
            onMouseDown={e => e.stopPropagation()} onClick={addRow}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-orange-400 transition-colors"
          >
            <Plus size={10} /> Row
          </button>
          <button
            onMouseDown={e => e.stopPropagation()} onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-[600px]">
        <table className="border-collapse w-full" style={{ minWidth: headers.length * 120 }}>
          <thead>
            <tr>
              {headers.map((h, ci) => (
                <th key={ci} className="relative group/col border-b border-white/5 bg-white/5" style={{ minWidth: 120 }}>
                  <input
                    value={h}
                    onMouseDown={e => e.stopPropagation()}
                    onChange={e => updateHeader(ci, e.target.value)}
                    className="w-full px-3 py-2 text-[11px] font-semibold text-gray-400 bg-transparent outline-none text-left"
                  />
                  {headers.length > 1 && (
                    <button
                      onMouseDown={e => e.stopPropagation()} onClick={() => removeCol(ci)}
                      className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-gray-500 flex items-center justify-center opacity-0 group-hover/col:opacity-100 transition-opacity"
                    >
                      <X size={7} />
                    </button>
                  )}
                </th>
              ))}
              <th className="w-6 border-b border-white/5 bg-white/5" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="group/row border-b border-white/5 last:border-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="border-r border-white/5 last:border-0">
                    <input
                      value={cell}
                      onMouseDown={e => e.stopPropagation()}
                      onChange={e => updateCell(ri, ci, e.target.value)}
                      className="w-full px-3 py-2 text-[11px] text-gray-300 bg-transparent outline-none hover:bg-white/5 focus:bg-white/5 transition-colors"
                    />
                  </td>
                ))}
                <td className="w-6 text-center">
                  {rows.length > 1 && (
                    <button
                      onMouseDown={e => e.stopPropagation()} onClick={() => removeRow(ri)}
                      className="w-4 h-4 rounded flex items-center justify-center text-gray-600 hover:text-red-400 opacity-0 group-hover/row:opacity-100 transition-opacity mx-auto"
                    >
                      <X size={9} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableCard