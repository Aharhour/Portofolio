import { useEffect, useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

// Comment-sectie onder een film: laat reacties zien en laat ingelogde gebruikers er één plaatsen.
const CommentSection = ({ movieId }) => {

    // Globale dingen die we uit de AppContext gebruiken:
    // - axios = onze API-client (heeft al de juiste baseURL)
    // - user = de ingelogde Clerk-gebruiker (null als niet ingelogd)
    // - getToken = haalt een JWT-token op om mee te sturen naar de backend
    const { axios, user, getToken } = useAppContext()

    // useState voor de lijst met reacties die we op het scherm tonen
    const [comments, setComments] = useState([])

    // useState voor de tekst die de gebruiker typt in het invoerveld
    const [text, setText] = useState('')

    // useState om te onthouden of we nu aan het versturen zijn (knop uitschakelen tijdens verzenden)
    const [sending, setSending] = useState(false)

    // Alle reacties van deze film ophalen bij de backend
    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`/api/comment/${movieId}`)
            if (data.success) setComments(data.comments)
        } catch (error) {
            // Stilletjes negeren - lege lijst is een prima fallback
        }
    }

    // Bij het laden van de pagina (of als de film verandert): reacties ophalen
    useEffect(() => {
        fetchComments()
    }, [movieId])

    // Functie die uitgevoerd wordt als het formulier verstuurd wordt
    const handleSubmit = async (e) => {
        e.preventDefault() // Voorkomt dat de pagina herlaadt

        // Niet ingelogd? → melding tonen en stoppen
        if (!user) return toast.error('Log in om een reactie te plaatsen')

        // Lege tekst? → niets doen
        if (!text.trim()) return

        try {
            setSending(true)
            const token = await getToken()

            // POST request naar de backend met de tekst en het film-id
            const { data } = await axios.post(
                '/api/comment/add',
                { movieId, text },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                // Nieuwe reactie vooraan toevoegen (nieuwste eerst)
                setComments([data.comment, ...comments])
                setText('') // Invoerveld leegmaken
                toast.success('Reactie geplaatst')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Plaatsen mislukt')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className='max-w-3xl mx-auto mt-20 px-4'>
            {/* Kopje met icoontje en aantal reacties */}
            <div className='flex items-center gap-2 mb-6'>
                <MessageCircle className='w-5 h-5 text-primary' />
                <h3 className='text-lg font-medium'>Reacties ({comments.length})</h3>
            </div>

            {/* Invoerformulier: alleen tonen als de gebruiker is ingelogd */}
            {user ? (
                <form onSubmit={handleSubmit} className='flex gap-2 mb-8'>
                    <input
                        type='text'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Schrijf een reactie...'
                        maxLength={500}
                        className='flex-1 bg-gray-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary'
                    />
                    <button
                        type='submit'
                        disabled={sending}
                        className='flex items-center gap-1 bg-primary hover:bg-primary-dull px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50'
                    >
                        <Send className='w-4 h-4' />
                        Plaatsen
                    </button>
                </form>
            ) : (
                <p className='text-sm text-gray-400 mb-8'>Log in om een reactie te plaatsen.</p>
            )}

            {/* Lijst met reacties */}
            <div className='flex flex-col gap-4'>
                {comments.length === 0 ? (
                    <p className='text-sm text-gray-500'>Nog geen reacties. Wees de eerste!</p>
                ) : (
                    comments.map((c) => (
                        <div key={c._id} className='bg-gray-800 rounded-lg p-4'>
                            <div className='flex items-center justify-between mb-1'>
                                <span className='font-medium text-primary text-sm'>{c.userName}</span>
                                <span className='text-xs text-gray-500'>
                                    {new Date(c.createdAt).toLocaleDateString('nl-NL')}
                                </span>
                            </div>
                            <p className='text-sm text-gray-200'>{c.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default CommentSection
