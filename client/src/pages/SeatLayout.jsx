import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon, MapPinIcon, CheckIcon } from 'lucide-react'
import isoTimeFormat from '../library/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import theaters from '../config/theaters'

const currency = import.meta.env.VITE_CURRENCY || '€'

// SeatLayout pagina: hier kiest de gebruiker zaal → tijd → stoelen → afrekenen.
// Dit is het hart van het boekingsproces.
const SeatLayout = () => {
    // URL params: filmId en datum (bv. /movies/123/2026-05-08)
    const { id, date } = useParams()
    // State voor de keuzes van de gebruiker
    const [selectedSeats, setSelectedSeats] = useState([])
    const [selectedTime, setSelectedTime] = useState(null)
    const [selectedTheater, setSelectedTheater] = useState(null)
    const [show, setShow] = useState(null)
    const [occupiedSeats, setOccupiedSeats] = useState([])

    const { axios, getToken, user } = useAppContext()

    // Snel toegang tot de config van de gekozen zaal (rijen, prijs, layout)
    const currentTheater = selectedTheater ? theaters[selectedTheater] : null

    // Filmdata + alle showtimes ophalen
    const getShow = async () => {
        try {
            const { data } = await axios.get(`/api/show/${id}`)
            if (data.success) {
                setShow(data)
            }
        } catch (error) {
            // Fout stilletjes negeren
        }
    }

    // Andere zaal kiezen → alle eerdere keuzes resetten (andere zaal = andere stoelen)
    const handleTheaterSelect = (theaterId) => {
        setSelectedTheater(theaterId)
        setSelectedSeats([])
        setOccupiedSeats([])
    }

    // Andere tijd kiezen → stoelen resetten (elke show heeft eigen bezette stoelen)
    const handleTimeSelect = (item) => {
        setSelectedTime(item)
        setSelectedSeats([])
        setOccupiedSeats([])
    }

    // Stoel klikken: toggle selectie met de regels (tijd vereist, max 5, niet bezet)
    const handleSeatClick = (seatId) => {
        if (!selectedTime) {
            return toast("Selecteer eerst een tijd")
        }
        // Max 5 stoelen per boeking
        if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
            return toast("Je kunt maximaal 5 stoelen selecteren")
        }
        // Bezette stoelen kunnen niet geselecteerd worden
        if (occupiedSeats.includes(seatId)) {
            return toast('Deze stoel is al bezet')
        }
        // Toggle: zit erin → eruit halen, zit er niet in → toevoegen
        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(seat => seat !== seatId)
                : [...prev, seatId]
        )
    }

    // Eén stoel-knop renderen.
    // offset = aantal pixels naar onder (voor de gebogen "zaal-kromming")
    // rotation = rotatie in graden (stoelen aan de zijkant kantelen naar het scherm toe)
    const renderSeat = (seatId, offset, rotation = 0) => (
        <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            style={{ marginBottom: `${offset}px`, transform: rotation ? `rotate(${rotation}deg)` : undefined }}
            className={`h-8 w-8 rounded border border-primary/60 cursor-pointer text-[10px] transition-colors ${selectedSeats.includes(seatId) ? "bg-primary text-white" : ""} ${occupiedSeats.includes(seatId) ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {seatId}
        </button>
    )

    // Eén rij stoelen renderen met een gebogen curve (zoals een echte bioscoopzaal).
    const maxRotation = 15 // Max graden rotatie aan de uiteinden van de rij

    const renderRow = (row, count, curveStrength) => {
        const mid = (count - 1) / 2 // Middelste positie in de rij
        return (
            <div key={row} className="flex gap-1.5 mt-2 items-end">
                {Array.from({ length: count }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    // -1 (uiterst links) tot +1 (uiterst rechts), 0 = midden
                    const normalized = (i - mid) / mid
                    const distFromCenter = Math.abs(normalized)
                    // Kwadratische curve: hoe verder van het midden, hoe meer offset (parabolisch)
                    const offset = Math.round(distFromCenter * distFromCenter * curveStrength)
                    // Stoelen links draaien rechtsom, rechts linksom (gericht op het scherm)
                    const rotation = Math.round(normalized * -maxRotation)
                    return renderSeat(seatId, offset, rotation)
                })}
            </div>
        )
    }

    // Een sectie van rijen renderen. Een sectie kan uit meerdere blokken bestaan
    // die naast elkaar getoond worden alsof ze één lange gebogen rij zijn.
    // Voorbeeld: section [1,2,3] met groupRows [["C","D"],["E","F"],["G","H"]]
    // → rij 0 van elk blok wordt één brede gebogen rij: C-stoelen + gap + E-stoelen + gap + G-stoelen.
    const renderSection = (section) => {
        const blocks = section.map(idx => groupRows[idx]).filter(Boolean)
        if (blocks.length === 0) return null

        const seatsPerRow = currentTheater?.seatsPerRow || 9

        if (blocks.length === 1) {
            // Eén blok: gewoon de standaard curve toepassen
            // Curve-strength schaalt mee met het aantal stoelen voor een natuurlijke vorm
            const curveStrength = seatsPerRow >= 12 ? 12 : seatsPerRow >= 10 ? 9 : 6
            return (
                <div>
                    {blocks[0].map(row => renderRow(row, seatsPerRow, curveStrength))}
                </div>
            )
        }

        // Meerdere blokken: rijen naast elkaar combineren tot één brede gebogen rij
        const maxRowsInBlock = Math.max(...blocks.map(b => b.length))
        const gapSeats = 2 // Virtuele gap-kolommen tussen de blokken (voor het gangpad-effect)
        const totalWidth = blocks.length * seatsPerRow + (blocks.length - 1) * gapSeats
        const mid = (totalWidth - 1) / 2
        // Bredere zalen krijgen sterkere curves zodat de buiging logisch blijft
        const curveStrength = totalWidth >= 30 ? 14 : totalWidth >= 20 ? 11 : 8

        return (
            <div>
                {Array.from({ length: maxRowsInBlock }, (_, rowIdx) => (
                    <div key={rowIdx} className="flex gap-1.5 mt-2 items-end">
                        {blocks.map((block, blockIdx) => {
                            const row = block[rowIdx]
                            if (!row) return null
                            const blockOffset = blockIdx * (seatsPerRow + gapSeats)

                            return (
                                <div key={blockIdx} className={`flex gap-1.5 ${blockIdx > 0 ? 'ml-6' : ''}`}>
                                    {Array.from({ length: seatsPerRow }, (_, i) => {
                                        const seatId = `${row}${i + 1}`
                                        const globalPos = blockOffset + i
                                        const normalized = (globalPos - mid) / mid
                                        const distFromCenter = Math.abs(normalized)
                                        const offset = Math.round(distFromCenter * distFromCenter * curveStrength)
                                        const rotation = Math.round(normalized * -maxRotation)
                                        return renderSeat(seatId, offset, rotation)
                                    })}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        )
    }

    // Bezette stoelen ophalen voor de geselecteerde voorstelling.
    // Dit wordt gebruikt om bezette stoelen grijs te maken in de UI.
    const getOccupiedSeats = async () => {
        try {
            const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
            if (data.success) {
                setOccupiedSeats(data.occupiedSeats)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            // Fout stilletjes negeren
        }
    }

    // Boeking aanmaken en doorsturen naar Stripe checkout.
    const bookTickets = async () => {
        try {
            // Validatie: alle stappen moeten doorlopen zijn
            if (!user) return toast.error("Log in om verder te gaan")
            if (!selectedTheater) return toast.error("Selecteer een zaal")
            if (!selectedTime) return toast.error("Selecteer een tijd")
            if (!selectedSeats.length) return toast.error("Selecteer stoelen")

            // POST naar de backend, die maakt de Booking + Stripe sessie aan
            const { data } = await axios.post('/api/booking/create',
                { showId: selectedTime.showId, selectedSeats, theater: selectedTheater },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            )

            if (data.success) {
                // Stuur de gebruiker direct door naar de Stripe betaalpagina
                window.location.href = data.url
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Bij het laden van de pagina: filmdata ophalen
    useEffect(() => { getShow() }, [])

    // Telkens wanneer de gebruiker een andere tijd kiest: opnieuw bezette stoelen ophalen
    useEffect(() => {
        if (selectedTime) {
            getOccupiedSeats()
        }
    }, [selectedTime])

    // Prijsberekeningen voor de samenvatting onderaan
    const basePrice = show?.movie ? (show.dateTime[date]?.[0] ? 0 : 0) : 0
    const showPrice = selectedTime ? (show?.dateTime[date]?.find(t => t.showId === selectedTime.showId) ? show.movie : null) : null
    const upcharge = currentTheater?.upcharge || 0 // Toeslag van de gekozen zaal

    // Rij-groepen van de huidige zaal (bv. [["A","B","C"], ["D","E"]] = 2 secties)
    const groupRows = currentTheater?.groupRows || []

    if (!show) return <Loading />

    return (
        <div className='px-6 md:px-16 lg:px-40 py-30 md:pt-50'>

            {/* Stap 1: Kies een zaal (zaal-1, zaal-2 of zaal-3) */}
            <div className='mb-12' style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <h2 className='text-2xl font-semibold mb-2'>Kies een zaal</h2>
                <p className='text-gray-400 text-sm mb-6'>Elke zaal heeft een unieke indeling en ervaring</p>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    {Object.values(theaters).map((theater, i) => (
                        <div
                            key={theater.id}
                            onClick={() => handleTheaterSelect(theater.id)}
                            className={`relative border rounded-xl p-5 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 ${selectedTheater === theater.id ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" : "border-gray-700 bg-primary/5"}`}
                            style={{ animation: `revealUp 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s both` }}
                        >
                            {selectedTheater === theater.id && (
                                <div className="absolute top-3 right-3 flex items-center justify-center bg-primary h-6 w-6 rounded-full shadow-lg shadow-primary/30" style={{ animation: 'revealScale 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
                                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                                <MapPinIcon className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-lg">{theater.name}</h3>
                            </div>

                            <p className='text-gray-400 text-xs mb-3'>{theater.description}</p>

                            <div className='flex items-center gap-3 text-xs text-gray-500'>
                                <span>{theater.totalSeats} stoelen</span>
                                <span>&bull;</span>
                                <span>{theater.rows.length} rijen</span>
                                <span>&bull;</span>
                                <span>{theater.seatsPerRow} per rij</span>
                            </div>

                            <div className='mt-3 pt-3 border-t border-gray-700'>
                                {theater.upcharge === 0 ? (
                                    <p className='text-sm text-green-400 font-medium'>Standaard prijs</p>
                                ) : (
                                    <p className='text-sm text-primary font-medium'>+{currency}{theater.upcharge.toFixed(2)} per stoel</p>
                                )}
                            </div>

                            {/* Mini-preview van de zaal-indeling op de keuze-kaart */}
                            <div className='flex flex-col items-center gap-0.5 mt-3'>
                                <div className="w-16 h-0.5 bg-primary/30 rounded-full mb-1"></div>
                                {theater.groupRows.slice(0, 3).map((group, gi) => (
                                    <div key={gi} className="flex gap-2">
                                        {group.map((row) => (
                                            <div key={row} className="flex gap-px">
                                                {Array.from({ length: Math.min(theater.seatsPerRow, 10) }, (_, i) => (
                                                    <div key={i} className="w-1.5 h-1.5 rounded-sm bg-primary/25" />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                {theater.groupRows.length > 3 && (
                                    <p className='text-[8px] text-gray-600'>+{theater.groupRows.length - 3} meer</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stap 2 & 3: Tijd kiezen + stoelen kiezen (verschijnt pas na zaal-keuze) */}
            {selectedTheater && (
                <div className='flex flex-col md:flex-row' style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                    {/* Sidebar links: alle beschikbare tijden voor deze datum */}
                    <div className='w-64 bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 rounded-xl py-10 h-max md:sticky md:top-30'>
                        <p className='text-lg font-semibold px-6'>Beschikbare tijden</p>
                        <div className='mt-5 space-y-1'>
                            {show.dateTime[date]?.map((item) => (
                                <div
                                    key={item.showId}
                                    onClick={() => handleTimeSelect(item)}
                                    className={`flex items-center gap-2 px-6 py-2.5 cursor-pointer transition-all duration-300 ${selectedTime?.showId === item.showId ? "bg-primary text-white shadow-lg shadow-primary/20 rounded-r-lg" : "hover:bg-primary/20 hover:pl-7 rounded-r-md"}`}
                                >
                                    <ClockIcon className="w-4 h-4" />
                                    <p className='text-sm font-medium'>{isoTimeFormat(item.time)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hoofdgedeelte: het scherm + de stoelen-grid */}
                    <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
                        <BlurCircle top="-100px" left="-100px" />
                        <BlurCircle bottom="0" right="0" />

                        {/* Banner met info over de gekozen zaal */}
                        <div className='mb-6 text-center'>
                            <h2 className='text-xl font-semibold text-primary'>{currentTheater.name}</h2>
                            <p className='text-gray-500 text-xs mt-1'>
                                {currentTheater.totalSeats} stoelen &bull; {currentTheater.rows.length} rijen &bull; {currentTheater.seatsPerRow} per rij
                                {upcharge > 0 && <span className='text-primary'> &bull; +{currency}{upcharge.toFixed(2)}/stoel</span>}
                            </p>
                        </div>

                        <h1 className='text-2xl font-semibold mb-4'>Selecteer je stoelen</h1>
                        <img
                            src={assets.screenImage}
                            alt="screen"
                            className={selectedTheater === 'zaal-1' ? 'w-[650px] max-w-full' : selectedTheater === 'zaal-3' ? 'w-[550px] max-w-full' : 'w-[280px] max-w-full'}
                        />
                        <p className='text-gray-400 text-sm mb-6'>SCHERM</p>

                        {selectedTime ? (
                            <div className='flex flex-col items-center mt-10 text-xs text-gray-300 gap-8'>
                                {(currentTheater.sectionLayout || [[0]]).map((section, sIdx) => (
                                    <div key={sIdx} className='flex justify-center'>
                                        {renderSection(section)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-gray-500 mt-10'>Selecteer een tijd om de stoelen te zien</p>
                        )}

                        {/* Legenda: uitleg van de drie stoel-statussen (vrij/geselecteerd/bezet) */}
                        {selectedTime && (
                            <div className='flex items-center gap-6 mt-10 text-xs text-gray-400'>
                                <div className='flex items-center gap-2'>
                                    <div className='h-5 w-5 rounded border border-primary/60'></div>
                                    <span>Beschikbaar</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='h-5 w-5 rounded bg-primary'></div>
                                    <span>Geselecteerd</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='h-5 w-5 rounded border border-primary/60 opacity-50'></div>
                                    <span>Bezet</span>
                                </div>
                            </div>
                        )}

                        {/* Samenvatting + afrekenknop (verschijnt zodra er stoelen geselecteerd zijn) */}
                        {selectedSeats.length > 0 && (
                            <div className='mt-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 w-full max-w-md text-center' style={{ animation: 'revealScale 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                                <p className='text-sm text-gray-400 mb-2'>Overzicht</p>
                                <p className='text-sm font-medium'>{selectedSeats.length}x stoel ({selectedSeats.join(', ')})</p>
                                <p className='text-sm text-gray-400'>{currentTheater.name}</p>
                                {upcharge > 0 && (
                                    <p className='text-xs text-gray-500 mt-1'>Incl. {currency}{upcharge.toFixed(2)} toeslag per stoel</p>
                                )}
                                <button onClick={bookTickets} className='flex items-center justify-center gap-2 mt-4 mx-auto px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition-all duration-200 rounded-full font-medium cursor-pointer btn-press glow-primary'>
                                    Afrekenen
                                    <ArrowRightIcon strokeWidth={3} className='w-4 h-4' />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SeatLayout
