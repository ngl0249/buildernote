import { useState } from "react"
import { Link } from "react-router-dom"
import { Clock, ArrowRight } from "lucide-react"
import Header from "../layout/Header"

export const GUIDES = [
  {
    category: "Getting started",
    slug: "getting-started",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    dot: "bg-orange-500",
    items: [
      { title: "Create your first board", slug: "create-first-board", desc: "Learn how to create and organize your first board from scratch.", tid: "5 min" },
      { title: "Invite your team", slug: "invite-team", desc: "Add team members and set up permissions in minutes.", tid: "3 min" },
      { title: "Understanding roles", slug: "understanding-roles", desc: "Learn what each role can do — Default, BuilderPro, Moderator, Developer and Owner.", tid: "4 min" },
    ],
  },
  {
    category: "Boards & cards",
    slug: "boards-cards",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-500",
    items: [
      { title: "Using notes and links", slug: "notes-and-links", desc: "Add rich notes, links and files directly on your board.", tid: "4 min" },
      { title: "Drag & drop on canvas", slug: "drag-drop", desc: "Organize freely with our flexible canvas.", tid: "3 min" },
      { title: "All card types explained", slug: "card-types", desc: "Notes, headings, to-dos, links, colors, documents, columns, comments and tables.", tid: "6 min" },
    ],
  },
  {
    category: "Tasks & calendar",
    slug: "tasks-calendar",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    dot: "bg-green-500",
    items: [
      { title: "Using the to-do list", slug: "todo-list", desc: "Create tasks, check them off and stay on top of your work.", tid: "5 min" },
      { title: "Using the calendar", slug: "calendar", desc: "Add events, navigate months and keep track of important dates.", tid: "4 min" },
    ],
  },
  {
    category: "Team collaboration",
    slug: "team-collaboration",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    dot: "bg-purple-500",
    items: [
      { title: "Real-time presence", slug: "realtime-presence", desc: "See where your teammates are and what they're working on live.", tid: "3 min" },
      { title: "Notifications", slug: "notifications", desc: "Stay informed when teammates make changes while you're away.", tid: "3 min" },
      { title: "Team boards", slug: "team-boards", desc: "Share boards with your team and collaborate in real time.", tid: "5 min" },
    ],
  },
]

const Guides = () => {
  const [search, setSearch] = useState("")

  const filtered = GUIDES.map(g => ({
    ...g,
    items: g.items.filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(g => g.items.length > 0)

  return (
    <div className="min-h-screen bg-[#1e2433]">
      <Header />
      <div className="pt-20 pb-16 px-6 text-center">
        <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Get started</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4 tracking-tight">Guides</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          Step-by-step guides to get the most out of Buildernote — whether you're new or experienced.
        </p>
        <div className="max-w-lg mx-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guides..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors text-sm"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-14">
        {filtered.map(group => (
          <div key={group.category}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-2 h-2 rounded-full ${group.dot}`} />
              <h2 className="text-lg font-bold text-white">{group.category}</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.items.map(item => (
                <Link
                  key={item.slug}
                  to={`/guides/${item.slug}`}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-500/30 transition-all group block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${group.color}`}>
                      {group.category}
                    </span>
                    <span className="text-[10px] text-gray-600 flex items-center gap-1">
                      <Clock size={9} />{item.tid}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Read guide</span><ArrowRight size={11} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No guides match your search.</p>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 Buildernote</p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-gray-500 hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-orange-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Guides