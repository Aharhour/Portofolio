import axios from 'axios';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import { inngest } from '../inngest/index.js';

// Fetch currently playing movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        })

        res.json({ success: true, movies: data.results })
    } catch (error) {
        res.status(502).json({ success: false, message: "Failed to fetch movies from TMDB." })
    }
}

// Add a new show - fetches movie from TMDB if not already in DB
export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body

        if (!movieId || !showsInput || !showPrice) {
            return res.status(400).json({ success: false, message: "Movie ID, show times, and price are required." });
        }

        if (!Array.isArray(showsInput) || showsInput.length === 0) {
            return res.status(400).json({ success: false, message: "At least one show time is required." });
        }

        if (typeof showPrice !== 'number' || showPrice <= 0) {
            return res.status(400).json({ success: false, message: "Price must be a positive number." });
        }

        let movie = await Movie.findById(movieId)

        if (!movie) {
            // Fetch movie details and credits from TMDB in parallel
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

            if (!movieApiData || !movieApiData.title) {
                return res.status(404).json({ success: false, message: "Movie not found on TMDB." });
            }

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
            }

            movie = await Movie.create(movieDetails);
        }

        // Build show documents from the date/time inputs
        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie_id: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        // Notify all users about the new show via Inngest
        await inngest.send({
            name: "app/show.added",
            data: { movieTitle: movie.title }
        })

        res.json({ success: true, message: 'Shows added successfully.' })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to add shows." })
    }
}

// Get all shows, returning only unique movies sorted by showtime
export const getShows = async (req, res) => {
    try {
        const shows = (await Show.find().populate('movie_id'))
            .toSorted((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime));

        // Deduplicate movies - keep only the first occurrence of each movie
        const seen = new Set();
        const uniqueMovies = shows.filter(show => {
            const id = show.movie_id?._id;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        }).map(show => show.movie_id);

        res.json({ success: true, shows: uniqueMovies })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load shows." })
    }
}

// Get a single movie with all its upcoming showtimes grouped by date
export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;

        const shows = await Show.find({
            movie_id: movieId,
            showDateTime: { $gte: new Date() }
        })

        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found." });
        }

        // Group showtimes by date
        const dateTime = {};
        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split('T')[0];
            if (!dateTime[date]) {
                dateTime[date] = [];
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.json({ success: true, movie, dateTime })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load movie details." });
    }
}
