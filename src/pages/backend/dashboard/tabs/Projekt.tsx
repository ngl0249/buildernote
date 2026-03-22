import { useEffect, useState } from "react"
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore"
import { db } from "../../../../lib/firebase/firebase"
import { useAuth } from "../../hooks/useAuth"
import {
  Plus, Trash2,  ChevronRight,
  Circle, CheckCircle2, Clock, Zap,
  LayoutGrid, List, Tag, Users, Calendar,
  ExternalLink, X,
} from "lucide-react"


type ProjectStatus = "idea" | "active" | "paused" | "completed"
type ProjectPriority = "low" | "medium" | "high"
type View = "grid" | "list"

type Project = {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  priority: ProjectPriority
  color: string
  tags: string[]
  dueDate: string | null
  teamSize: number | null
  url: string | null
  progress: number
  createdAt: any
}


const PROJECT_COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ec4899",
  "#8b5cf6", "#06b6d4", "#f97316", "#ef4444",
]

const STATUSES: {
  key: ProjectStatus; label: string
  color: string; bg: string; border: string
  icon: React.ReactNode
}[] = [
  { key: "idea",      label: "Idea",      color: "text-stone-500",   bg: "bg-stone-100",  border: "border-stone-200",  icon: <Circle size={11} /> },
  { key: "active",    label: "Active",    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: <Zap size={11} /> },
  { key: "paused",    label: "Paused",    color: "text-amber-500",   bg: "bg-amber-50",   border: "border-amber-200",   icon: <Clock size={11} /> },
  { key: "completed", label: "Completed", color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    icon: <CheckCircle2 size={11} /> },
]

const PRIORITIES: { key: ProjectPriority; label: string; dot: string; color: string }[] = [
  { key: "low",    label: "Low",    dot: "bg-stone-300",  color: "text-stone-400" },
  { key: "medium", label: "Medium", dot: "bg-amber-400",  color: "text-amber-500" },
  { key: "high",   label: "High",   dot: "bg-red-400",    color: "text-red-500"   },
]

const FILTER_STATUSES: (ProjectStatus | "all")[] = ["all", "idea", "active", "paused", "completed"]

const statusOf   = (s: ProjectStatus)   => STATUSES.find(x => x.key === s)   ?? STATUSES[0]
const priorityOf = (p: ProjectPriority) => PRIORITIES.find(x => x.key === p) ?? PRIORITIES[1]

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function isOverdue(d: string | null, status: ProjectStatus) {
  if (!d || status === "completed") return false
  return new Date(d) < new Date()
}

const projectsRef = (uid: string) => collection(db, "users", uid, "projects")
const projectDocRef = (uid: string, id: string) => doc(db, "users", uid, "projects", id)


function NewProjectForm({
  onSave,
  onCancel,
  color,
}: {
  onSave: (data: Omit<Project, "id" | "createdAt">) => Promise<void>
  onCancel: () => void
  color: string
}) {
  const [name, setName]           = useState("")
  const [desc, setDesc]           = useState("")
  const [status, setStatus]       = useState<ProjectStatus>("idea")
  const [priority, setPriority]   = useState<ProjectPriority>("medium")
  const [selectedColor, setColor] = useState(color)
  const [tags, setTags]           = useState("")
  const [dueDate, setDueDate]     = useState("")
  const [teamSize, setTeamSize]   = useState("")
  const [url, setUrl]             = useState("")
  const [progress, setProgress]   = useState(0)
  const [saving, setSaving]       = useState(false)

  const handleSave = async () => {
    if (!name.trim() || saving) return
    setSaving(true)
    await onSave({
      name: name.trim(),
      description: desc.trim() || null,
      status,
      priority,
      color: selectedColor,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      dueDate: dueDate || null,
      teamSize: teamSize ? parseInt(teamSize) : null,
      url: url.trim() || null,
      progress,
    })
    setSaving(false)
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div className="h-[3px]" style={{ backgroundColor: selectedColor }} />
      <div className="p-5 space-y-4">
        <input
          autoFocus
          placeholder="Project name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") onCancel() }}
          className="w-full text-sm font-semibold text-stone-800 placeholder-stone-300 outline-none bg-transparent"
        />
        <textarea
          placeholder="Description (optional)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={2}
          className="w-full text-xs text-stone-500 placeholder-stone-300 outline-none resize-none bg-transparent"
        />

        <div>
          <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {PROJECT_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full transition-all ${selectedColor === c ? "ring-2 ring-stone-800 ring-offset-1" : "opacity-60 hover:opacity-100"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Status</p>
            <select value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 outline-none">
              {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Priority</p>
            <select value={priority} onChange={e => setPriority(e.target.value as ProjectPriority)} className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 outline-none">
              {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Due date</p>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 outline-none" />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Team size</p>
            <input type="number" min="1" placeholder="e.g. 3" value={teamSize} onChange={e => setTeamSize(e.target.value)} className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 outline-none" />
          </div>
        </div>

        <div>
          <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Tags (comma separated)</p>
          <input placeholder="e.g. design, frontend, mvp" value={tags} onChange={e => setTags(e.target.value)} className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 outline-none" />
        </div>

        <div>
          <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">URL (optional)</p>
          <input placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 outline-none" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Progress</p>
            <span className="text-[10px] text-stone-500 font-medium">{progress}%</span>
          </div>
          <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(parseInt(e.target.value))} className="w-full accent-stone-800 h-1" />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex-1 py-2 rounded-xl text-white text-xs font-semibold transition-colors disabled:opacity-50"
            style={{ backgroundColor: selectedColor }}
          >
            {saving ? "Saving…" : "Create project"}
          </button>
          <button onClick={onCancel} className="px-3 py-2 rounded-xl bg-stone-100 text-stone-500 text-xs hover:bg-stone-200 transition-colors">
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}


function ProjectCard({
  project,
  onDelete,
  onUpdate,
}: {
  project: Project
  onDelete: () => void
  onUpdate: (patch: Partial<Project>) => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)
  const st      = statusOf(project.status)
  const pri     = priorityOf(project.priority)
  const overdue = isOverdue(project.dueDate, project.status)

  return (
    <div
      className={`group relative rounded-xl border bg-white transition-all duration-200 cursor-pointer overflow-hidden ${expanded ? "border-stone-300 shadow-md" : "border-stone-200 hover:border-stone-300 hover:shadow-md"}`}
      onClick={() => setExpanded(v => !v)}
    >
      <div className="h-[3px] w-full" style={{ backgroundColor: project.color }} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
              <h3 className="text-sm font-semibold text-stone-800 tracking-tight truncate">{project.name}</h3>
            </div>
            {project.description && (
              <p className="text-[11px] text-stone-400 pl-4 line-clamp-2 leading-relaxed">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={e => { e.stopPropagation(); onDelete() }} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <Trash2 size={12} />
            </button>
            <div className={`p-1.5 transition-transform duration-200 text-stone-300 ${expanded ? "rotate-90" : ""}`}>
              <ChevronRight size={12} />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-stone-400">Progress</span>
            <span className="text-[10px] text-stone-500 font-medium">{project.progress}%</span>
          </div>
          <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%`, backgroundColor: project.color }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${st.bg} ${st.color} ${st.border}`}>
            {st.icon} {st.label}
          </span>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
            <span className={`text-[10px] ${pri.color}`}>{pri.label}</span>
          </div>
          {project.dueDate && (
            <div className={`flex items-center gap-1 text-[10px] ${overdue ? "text-red-400" : "text-stone-400"}`}>
              <Calendar size={9} />
              {formatDate(project.dueDate)}
              {overdue && <span className="text-red-400">· overdue</span>}
            </div>
          )}
          {project.teamSize && (
            <div className="flex items-center gap-1 text-[10px] text-stone-400">
              <Users size={9} />
              {project.teamSize}
            </div>
          )}
        </div>

        {project.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {project.tags.map(tag => (
              <span key={tag} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[9px] text-stone-500">
                <Tag size={8} />{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {expanded && (
        <div className="border-t border-stone-100 px-4 pb-4 pt-3 space-y-3" onClick={e => e.stopPropagation()}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Status</p>
              <select value={project.status} onChange={e => onUpdate({ status: e.target.value as ProjectStatus })} className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-700 outline-none">
                {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Priority</p>
              <select value={project.priority} onChange={e => onUpdate({ priority: e.target.value as ProjectPriority })} className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-700 outline-none">
                {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] text-stone-400 uppercase tracking-wider">Progress</p>
              <span className="text-[10px] text-stone-500 font-medium">{project.progress}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={project.progress}
              onChange={e => onUpdate({ progress: parseInt(e.target.value) })}
              className="w-full h-1 accent-stone-800"
            />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Due date</p>
            <input type="date" value={project.dueDate ?? ""} onChange={e => onUpdate({ dueDate: e.target.value || null })} className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-700 outline-none" />
          </div>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 text-[11px] text-blue-500 hover:text-blue-600 transition-colors">
              <ExternalLink size={11} /> {project.url}
            </a>
          )}
          <button onClick={onDelete} className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-500 transition-colors">
            <Trash2 size={11} /> Delete project
          </button>
        </div>
      )}
    </div>
  )
}


function ProjectRow({
  project,
  onDelete,
}: {
  project: Project
  onDelete: () => void
  onUpdate: (patch: Partial<Project>) => Promise<void>
}) {
  const st      = statusOf(project.status)
  const pri     = priorityOf(project.priority)
  const overdue = isOverdue(project.dueDate, project.status)

  return (
    <div className="group flex items-center gap-4 px-4 py-3 rounded-xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-150">
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: project.color }} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 truncate">{project.name}</p>
        {project.description && (
          <p className="text-[11px] text-stone-400 truncate">{project.description}</p>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-2 w-24">
        <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${project.progress}%`, backgroundColor: project.color }} />
        </div>
        <span className="text-[10px] text-stone-400 w-7 text-right">{project.progress}%</span>
      </div>

      <span className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${st.bg} ${st.color} ${st.border}`}>
        {st.icon} {st.label}
      </span>

      <div className="hidden md:flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
        <span className={`text-[10px] ${pri.color}`}>{pri.label}</span>
      </div>

      {project.dueDate && (
        <span className={`hidden lg:block text-[10px] ${overdue ? "text-red-400" : "text-stone-400"}`}>
          {formatDate(project.dueDate)}
        </span>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1.5 rounded-lg text-stone-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
            <ExternalLink size={12} />
          </a>
        )}
        <button onClick={onDelete} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}


export default function Projekt() {
  const { user } = useAuth()
  const uid = user?.uid

  const [projects, setProjects]         = useState<Project[]>([])
  const [loading, setLoading]           = useState(true)
  const [view, setView]                 = useState<View>("grid")
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">("all")
  const [showNew, setShowNew]           = useState(false)
  const [newColor, setNewColor]         = useState(PROJECT_COLORS[0])

  useEffect(() => {
    if (!uid) return
    const q = query(projectsRef(uid), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)))
      setLoading(false)
    })
    return () => unsub()
  }, [uid])

  async function addProject(data: Omit<Project, "id" | "createdAt">) {
    if (!uid) return
    await addDoc(projectsRef(uid), { ...data, createdAt: serverTimestamp() })
    setShowNew(false)
    setNewColor(PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)])
  }

  async function updateProject(id: string, patch: Partial<Project>) {
    if (!uid) return
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))
    await updateDoc(projectDocRef(uid, id), patch as Record<string, any>)
  }

  async function deleteProject(id: string) {
    if (!uid) return
    setProjects(prev => prev.filter(p => p.id !== id))
    await deleteDoc(projectDocRef(uid, id))
  }

  const filtered = projects.filter(p => filterStatus === "all" || p.status === filterStatus)

  const counts = Object.fromEntries(
    STATUSES.map(s => [s.key, projects.filter(p => p.status === s.key).length])
  ) as Record<ProjectStatus, number>

  return (
    <div className="flex flex-col h-full bg-[#eaeaea] font-sans">
      <div className="px-8 py-6 border-b border-stone-200/80 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-stone-800">Projects</h1>
              <span className="text-xs text-stone-400 bg-white border border-stone-200 px-2 py-0.5 rounded-md">{projects.length}</span>
            </div>
            <p className="text-sm text-stone-400 mt-0.5">Track and organise everything you're working on</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-stone-100 text-stone-700" : "text-stone-400 hover:text-stone-600"}`}
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-stone-100 text-stone-700" : "text-stone-400 hover:text-stone-600"}`}
              >
                <List size={13} />
              </button>
            </div>

            <button
              onClick={() => setShowNew(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-800 text-white text-xs font-medium hover:bg-stone-700 transition-colors"
            >
              <Plus size={13} />
              New project
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {FILTER_STATUSES.map(s => {
            const count = s === "all" ? projects.length : counts[s as ProjectStatus]
            const st = s !== "all" ? statusOf(s as ProjectStatus) : null
            const active = filterStatus === s
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                  active
                    ? st ? `${st.bg} ${st.color} ${st.border} font-semibold` : "bg-stone-800 text-white border-stone-800"
                    : "bg-white text-stone-400 border-stone-200 hover:border-stone-300"
                }`}
              >
                {st && <span>{st.icon}</span>}
                {s === "all" ? "All" : statusOf(s as ProjectStatus).label}
                <span className={`px-1 py-0.5 rounded text-[9px] ${active && s !== "all" ? "bg-white/40" : "bg-stone-100 text-stone-500"}`}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {showNew && (
              <div className="mb-4 max-w-lg">
                <NewProjectForm
                  color={newColor}
                  onSave={addProject}
                  onCancel={() => setShowNew(false)}
                />
              </div>
            )}

            {filtered.length === 0 && !showNew ? (
              <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center">
                  <LayoutGrid size={20} className="text-stone-300" />
                </div>
                <div>
                  <p className="text-sm text-stone-400 font-medium">No projects yet</p>
                  <p className="text-xs text-stone-300 mt-0.5">Click "New project" to get started</p>
                </div>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(p => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onDelete={() => deleteProject(p.id)}
                    onUpdate={patch => updateProject(p.id, patch)}
                  />
                ))}
                {!showNew && (
                  <button
                    onClick={() => setShowNew(true)}
                    className="rounded-xl border border-dashed border-stone-200 bg-transparent hover:border-stone-300 hover:bg-white/60 transition-all duration-200 p-5 flex flex-col items-center justify-center gap-2 text-stone-300 hover:text-stone-400 min-h-[160px]"
                  >
                    <div className="w-8 h-8 rounded-xl border border-stone-200 flex items-center justify-center">
                      <Plus size={16} />
                    </div>
                    <span className="text-xs">New project</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(p => (
                  <ProjectRow
                    key={p.id}
                    project={p}
                    onDelete={() => deleteProject(p.id)}
                    onUpdate={patch => updateProject(p.id, patch)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}