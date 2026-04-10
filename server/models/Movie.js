import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        overview: { type: String, required: true, maxlength: 5000 },
        poster_path: { type: String, required: true },
        backdrop_path: { type: String, required: true },
        release_date: { type: String, required: true },
        original_language: { type: String },
        tagline: { type: String, maxlength: 500 },
        genres: [{ type: mongoose.Schema.Types.Mixed }],
        casts: [{ type: mongoose.Schema.Types.Mixed }],
        vote_average: { type: Number, required: true },
        runtime: { type: Number, required: true },
    }, { timestamps: true }
)

movieSchema.index({ title: 1 });

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
