import { Wrench } from "lucide-react"
import logo from "/landingimg/navbar/navlogo.webp"

const MaintenancePage = () => {
    return (
        <div className="min-h-screen bg-[#1e2433] flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="logo" className="w-16 h-16" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
                    <Wrench size={28} className="text-orange-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">Under maintenance</h1>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">

                    The site is temporarily unavailable. We're updating and improving your experience. We'll be back up and running soon — thanks for your patience!
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Buildernote · Maintenance mode
                </div>
            </div>
        </div>
    )
}

export default MaintenancePage