import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import useScrollReveal from '../library/useScrollReveal'

const contactInfo = [
    {
        icon: <Mail className="w-5 h-5 text-primary" />,
        title: "E-mail",
        value: "adilharhour@gmail.com",
        link: "mailto:adilharhour@gmail.com"
    },
    {
        icon: <Phone className="w-5 h-5 text-primary" />,
        title: "Telefoon",
        value: "+31 6 154 839 98",
        link: "tel:+31615483998"
    },
    {
        icon: <MapPin className="w-5 h-5 text-primary" />,
        title: "Locatie",
        value: "Nederland",
        link: null
    },
    {
        icon: <Clock className="w-5 h-5 text-primary" />,
        title: "Bereikbaar",
        value: "Ma - Vr: 09:00 - 18:00",
        link: null
    },
]

const faq = [
    {
        question: "Hoe boek ik een ticket?",
        answer: "Kies een film, selecteer een datum en tijd, kies je stoelen en bevestig je boeking. Zo simpel is het!"
    },
    {
        question: "Kan ik mijn boeking annuleren?",
        answer: "Ja, je kunt je boeking tot 2 uur voor de voorstelling kosteloos annuleren via 'Mijn Boekingen'."
    },
    {
        question: "Welke betaalmethoden worden geaccepteerd?",
        answer: "Wij accepteren iDEAL, creditcard, PayPal en diverse andere betaalmethoden."
    },
    {
        question: "Hoe kan ik mijn account verwijderen?",
        answer: "Neem contact met ons op via het formulier of stuur een e-mail. Wij verwerken je verzoek binnen 48 uur."
    },
]

const ContactUs = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sending, setSending] = useState(false)
    const ref = useScrollReveal()

    const handleSubmit = (e) => {
        e.preventDefault()
        setSending(true)
        setTimeout(() => {
            toast.success('Bericht succesvol verzonden!')
            setForm({ name: '', email: '', subject: '', message: '' })
            setSending(false)
        }, 1000)
    }

    return (
        <div ref={ref} className="pt-28 pb-20 px-6 md:px-16 lg:px-36">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto mb-20 reveal reveal-blur">
                <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Contact</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Neem <span className="text-gradient">Contact</span> Op
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Heb je een vraag, opmerking of suggestie? Wij horen graag van je. Vul het formulier in of neem direct contact met ons op.
                </p>
            </div>

            {/* Contact cards + Form */}
            <div className="grid lg:grid-cols-5 gap-8 mb-20">
                {/* Info cards */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {contactInfo.map((item, i) => (
                        <div key={item.title} className={`group rounded-xl border border-white/10 bg-white/[0.03] p-5 card-hover hover:border-primary/30 reveal stagger-${i + 1}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider">{item.title}</p>
                                    {item.link ? (
                                        <a href={item.link} className="text-white hover:text-primary transition-colors duration-300 text-sm">{item.value}</a>
                                    ) : (
                                        <p className="text-white text-sm">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Extra CTA */}
                    <div className="rounded-xl border border-primary/20 bg-primary/[0.05] p-6 mt-2 reveal stagger-5">
                        <div className="flex items-center gap-3 mb-3">
                            <MessageCircle className="w-5 h-5 text-primary" />
                            <h3 className="text-white font-semibold">Snelle Hulp Nodig?</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Voor dringende vragen kun je ons direct bellen. Wij proberen binnen 24 uur op e-mails te reageren.
                        </p>
                    </div>
                </div>

                {/* Contact form */}
                <form onSubmit={handleSubmit} className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 reveal reveal-right">
                    <h2 className="text-2xl font-bold text-white mb-6">Stuur een Bericht</h2>
                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="text-gray-400 text-sm mb-1.5 block">Naam</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Je naam"
                                className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(248,69,101,0.1)] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1.5 block">E-mail</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="je@email.com"
                                className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(248,69,101,0.1)] transition-all duration-300"
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="text-gray-400 text-sm mb-1.5 block">Onderwerp</label>
                        <input
                            type="text"
                            required
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            placeholder="Waar gaat het over?"
                            className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(248,69,101,0.1)] transition-all duration-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="text-gray-400 text-sm mb-1.5 block">Bericht</label>
                        <textarea
                            required
                            rows={5}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder="Typ je bericht hier..."
                            className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(248,69,101,0.1)] transition-all duration-300 resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={sending}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dull rounded-full text-white font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer btn-press glow-primary"
                    >
                        <Send className="w-4 h-4" />
                        {sending ? 'Verzenden...' : 'Verstuur Bericht'}
                    </button>
                </form>
            </div>

            {/* FAQ */}
            <div>
                <div className="text-center mb-12 reveal">
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">FAQ</p>
                    <h2 className="text-3xl font-bold text-white">Veelgestelde Vragen</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {faq.map((item, i) => (
                        <div key={item.question} className={`rounded-xl border border-white/10 bg-white/[0.03] p-6 card-hover hover:border-primary/20 reveal stagger-${i + 1}`}>
                            <h3 className="text-white font-semibold mb-2">{item.question}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ContactUs
