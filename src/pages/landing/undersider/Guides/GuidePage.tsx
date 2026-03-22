import { Link, } from "react-router-dom"
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react"
import Header from "../../layout/Header"

interface Step {
  title: string
  content: React.ReactNode
}

interface GuidePageProps {
  category: string
  categoryColor: string
  title: string
  readTime: string
  description: string
  steps: Step[]
  prevGuide?: { title: string; slug: string }
  nextGuide?: { title: string; slug: string }
}

const GuidePage = ({
  category, categoryColor, title, readTime, description, steps, prevGuide, nextGuide,
}: GuidePageProps) => {
  return (
    <div className="min-h-screen bg-[#1e2433]">
      <Header />

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">

        <Link to="/guides" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors mb-8">
          <ArrowLeft size={14} />Back to guides
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${categoryColor}`}>
              {category}
            </span>
            <span className="text-[10px] text-gray-600 flex items-center gap-1">
              <Clock size={9} />{readTime}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">{title}</h1>
          <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
        </div>

        <div className="h-px bg-white/5 mb-10" />

        <div className="space-y-10">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-sm font-bold mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-semibold text-lg mb-3">{step.title}</h2>
                <div className="text-gray-400 text-sm leading-relaxed space-y-3">
                  {step.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/5 mt-14 mb-10" />

        <div className="flex items-center justify-between gap-4">
          {prevGuide ? (
            <Link
              to={`/guides/${prevGuide.slug}`}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <div>
                <p className="text-[10px] text-gray-600 mb-0.5">Previous</p>
                <p className="font-medium">{prevGuide.title}</p>
              </div>
            </Link>
          ) : <div />}

          {nextGuide ? (
            <Link
              to={`/guides/${nextGuide.slug}`}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group text-right"
            >
              <div>
                <p className="text-[10px] text-gray-600 mb-0.5">Next</p>
                <p className="font-medium">{nextGuide.title}</p>
              </div>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : <div />}
        </div>

        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
          <BookOpen size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-semibold mb-1">More guides</p>
            <p className="text-gray-500 text-xs mb-3">Browse all guides to get the most out of Buildernote.</p>
            <Link to="/guides" className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors">
              View all guides →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuidePage