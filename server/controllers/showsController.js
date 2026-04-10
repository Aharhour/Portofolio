import axios from 'axios';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import { inngest } from '../inngest/index.js';
import theaters from '../configs/theaters.js';

// Get all theater configurations
export const getTheaters = (req, res) => {
    res.json({ success: true, theaters: Object.values(theaters) });
}

// Major upcoming releases hardcoded for months where TMDB data may be sparse
const hardcodedReleases = [
    { id: 10000001, title: "Mission: Impossible – The Final Reckoning", overview: "Ethan Hunt keert terug voor de ultieme missie in het laatste hoofdstuk van de iconische franchise. In een race tegen de klok moet hij een nieuwe dreiging stoppen die de hele wereld bedreigt.", poster_path: "/z0HjGMCOIv4xwDMJkNnMSPkLod1.jpg", backdrop_path: "/zCSKb1kFIigAabMmVOcGCVWOhaz.jpg", release_date: "2026-05-21", vote_average: 0, popularity: 450, original_language: "en", genre_ids: [28, 53, 12] },
    { id: 10000002, title: "The Batman Part II", overview: "Bruce Wayne wordt geconfronteerd met een nieuw gevaar in Gotham City dat hem dwingt om alles wat hij kent in twijfel te trekken. De duisternis keert terug, groter dan ooit.", poster_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg", backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg", release_date: "2026-10-02", vote_average: 0, popularity: 400, original_language: "en", genre_ids: [28, 80, 18] },
    { id: 10000003, title: "Avengers: Doomsday", overview: "De Avengers komen samen voor hun grootste uitdaging ooit wanneer Doctor Doom een plan onthult dat het hele multiversum bedreigt. Nieuwe en oude helden moeten samenwerken om het universum te redden.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-05-01", vote_average: 0, popularity: 800, original_language: "en", genre_ids: [28, 878, 12] },
    { id: 10000004, title: "Jurassic World: Rebirth", overview: "Vijf jaar na de gebeurtenissen van Dominion zijn dinosaurussen over de hele wereld verspreid. Een nieuw team onderzoekers ontdekt een geheim dat alles verandert.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-07-02", vote_average: 0, popularity: 350, original_language: "en", genre_ids: [28, 12, 878] },
    { id: 10000005, title: "Star Wars: New Jedi Order", overview: "Een nieuwe generatie Jedi staat op onder leiding van Rey. Maar een oude vijand uit de schaduwen bedreigt de fragiele vrede in het sterrenstelsel.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-12-17", vote_average: 0, popularity: 500, original_language: "en", genre_ids: [28, 12, 878] },
    { id: 10000006, title: "Spider-Man 4", overview: "Peter Parker moet navigeren door een wereld die zijn identiteit kent. Nieuwe vijanden verschijnen terwijl hij probeert zijn gewone leven weer op te bouwen.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-07-24", vote_average: 0, popularity: 600, original_language: "en", genre_ids: [28, 12, 878] },
    { id: 10000007, title: "Shrek 5", overview: "Shrek en zijn vrienden beleven een nieuw avontuur wanneer een mysterieuze bedreiging hun moeras en het hele koninkrijk Ver Weg bedreigt.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-07-01", vote_average: 0, popularity: 380, original_language: "en", genre_ids: [16, 35, 12] },
    { id: 10000008, title: "The Fantastic Four: First Steps", overview: "Marvel's eerste familie maakt hun debuut in het MCU. Reed Richards, Sue Storm, Johnny Storm en Ben Grimm ontdekken hun krachten en moeten de aarde beschermen.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-07-25", vote_average: 0, popularity: 500, original_language: "en", genre_ids: [28, 878, 12] },
    { id: 10000009, title: "Wicked: For Good", overview: "Het vervolg op de hit-musical Wicked. Elphaba en Glinda's verhaal bereikt zijn emotionele climax wanneer hun vriendschap op de proef wordt gesteld.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-11-20", vote_average: 0, popularity: 350, original_language: "en", genre_ids: [14, 10402, 18] },
    { id: 10000010, title: "Zootopia 2", overview: "Judy Hopps en Nick Wilde keren terug voor een nieuw avontuur in de bruisende stad Zootopia. Een mysterieuze verdwijning leidt hen naar een verborgen wereld.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-11-26", vote_average: 0, popularity: 320, original_language: "en", genre_ids: [16, 12, 35] },
    { id: 10000011, title: "Supergirl: Woman of Tomorrow", overview: "Kara Zor-El verlaat de aarde op een interstellaire missie. Onderweg ontdekt ze haar ware kracht en komt ze oog in oog te staan met een kosmische dreiging.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-06-26", vote_average: 0, popularity: 300, original_language: "en", genre_ids: [28, 878, 12] },
    { id: 10000012, title: "Ice Age 6: Adventures of Buck Wild 2", overview: "Buck Wild en zijn vrienden gaan op een nieuw episch avontuur onder het ijs. Nieuwe personages en gevaren wachten in de diepte.", poster_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", backdrop_path: "/dI1bSBzKEgLMGlGNWPFmhVExOPZ.jpg", release_date: "2026-04-18", vote_average: 0, popularity: 250, original_language: "en", genre_ids: [16, 12, 35] },
];

// Fetch upcoming movies from TMDB + hardcoded major releases (april 2026 - december 2026)
export const getUpcomingMovies = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const endDate = '2026-12-31';
        const headers = { Authorization: `Bearer ${process.env.TMDB_API_KEY}` };

        // Fetch multiple pages from TMDB discover
        const pages = [1, 2, 3, 4, 5];
        const responses = await Promise.all(
            pages.map(page =>
                axios.get('https://api.themoviedb.org/3/discover/movie', {
                    headers,
                    params: {
                        'primary_release_date.gte': today,
                        'primary_release_date.lte': endDate,
                        sort_by: 'popularity.desc',
                        page,
                    }
                })
            )
        );

        // Merge TMDB results + hardcoded, deduplicate by id
        const seen = new Set();
        const tmdbMovies = responses.flatMap(r => r.data.results);
        const allMovies = [...tmdbMovies, ...hardcodedReleases].filter(m => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        });

        res.json({ success: true, movies: allMovies })
    } catch (error) {
        // If TMDB fails, still return hardcoded releases
        res.json({ success: true, movies: hardcodedReleases })
    }
}

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

        if (movieId === undefined || movieId === null || !showsInput || !showPrice) {
            return res.status(400).json({ success: false, message: "Movie ID, show times, and price are required." });
        }

        if (!Array.isArray(showsInput) || showsInput.length === 0) {
            return res.status(400).json({ success: false, message: "At least one show time is required." });
        }

        const parsedPrice = Number(showPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ success: false, message: "Price must be a positive number." });
        }

        const movieIdStr = String(movieId);
        let movie = await Movie.findById(movieIdStr)

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
                _id: movieIdStr,
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
                    movie_id: movieIdStr,
                    showDateTime: new Date(dateTimeString),
                    showPrice: parsedPrice,
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
