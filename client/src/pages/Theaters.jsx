import { MapPinIcon, ArmchairIcon, MonitorIcon, Volume2Icon } from 'lucide-react'
import theaters from '../config/theaters'
import BlurCircle from '../components/BlurCircle'
import useScrollReveal from '../library/useScrollReveal'

const theaterExtras = {
    "zaal-1": {
        icon: <MonitorIcon className="w-8 h-8 text-primary" />,
        features: ["Standaard projectie", "Surround sound", "Comfortabele stoelen", "Rolstoeltoegankelijk"],
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    },
    "zaal-2": {
        icon: <ArmchairIcon className="w-8 h-8 text-primary" />,
        features: ["Luxe fauteuils", "Intieme sfeer", "Premium geluid", "Perfecte date-night zaal"],
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80",
    },
    "zaal-3": {
        icon: <Volume2Icon className="w-8 h-8 text-primary" />,
        features: ["IMAX-scherm", "Dolby Atmos geluid", "Laser projectie", "Meest meeslepende ervaring"],
        image: "https://images.unsplash.com/photo-1596445836561-991bcd39a86d?w=600&q=80",
    },
}

const Theaters = () => {
    const ref = useScrollReveal()

    return (
        <div ref={ref} className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50 pb-20">
            <div className="relative text-center mb-16 reveal reveal-blur">
                <BlurCircle top="-100px" left="30%" />
                <h1 className="text-4xl font-bold">Onze Zalen</h1>
                <p className="text-gray-400 mt-3 max-w-xl mx-auto">
                    BetaTickets beschikt over 3 unieke bioscoopzalen, elk met een eigen karakter en sfeer.
                    Ontdek welke zaal het beste bij jouw filmervaring past.
                </p>
            </div>

            <div className="grid gap-10">
                {Object.values(theaters).map((theater, i) => {
                    const extra = theaterExtras[theater.id]
                    return (
                        <div
                            key={theater.id}
                            className={`relative flex flex-col md:flex-row gap-6 bg-primary/5 border border-primary/15 rounded-2xl overflow-hidden card-hover reveal stagger-${(i + 1) * 2}`}
                        >
                            {/* Theater image */}
                            <div className="md:w-80 h-56 md:h-auto shrink-0 img-zoom">
                                <img
                                    src={extra.image}
                                    alt={theater.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Theater info */}
                            <div className="flex-1 p-6 md:py-8">
                                <div className="flex items-center gap-3 mb-2">
                                    {extra.icon}
                                    <div>
                                        <h2 className="text-2xl font-semibold">{theater.name}</h2>
                                        <p className="text-gray-400 text-sm">{theater.description}</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-4 mt-5">
                                    <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-center hover:bg-primary/15 transition-colors">
                                        <p className="text-2xl font-bold text-primary">{theater.totalSeats}</p>
                                        <p className="text-xs text-gray-400">Stoelen</p>
                                    </div>
                                    <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-center hover:bg-primary/15 transition-colors">
                                        <p className="text-2xl font-bold text-primary">{theater.rows.length}</p>
                                        <p className="text-xs text-gray-400">Rijen</p>
                                    </div>
                                    <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-center hover:bg-primary/15 transition-colors">
                                        <p className="text-2xl font-bold text-primary">{theater.seatsPerRow}</p>
                                        <p className="text-xs text-gray-400">Per rij</p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mt-5">
                                    <p className="text-sm font-medium text-gray-300 mb-2">Kenmerken</p>
                                    <div className="flex flex-wrap gap-2">
                                        {extra.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="text-xs bg-white/5 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full hover:border-primary/30 hover:text-white transition-all duration-300"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Seat layout preview */}
                                <div className="mt-6">
                                    <p className="text-sm font-medium text-gray-300 mb-3">Zaalindeling</p>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-32 h-1 bg-primary/40 rounded-full mb-1"></div>
                                        <p className="text-[10px] text-gray-500 mb-1">SCHERM</p>
                                        {(theater.sectionLayout || [[0]]).map((section, sIdx) => (
                                            <div key={sIdx} className={`flex justify-center ${section.length > 1 ? 'gap-3' : ''}`}>
                                                {section.map((groupIdx) => (
                                                    <div key={groupIdx} className="flex flex-col gap-px">
                                                        {theater.groupRows[groupIdx]?.map((row) => (
                                                            <div key={row} className="flex gap-px items-center">
                                                                <span className="text-[8px] text-gray-500 w-2.5">{row}</span>
                                                                {Array.from({ length: theater.seatsPerRow }, (_, i) => (
                                                                    <div key={i} className="w-1.5 h-1.5 rounded-sm bg-primary/30 border border-primary/20" />
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Theater badge */}
                            <div className="absolute top-4 right-4">
                                <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 text-primary text-xs font-medium px-3 py-1 rounded-full">
                                    <MapPinIcon className="w-3 h-3" />
                                    {theater.id.replace('zaal-', 'Zaal ')}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Theaters
