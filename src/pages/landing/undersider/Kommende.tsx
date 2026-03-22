import { Link } from "react-router-dom"
import { Video } from "lucide-react"
import Header from "../layout/Header"

const UPCOMING = [
  {
    status: "Planned",
    statusColor: "bg-orange-100 text-orange-500 border-orange-200",
    title: "Buildernote App",
    desc: "A modern PC app for downloading and organizing your notes efficiently.",
    eta: "Q2 2026"
  },
  { status: "Planned", statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20", title: "AI assistant", desc: "Let AI summarize boards, suggest next tasks and write notes faster than ever.", eta: "Q3 2026" },
  { status: "Planned", statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20", title: "GitHub integration", desc: "Connect your repos and see issues, pull requests and commits directly on your boards.", eta: "Q3 2026" },
  { status: "In Development", statusColor: "bg-gray-500/10 text-gray-400 border-gray-500/20", title: "Board templates", desc: "Get started quickly with ready-made templates for sprint planning, onboarding, brand kits and more.", eta: "Q4 2026" },
  {
  status: "Planned",
  statusColor: "bg-pink-100 text-pink-500 border-pink-200",
  title: "Focus Mode",
  desc: "Block distractions and highlight only the most important notes while working.",
  eta: "Q3 2026"
  },
]

const DONE = ["Firebase real-time sync", "Google and email login", "Comments and notifications"]

const Kommende = () => (
  <div className="min-h-screen bg-[#1e2433]">
    <Header />
    <div className="pt-20 pb-16 px-6 text-center">
      <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Roadmap</span>
      <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4 tracking-tight">Upcoming features</h1>
      <p className="text-gray-400 text-lg max-w-xl mx-auto">We are constantly building on Buildernote. Here is what's coming — and what we've already delivered.</p>
    </div>

    <div className="max-w-6xl mx-auto px-6 mb-10">
      <div className="flex items-center gap-6 flex-wrap">
        {[{ dot: "bg-orange-500", label: "Coming soon" }, { dot: "bg-blue-500", label: "In development" }, { dot: "bg-gray-500", label: "Planned" }].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
            <span className="text-sm text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-6 pb-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {UPCOMING.map(item => (
          <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-500/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${item.statusColor}`}>{item.status}</span>
              <span className="text-[10px] text-gray-600 font-medium">{item.eta}</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">{item.desc}</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-3 border-t border-white/10" />
          </div>
        ))}
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Sneak peek</span>
            <h2 className="text-2xl font-bold text-white mt-3 mb-4">Video notes are coming to Buildernote</h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">Record short videos directly on your board. Share quick updates with the team without writing a long message. Perfect for async collaboration.</p>
            <ul className="space-y-2">
              {["Up to 2 minutes of video", "Automatic transcription", "Available on all plans"].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                  <div className="w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0"><span className="text-orange-400 text-[8px]">✓</span></div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#252d3d] rounded-2xl aspect-video flex items-center justify-center border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5" />
            <div className="text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center mx-auto mb-3"><Video size={24} className="text-orange-400" /></div>
              <p className="text-gray-500 text-xs">Demo video — coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#252d3d] py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-8">Already delivered</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {DONE.map(d => (
            <div key={d} className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-4 py-2 rounded-full">✓ {d}</div>
          ))}
        </div>
      </div>
    </div>

    <div className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Have an idea?</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">We love feedback from our users. Send us your idea and we'll include it in our planning.</p>
      <a href="mailto:infobuildernote@gmail.com" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-block">Send your idea →</a>
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

export default Kommende