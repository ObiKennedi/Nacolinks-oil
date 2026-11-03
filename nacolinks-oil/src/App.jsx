import About from "./components/about"
import Contact from "./components/contact"
import Footer from "./components/footer"
import Header from "./components/header"
import Hero from "./components/hero"
import Prices from "./components/prices"
import Stations from "./components/stations"

export default function App() {
  
  return (
    <>
      <Header/>
      <main>
        <Hero/>
        <Prices/>
        <Stations/>
        <About/>
        <Contact/>
      </main>
      <Footer/>
    </>
  )
}
