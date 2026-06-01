import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/react";
import { useLocation, useNavigate } from "react-router-dom";

// Globale axios baseURL: alle API-calls gaan automatisch naar onze backend
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

// Context die door de hele app gedeeld wordt (films, user, admin status, etc.)
export const AppContext = createContext()

// Provider component: bevat alle globale state en helper-functies.
// Wordt om de App heen gewikkeld in main.jsx zodat elke component erbij kan via useAppContext().
export const AppProvider = ({ children }) => {
    // State voor admin-status, alle films en favorieten
    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])

    // Base URL voor TMDB poster afbeeldingen
    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    // Clerk hooks voor user-data en auth-token
    const { user } = useUser()
    const { getToken, isLoaded } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    // Checkt bij de backend of de huidige gebruiker admin-rechten heeft.
    // Niet-admins die naar /admin proberen worden teruggestuurd naar de homepage.
    const fetchIsAdmin = async () => {
        try {
            const token = await getToken()
            if (!token) return

            // JWT token meesturen in de Authorization header zodat de backend kan verifiëren
            const { data } = await axios.get('/api/admin/is-admin', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setIsAdmin(data.isAdmin)

            // Beveiligingsmaatregel: niet-admin op admin-pagina → terug naar home + foutmelding
            if (!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch (error) {
            setIsAdmin(false)
            if (location.pathname.startsWith('/admin')) {
                navigate('/')
                toast.error(error.response?.data?.message || 'You are not authorized to access admin dashboard')
            }
        }
    }

    // Alle films met geplande shows ophalen voor de Home/Movies-pagina.
    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all')
            if (data.success) {
                setShows(data.shows)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            // Fout stilletjes negeren, fallback is een lege lijst
        }
    }

    // Favoriete films van de ingelogde gebruiker ophalen (auth-token vereist).
    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })

            if (data.success) {
                setFavoriteMovies(data.movies)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            // Fout stilletjes negeren
        }
    }

    // Bij eerste keer laden van de app: alle films ophalen (nog geen login nodig)
    useEffect(() => {
        fetchShows()
    }, [])

    // Zodra de user is ingelogd én Clerk klaar is: admin-check + favorieten laden.
    // location.pathname staat erbij zodat we ook bij navigatie naar /admin opnieuw checken.
    useEffect(() => {
        if (user && isLoaded) {
            fetchIsAdmin()
            fetchFavoriteMovies()
        }
    }, [user, isLoaded, location.pathname])

    // Alle waarden die we beschikbaar maken via de context
    const value = {
        axios, fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows,
        favoriteMovies, fetchFavoriteMovies, image_base_url
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

// Custom hook zodat componenten gewoon `const { shows } = useAppContext()` kunnen schrijven.
export const useAppContext = () => useContext(AppContext)