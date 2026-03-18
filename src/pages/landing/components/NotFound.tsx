import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const fade = (delay = 0): React.CSSProperties => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
  })

  return (
    <div className="min-h-screen bg-[#1a1f2e] flex flex-col items-center justify-center px-6 overflow-hidden relative select-none">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%)",
        }}
      />


      <div className="relative z-10 text-center">

        <div style={fade(0)} className="relative mb-6 leading-none">
          <span
            className="block font-black pointer-events-none"
            style={{
              fontSize: "clamp(100px, 18vw, 200px)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              WebkitTextStroke: "1px rgba(255,255,255,0.05)",
              color: "transparent",
            }}
          >
            404
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center font-black pointer-events-none"
            style={{
              fontSize: "clamp(100px, 18vw, 200px)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </span>
        </div>

        <div style={fade(0.1)} className="flex items-center justify-center gap-2 mb-7">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/80" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/50" />
        </div>

        <h1
          style={{ ...fade(0.15), fontSize: "clamp(18px, 2.5vw, 24px)", letterSpacing: "-0.02em" }}
          className="font-bold text-white mb-2"
        >
          Page not found
        </h1>
        <p style={fade(0.2)} className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed mb-9">
          This page doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div style={fade(0.25)} className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-gray-200 text-sm font-medium rounded-xl transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <p style={fade(0.35)} className="mt-14 text-[10px] text-white/10 font-semibold tracking-[0.25em] uppercase">
          Buildernote
        </p>
      </div>
    </div>
  )
}