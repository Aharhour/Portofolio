import mongoose from "mongoose";

// Movie model: data komt grotendeels uit de TMDB API.
// We gebruiken het TMDB id als _id zodat we duplicaten voorkomen.
const movieSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },                                   // TMDB movie id
        title: { type: String, required: true },                                 // Titel van de film
        overview: { type: String, required: true, maxlength: 5000 },             // Korte beschrijving
        poster_path: { type: String, required: true },                           // Pad naar de poster afbeelding (TMDB)
        backdrop_path: { type: String, required: true },                         // Achtergrond afbeelding voor hero/details
        release_date: { type: String, required: true },                          // Datum van uitkomen
        original_language: { type: String },                                     // Originele taal (en, nl, fr, ...)
        tagline: { type: String, maxlength: 500 },                               // Slogan/tagline
        genres: [{ type: mongoose.Schema.Types.Mixed }],                         // Genres als objecten van TMDB
        casts: [{ type: mongoose.Schema.Types.Mixed }],                          // Cast lijst van TMDB
        vote_average: { type: Number, required: true },                          // TMDB beoordeling (0-10)
        runtime: { type: Number, required: true },                               // Duur in minuten
    }, { timestamps: true }
)

// Index op titel voor zoekqueries
movieSchema.index({ title: 1 });

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
