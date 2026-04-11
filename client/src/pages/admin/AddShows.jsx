import { useEffect, useState } from 'react'
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import { CheckIcon, CalendarIcon, ClockIcon, SearchIcon, StarIcon, XIcon } from 'lucide-react'
import { kConverter } from '../../library/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {
    const { axios, getToken, user, image_base_url } = useAppContext()
    const currency = import.meta.env.VITE_CURRENCY

    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");
    const [addingShow, setAddingShow] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchNowPlayingMovies = async () => {
        try {
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setNowPlayingMovies(data.movies);
            }
        } catch (error) {
            // Fetch failed
        }
    };

    const handleDateTimeAdd = () => {
        if (!dateTimeInput) return toast.error('Selecteer een datum en tijd');
        const [date, time] = dateTimeInput.split("T");
        if (!date || !time) return;

        // Check if date is in the future
        if (new Date(dateTimeInput) <= new Date()) {
            return toast.error('Datum moet in de toekomst liggen');
        }

        setDateTimeSelection((prev) => {
            const times = prev[date] || [];
            if (times.includes(time)) {
                toast.error('Deze tijd is al toegevoegd');
                return prev;
            }
            return { ...prev, [date]: [...times, time] };
        });
        setDateTimeInput("");
    };

    const handleRemoveTime = (date, time) => {
        setDateTimeSelection((prev) => {
            const filteredTimes = prev[date].filter((t) => t !== time);
            if (filteredTimes.length === 0) {
                const { [date]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [date]: filteredTimes };
        });
    };

    const handleSubmit = async () => {
        if (!selectedMovie) return toast.error('Selecteer een film');
        if (Object.keys(dateTimeSelection).length === 0) return toast.error('Voeg minimaal één showtime toe');
        if (!showPrice || Number(showPrice) <= 0) return toast.error('Voer een geldige prijs in');

        setAddingShow(true)
        try {
            const showsInput = Object.entries(dateTimeSelection).map(([date, time]) => ({ date, time }));

            const payload = {
                movieId: selectedMovie,
                showsInput,
                showPrice: Number(showPrice)
            }

            const { data } = await axios.post('/api/show/add', payload, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })

            if (data.success) {
                toast.success(data.message)
                setSelectedMovie(null)
                setDateTimeSelection({})
                setShowPrice("")
                setSearchQuery("")
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setAddingShow(false)
    }

    useEffect(() => {
        if (user) {
            fetchNowPlayingMovies();
        }
    }, [user]);

    const filteredMovies = nowPlayingMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedMovieData = nowPlayingMovies.find(m => m.id === selectedMovie)
    const totalShowtimes = Object.values(dateTimeSelection).reduce((acc, times) => acc + times.length, 0)

    return nowPlayingMovies.length > 0 ? (
        <div>
            <div style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <Title text1="Add" text2="Shows" />
                <p className='text-gray-500 text-sm mt-1'>Selecteer een film, stel showtimes in en publiceer</p>
            </div>

            {/* Step 1: Movie selection */}
            <div className='mt-8' style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-base font-semibold flex items-center gap-2'>
                        <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20'>1</span>
                        Kies een film
                    </h2>

                    {/* Search */}
                    <div className='flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-primary/30 transition-all duration-300'>
                        <SearchIcon className='w-4 h-4 text-gray-500' />
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Zoek film...'
                            className='bg-transparent outline-none text-sm w-40 placeholder:text-gray-600'
                        />
                        {searchQuery && (
                            <XIcon className='w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-white transition-colors' onClick={() => setSearchQuery("")} />
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto pb-4 no-scrollbar">
                    <div className="group flex gap-3 w-max">
                        {filteredMovies.map((movie) => (
                            <div
                                key={movie.id}
                                className={`relative w-36 shrink-0 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1.5 transition-all duration-300 ${selectedMovie === movie.id ? 'ring-2 ring-primary rounded-lg shadow-lg shadow-primary/15' : ''}`}
                                onClick={() => setSelectedMovie(movie.id)}
                            >
                                <div className="relative rounded-lg overflow-hidden">
                                    <img src={image_base_url + movie.poster_path} alt={movie.title} className="w-full aspect-[2/3] object-cover brightness-90 hover:brightness-100 transition-all duration-300" />
                                    <div className="text-xs flex items-center justify-between p-1.5 bg-black/70 backdrop-blur-sm w-full absolute bottom-0 left-0">
                                        <p className="flex items-center gap-1 text-gray-400">
                                            <StarIcon className="w-3 h-3 text-primary fill-primary" />
                                            {movie.vote_average.toFixed(1)}
                                        </p>
                                        <p className="text-gray-400 text-[10px]">{kConverter(movie.vote_count)}</p>
                                    </div>
                                </div>
                                {selectedMovie === movie.id && (
                                    <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded-full shadow-lg shadow-primary/30" style={{ animation: 'revealScale 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
                                        <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                                    </div>
                                )}
                                <p className="font-medium text-xs mt-1.5 truncate">{movie.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {filteredMovies.length === 0 && (
                    <div className='text-center py-12 bg-white/[0.02] rounded-xl border border-dashed border-white/[0.08]'>
                        <SearchIcon className='w-8 h-8 text-gray-600 mx-auto mb-2' />
                        <p className='text-gray-500 text-sm'>Geen films gevonden voor "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {/* Selected movie preview */}
            {selectedMovieData && (
                <div className='flex items-center gap-4 mt-2 p-4 bg-primary/[0.06] border border-primary/15 rounded-xl' style={{ animation: 'revealUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                    <img src={image_base_url + selectedMovieData.poster_path} alt={selectedMovieData.title} className='w-14 h-20 object-cover rounded-lg shadow-md' />
                    <div className='flex-1 min-w-0'>
                        <p className='font-semibold'>{selectedMovieData.title}</p>
                        <p className='text-xs text-gray-400 mt-0.5'>
                            {selectedMovieData.release_date} &bull; {selectedMovieData.vote_average.toFixed(1)} rating &bull; {kConverter(selectedMovieData.vote_count)} stemmen
                        </p>
                        <p className='text-xs text-gray-500 mt-1 line-clamp-1'>{selectedMovieData.overview}</p>
                    </div>
                    <button onClick={() => setSelectedMovie(null)} className='text-gray-500 hover:text-white hover:bg-white/[0.05] p-2 rounded-lg transition-all duration-300 cursor-pointer'>
                        <XIcon className='w-5 h-5' />
                    </button>
                </div>
            )}

            {/* Step 2: Price & Showtimes */}
            <div className='mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8' style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
                {/* Left: Price + Date/Time input */}
                <div>
                    <h2 className='text-base font-semibold flex items-center gap-2 mb-5'>
                        <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20'>2</span>
                        Prijs & Showtimes
                    </h2>

                    {/* Price */}
                    <div className='mb-6'>
                        <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Basisprijs per stoel</label>
                        <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 w-fit focus-within:border-primary/30 transition-all duration-300">
                            <span className="text-gray-400 text-sm font-medium">{currency}</span>
                            <input
                                min={0}
                                step={0.01}
                                type="number"
                                value={showPrice}
                                onChange={(e) => setShowPrice(e.target.value)}
                                placeholder="0.00"
                                className="outline-none bg-transparent text-lg font-semibold w-28"
                            />
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Datum & Tijd toevoegen</label>
                        <div className="flex items-center gap-3">
                            <div className='flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 flex-1 focus-within:border-primary/30 transition-all duration-300'>
                                <CalendarIcon className='w-4 h-4 text-gray-500' />
                                <input
                                    type="datetime-local"
                                    value={dateTimeInput}
                                    onChange={(e) => setDateTimeInput(e.target.value)}
                                    className="outline-none bg-transparent text-sm flex-1"
                                />
                            </div>
                            <button
                                onClick={handleDateTimeAdd}
                                className="bg-primary hover:bg-primary-dull text-white px-5 py-3 text-sm rounded-xl transition-all duration-200 cursor-pointer font-medium btn-press"
                            >
                                Toevoegen
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Selected showtimes overview */}
                <div>
                    <div className='flex items-center justify-between mb-4'>
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Geselecteerde showtimes
                        </label>
                        {totalShowtimes > 0 && (
                            <span className='text-xs bg-primary/20 text-primary px-2.5 py-0.5 rounded-full font-medium'>
                                {totalShowtimes} showtime{totalShowtimes !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {Object.keys(dateTimeSelection).length > 0 ? (
                        <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar">
                            {Object.entries(dateTimeSelection)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([date, times]) => (
                                <div key={date} className='bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.1] transition-all duration-300' style={{ animation: 'revealUp 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <CalendarIcon className='w-4 h-4 text-primary' />
                                        <span className='text-sm font-medium'>
                                            {new Date(date).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {times.sort().map((time) => (
                                            <div key={time} className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 rounded-lg text-sm group hover:border-primary/20 transition-all duration-300">
                                                <ClockIcon className='w-3.5 h-3.5 text-gray-500' />
                                                <span>{time}</span>
                                                <button onClick={() => handleRemoveTime(date, time)} className="text-gray-600 hover:text-red-400 transition-colors duration-300 cursor-pointer">
                                                    <XIcon className='w-3.5 h-3.5' />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-12 bg-white/[0.02] border border-dashed border-white/[0.08] rounded-xl'>
                            <ClockIcon className='w-8 h-8 text-gray-600 mb-2' />
                            <p className='text-sm text-gray-500'>Nog geen showtimes toegevoegd</p>
                            <p className='text-xs text-gray-600 mt-1'>Gebruik het formulier links om showtimes toe te voegen</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary & Submit */}
            <div className='mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.06]' style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both' }}>
                <div className='text-sm text-gray-400'>
                    {selectedMovieData && totalShowtimes > 0 && showPrice ? (
                        <p>
                            <span className='text-white font-medium'>{selectedMovieData.title}</span>
                            {' '}&bull; {totalShowtimes} showtime{totalShowtimes !== 1 ? 's' : ''}
                            {' '}&bull; {currency}{Number(showPrice).toFixed(2)} per stoel
                        </p>
                    ) : (
                        <p className='text-gray-600'>Vul alle velden in om te publiceren</p>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={addingShow || !selectedMovie || totalShowtimes === 0 || !showPrice}
                    className="bg-primary hover:bg-primary-dull disabled:opacity-40 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer font-medium text-sm btn-press shadow-lg shadow-primary/20 disabled:shadow-none"
                >
                    {addingShow ? 'Toevoegen...' : 'Show Publiceren'}
                </button>
            </div>
        </div>
    ) : <Loading />
}

export default AddShows
