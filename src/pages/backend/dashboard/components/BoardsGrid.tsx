import { useState } from "react"
import { Plus } from "lucide-react"
import { type Board } from "../../types/index"
import BoardCard from "./BoardCard"
import NewBoardModal from "./NewBoardModal"

interface BoardsGridProps {
  boards:    Board[]
  loading:   boolean
  username:  string
  onCreate:  (title: string, iconName: string, color: string) => void
  onRename:  (id: string, title: string) => void
  onDelete:  (id: string) => void
  onReorder: (reordered: Board[]) => void
}

const BoardsGrid = ({ boards, loading, username, onCreate, onRename, onDelete, onReorder }: BoardsGridProps) => {
  const [showModal, setShowModal]   = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const handleDragStart = (id: string) => setDraggingId(id)

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (id !== draggingId) setDragOverId(id)
  }

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null); setDragOverId(null); return
    }
    const from = boards.findIndex(b => b.id === draggingId)
    const to   = boards.findIndex(b => b.id === targetId)
    if (from === -1 || to === -1) return
    const reordered = [...boards]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    onReorder(reordered)
    setDraggingId(null); setDragOverId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Home</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {boards.length} {boards.length === 1 ? "board" : "boards"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1e2433] hover:bg-[#252d3d] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} className="text-orange-400" />
          New board
        </button>
      </div>

      {boards.length > 0 ? (
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
          onDragEnd={() => { setDraggingId(null); setDragOverId(null) }}
        >
          {boards.map(board => (
            <BoardCard
              key={board.id}
              board={board}
              username={username}
              onRename={onRename}
              onDelete={onDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggingId === board.id}
              isDragOver={dragOverId === board.id}
            />
          ))}

          <button
            onClick={() => setShowModal(true)}
            className="flex flex-col items-center justify-center aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50/60 text-gray-400 hover:text-orange-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center mb-2 transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-xs font-medium">New board</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1e2433] flex items-center justify-center mb-5 shadow-lg">
            <Plus size={28} className="text-orange-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">No boards yet</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            Create your first board to start organizing your projects and ideas.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus size={15} /> Create your first board
          </button>
        </div>
      )}

      {showModal && (
        <NewBoardModal
          onClose={() => setShowModal(false)}
          onCreate={onCreate}
        />
      )}
    </>
  )
}

export default BoardsGrid