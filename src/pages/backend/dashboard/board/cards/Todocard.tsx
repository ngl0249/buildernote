import { useState } from "react"
import { X, GripHorizontal, Plus, Check } from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface Props {
  card:        BoardCard
  onUpdate:    (data: Partial<BoardCard>) => void
  onDelete:    () => void
  onMouseDown: (e: React.MouseEvent) => void
}

const TodoCard = ({ card, onUpdate, onDelete, onMouseDown }: Props) => {
  const [focused, setFocused] = useState(false)

  const tasks   = card.content ? card.content.split("\n") : [""]
  const checked = card.checked ?? tasks.map(() => false)

  const setTasks = (newTasks: string[], newChecked: boolean[]) => {
    onUpdate({ content: newTasks.join("\n"), checked: newChecked })
  }

  const toggleCheck = (i: number) => {
    const newChecked = [...checked]
    newChecked[i] = !newChecked[i]
    onUpdate({ checked: newChecked })
  }

  const updateTask = (i: number, val: string) => {
    const newTasks = [...tasks]
    newTasks[i] = val
    setTasks(newTasks, checked)
  }

  const addTask = () => {
    setTasks([...tasks, ""], [...checked, false])
  }

  const removeTask = (i: number) => {
    if (tasks.length === 1) { onDelete(); return }
    const newTasks   = tasks.filter((_, idx) => idx !== i)
    const newChecked = checked.filter((_, idx) => idx !== i)
    setTasks(newTasks, newChecked)
  }

  const done  = checked.filter(Boolean).length
  const total = tasks.length

  return (
    <div
      className="absolute group"
      style={{ left: card.x, top: card.y, width: card.width }}
    >
      <div className={`bg-[#252d3d] rounded-2xl shadow-sm border transition-all ${focused ? "border-orange-300 shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
        <div
          onMouseDown={onMouseDown}
          className="flex items-center justify-between px-3 pt-2.5 pb-2 cursor-grab active:cursor-grabbing border-b border-gray-100"
        >
          <div className="flex items-center gap-2">
            <GripHorizontal size={13} className="text-gray-300 group-hover:text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              To-do
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{done}/{total}</span>
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {total > 0 && (
          <div className="h-0.5 bg-gray-100 mx-3">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
        )}

        <div
          className="px-3 py-2 space-y-1.5"
          onMouseDown={e => e.stopPropagation()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2 group/task">
              <button
                onClick={() => toggleCheck(i)}
                className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                  checked[i]
                    ? "bg-orange-500 border-orange-500"
                    : "border-gray-300 hover:border-orange-400"
                }`}
              >
                {checked[i] && <Check size={10} strokeWidth={3} className="text-white" />}
              </button>
              <input
                value={task}
                onChange={e => updateTask(i, e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") addTask()
                  if (e.key === "Backspace" && task === "") removeTask(i)
                }}
                placeholder="Task..."
                className={`flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300 ${
                  checked[i] ? "line-through text-gray-400" : "text-gray-700"
                }`}
              />
              <button
                onClick={() => removeTask(i)}
                className="opacity-0 group-hover/task:opacity-100 text-gray-300 hover:text-red-400 transition-all"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>

        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={addTask}
          className="w-full flex items-center gap-2 px-3 pb-3 text-xs text-gray-400 hover:text-orange-500 transition-colors"
        >
          <Plus size={12} /> Add task
        </button>
      </div>
    </div>
  )
}

export default TodoCard