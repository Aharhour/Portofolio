import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import UpcomingSection from '../components/UpcomingSection'
import TrailerSection from '../components/TrailerSection'

// Home pagina = compositie van 4 secties die los gedefinieerd zijn als components.
// Volgorde: hero (banner) → uitgelichte films → aankomende releases → trailers.
const Home = () => {
  return (
    <>
      <HeroSection />     {/* Grote banner bovenaan met de huidige uitgelichte film */}
      <FeaturedSection /> {/* Uitgelichte films die nu draaien */}
      <UpcomingSection /> {/* Films die binnenkort uitkomen */}
      <TrailerSection />  {/* Trailers die je kunt afspelen */}
    </>
  )
}

export default Home
