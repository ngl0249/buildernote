import Header from "./layout/Header"
import Hero from "../landing/components/Hero"
import About from "./components/About"
import Made from "./components/Made"
import Auth from "./components/Auth"
import Footer from "../landing/layout/Footer"
import Cookies from "./components/Cookies"

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Made />
      <Auth />
      <Cookies />
      <Footer />
    </div>
  )
}

export default Landing