import { useState, useRef } from "react"
import {
  Sparkles, FileText, LayoutGrid, Users,
  Check, X, GripVertical, Plus, UserPlus, MessageSquare, Zap
} from "lucide-react"


const INITIAL_TASKS = [
  { id: 1, text: "Design landing page", done: true },
  { id: 2, text: "Set up Firebase auth", done: true },
  { id: 3, text: "Build board canvas", done: false },
  { id: 4, text: "Connect Firestore", done: false },
]

const FEATURES = [
  {
    Icon: Sparkles,
    label: "Ideas",
    title: "Save ideas & inspiration",
    desc: "Combine notes, images, videos, sketches and more with ease. Collect anything that sparks your creativity.",
  },
  {
    Icon: FileText,
    label: "Notes",
    title: "Take notes & collect research",
    desc: "Quickly jot down ideas with simple text editing, and save links or content from the web in a single click.",
  },
  {
    Icon: LayoutGrid,
    label: "Organize",
    title: "Organize projects visually",
    desc: "Gather all your project information and tasks into one place so you can see the big picture — and the details.",
  },
  {
    Icon: Users,
    label: "Collaborate",
    title: "Collaborate with clients & your team",
    desc: "Invite others to edit, comment or view your boards and collaborate like you're in the same room.",
  },
]

type Column = "waiting" | "doing" | "done"

interface KanbanTask {
  id: number
  text: string
  col: Column
  tag?: string
}

const INITIAL_KANBAN: KanbanTask[] = [
  { id: 10, text: "Design system tokens", col: "done", tag: "Design" },
  { id: 11, text: "Auth flow mockups", col: "done", tag: "Design" },
  { id: 12, text: "Build board canvas", col: "doing", tag: "Dev" },
  { id: 13, text: "Real-time sync", col: "doing", tag: "Dev" },
  { id: 14, text: "Mobile layout", col: "waiting", tag: "Design" },
  { id: 15, text: "Onboarding flow", col: "waiting", tag: "Product" },
  { id: 16, text: "Beta invites", col: "waiting", tag: "Growth" },
]

const COLS: { id: Column; label: string; borderIdle: string; borderActive: string; dot: string }[] = [
  { id: "waiting", label: "To-do / Waiting", borderIdle: "border-white/10",       borderActive: "border-gray-400/50",    dot: "bg-gray-400" },
  { id: "doing",   label: "Doing",   borderIdle: "border-orange-500/30",  borderActive: "border-orange-400/70",  dot: "bg-orange-400" },
  { id: "done",    label: "Done",    borderIdle: "border-emerald-500/30", borderActive: "border-emerald-400/70", dot: "bg-emerald-400" },
]

const TAG_COLORS: Record<string, string> = {
  Design:  "bg-violet-500/20 text-violet-300 border border-violet-500/20",
  Dev:     "bg-sky-500/20 text-sky-300 border border-sky-500/20",
  Product: "bg-amber-500/20 text-amber-300 border border-amber-500/20",
  Growth:  "bg-rose-500/20 text-rose-300 border border-rose-500/20",
}

const COLLAB_ITEMS = [
  { Icon: UserPlus,      title: "Invite your team",  desc: "Share any board with a link or email invite. Guests get view-only access by default." },
  { Icon: MessageSquare, title: "Leave comments",    desc: "Drop comments anywhere on the board. Tag teammates and resolve threads." },
  { Icon: Zap,           title: "Real-time sync",    desc: "Changes appear instantly for everyone. No refresh, no conflicts, no drama." },
]


const SectionDivider = ({ label }: { label?: string }) => (
  <div className="relative flex items-center gap-6 py-10 md:py-12">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    {label && (
      <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase shrink-0 select-none">
        {label}
      </span>
    )}
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
  </div>
)


const TodoWidget = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [input, setInput] = useState("")

  const toggle = (id: number) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x))
  const addTask = () => {
    const text = input.trim()
    if (!text) return
    setTasks(t => [...t, { id: Date.now(), text, done: false }])
    setInput("")
  }
  const remove = (id: number) => setTasks(t => t.filter(x => x.id !== id))

  const doneCount = tasks.filter(t => t.done).length
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  return (
    <div className="bg-[#1a1f2e] rounded-2xl p-5 md:p-6 shadow-xl border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-semibold text-sm">Project tasks</p>
          <p className="text-gray-500 text-xs mt-0.5">{doneCount} of {tasks.length} completed</p>
        </div>
        <p className="text-orange-400 font-bold text-lg">{pct}%</p>
      </div>

      <div className="h-1.5 bg-white/10 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <div className="space-y-2 mb-4 max-h-52 overflow-y-auto pr-1">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 group transition-colors">
            <button
              onClick={() => toggle(task.id)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                task.done ? "bg-orange-500 border-orange-500" : "border-white/20 hover:border-orange-400"
              }`}
            >
              {task.done && <Check size={11} strokeWidth={3} className="text-white" />}
            </button>
            <span className={`text-sm flex-1 ${task.done ? "text-gray-500 line-through" : "text-gray-200"}`}>
              {task.text}
            </span>
            <button onClick={() => remove(task.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
        />
        <button
          onClick={addTask}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-shrink-0"
        >
          Add
        </button>
      </div>
    </div>
  )
}


const KanbanBoard = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_KANBAN)
  const [input, setInput] = useState("")
  const [targetCol, setTargetCol] = useState<Column>("waiting")
  const dragging = useRef<number | null>(null)
  const [dragOver, setDragOver] = useState<Column | null>(null)

  const addCard = () => {
    const text = input.trim()
    if (!text) return
    setTasks(t => [...t, { id: Date.now(), text, col: targetCol }])
    setInput("")
  }

  const onDragStart = (id: number) => { dragging.current = id }
  const onDrop = (col: Column) => {
    if (dragging.current == null) return
    setTasks(t => t.map(x => x.id === dragging.current ? { ...x, col } : x))
    dragging.current = null
    setDragOver(null)
  }

  return (
    <div>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
        {COLS.map(col => {
          const colTasks = tasks.filter(t => t.col === col.id)
          const isOver = dragOver === col.id
          return (
            <div
              key={col.id}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id) }}
              onDragLeave={e => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null)
              }}
              onDrop={() => onDrop(col.id)}
              className={`rounded-2xl p-4 border-2 transition-all duration-150 bg-[#1a1f2e] ${
                isOver ? col.borderActive : col.borderIdle
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`} />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{col.label}</span>
                <span className="ml-auto text-xs text-gray-600 bg-white/5 rounded-md px-2 py-0.5 tabular-nums">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => onDragStart(task.id)}
                    className="flex items-start gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/[0.09] border border-white/5 cursor-grab active:cursor-grabbing active:opacity-50 group transition-all select-none"
                  >
                    <GripVertical size={14} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 leading-snug mb-2">{task.text}</p>
                      {task.tag && (
                        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[task.tag] ?? "bg-white/10 text-gray-400"}`}>
                          {task.tag}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setTasks(t => t.filter(x => x.id !== task.id))}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 flex-shrink-0 transition-all mt-0.5"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}

                {isOver && colTasks.length === 0 && (
                  <div className="h-16 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center">
                    <span className="text-xs text-gray-600">Drop here</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addCard()}
          placeholder="New card..."
          className="flex-1 bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors min-w-0"
        />
        <select
          value={targetCol}
          onChange={e => setTargetCol(e.target.value as Column)}
          className="bg-[#1a1f2e] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer flex-shrink-0"
        >
          {COLS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button
          onClick={addCard}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
    </div>
  )
}


const About = () => (
  <section className="bg-white">
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-16 md:pt-20 pb-20 md:pb-28">

      <div className="text-center mb-12 md:mb-16">
        <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">What you get</span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4 tracking-tight">Everything in one place</h2>
        <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
          Buildernote combines the best parts of a visual board, task manager and documentation tool.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURES.map(({ Icon, label, title, desc }) => (
          <div key={title} className="flex gap-4 md:gap-5 p-5 md:p-6 rounded-2xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#1e2433] group-hover:bg-orange-500 flex items-center justify-center flex-shrink-0 transition-colors">
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-widest text-orange-500 uppercase">{label}</span>
              <h3 className="font-semibold text-gray-900 mt-0.5 mb-1">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionDivider label="Try it" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Simple tasks</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-4 tracking-tight">See how it feels</h2>
          <p className="text-gray-500 text-base leading-relaxed mb-6">
            Add tasks, check them off and track your progress — right here. No account needed.
          </p>
          <ul className="space-y-3">
            {["Create tasks in seconds", "Track progress with a live bar", "Check off completed work"].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <Check size={11} strokeWidth={3} className="text-white" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <TodoWidget />
      </div>

      <SectionDivider label="Board view" />

      <div>
        <div className="text-center mb-8 md:mb-10">
          <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Kanban</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-3 tracking-tight">Drag, drop & get things done</h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Move cards between Waiting, Doing and Done. Drag to reorder, add new cards and keep your whole team aligned.
          </p>
        </div>
        <KanbanBoard />
      </div>

      <SectionDivider label="Collaborate" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        {COLLAB_ITEMS.map(({ Icon, title, desc }) => (
          <div key={title} className="p-5 md:p-6 rounded-2xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#1e2433] group-hover:bg-orange-500 flex items-center justify-center mb-4 transition-colors">
              <Icon size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

    </div>
  </section>
)

export default About