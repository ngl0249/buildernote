import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import previewImage from "/landingimg/hero/preview.webp"

const Hero = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      <div className="bg-[#1e2433]">

        <div className={`flex flex-col items-center text-center pt-28 md:pt-40 pb-12 md:pb-16 px-5 md:px-4 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs text-gray-400 tracking-wide">Now in early access</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-5">
            Build smarter.<br />
            <span className="text-orange-400">Stay organized.</span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-10 max-w-lg leading-relaxed">
            A visual workspace for developers, designers and teams who want to move fast without losing track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-orange-500/20 text-center"
            >
              Sign up for free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto text-sm text-gray-300 hover:text-white border border-white/20 hover:border-white/40 px-6 py-3.5 rounded-xl transition-colors text-center"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className={`hidden md:block px-4 md:px-10 lg:px-20 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="max-w-6xl mx-auto rounded-t-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-x border-t border-white/10">
            <img
              src={previewImage}
              alt="Buildernote preview"
              className="w-full h-auto block"
              draggable={false}
            />
          </div>
        </div>

        <div className={`md:hidden px-5 pb-10 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Visual boards", sub: "Freeform canvas", color: "bg-orange-500" },
              { label: "Task tracking", sub: "To-do lists", color: "bg-emerald-500" },
              { label: "Team collab", sub: "Real-time sync", color: "bg-sky-500" },
              { label: "Code & docs", sub: "Built for devs", color: "bg-violet-500" },
            ].map(item => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className={`w-8 h-8 rounded-lg ${item.color} mb-3`} />
                <p className="text-white text-sm font-semibold">{item.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>



        <div className="relative overflow-hidden hidden md:block" style={{ height: "120px",}}>
          <div className="absolute inset-0 " />
          <svg viewBox="0 0 1440 180" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ display: "block" }}>
            <polygon points="0,180 1440,0 1440,180" fill="white" />
          </svg>
        </div>
      </div>
      <div className="md:hidden h-8 bg-[#1e2433]" />

      <div className="bg-white h-4" />
    </div>
  )
}

export default Hero