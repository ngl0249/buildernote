import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../layout/Header"

const FREE_FEATURES = ["Up to 5 boards", "Unlimited notes and tasks", "1 GB file storage", "Share with up to 2 users", "Basic board features", "Email support"]
const PRO_FEATURES = ["Unlimited boards", "Unlimited notes and tasks", "20 GB file storage", "Unlimited team members", "All advanced features", "Nesting — boards in boards", "Priority support", "Export to PDF and JSON", "Early access to new features"]
const FAQ = [
  { q: "Can I change plan at any time?", a: "Yes, you can upgrade or downgrade your plan at any time from your account settings." },
  { q: "What happens to my data if I downgrade?", a: "Your data remains intact. If you exceed the free plan's limits, creating new boards will be restricted until you delete some or upgrade." },
  { q: "Do you offer discounts for students or NGOs?", a: "Yes! Contact us at support@buildernote.io with documentation and we'll find a solution." },
  { q: "Is there a binding period?", a: "No. Monthly plans can be cancelled with one month's notice. Annual subscriptions are prepaid but can be cancelled before the next renewal." },
]

const Priser = () => {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const proPrice = annual ? 79 : 99

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="bg-[#1e2433] pt-20 pb-24 px-6 text-center">
        <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Pricing</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4 tracking-tight">Simple and transparent</h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto mb-10">Start for free. Upgrade when you're ready. No hidden fees.</p>
        <div className="inline-flex items-center gap-1 bg-white/10 rounded-xl p-1">
          <button onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!annual ? "bg-white text-[#1e2433]" : "text-gray-400 hover:text-white"}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${annual ? "bg-white text-[#1e2433]" : "text-gray-400 hover:text-white"}`}>
            Annual<span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">-20%</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1e2433] mb-1">Default</h2>
            <p className="text-gray-500 text-sm mb-4">Everything you need to get started.</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-[#1e2433]">0</span>
              <span className="text-gray-400 text-sm">kr/mo</span>
            </div>
            <Link to="/register" className="w-full block text-center border-2 border-[#1e2433] text-[#1e2433] hover:bg-[#1e2433] hover:text-white font-semibold py-3 rounded-xl transition-colors text-sm mb-6">Create free account</Link>
            <ul className="space-y-3">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0"><span className="text-gray-400 text-[8px]">✓</span></div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1e2433] rounded-2xl border border-orange-500/30 p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
            <h2 className="text-xl font-bold text-white mb-1">Builderpro</h2>
            <p className="text-gray-400 text-sm mb-4">For serious teams who want more.</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white">{proPrice}</span>
              <span className="text-gray-400 text-sm">kr/mo {annual && <span className="text-orange-400 text-xs">— save 20%</span>}</span>
            </div>
            <Link to="/register" className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm mb-6">Start 14-day free trial</Link>
            <ul className="space-y-3">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0"><span className="text-white text-[8px]">✓</span></div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-8">All plans include HTTPS encryption, Firebase security and GDPR compliance.</p>
      </div>

      <div className="bg-[#f4f3f0] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1e2433] mb-8 text-center">Pricing questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-semibold text-[#1e2433]">{item.q}</span>
                  <span className={`text-gray-400 text-xl leading-none transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && <div className="px-6 pb-4"><p className="text-sm text-gray-500 leading-relaxed">{item.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1e2433] py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Still unsure?</h2>
        <p className="text-gray-400 mb-8">Try Buildernote for free today — no credit card required.</p>
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
}

export default Priser