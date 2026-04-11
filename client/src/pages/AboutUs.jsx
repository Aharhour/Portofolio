import { Film, Users, Armchair, Sparkles, Heart, Shield } from 'lucide-react'
import useScrollReveal from '../library/useScrollReveal'

const values = [
    {
        icon: <Film className="w-6 h-6 text-primary" />,
        title: "Passie voor Film",
        description: "Wij geloven dat elke film een ervaring is. Daarom maken wij het boeken van tickets zo moeiteloos mogelijk."
    },
    {
        icon: <Users className="w-6 h-6 text-primary" />,
        title: "Klant Centraal",
        description: "Onze gebruikers staan op de eerste plaats. Van intuïtief design tot snelle klantenservice."
    },
    {
        icon: <Armchair className="w-6 h-6 text-primary" />,
        title: "Beste Stoelen",
        description: "Kies zelf je favoriete plek in de zaal met onze interactieve stoelenselectie."
    },
    {
        icon: <Sparkles className="w-6 h-6 text-primary" />,
        title: "Moderne Technologie",
        description: "Gebouwd met de nieuwste technologieën voor een razendsnelle en betrouwbare ervaring."
    },
    {
        icon: <Heart className="w-6 h-6 text-primary" />,
        title: "Gemeenschap",
        description: "Wij brengen filmliefhebbers samen en maken de bioscoopervaring toegankelijk voor iedereen."
    },
    {
        icon: <Shield className="w-6 h-6 text-primary" />,
        title: "Veilig & Betrouwbaar",
        description: "Jouw gegevens en betalingen zijn altijd veilig bij ons. Privacy staat voorop."
    },
]

const team = [
    { name: "Adil Harhour", role: "Founder & Developer", initials: "AH" },
]

const AboutUs = () => {
    const ref = useScrollReveal()

    return (
        <div ref={ref} className="pt-28 pb-20 px-6 md:px-16 lg:px-36">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto mb-20 reveal reveal-blur">
                <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Over Ons</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    De Toekomst van <span className="text-gradient">Ticket Boeken</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    BetaTickets is opgericht met één doel: de bioscoopervaring verbeteren vanaf het allereerste moment — het boeken van je ticket. Wij combineren een strak design met krachtige technologie om jou de beste ervaring te bieden.
                </p>
            </div>

            {/* Story section */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12 mb-20 overflow-hidden reveal">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-float" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ons Verhaal</h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Het begon met een simpele frustratie: waarom is het boeken van bioscooptickets nog steeds zo omslachtig? Lange wachtrijen, onoverzichtelijke websites en geen idee waar je precies zit.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Daarom bouwden wij BetaTickets — een platform waar je in een paar klikken je favoriete film boekt, je stoelen uitkiest en zorgeloos geniet van de film. Gebouwd door filmliefhebbers, voor filmliefhebbers.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { value: "1000+", label: "Tickets Geboekt" },
                            { value: "50+", label: "Films Beschikbaar" },
                            { value: "99%", label: "Tevreden Klanten" },
                            { value: "24/7", label: "Ondersteuning" },
                        ].map((stat, i) => (
                            <div key={stat.label} className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center card-hover reveal stagger-${i + 1}`}>
                                <p className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
                                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="mb-20">
                <div className="text-center mb-12 reveal">
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Onze Waarden</p>
                    <h2 className="text-3xl font-bold text-white">Waar Wij Voor Staan</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((item, i) => (
                        <div key={item.title} className={`group rounded-xl border border-white/10 bg-white/[0.03] p-6 card-hover hover:border-primary/30 hover:bg-primary/[0.03] reveal stagger-${i + 1}`}>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team */}
            <div className="text-center reveal">
                <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Het Team</p>
                <h2 className="text-3xl font-bold text-white mb-12">De Mensen Achter BetaTickets</h2>
                <div className="flex justify-center">
                    {team.map((member) => (
                        <div key={member.name} className="group">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary-dull flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20 glow-primary">
                                {member.initials}
                            </div>
                            <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                            <p className="text-gray-400 text-sm">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AboutUs
