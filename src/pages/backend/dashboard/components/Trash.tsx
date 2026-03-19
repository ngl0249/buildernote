import { useState, useEffect, useRef, type RefObject } from "react"
import { Trash2, RotateCcw, X, LayoutGrid, AlertTriangle } from "lucide-react"
import { type DeletedBoard } from "../../hooks/useBoards"

interface TrashPanelProps {
  open:            boolean
  deletedBoards:   DeletedBoard[]
  onRestore:       (id: string) => void
  onDeleteForever: (id: string) => void
  onClose:         () => void
  trashButtonRef:  RefObject<HTMLButtonElement | null>

}

const TrashPanel = ({
  open, deletedBoards, onRestore, onDeleteForever, onClose, trashButtonRef,
}: TrashPanelProps) => {
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (trashButtonRef.current?.contains(e.target as Node)) return
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open, onClose, trashButtonRef])

  useEffect(() => { if (!open) setConfirmId(null) }, [open])

  const timeAgo = (ts: number) => {
    const days = Math.floor((Date.now() - ts) / 86400000)
    if (days === 0) return "i dag"
    if (days === 1) return "i går"
    return `${days} dage siden`
  }

  return (
    <div
      ref={panelRef}
      className={`
        h-full bg-[#1a1f2e] border-r border-white/5 flex flex-col flex-shrink-0
        transition-all duration-300 ease-in-out overflow-hidden
        ${open ? "w-72" : "w-0"}
      `}
    >
      <div className="w-72 flex flex-col h-full">

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Trash2 size={15} className="text-gray-400" />
            <span className="text-sm font-semibold text-white">Papirkurv</span>
            {deletedBoards.length > 0 && (
              <span className="text-[10px] bg-white/10 text-gray-400 rounded-md px-1.5 py-0.5 font-medium">
                {deletedBoards.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {deletedBoards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pb-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-400">Papirkurven er tom</p>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                Slettede boards gemmes her i 30 dage
              </p>
            </div>
          ) : (
            <ul className="py-2 px-2 space-y-0.5">
              {deletedBoards.map(board => (
                <li key={board.id} className="rounded-xl overflow-hidden">
                  {confirmId === board.id ? (
                    <div className="flex flex-col gap-2 px-3 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
                        <p className="text-xs text-red-300 font-medium">Slet permanent?</p>
                      </div>
                      <p className="text-[11px] text-red-400/70 leading-relaxed">
                        "{board.title}" kan ikke gendannes bagefter.
                      </p>
                      <div className="flex gap-2 mt-0.5">
                        <button
                          onClick={() => { onDeleteForever(board.id); setConfirmId(null) }}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Slet for altid
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          Annuller
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: board.color || "#f97316" }}
                      >
                        <LayoutGrid size={13} className="text-white/80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-200 truncate">{board.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{timeAgo(board.deletedAt)}</p>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => onRestore(board.id)}
                          title="Gendan board"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
                        >
                          <RotateCcw size={13} />
                        </button>
                        <button
                          onClick={() => setConfirmId(board.id)}
                          title="Slet permanent"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {deletedBoards.length > 0 && (
          <div className="px-5 py-3 border-t border-white/5 flex-shrink-0">
            <p className="text-[10px] text-gray-600 leading-relaxed">
              Boards slettes automatisk efter 30 dage ·{" "}
              <span className="text-orange-400/70 hover:text-orange-400 cursor-pointer transition-colors">
                Opgrader for længere historik
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrashPanel