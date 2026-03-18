import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import logo from "/landingimg/navbar/navlogo.webp"

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) setMenuOpen(false)
  }, [scrolled])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-[#1e2433] shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="w-full px-5 md:px-8 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Buildernote logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <span className="font-bold text-lg md:text-xl tracking-tight text-white">
            Builder<span className="text-orange-400">note</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-300 hover:text-white transition-colors px-5 py-2.5 rounded-lg border border-white/20 hover:border-white/40"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Sign up for free
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-5 pb-5 pt-4 flex flex-col gap-3">
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-3 rounded-lg border border-white/20 text-center"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors text-center"
          >
            Sign up for free
          </Link>
        </div>
      )}
    </header>
  )
}

export default Header