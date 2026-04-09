import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/react";
import { useLocation, useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const { user } = useUser()
    const { getToken, isLoaded } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    // Check if the current user has admin privileges via the backend
    const fetchIsAdmin = async () => {
        try {
            const token = await getToken()
            if (!token) return

            const { data } = await axios.get('/api/admin/is-admin', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setIsAdmin(data.isAdmin)

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
            // Admin check failed
        }
    }

    // Fetch all available shows (unique movies) from the backend
    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all')
            if (data.success) {
                setShows(data.shows)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            // Fetch failed
        }
    }

    // Fetch the logged-in user's favorite movies from Clerk metadata
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
            // Fetch failed
        }
    }

    // Load shows on initial mount
    useEffect(() => {
        fetchShows()
    }, [])

    // When user logs in, check admin status and load favorites
    useEffect(() => {
        if (user && isLoaded) {
            fetchIsAdmin()
            fetchFavoriteMovies()
        }
    }, [user, isLoaded, location.pathname])

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

export const useAppContext = () => useContext(AppContext)