import { useRef, } from "react"

import loreImg from "/landingimg/made/partners/lore.webp"
import tradyImg from "/landingimg/made/partners/trady.webp"

const PROJECTS = [
  {
    title: "Sprint Board",
    tag: "Project management",
    dark: true,
    cards: [
      { type: "todo", items: ["Design system setup", "Auth flow", "Dashboard UI"] },
      { type: "tag", labels: ["In progress", "Review", "Done"] },
    ],
  },
  {
    title: "Brand Kit",
    tag: "Design system",
    dark: false,
    cards: [
      { type: "palette", colors: ["#1e2433", "#f97316", "#ffffff", "#e5e7eb"] },
      { type: "type", font: "Buildernote" },
    ],
  },
  {
    title: "Dev Docs",
    tag: "Documentation",
    dark: true,
    cards: [
      { type: "code", lines: ["const auth = getAuth(app)", "const db = getFirestore(app)"] },
      { type: "note", text: "Firebase v9 modular SDK. Import only what you need." },
    ],
  },
  {
    title: "Moodboard",
    tag: "Creative brief",
    dark: false,
    cards: [
      { type: "colors", swatches: ["#2d3a4a", "#f97316", "#f0f0ed", "#10b981"] },
      { type: "keywords", words: ["Bold", "Minimal", "Fast", "Clean"] },
    ],
  },
  {
    title: "Roadmap",
    tag: "Planning",
    dark: true,
    cards: [
      { type: "milestones", items: ["v1 Launch", "Auth", "Boards", "Sharing"] },
      { type: "progress", value: 65 },
    ],
  },
  {
    title: "Client Brief",
    tag: "Creative",
    dark: false,
    cards: [
      { type: "note", text: "Modern SaaS tool for builders. Orange accent. Dark navy base." },
      { type: "tag", labels: ["Web", "Mobile", "Dashboard"] },
    ],
  },
]

const BRANDS = [
  { name: "Lore", img: loreImg },
  { name: "Trady", img: tradyImg },
]

const CardContent = ({ card, dark }: { card: any; dark: boolean }) => {
  const text = dark ? "text-gray-300" : "text-gray-700"
  const sub  = dark ? "text-gray-500" : "text-gray-400"

  if (card.type === "todo") return (
    <div className="space-y-2">
      {card.items.map((item: string, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${i === 0 ? "bg-orange-500 border-orange-500" : dark ? "border-white/20" : "border-gray-300"}`}>
            {i === 0 && <span className="text-white text-[7px]">✓</span>}
          </div>
          <span className={`text-[11px] ${i === 0 ? `${sub} line-through` : text}`}>{item}</span>
        </div>
      ))}
    </div>
  )
  if (card.type === "tag") return (
    <div className="flex flex-wrap gap-1.5">
      {card.labels.map((l: string, i: number) => (
        <span key={i} className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${i === 0 ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : dark ? "bg-white/5 text-gray-400 border-white/10" : "bg-gray-50 text-gray-500 border-gray-100"}`}>{l}</span>
      ))}
    </div>
  )
  if (card.type === "palette") return (
    <div className="flex gap-2">
      {card.colors.map((c: string, i: number) => (
        <div key={i} className="flex-1 h-10 rounded-xl border border-gray-100" style={{ backgroundColor: c }} />
      ))}
    </div>
  )
  if (card.type === "type") return (
    <div className="flex items-center justify-center h-12 bg-[#1e2433] rounded-xl">
      <span className="text-orange-400 font-black text-lg tracking-tight">{card.font}</span>
    </div>
  )
  if (card.type === "code") return (
    <div className="bg-[#141c28] rounded-xl p-3 space-y-1">
      {card.lines.map((l: string, i: number) => (
        <p key={i} className="text-[10px] font-mono text-orange-300">{l}</p>
      ))}
    </div>
  )
  if (card.type === "note") return <p className={`text-xs leading-relaxed ${text}`}>{card.text}</p>
  if (card.type === "colors") return (
    <div className="grid grid-cols-4 gap-1.5">
      {card.swatches.map((c: string, i: number) => (
        <div key={i} className="h-8 rounded-lg border border-gray-100" style={{ backgroundColor: c }} />
      ))}
    </div>
  )
  if (card.type === "keywords") return (
    <div className="flex flex-wrap gap-1.5">
      {card.words.map((w: string, i: number) => (
        <span key={i} className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-full font-medium">{w}</span>
      ))}
    </div>
  )
  if (card.type === "milestones") return (
    <div className="space-y-1.5">
      {card.items.map((item: string, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i < 2 ? "bg-orange-500" : dark ? "bg-white/10" : "bg-gray-200"}`} />
          <span className={`text-[11px] ${i < 2 ? (dark ? "text-gray-200 font-medium" : "text-gray-700 font-medium") : sub}`}>{item}</span>
        </div>
      ))}
    </div>
  )
  if (card.type === "progress") return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className={sub}>Overall progress</span>
        <span className="text-orange-500 font-bold">{card.value}%</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}>
        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${card.value}%` }} />
      </div>
    </div>
  )
  return null
}

const ProjectCard = ({ project }: { project: typeof PROJECTS[0] }) => (
  <div className={`flex-shrink-0 w-72 rounded-2xl overflow-hidden border shadow-sm ${project.dark ? "bg-[#1e2433] border-white/10" : "bg-white border-gray-100"}`}>
    <div className={`px-5 py-4 border-b ${project.dark ? "border-white/10" : "border-gray-100"}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-bold ${project.dark ? "text-white" : "text-gray-800"}`}>{project.title}</span>
        <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">{project.title[0]}</span>
        </div>
      </div>
      <span className={`text-[10px] font-medium ${project.dark ? "text-gray-500" : "text-gray-400"}`}>{project.tag}</span>
    </div>
    <div className={`p-5 space-y-4 ${project.dark ? "bg-[#252d3d]" : "bg-[#f9f9f7]"}`}>
      {project.cards.map((card, i) => (
        <div key={i} className={`rounded-xl p-3.5 ${project.dark ? "bg-[#1e2433] border border-white/10" : "bg-white border border-gray-100 shadow-sm"}`}>
          <CardContent card={card} dark={project.dark} />
        </div>
      ))}
    </div>
  </div>
)

const Made = () => {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <section className="bg-[#252d3d] py-24 overflow-hidden">

      <style>{`
        @keyframes slide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .slide-track {
          animation: slide 36s linear infinite;
        }
        .slide-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-8 mb-12 text-center">
        <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Made with Buildernote</span>
        <h2 className="text-4xl font-bold text-white mt-3 mb-4 tracking-tight">
          Whatever you're building
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          From sprint planning to brand kits — Buildernote adapts to how you and your team work.
        </p>
      </div>

      <div className="relative mb-20">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#252d3d] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#252d3d] to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div ref={trackRef} className="slide-track flex gap-5 px-8" style={{ width: "max-content" }}>
            {[...PROJECTS, ...PROJECTS].map((project, i) => (
              <ProjectCard key={i} project={project} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 text-center">
        <p className="text-xs text-gray-500 tracking-widest uppercase mb-8">Used by teams at</p>
        <div className="flex items-center justify-center gap-12">
          {BRANDS.map((brand) => (
            <div key={brand.name} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <img
                src={brand.img}
                alt={brand.name}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

export default Made