import { Shield, Eye, Database, Trash2, Cookie, UserCheck, Globe, Mail } from 'lucide-react'
import useScrollReveal from '../library/useScrollReveal'

const sections = [
    {
        icon: <Eye className="w-5 h-5 text-primary" />,
        title: "1. Welke Gegevens Verzamelen Wij?",
        content: [
            "Wanneer je BetaTickets gebruikt, kunnen wij de volgende gegevens verzamelen:",
            null,
            "**Accountgegevens:** naam, e-mailadres en wachtwoord (beheerd via Clerk).",
            "**Boekingsgegevens:** filmkeuze, geselecteerde stoelen, datum en tijd van de voorstelling.",
            "**Technische gegevens:** IP-adres, browsertype, apparaatinformatie en cookies voor het verbeteren van de gebruikerservaring.",
            "**Communicatie:** berichten die je naar ons stuurt via het contactformulier."
        ]
    },
    {
        icon: <Database className="w-5 h-5 text-primary" />,
        title: "2. Waarvoor Gebruiken Wij Je Gegevens?",
        content: [
            "Wij gebruiken je gegevens uitsluitend voor de volgende doeleinden:",
            null,
            "Het aanmaken en beheren van je account.",
            "Het verwerken en bevestigen van je ticketboekingen.",
            "Het verbeteren van onze diensten en gebruikerservaring.",
            "Het versturen van boekingsbevestigingen en belangrijke meldingen.",
            "Het beantwoorden van je vragen en verzoeken."
        ]
    },
    {
        icon: <Shield className="w-5 h-5 text-primary" />,
        title: "3. Hoe Beveiligen Wij Je Gegevens?",
        content: [
            "De beveiliging van je gegevens is onze topprioriteit:",
            null,
            "Authenticatie wordt veilig afgehandeld door Clerk, een toonaangevende auth-provider.",
            "Alle communicatie verloopt via versleutelde HTTPS-verbindingen.",
            "Gevoelige gegevens worden versleuteld opgeslagen in onze database.",
            "Wij voeren regelmatig beveiligingscontroles uit op onze systemen."
        ]
    },
    {
        icon: <UserCheck className="w-5 h-5 text-primary" />,
        title: "4. Delen Met Derden",
        content: [
            "Wij verkopen je gegevens nooit aan derden. Wij delen gegevens alleen met:",
            null,
            "**Clerk** — voor veilige authenticatie en accountbeheer.",
            "**Convex** — voor het opslaan van boekingsgegevens in onze database.",
            "**Inngest** — voor het verwerken van ticketverkopen op de achtergrond.",
            null,
            "Deze partijen verwerken gegevens uitsluitend in onze opdracht en volgens strikte beveiligingsnormen."
        ]
    },
    {
        icon: <Cookie className="w-5 h-5 text-primary" />,
        title: "5. Cookies",
        content: [
            "BetaTickets gebruikt cookies voor:",
            null,
            "**Functionele cookies:** noodzakelijk voor het inloggen en onthouden van je sessie.",
            "**Analytische cookies:** om te begrijpen hoe bezoekers onze website gebruiken (geanonimiseerd).",
            null,
            "Je kunt cookies uitschakelen in je browserinstellingen, maar dit kan de functionaliteit van de website beperken."
        ]
    },
    {
        icon: <Trash2 className="w-5 h-5 text-primary" />,
        title: "6. Jouw Rechten",
        content: [
            "Op grond van de AVG (GDPR) heb je de volgende rechten:",
            null,
            "**Recht op inzage** — je kunt opvragen welke gegevens wij van je bewaren.",
            "**Recht op correctie** — je kunt onjuiste gegevens laten aanpassen.",
            "**Recht op verwijdering** — je kunt verzoeken om je gegevens te laten verwijderen.",
            "**Recht op overdraagbaarheid** — je kunt je gegevens opvragen in een leesbaar formaat.",
            null,
            "Om gebruik te maken van deze rechten, neem contact met ons op via het contactformulier of stuur een e-mail."
        ]
    },
    {
        icon: <Globe className="w-5 h-5 text-primary" />,
        title: "7. Bewaartermijn",
        content: [
            "Wij bewaren je gegevens niet langer dan noodzakelijk:",
            null,
            "**Accountgegevens** worden bewaard zolang je account actief is.",
            "**Boekingsgegevens** worden 12 maanden na de voorstelling verwijderd.",
            "**Communicatie** wordt maximaal 6 maanden bewaard na afhandeling.",
            null,
            "Na het verwijderen van je account worden al je gegevens binnen 30 dagen permanent verwijderd."
        ]
    },
    {
        icon: <Mail className="w-5 h-5 text-primary" />,
        title: "8. Contact",
        content: [
            "Heb je vragen over ons privacybeleid? Neem gerust contact met ons op:",
            null,
            "**E-mail:** adilharhour@gmail.com",
            "**Telefoon:** +31 6 154 839 98",
            null,
            "Wij reageren binnen 48 uur op privacygerelateerde vragen."
        ]
    },
]

const renderLine = (line, i) => {
    if (line === null) return <div key={i} className="h-2" />
    const parts = line.split(/(\*\*.*?\*\*)/)
    return (
        <p key={i} className="text-gray-400 text-sm leading-relaxed">
            {parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                    ? <span key={j} className="text-gray-200 font-medium">{part.slice(2, -2)}</span>
                    : part
            )}
        </p>
    )
}

const PrivacyPolicy = () => {
    const ref = useScrollReveal()

    return (
        <div ref={ref} className="pt-28 pb-20 px-6 md:px-16 lg:px-36">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto mb-16 reveal reveal-blur">
                <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Privacybeleid</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Jouw <span className="text-gradient">Privacy</span> is Belangrijk
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Bij BetaTickets nemen wij de bescherming van je persoonlijke gegevens serieus.
                    Hieronder lees je hoe wij omgaan met je data.
                </p>
                <p className="text-gray-500 text-sm mt-4">Laatst bijgewerkt: 23 maart 2026</p>
            </div>

            {/* Sections */}
            <div className="max-w-4xl mx-auto space-y-6">
                {sections.map((section, i) => (
                    <div key={section.title} className={`rounded-xl border border-white/10 bg-white/[0.03] p-6 md:p-8 card-hover hover:border-primary/20 reveal stagger-${Math.min(i + 1, 8)}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                {section.icon}
                            </div>
                            <h2 className="text-white font-semibold text-lg">{section.title}</h2>
                        </div>
                        <div className="space-y-1.5 pl-12">
                            {section.content.map((line, i) => renderLine(line, i))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom note */}
            <div className="max-w-4xl mx-auto mt-12 rounded-xl border border-primary/20 bg-primary/[0.05] p-6 text-center reveal">
                <p className="text-gray-300 text-sm">
                    Door gebruik te maken van BetaTickets ga je akkoord met dit privacybeleid.
                    Wij behouden ons het recht voor om dit beleid te wijzigen en zullen je hierover informeren.
                </p>
            </div>
        </div>
    )
}

export default PrivacyPolicy
