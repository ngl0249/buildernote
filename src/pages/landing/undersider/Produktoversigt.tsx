import { Link } from "react-router-dom"
import Header from "../layout/Header"

const FEATURES = [
  { icon: "B", title: "Visual boards", desc: "Organize ideas, files and notes on a free canvas. Drag and drop anything, anywhere.", color: "bg-orange-500" },
  { icon: "T", title: "Task management", desc: "Create to-do lists, assign tasks and set deadlines. Keep track of what's happening.", color: "bg-blue-500" },
  { icon: "C", title: "Real-time collaboration", desc: "Share boards with your team, comment and work together without delay.", color: "bg-green-500" },
  { icon: "D", title: "Documentation", desc: "Write notes, embed code and link to repos. All your documentation in one place.", color: "bg-purple-500" },
  { icon: "F", title: "File management", desc: "Upload images, PDFs and files directly on your board. No extra tools.", color: "bg-pink-500" },
  { icon: "N", title: "Nesting", desc: "Boards inside boards. Build hierarchies and keep your projects organized.", color: "bg-amber-500" },
]

const INTEGRATIONS = ["Firebase", "GitHub", "Google Drive", "Slack", "Figma", "Notion"]

const Produktoversigt = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <div className="bg-[#1e2433] pt-24 pb-24 px-6 text-center">
      <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Product overview</span>
      <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5 tracking-tight leading-tight">Everything you need.<br />One place.</h1>
      <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">Buildernote brings boards, tasks, documentation and collaboration into one flexible platform — built for modern teams.</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">Get started for free</Link>
        <Link to="/guides" className="border border-white/20 text-white hover:border-white/40 px-8 py-3.5 rounded-xl transition-colors text-sm">View guides →</Link>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-[#1e2433] mb-4">Core features</h2>
        <p className="text-gray-500 text-lg max-w-lg mx-auto">Built for developers, designers and teams who want to move fast.</p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {FEATURES.map(f => (
          <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/20 transition-all group">
            <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-4 text-white font-black text-sm group-hover:scale-110 transition-transform`}>{f.icon}</div>
            <h3 className="font-bold text-[#1e2433] mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-[#f4f3f0] py-24 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Workflow</span>
          <h2 className="text-3xl font-bold text-[#1e2433] mt-3 mb-4">From idea to delivery</h2>
          <p className="text-gray-500 leading-relaxed mb-6">Buildernote follows you from first idea to finished product. Plan, document and ship — all without switching tools.</p>
          <div className="space-y-4">
            {["Plan the project on a visual board", "Create and assign tasks to the team", "Document decisions and code", "Ship and share the result"].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#1e2433] rounded-2xl p-6 border border-white/10">
          <div className="space-y-3">
            {["Design system setup", "Auth flow", "Dashboard UI", "Mobile responsive", "Launch prep"].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i < 2 ? "bg-white/5" : i === 2 ? "bg-orange-500/10 border border-orange-500/20" : ""}`}>
                <div className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center ${i < 2 ? "bg-orange-500 border-orange-500" : i === 2 ? "border-orange-500" : "border-white/20"}`}>
                  {i < 2 && <span className="text-white text-[7px]">✓</span>}
                </div>
                <span className={`text-sm ${i < 2 ? "text-gray-400 line-through" : i === 2 ? "text-orange-400 font-medium" : "text-gray-500"}`}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-6 py-24 text-center">
      <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Integrations</span>
      <h2 className="text-3xl font-bold text-[#1e2433] mt-3 mb-4">Works with your tools</h2>
      <p className="text-gray-500 mb-12 max-w-lg mx-auto">Buildernote integrates with the tools you already use.</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {INTEGRATIONS.map(name => (
          <div key={name} className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 hover:border-orange-200 hover:bg-orange-50 transition-colors">{name}</div>
        ))}
      </div>
    </div>

    <div className="bg-[#1e2433] py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Ready to try?</h2>
      <p className="text-gray-400 mb-8">Free forever. No credit card required.</p>
      <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-block">Create free account</Link>
    </div>

    <div className="bg-[#1e2433] border-t border-white/10 py-8 px-6">
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

export default Produktoversigt