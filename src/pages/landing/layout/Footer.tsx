import { Github, } from "lucide-react"
import { FaDiscord } from "react-icons/fa"

const SHOW_LOGO_IMAGE = true
const logoSrc = "/landingimg/footer/footer.webp"   


const BuilderNoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#F97316" />
    <path d="M8 10h10M8 16h16M8 22h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="23" cy="10" r="2.5" fill="#fff" />
  </svg>
)

const LINKS: { heading: string; items: { label: string; href: string }[] }[] = [
  {
    heading: "Get started",
    items: [
      { label: "Guides",          href: "/guides" },
      { label: "Product overview", href: "/productoverview" },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Help center",        href: "/hjaelpecenter" },
      { label: "Plans and prices",     href: "/prices" },
      { label: "Upcoming features", href: "/forthcoming" },
      { label: "Application status",  href: "/status" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "infobuildernote@gmail.com", href: "mailto:infobuildernote@gmail.com" },
      { label: "Team",                 href: "/team"},
      { label: "Privacy policy",    href: "/privacy" },
      { label: "Terms of Service",        href: "/terms" },
    ],
  },
]

const SOCIALS = [
  { label: "GitHub",   Icon: Github,   href: "https://github.com/bodywarn" },
  { label: "Discord",   Icon: FaDiscord,   href: "https://discord.gg/YAWRp2bj9d" },
]

const Footer = () => (
  <footer className="bg-[#25304d] border-t border-orange-500/20">
    <div className="max-w-6xl mx-auto px-8 pt-16 pb-10">

      <div className="flex flex-wrap gap-16 justify-between mb-14">

        <div className="max-w-[260px]">
          <div className="flex items-center gap-3 mb-4">
            {SHOW_LOGO_IMAGE ? (
              <img src={logoSrc} alt="BuilderNote logo" className="w-8 h-8 object-contain" />
            ) : (
              <BuilderNoteIcon />
            )}
            <span className="text-white font-bold text-lg tracking-tight">BuilderNote</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            The intelligent workspace for builders. Organize ideas, projects, and notes — all in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-14">
          {LINKS.map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-[10px] font-semibold tracking-widest text-orange-500 uppercase mb-4">
                {heading}
              </p>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ label, Icon, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500/10 hover:border-orange-500/30 transition-all"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} BuilderNote. All rights reserved.
        </p>
      </div>

    </div>
  </footer>
)

export default Footer