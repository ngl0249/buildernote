import { useState } from "react"
import { Link } from "react-router-dom"
import { Rocket, LayoutDashboard, Users, CreditCard, ShieldCheck, Zap } from "lucide-react"
import Header from "../layout/Header"

const CATEGORIES = [
  { icon: Rocket, title: "Getting started", desc: "Create account, first board and basic features.", articles: ["How to create an account", "Create your first board", "Invite team members", "Import from Notion"] },
  { icon: LayoutDashboard, title: "Boards & tasks", desc: "Everything about boards, notes, tasks and canvas.", articles: ["Drag & drop on canvas", "Create and assign tasks", "Nesting — boards in boards", "Using links and files"] },
  { icon: Users, title: "Team & sharing", desc: "Invite, share and collaborate with your team.", articles: ["Share a board with the team", "Permissions and roles", "Comments and notifications", "Guest access"] },
  { icon: CreditCard, title: "Account & billing", desc: "Subscription, payment and account settings.", articles: ["Change subscription", "Download invoice", "Delete your account", "Change email or password"] },
  { icon: ShieldCheck, title: "Security & privacy", desc: "Your data, security and GDPR.", articles: ["How your data is stored", "Two-factor authentication", "Export your data", "GDPR and your rights"] },
  { icon: Zap, title: "Tips & tricks", desc: "Keyboard shortcuts, workflows and advanced features.", articles: ["Keyboard shortcuts", "Quick task creation", "Sprint planning workflow", "Export to PDF"] },
]

const FAQ = [
  { q: "Is Buildernote free?", a: "Yes, we offer a free plan that covers most needs. See our pricing page for details about the Pro plan." },
  { q: "Can I import from Notion or Trello?", a: "Yes, we support import from Notion and Trello. Go to Settings → Import to get started." },
  { q: "What happens to my data if I delete my account?", a: "All your data is permanently deleted within 30 days of account deletion. You can export your data before deletion." },
  { q: "Does Buildernote work offline?", a: "Buildernote requires an internet connection to sync data. We are working on offline support in a future update." },
  { q: "Can I use Buildernote on mobile?", a: "Yes, Buildernote is fully responsive and works in mobile browsers. A native app is on our roadmap." },
]

const Hjaelpecenter = () => {
  const [search, setSearch] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filtered = search.trim()
    ? CATEGORIES.map(cat => ({ ...cat, articles: cat.articles.filter(a => a.toLowerCase().includes(search.toLowerCase())) })).filter(cat => cat.articles.length > 0 || cat.title.toLowerCase().includes(search.toLowerCase()))
    : CATEGORIES

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="bg-[#1e2433] pt-20 pb-24 px-6 text-center">
        <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Support</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4 tracking-tight">Help center</h1>
        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">What can we help you with?</p>
        <div className="max-w-lg mx-auto">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search help articles..." className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 text-sm" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {filtered.map(cat => {
            const Icon = cat.icon
            return (
              <div key={cat.title} className="p-6 rounded-2xl border border-gray-100 hover:border-orange-100 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-[#1e2433] group-hover:bg-orange-500 flex items-center justify-center mb-4 transition-colors"><Icon size={18} className="text-white" /></div>
                <h3 className="font-bold text-[#1e2433] mb-2 group-hover:text-orange-500 transition-colors">{cat.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{cat.desc}</p>
                <ul className="space-y-1.5">
                  {cat.articles.map(a => (
                    <li key={a} className="text-xs text-gray-400 flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer">
                      <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />{a}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
          {filtered.length === 0 && <div className="col-span-3 text-center py-16"><p className="text-gray-400 text-sm">No results for "{search}"</p></div>}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1e2433] mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-semibold text-[#1e2433]">{item.q}</span>
                  <span className={`text-gray-400 text-xl leading-none transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && <div className="px-6 pb-5"><p className="text-sm text-gray-500 leading-relaxed">{item.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#f4f3f0] py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-[#1e2433] mb-3">Didn't find the answer?</h2>
        <p className="text-gray-500 mb-6">Our support team typically responds within 24 hours.</p>
        <a href="mailto:infobuildernote@gmail.com" className="bg-[#1e2433] hover:bg-[#252d3d] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-block text-sm">Contact support →</a>
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
}

export default Hjaelpecenter